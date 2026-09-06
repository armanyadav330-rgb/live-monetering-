import {
  Project,
  User,
  Inspection,
  CCTVCamera,
  AttendanceRecord,
  AIAnomalyAlert,
  NotificationItem,
  AuditLog,
  RandomVCRecord,
  RiskFactorBreakdown,
  RiskLevel,
  UserRole,
  PortalSettings,
  GrievanceTicket,
} from '../types';
import {
  SEED_PROJECTS,
  SEED_USERS,
  SEED_INSPECTIONS,
  SEED_CCTV_CAMERAS,
  SEED_ATTENDANCE,
  SEED_AI_ALERTS,
  SEED_NOTIFICATIONS,
  SEED_AUDIT_LOGS,
  SEED_VC_RECORDS,
  SEED_GRIEVANCES,
} from '../data/seedData';

class PortalDataStore {
  private projects: Project[] = [];
  private users: User[] = [];
  private inspections: Inspection[] = [];
  private cameras: CCTVCamera[] = [];
  private attendance: AttendanceRecord[] = [];
  private aiAlerts: AIAnomalyAlert[] = [];
  private notifications: NotificationItem[] = [];
  private auditLogs: AuditLog[] = [];
  private vcRecords: RandomVCRecord[] = [];
  private grievances: GrievanceTicket[] = [];
  private settings: PortalSettings = {
    portalTitle: 'Department of Social Justice & Empowerment - Institutional Monitoring & Inspection Portal',
    departmentName: 'Department of Social Justice and Empowerment (DoSJE)',
    ministryName: 'Ministry of Social Justice and Empowerment, Government of India',
    financialYear: '2026-2027',
    defaultLanguage: 'en',
    simulationMode: true,

    primaryTollFree: '1800-180-4921',
    secondaryTollFree: '1800-200-8890',
    ivrLanguage: 'bilingual',
    autoVideoCallBridge: true,
    recordingConsentNotice: true,

    riskWeights: {
      attendanceAnomaly: 20,
      cctvDowntime: 15,
      inspectionHistory: 20,
      gpsVerification: 20,
      complianceHistory: 15,
      otherSignals: 10,
    },

    geofenceRadiusMeters: 100,
    mandatoryPhotosCount: 4,
    minCctvUptimePercent: 85,
    offlineSyncEnabled: true,
    autoSurpriseAuditTrigger: true,

    smsAlertsEnabled: true,
    whatsappAlertsEnabled: true,
    emailDigestFrequency: 'DAILY',
    alertEmailRecipient: 'monitoring-officer@dosje.gov.in',

    sessionTimeoutMinutes: 30,
    enforce2FA: true,
    watermarkExportedReports: true,
    updatedAt: new Date().toISOString(),
    updatedBy: 'Dr. Rajeshwar Sharma, IAS (Super Admin)',
  };

  constructor() {
    this.resetToSeed();
    this.loadSettingsFromStorage();
  }

