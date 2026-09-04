import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { portalStore } from './src/services/store';
import { cctvProvider } from './src/services/cctvProvider';
import { vcProvider } from './src/services/vcProvider';
import { attendanceProvider } from './src/services/attendanceProvider';
import { analyzeProjectWithGemini, summarizeInspectionWithGemini } from './src/services/serverGemini';
import { UserRole } from './src/types';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Middleware for parsing JSON with ample capacity for base64 / evidence preview
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Helper to extract mock/session user from header
  const getRequestUser = (req: express.Request) => {
    const userId = (req.headers['x-user-id'] as string) || 'usr_super_admin';
    const userRole = (req.headers['x-user-role'] as UserRole) || 'SUPER_ADMIN';
    const userName = (req.headers['x-user-name'] as string) || 'Dr. Rajeshwar Sharma, IAS';
    return { id: userId, name: decodeURIComponent(userName), role: userRole };
  };

  // ==========================================
  // API ROUTES (FIRST)
  // ==========================================

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'DoSJE Smart Monitoring & Inspection Portal',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  });

  // Dashboard Stats Aggregation
  app.get('/api/dashboard/stats', (req, res) => {
    try {
      const projects = portalStore.getProjects();
      const inspections = portalStore.getInspections();
      const cameras = portalStore.getCameras();

      const totalProjects = projects.length;
      const criticalProjects = projects.filter((p) => p.riskLevel === 'CRITICAL').length;
      const highRiskProjects = projects.filter((p) => p.riskLevel === 'HIGH').length;
      const mediumRiskProjects = projects.filter((p) => p.riskLevel === 'MEDIUM').length;
      const lowRiskProjects = projects.filter((p) => p.riskLevel === 'LOW').length;

      const totalInspections = inspections.length;
      const completedInspections = inspections.filter((i) => i.status === 'COMPLETED').length;
      const pendingInspections = inspections.filter((i) => i.status === 'PENDING').length;
      const surpriseInspections = inspections.filter((i) => i.priority === 'SURPRISE').length;

      const onlineCameras = cameras.filter((c) => c.status === 'ONLINE').length;
      const totalCameras = cameras.length;
      const cctvUptimePercent = totalCameras > 0 ? Math.round((onlineCameras / totalCameras) * 100) : 0;

      const avgAttendance = projects.length > 0
        ? Math.round(projects.reduce((acc, p) => acc + p.averageAttendancePercent, 0) / projects.length)
        : 0;

      res.json({
        success: true,
        data: {
          totalProjects,
          criticalProjects,
          highRiskProjects,
          mediumRiskProjects,
          lowRiskProjects,
          totalInspections,
          completedInspections,
          pendingInspections,
          surpriseInspections,
          onlineCameras,
          totalCameras,
          cctvUptimePercent,
          avgAttendance,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Projects API
  app.get('/api/projects', (req, res) => {
    try {
      let projects = portalStore.getProjects();
      const { search, state, district, scheme, risk, cctvStatus, status } = req.query;

      if (search && typeof search === 'string') {
        const q = search.toLowerCase();
        projects = projects.filter(
          (p) =>
            p.projectName.toLowerCase().includes(q) ||
            p.projectId.toLowerCase().includes(q) ||
            p.ngoName.toLowerCase().includes(q) ||
            p.district.toLowerCase().includes(q) ||
            p.state.toLowerCase().includes(q)
        );
      }

      if (state && typeof state === 'string' && state !== 'ALL') {
        projects = projects.filter((p) => p.state === state);
      }
      if (district && typeof district === 'string' && district !== 'ALL') {
        projects = projects.filter((p) => p.district === district);
      }
      if (scheme && typeof scheme === 'string' && scheme !== 'ALL') {
        projects = projects.filter((p) => p.scheme === scheme);
      }
      if (risk && typeof risk === 'string' && risk !== 'ALL') {
        projects = projects.filter((p) => p.riskLevel === risk);
      }
      if (cctvStatus && typeof cctvStatus === 'string' && cctvStatus !== 'ALL') {
        projects = projects.filter((p) => p.cctvStatus === cctvStatus);
      }
      if (status && typeof status === 'string' && status !== 'ALL') {
        projects = projects.filter((p) => p.projectStatus === status);
      }

      res.json({ success: true, count: projects.length, data: projects });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/projects/:id', (req, res) => {
    try {
      const project = portalStore.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      const inspections = portalStore.getInspections().filter((i) => i.projectId === project.id);
      const cameras = portalStore.getCameras(project.id);
      const attendance = portalStore.getAttendance(project.id);

      res.json({
        success: true,
        data: {
          ...project,
          inspections,
          cameras,
          attendance,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/projects', (req, res) => {
    try {
      const user = getRequestUser(req);
      const newProj = portalStore.createProject(req.body, user);
      res.status(201).json({ success: true, data: newProj });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.put('/api/projects/:id', (req, res) => {
    try {
      const user = getRequestUser(req);
      const updated = portalStore.updateProject(req.params.id, req.body, user);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/projects/:id', (req, res) => {
    try {
      const user = getRequestUser(req);
      const deleted = portalStore.deleteProject(req.params.id, user);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      res.json({ success: true, message: 'Project removed successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Inspections API
  app.get('/api/inspections', (req, res) => {
    try {
      let list = portalStore.getInspections();
      const { status, priority, inspectorId, projectId, search } = req.query;

      if (status && typeof status === 'string' && status !== 'ALL') {
        list = list.filter((i) => i.status === status);
      }
      if (priority && typeof priority === 'string' && priority !== 'ALL') {
        list = list.filter((i) => i.priority === priority);
      }
      if (inspectorId && typeof inspectorId === 'string') {
        list = list.filter((i) => i.inspectorId === inspectorId);
      }
      if (projectId && typeof projectId === 'string') {
        list = list.filter((i) => i.projectId === projectId);
      }
      if (search && typeof search === 'string') {
        const q = search.toLowerCase();
        list = list.filter(
          (i) =>
            i.inspectionCode.toLowerCase().includes(q) ||
            i.projectName.toLowerCase().includes(q) ||
            i.inspectorName.toLowerCase().includes(q) ||
            i.district.toLowerCase().includes(q)
        );
      }

      res.json({ success: true, count: list.length, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/inspections/:id', (req, res) => {
    try {
      const item = portalStore.getInspectionById(req.params.id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Inspection not found' });
      }
      res.json({ success: true, data: item });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/inspections/:id', (req, res) => {
    try {
      const user = getRequestUser(req);
      const updated = portalStore.updateInspection(req.params.id, req.body, user);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Inspection not found' });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Random Inspection Assignment Algorithm Endpoint
  app.post('/api/assignments/random', (req, res) => {
    try {
      const user = getRequestUser(req);
      const { district, state, scheme, minRiskLevel } = req.body;
      const result = portalStore.assignRandomInspection({
        district,
        state,
        scheme,
        minRiskLevel,
        assignedBy: user,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }
      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // CCTV API
  app.get('/api/cctv/cameras', async (req, res) => {
    try {
      const { projectId } = req.query;
      const cameras = await cctvProvider.getAllCameras(projectId as string | undefined);
      res.json({ success: true, data: cameras });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/cctv/feed/:cameraId', async (req, res) => {
    try {
      const feed = await cctvProvider.getCameraFeed(req.params.cameraId);
      if (!feed) {
        return res.status(404).json({ success: false, message: 'Camera not found' });
      }
      res.json({ success: true, data: feed });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/cctv/cameras/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await cctvProvider.updateCameraStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Camera not found' });
      }
      portalStore.updateCameraStatus(req.params.id, status);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Random VC API
  app.get('/api/vc/records', async (req, res) => {
    try {
      const records = await vcProvider.getVCRecords(req.query.projectId as string | undefined);
      res.json({ success: true, data: records });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/vc/random-target', (req, res) => {
    try {
      const projects = portalStore.getProjects();
      const target = vcProvider.selectRandomParticipant(projects);
      if (!target) {
        return res.status(404).json({ success: false, message: 'No eligible projects for video verification' });
      }
      res.json({ success: true, data: target });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/vc/records', async (req, res) => {
    try {
      const user = getRequestUser(req);
      const record = await vcProvider.saveVCRecord({
        ...req.body,
        conductedByUserId: user.id,
        conductedByUserName: user.name,
      });

      portalStore.addAuditLog(
        user.id,
        user.name,
        user.role,
        'VC_VERIFICATION_CONDUCTED',
        'PROJECT',
        record.projectId,
        record.projectName,
        { result: record.verificationResult, participantType: record.participantType }
      );

      res.status(201).json({ success: true, data: record });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Attendance API
  app.get('/api/attendance', async (req, res) => {
    try {
      const { projectId } = req.query;
      const records = await attendanceProvider.getAttendanceRecords(projectId as string | undefined);
      const summary = attendanceProvider.getAttendanceSummary(records);
      res.json({ success: true, summary, data: records });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/attendance/trend/:projectId', (req, res) => {
    try {
      const project = portalStore.getProjectById(req.params.projectId);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      const trend = attendanceProvider.generate30DayTrend(
        project.id,
        project.beneficiaryCount,
        project.averageAttendancePercent
      );
      res.json({ success: true, data: trend });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // AI Analytics API (Gemini Server-Side)
  app.post('/api/ai/analyze-project', async (req, res) => {
    try {
      const { projectId } = req.body;
      const project = portalStore.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      const recentInspections = portalStore.getInspections().filter((i) => i.projectId === project.id);
      const attendance = portalStore.getAttendance(project.id);
      const attNotes = attendance.filter((a) => a.anomalyFlag).map((a) => a.anomalyReason || 'Anomaly');

      const analysis = await analyzeProjectWithGemini(project, recentInspections, attNotes);

      const user = getRequestUser(req);
      portalStore.addAuditLog(
        user.id,
        user.name,
        user.role,
        'AI_ANALYSIS_TRIGGERED',
        'PROJECT',
        project.id,
        project.projectName,
        { model: analysis.modelUsed, isSimulated: analysis.isSimulatedFallback }
      );

      res.json({ success: true, data: analysis });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/ai/summarize-inspection', async (req, res) => {
    try {
      const { inspectionId } = req.body;
      const inspection = portalStore.getInspectionById(inspectionId);
      if (!inspection) {
        return res.status(404).json({ success: false, message: 'Inspection not found' });
      }

      const result = await summarizeInspectionWithGemini(inspection);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/ai/alerts', (req, res) => {
    try {
      const alerts = portalStore.getAIAlerts();
      res.json({ success: true, data: alerts });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/ai/alerts/:id/dismiss', (req, res) => {
    try {
      const ok = portalStore.dismissAIAlert(req.params.id);
      res.json({ success: ok });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Notifications API
  app.get('/api/notifications', (req, res) => {
    try {
      const user = getRequestUser(req);
      const list = portalStore.getNotifications(user.role);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/notifications/:id/read', (req, res) => {
    try {
      const ok = portalStore.markNotificationRead(req.params.id);
      res.json({ success: ok });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/notifications/mark-all-read', (req, res) => {
    try {
      const user = getRequestUser(req);
      portalStore.markAllNotificationsRead(user.role);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Audit Logs API
  app.get('/api/audit-logs', (req, res) => {
    try {
      const logs = portalStore.getAuditLogs();
      res.json({ success: true, count: logs.length, data: logs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/audit-logs', (req, res) => {
    try {
      const user = getRequestUser(req);
      const { action, targetType, targetId, targetName, metadata } = req.body;
      const log = portalStore.addAuditLog(
        user.id,
        user.name,
        user.role,
        action || 'SYSTEM',
        targetType || 'SYSTEM',
        targetId,
        targetName,
        metadata
      );
      res.json({ success: true, data: log });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Users API
  app.get('/api/users', (req, res) => {
    try {
      const users = portalStore.getUsers();
      res.json({ success: true, data: users });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/users', (req, res) => {
    try {
      const author = getRequestUser(req);
      if (author.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ success: false, message: 'Only Super Admin can provision new user accounts.' });
      }
      const created = portalStore.createUser(req.body, author);
      res.status(201).json({ success: true, data: created });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.put('/api/users/:id/role', (req, res) => {
    try {
      const author = getRequestUser(req);
      if (author.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ success: false, message: 'Only Super Admin can modify user roles.' });
      }
      const updated = portalStore.updateUserRole(req.params.id, req.body.role, author);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // Reset Demo Data
  app.post('/api/reset-demo', (req, res) => {
    try {
      const user = getRequestUser(req);
      portalStore.resetToSeed();
      portalStore.addAuditLog(
        user.id,
        user.name,
        user.role,
        'DEMO_DATA_RESET',
        'SYSTEM',
        undefined,
        'Reset to initial seeds'
      );
      res.json({ success: true, message: 'Database reset to default seed state successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Simulated Evidence File Upload
  app.post('/api/upload', (req, res) => {
    try {
      const user = getRequestUser(req);
      const { fileName, fileType, fileSize, category, caption, dataUrl } = req.body;

      if (!fileName || !fileType) {
        return res.status(400).json({ success: false, message: 'File name and type are required.' });
      }

      // Allowed types check (JPG, PNG, MP4, PDF)
      const allowed = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'];
      if (!allowed.includes(fileType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Only JPG, PNG, MP4, and PDF are supported.',
        });
      }

      // Max size: 20MB
      if (fileSize > 20 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'File size exceeds 20MB ceiling.',
        });
      }

      const evidenceId = `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const url = dataUrl || `https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80`;

      res.status(201).json({
        success: true,
        data: {
          id: evidenceId,
          fileName,
          fileType,
          fileSize,
          url,
          uploadedAt: new Date().toISOString(),
          uploaderId: user.id,
          uploaderName: user.name,
          fileCategory:
            category ||
            (fileType && fileType.startsWith('image/')
              ? 'PHOTO'
              : fileType && fileType.startsWith('video/')
              ? 'VIDEO'
              : 'DOCUMENT'),
          caption: caption || '',
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // VITE OR STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DoSJE Monitoring Portal Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