  private loadSettingsFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem('dosje_portal_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.settings = { ...this.settings, ...parsed };
        }
      } catch {
        // ignore
      }
    }
  }

  private saveSettingsToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('dosje_portal_settings', JSON.stringify(this.settings));
      } catch {
        // ignore
      }
    }
  }

  public resetToSeed(): void {
    this.projects = JSON.parse(JSON.stringify(SEED_PROJECTS));
    this.users = JSON.parse(JSON.stringify(SEED_USERS));
    this.inspections = JSON.parse(JSON.stringify(SEED_INSPECTIONS));
    this.cameras = JSON.parse(JSON.stringify(SEED_CCTV_CAMERAS));
    this.attendance = JSON.parse(JSON.stringify(SEED_ATTENDANCE));
    this.aiAlerts = JSON.parse(JSON.stringify(SEED_AI_ALERTS));
    this.notifications = JSON.parse(JSON.stringify(SEED_NOTIFICATIONS));
    this.auditLogs = JSON.parse(JSON.stringify(SEED_AUDIT_LOGS));
    this.vcRecords = JSON.parse(JSON.stringify(SEED_VC_RECORDS));
    this.grievances = JSON.parse(JSON.stringify(SEED_GRIEVANCES));
  }

  // ---- AUDIT LOGS ----
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public addAuditLog(
    userId: string,
    userName: string,
    userRole: UserRole,
    action: AuditLog['action'],
    targetType: AuditLog['targetType'],
    targetId?: string,
    targetName?: string,
    metadata?: Record<string, unknown>
  ): AuditLog {
    const log: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      userName,
      userRole,
      action,
      targetType,
      targetId,
      targetName,
      metadata,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }

  // ---- NOTIFICATIONS ----
  public getNotifications(role?: UserRole): NotificationItem[] {
    return this.notifications.filter(
      (n) => !n.targetRole || n.targetRole === 'ALL' || n.targetRole === role
    );
  }

  public markNotificationRead(id: string): boolean {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  public markAllNotificationsRead(role?: UserRole): void {
    this.notifications.forEach((n) => {
      if (!n.targetRole || n.targetRole === 'ALL' || n.targetRole === role) {
        n.read = true;
      }
    });
  }

  public addNotification(
    title: string,
    message: string,
    type: NotificationItem['type'],
    targetRole?: UserRole | 'ALL',
    link?: string
  ): NotificationItem {
    const item: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      targetRole: targetRole || 'ALL',
      link,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(item);
    return item;
  }

  // ---- PROJECTS ----
  public getProjects(): Project[] {
    return [...this.projects];
  }

  public getProjectById(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id || p.projectId === id);
  }

  public createProject(
    projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'riskScore' | 'riskLevel' | 'riskBreakdown'>,
    author: { id: string; name: string; role: UserRole }
  ): Project {
    const id = `proj_${Date.now()}`;
    const now = new Date().toISOString();
    const breakdown = this.calculateRiskBreakdown({
      attendanceStatus: projectData.attendanceStatus,
      cctvStatus: projectData.cctvStatus,
      beneficiaryCount: projectData.beneficiaryCount,
      averageAttendancePercent: projectData.averageAttendancePercent,
      activeCamerasCount: projectData.activeCamerasCount,
      totalCamerasCount: projectData.totalCamerasCount,
    });

    const newProject: Project = {
      ...projectData,
      id,
      riskScore: breakdown.total,
      riskLevel: this.getRiskLevelFromScore(breakdown.total),
      riskBreakdown: breakdown,
      createdAt: now,
      updatedAt: now,
    };

    this.projects.unshift(newProject);
    this.addAuditLog(
      author.id,
      author.name,
      author.role,
      'PROJECT_CREATED',
      'PROJECT',
      newProject.id,
      newProject.projectName,
      { scheme: newProject.scheme, state: newProject.state }
    );

    return newProject;
  }

  public updateProject(
    id: string,
    updates: Partial<Project>,
    author: { id: string; name: string; role: UserRole }
  ): Project | null {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = this.projects[index];
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Recompute risk if relevant fields changed
    if (
      updates.attendanceStatus !== undefined ||
      updates.cctvStatus !== undefined ||
      updates.averageAttendancePercent !== undefined ||
      updates.activeCamerasCount !== undefined
    ) {
      const breakdown = this.calculateRiskBreakdown({
        attendanceStatus: updated.attendanceStatus,
        cctvStatus: updated.cctvStatus,
        beneficiaryCount: updated.beneficiaryCount,
        averageAttendancePercent: updated.averageAttendancePercent,
        activeCamerasCount: updated.activeCamerasCount,
        totalCamerasCount: updated.totalCamerasCount,
        lastInspectionResult: updated.lastInspectionResult,
      });
      updated.riskScore = breakdown.total;
      updated.riskLevel = this.getRiskLevelFromScore(breakdown.total);
      updated.riskBreakdown = breakdown;
    }

    this.projects[index] = updated;

    this.addAuditLog(
      author.id,
      author.name,
      author.role,
      'PROJECT_UPDATED',
      'PROJECT',
      updated.id,
      updated.projectName,
      { updatedFields: Object.keys(updates) }
    );

    return updated;
  }

  public deleteProject(id: string, author: { id: string; name: string; role: UserRole }): boolean {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;

    const [deleted] = this.projects.splice(index, 1);
    this.addAuditLog(
      author.id,
      author.name,
      author.role,
      'PROJECT_DELETED',
      'PROJECT',
      deleted.id,
      deleted.projectName
    );
    return true;
  }

  // ---- RISK SCORING ENGINE ----
  public calculateRiskBreakdown(params: {
    attendanceStatus?: 'NORMAL' | 'WARNING' | 'HIGH ATTENTION';
    cctvStatus?: 'ONLINE' | 'OFFLINE' | 'WARNING';
    beneficiaryCount?: number;
    averageAttendancePercent?: number;
    activeCamerasCount?: number;
    totalCamerasCount?: number;
    lastInspectionResult?: string;
  }): RiskFactorBreakdown {
    const notes: string[] = [];

    // Factor 1: Attendance Anomaly (max 20)
    let attendanceAnomaly = 4;
    const attPct = params.averageAttendancePercent ?? 85;
    if (params.attendanceStatus === 'HIGH ATTENTION' || attPct < 60) {
      attendanceAnomaly = 19;
      notes.push('Critical attendance irregularity observed vs registered rolls.');
    } else if (params.attendanceStatus === 'WARNING' || attPct < 75) {
      attendanceAnomaly = 12;
      notes.push('Mild attendance deficit noted.');
    } else {
      attendanceAnomaly = 4;
    }

    // Factor 2: CCTV Downtime (max 15)
    let cctvDowntime = 2;
    if (params.cctvStatus === 'OFFLINE') {
      cctvDowntime = 15;
      notes.push('CCTV stream offline or heartbeat expired.');
    } else if (params.cctvStatus === 'WARNING') {
      cctvDowntime = 9;
      notes.push('Intermittent camera downtime or degraded FPS.');
    } else {
      cctvDowntime = 2;
    }

    // Factor 3: Inspection History (max 20)
    let inspectionHistory = 5;
    if (params.lastInspectionResult === 'NON_COMPLIANT') {
      inspectionHistory = 18;
      notes.push('Prior inspection flagged critical non-compliance.');
    } else if (params.lastInspectionResult === 'REQUIRES_FOLLOW_UP' || params.lastInspectionResult === 'PARTIALLY_COMPLIANT') {
      inspectionHistory = 11;
      notes.push('Previous follow-up items pending closure.');
    } else {
      inspectionHistory = 5;
    }

    // Factor 4: GPS Verification (max 20)
    const gpsVerification = params.cctvStatus === 'OFFLINE' ? 14 : 4;

    // Factor 5: Compliance History (max 15)
    const complianceHistory = params.attendanceStatus === 'HIGH ATTENTION' ? 12 : 6;

    // Factor 6: Other Signals (max 10)
    const otherSignals = attendanceAnomaly > 15 || cctvDowntime > 10 ? 5 : 3;

    const total = attendanceAnomaly + cctvDowntime + inspectionHistory + gpsVerification + complianceHistory + otherSignals;

    return {
      attendanceAnomaly,
      cctvDowntime,
      inspectionHistory,
      gpsVerification,
      complianceHistory,
      otherSignals,
      total,
      notes,
    };
  }

  public getRiskLevelFromScore(score: number): RiskLevel {
    if (score >= 75) return 'CRITICAL';
    if (score >= 50) return 'HIGH';
    if (score >= 35) return 'MEDIUM';
    return 'LOW';
  }

  // ---- INSPECTIONS ----
  public getInspections(): Inspection[] {
    return [...this.inspections].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getInspectionById(id: string): Inspection | undefined {
    return this.inspections.find((i) => i.id === id || i.inspectionCode === id);
  }

  public createInspection(inspection: Inspection): Inspection {
    this.inspections.unshift(inspection);
    return inspection;
  }

  public updateInspection(
    id: string,
    updates: Partial<Inspection>,
    author: { id: string; name: string; role: UserRole }
  ): Inspection | null {
    const index = this.inspections.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const existing = this.inspections[index];
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.status === 'COMPLETED' && !existing.submittedAt) {
      updated.submittedAt = new Date().toISOString();

      // Update the project's last inspection date and result
      const proj = this.projects.find((p) => p.id === updated.projectId);
      if (proj) {
        proj.lastInspectionDate = updated.submittedAt;
        proj.lastInspectionResult = updated.overallResult;
        proj.updatedAt = new Date().toISOString();
      }

      this.addAuditLog(
        author.id,
        author.name,
        author.role,
        'INSPECTION_SUBMITTED',
        'INSPECTION',
        updated.id,
        updated.projectName,
        { result: updated.overallResult, inspectionCode: updated.inspectionCode }
      );

      this.addNotification(
        `Inspection Completed: ${updated.projectName}`,
        `Inspector ${updated.inspectorName} submitted report. Result: ${updated.overallResult || 'COMPLETED'}.`,
        'REPORT_SUBMITTED',
        'ALL',
        `/inspections/${updated.id}`
      );
    }

    this.inspections[index] = updated;
    return updated;
  }

  // ---- RANDOM INSPECTION ASSIGNMENT ALGORITHM ----
  public assignRandomInspection(params: {
    district?: string;
    state?: string;
    scheme?: string;
    minRiskLevel?: RiskLevel;
    assignedBy: { id: string; name: string; role: UserRole };
  }): {
    success: boolean;
    message: string;
    inspection?: Inspection;
  } {
    // 1. Exclude inactive projects
    let candidates = this.projects.filter(
      (p) => p.projectStatus === 'ACTIVE' || p.projectStatus === 'UNDER_REVIEW'
    );

    if (params.state) {
      candidates = candidates.filter((p) => p.state === params.state);
    }
    if (params.district) {
      candidates = candidates.filter((p) => p.district === params.district);
    }
    if (params.scheme) {
      candidates = candidates.filter((p) => p.scheme === params.scheme);
    }
    if (params.minRiskLevel) {
      const riskOrder: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
      const minIdx = riskOrder.indexOf(params.minRiskLevel);
      candidates = candidates.filter((p) => riskOrder.indexOf(p.riskLevel) >= minIdx);
    }

    if (candidates.length === 0) {
      return {
        success: false,
        message: 'No eligible candidate projects found matching current criteria.',
      };
    }

    // 2. Weight candidate projects:
    // - CRITICAL: 5x weight
    // - HIGH: 3x weight
    // - MEDIUM: 2x weight
    // - Uninspected (>60 days or never): 3x weight bonus
    const weightedPool: { project: Project; weight: number }[] = candidates.map((proj) => {
      let weight = 1;
      if (proj.riskLevel === 'CRITICAL') weight += 5;
      else if (proj.riskLevel === 'HIGH') weight += 3;
      else if (proj.riskLevel === 'MEDIUM') weight += 2;

      if (!proj.lastInspectionDate) {
        weight += 4;
      } else {
        const daysSince = Math.floor(
          (Date.now() - new Date(proj.lastInspectionDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSince > 60) weight += 3;
        else if (daysSince > 30) weight += 1;
      }

      return { project: proj, weight };
    });

    const poolExpanded: Project[] = [];
    weightedPool.forEach(({ project, weight }) => {
      for (let i = 0; i < weight; i++) {
        poolExpanded.push(project);
      }
    });

    const selectedProject = poolExpanded[Math.floor(Math.random() * poolExpanded.length)];

    // 6. Assign an available inspection officer
    // Avoid assigning the same officer who previously inspected this project if other officers available
    const allOfficers = this.users.filter((u) => u.role === 'INSPECTION_OFFICER' && u.isActive);
    if (allOfficers.length === 0) {
      return {
        success: false,
        message: 'No active inspection officers found in the system.',
      };
    }

    // Find previous inspector for this project
    const previousInspections = this.inspections.filter((i) => i.projectId === selectedProject.id);
    const previousInspectorIds = new Set(previousInspections.map((i) => i.inspectorId));

    // Prefer officers in same state/district or unassigned
    let eligibleOfficers = allOfficers.filter((o) => !previousInspectorIds.has(o.id));
    if (eligibleOfficers.length === 0) {
      eligibleOfficers = allOfficers; // fallback
    }

    const assignedOfficer = eligibleOfficers[Math.floor(Math.random() * eligibleOfficers.length)];

    // Schedule 3 to 7 days from now
    const scheduledDays = Math.floor(Math.random() * 5) + 3;
    const schedDate = new Date();
    schedDate.setDate(schedDate.getDate() + scheduledDays);
    const scheduledDateStr = schedDate.toISOString().split('T')[0];

    const inspectionId = `insp_${Date.now()}`;
    const codeNum = Math.floor(Math.random() * 900) + 100;
    const inspectionCode = `INSP-2026-${codeNum}`;

    let priority: 'ROUTINE' | 'HIGH' | 'CRITICAL' = 'ROUTINE';
    if (selectedProject.riskLevel === 'CRITICAL') priority = 'CRITICAL';
    else if (selectedProject.riskLevel === 'HIGH') priority = 'HIGH';

    const newInspection: Inspection = {
      id: inspectionId,
      inspectionCode,
      projectId: selectedProject.id,
      projectName: selectedProject.projectName,
      ngoName: selectedProject.ngoName,
      scheme: selectedProject.scheme,
      state: selectedProject.state,
      district: selectedProject.district,
      projectCoordinates: {
        latitude: selectedProject.latitude,
        longitude: selectedProject.longitude,
      },
      inspectorId: assignedOfficer.id,
      inspectorName: assignedOfficer.name,
      inspectorDesignation: assignedOfficer.designation,
      scheduledDate: scheduledDateStr,
      status: 'PENDING',
      priority,
      assignmentReason: `Automated weighted selection: Project risk score is ${selectedProject.riskScore}/100 (${selectedProject.riskLevel}) with ${selectedProject.cctvStatus} CCTV status.`,
      checklist: [
        {
          id: 'chk_1',
          title: 'Infrastructure & physical premises verified and operational',
          category: 'INFRASTRUCTURE',
          status: 'NOT_APPLICABLE',
          observations: '',
        },
        {
          id: 'chk_2',
          title: 'Sanctioned staff present and attendance registers verified',
          category: 'PERSONNEL',
          status: 'NOT_APPLICABLE',
          observations: '',
        },
        {
          id: 'chk_3',
          title: 'Physical beneficiary headcount matches portal rolls',
          category: 'SERVICES',
          status: 'NOT_APPLICABLE',
          observations: '',
        },
        {
          id: 'chk_4',
          title: 'CCTV hardware and NVR archive active without blind spots',
          category: 'CCTV_TECH',
          status: 'NOT_APPLICABLE',
          observations: '',
        },
        {
          id: 'chk_5',
          title: 'Biometric records, meal logs, and medicine registers up to date',
          category: 'RECORDS',
          status: 'NOT_APPLICABLE',
          observations: '',
        },
        {
          id: 'chk_6',
          title: 'Beneficiary satisfaction & feedback interviewed independently',
          category: 'SERVICES',
          status: 'NOT_APPLICABLE',
          observations: '',
        },
      ],
      evidence: [],
      findings: '',
      remarks: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.inspections.unshift(newInspection);

    this.addAuditLog(
      params.assignedBy.id,
      params.assignedBy.name,
      params.assignedBy.role,
      'INSPECTION_ASSIGNED',
      'INSPECTION',
      newInspection.id,
      selectedProject.projectName,
      {
        assignedOfficerId: assignedOfficer.id,
        assignedOfficerName: assignedOfficer.name,
        inspectionCode,
        priority,
      }
    );

    this.addNotification(
      `New Inspection Assigned: ${newInspection.inspectionCode}`,
      `Officer ${assignedOfficer.name} assigned to inspect ${selectedProject.projectName} (${selectedProject.district}, ${selectedProject.state}).`,
      'ASSIGNMENT',
      'ALL',
      `/inspections/${newInspection.id}`
    );

    return {
      success: true,
      message: `Inspection ${newInspection.inspectionCode} successfully assigned to ${assignedOfficer.name}.`,
      inspection: newInspection,
    };
  }

  // ---- USERS ----
  public getUsers(): User[] {
    return [...this.users];
  }

  public getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id || u.email === id);
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt'>, author: { id: string; name: string; role: UserRole }): User {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.addAuditLog(
      author.id,
      author.name,
      author.role,
      'USER_CREATED',
      'USER',
      newUser.id,
      newUser.name,
      { email: newUser.email, role: newUser.role }
    );
    return newUser;
  }

  public updateUserRole(
    userId: string,
    newRole: UserRole,
    author: { id: string; name: string; role: UserRole }
  ): User | null {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;
    const oldRole = user.role;
    user.role = newRole;

    this.addAuditLog(
      author.id,
      author.name,
      author.role,
      'USER_ROLE_CHANGED',
      'USER',
      user.id,
      user.name,
      { oldRole, newRole }
    );
    return user;
  }

  // ---- AI ANOMALY ALERTS ----
  public getAIAlerts(): AIAnomalyAlert[] {
    return [...this.aiAlerts];
  }

  public dismissAIAlert(id: string): boolean {
    const alert = this.aiAlerts.find((a) => a.id === id);
    if (alert) {
      alert.status = 'DISMISSED';
      return true;
    }
    return false;
  }

  public addAIAlert(alert: Omit<AIAnomalyAlert, 'id' | 'createdAt'>): AIAnomalyAlert {
    const newAlert: AIAnomalyAlert = {
      ...alert,
      id: `alert_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.aiAlerts.unshift(newAlert);
    return newAlert;
  }

  // ---- CCTV CAMERAS ----
  public getCameras(projectId?: string): CCTVCamera[] {
    if (projectId) {
      return this.cameras.filter((c) => c.projectId === projectId);
    }
    return [...this.cameras];
  }

  public updateCameraStatus(cameraId: string, status: CCTVCamera['status']): CCTVCamera | null {
    const cam = this.cameras.find((c) => c.id === cameraId);
    if (!cam) return null;
    cam.status = status;
    cam.lastHeartbeat = new Date().toISOString();
    return cam;
  }

  // ---- ATTENDANCE ----
  public getAttendance(projectId?: string): AttendanceRecord[] {
    if (projectId) {
      return this.attendance.filter((a) => a.projectId === projectId);
    }
    return [...this.attendance];
  }

  // ---- PORTAL SETTINGS ----
  public getSettings(): PortalSettings {
    return { ...this.settings };
  }

  public updateSettings(
    newSettings: Partial<PortalSettings>,
    user?: { id: string; name: string; role?: UserRole }
  ): PortalSettings {
    this.settings = {
      ...this.settings,
      ...newSettings,
      riskWeights: {
        ...this.settings.riskWeights,
        ...(newSettings.riskWeights || {}),
      },
      updatedAt: new Date().toISOString(),
      updatedBy: user ? `${user.name} (${user.role || 'Super Admin'})` : 'Super Admin',
    };
    this.saveSettingsToStorage();

    // Log to audit log
    this.addAuditLog(
      user?.id || 'usr_super_admin',
      user?.name || 'Dr. Rajeshwar Sharma, IAS',
      user?.role || 'SUPER_ADMIN',
      'SETTINGS_UPDATED',
      'SYSTEM',
      'system_settings',
      'Portal Configuration & Policy Rules',
      { modifiedFields: Object.keys(newSettings) }
    );

    return { ...this.settings };
  }

  public resetSettings(): PortalSettings {
    this.settings = {
      portalTitle: 'Department of Social Justice & Empowerment - Institutional Monitoring & Inspection Portal',
      departmentName: 'Department of Social Justice and Empowerment (DoSJE)',
      ministryName: 'Ministry of Social Justice and Empowerment, Government of India',
      financialYear: '2026-2027',
      defaultLanguage: 'en',
      simulationMode: true,

      primaryTollFree: '1800-180-4921',
      secondaryTollFree: '1800-200-8890',
      ivrLanguage: 'bilingual',
      autoVideoCallBridge: true,
      recordingConsentNotice: true,

      riskWeights: {
        attendanceAnomaly: 20,
        cctvDowntime: 15,
        inspectionHistory: 20,
        gpsVerification: 20,
        complianceHistory: 15,
        otherSignals: 10,
      },

      geofenceRadiusMeters: 100,
      mandatoryPhotosCount: 4,
      minCctvUptimePercent: 85,
      offlineSyncEnabled: true,
      autoSurpriseAuditTrigger: true,

      smsAlertsEnabled: true,
      whatsappAlertsEnabled: true,
      emailDigestFrequency: 'DAILY',
      alertEmailRecipient: 'monitoring-officer@dosje.gov.in',

      sessionTimeoutMinutes: 30,
      enforce2FA: true,
      watermarkExportedReports: true,
      updatedAt: new Date().toISOString(),
      updatedBy: 'System Default Reset',
    };
    this.saveSettingsToStorage();
    return { ...this.settings };
  }

  // ---- GRIEVANCES & TICKETS ----
  public getGrievances(): GrievanceTicket[] {
    return [...this.grievances].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getGrievanceById(id: string): GrievanceTicket | undefined {
    return this.grievances.find((g) => g.id === id || g.ticketNumber === id);
  }

  public createGrievance(
    data: Partial<GrievanceTicket>,
    user?: { id: string; name: string; role: UserRole }
  ): GrievanceTicket {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = data.ticketNumber || `GRV-2026-${randomSuffix}`;
    const newTicket: GrievanceTicket = {
      id: `grv_${Date.now()}`,
      ticketNumber,
      applicantName: data.applicantName || user?.name || 'Citizen / NGO Representative',
      applicantPhone: data.applicantPhone || '+91 98180 00000',
      category: data.category || 'GENERAL_GRIEVANCE',
      subject: data.subject || 'Citizen Grievance Resolution Request',
      description: data.description || 'Request submitted via AI Assistant.',
      scheme: data.scheme || 'Central Sector Schemes (DoSJE)',
      projectName: data.projectName,
      priority: data.priority || 'HIGH',
      status: data.status || 'OPEN',
      resolutionNotes: data.resolutionNotes || 'Logged by AI Assistant Desk. Forwarded to field directorate for immediate review.',
      assignedOfficer: data.assignedOfficer || 'Dr. Rajeshwar Sharma, IAS',
      createdAt: new Date().toISOString(),
      channel: data.channel || 'CHATBOT',
    };

    this.grievances.unshift(newTicket);

    if (user) {
      this.addAuditLog(
        user.id,
        user.name,
        user.role,
        'SYSTEM' as any,
        'SYSTEM',
        newTicket.id,
        `Grievance Logged: ${ticketNumber}`,
        { category: newTicket.category, subject: newTicket.subject }
      );
    }

    return newTicket;
  }

  public resolveGrievance(
    id: string,
    resolutionNotes: string,
    user?: { id: string; name: string; role: UserRole }
  ): GrievanceTicket | null {
    const item = this.getGrievanceById(id);
    if (!item) return null;

    item.status = 'RESOLVED';
    item.resolutionNotes = resolutionNotes;
    item.resolvedAt = new Date().toISOString();

    if (user) {
      this.addAuditLog(
        user.id,
        user.name,
        user.role,
        'SYSTEM' as any,
        'SYSTEM',
        item.id,
        `Grievance Resolved: ${item.ticketNumber}`,
        { resolutionNotes }
      );
    }

    return item;
  }
}

export const portalStore = new PortalDataStore();
