import {
  Project,
  Inspection,
  User,
  CCTVCamera,
  AttendanceRecord,
  AIAnomalyAlert,
  NotificationItem,
  AuditLog,
  RandomVCRecord,
  UserRole,
  RiskLevel,
} from '../types';
import { portalStore } from './store';
import { cctvProvider } from './cctvProvider';
import { vcProvider } from './vcProvider';
import { attendanceProvider } from './attendanceProvider';

// Current session storage key
const CURRENT_USER_KEY = 'dosje_current_user';

export function getStoredUser(): User {
  const saved = localStorage.getItem(CURRENT_USER_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return portalStore.getUsers()[0]; // Super Admin default
}

export function setStoredUser(user: User): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getAuthHeaders(): Record<string, string> {
  const u = getStoredUser();
  return {
    'Content-Type': 'application/json',
    'x-user-id': u.id,
    'x-user-role': u.role,
    'x-user-name': encodeURIComponent(u.name),
  };
}

export const api = {
  // Projects
  async getProjects(params?: Record<string, string>): Promise<Project[]> {
    try {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(`/api/projects${query}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback to in-memory store
    }
    return portalStore.getProjects();
  },

  async getProject(id: string): Promise<Project | null> {
    try {
      const res = await fetch(`/api/projects/${id}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return portalStore.getProjectById(id) || null;
  },

  async createProject(data: any): Promise<Project> {
    const user = getStoredUser();
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return portalStore.createProject(data, user);
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const user = getStoredUser();
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return portalStore.updateProject(id, updates, user);
  },

  async deleteProject(id: string): Promise<boolean> {
    const user = getStoredUser();
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    return portalStore.deleteProject(id, user);
  },

  // Inspections
  async getInspections(params?: Record<string, string>): Promise<Inspection[]> {
    try {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(`/api/inspections${query}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return portalStore.getInspections();
  },

  async getInspection(id: string): Promise<Inspection | null> {
    try {
      const res = await fetch(`/api/inspections/${id}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return portalStore.getInspectionById(id) || null;
  },

  async updateInspection(id: string, updates: Partial<Inspection>): Promise<Inspection | null> {
    const user = getStoredUser();
    try {
      const res = await fetch(`/api/inspections/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return portalStore.updateInspection(id, updates, user);
  },

  async assignRandomInspection(data: {
    district?: string;
    state?: string;
    scheme?: string;
    minRiskLevel?: RiskLevel;
  }): Promise<{ success: boolean; message: string; inspection?: Inspection }> {
    const user = getStoredUser();
    try {
      const res = await fetch('/api/assignments/random', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      return json;
    } catch {
      // fallback
      return portalStore.assignRandomInspection({ ...data, assignedBy: user });
    }
  },

  // CCTV
  async getCameras(projectId?: string): Promise<CCTVCamera[]> {
    try {
      const url = projectId ? `/api/cctv/cameras?projectId=${projectId}` : '/api/cctv/cameras';
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return cctvProvider.getAllCameras(projectId);
  },

  async updateCameraStatus(id: string, status: CCTVCamera['status']): Promise<CCTVCamera | null> {
    try {
      const res = await fetch(`/api/cctv/cameras/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return cctvProvider.updateCameraStatus(id, status);
  },

  // Random VC
  async getVCRecords(projectId?: string): Promise<RandomVCRecord[]> {
    try {
      const url = projectId ? `/api/vc/records?projectId=${projectId}` : '/api/vc/records';
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return vcProvider.getVCRecords(projectId);
  },

  async getRandomVCTarget(): Promise<any> {
    try {
      const res = await fetch('/api/vc/random-target', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return vcProvider.selectRandomParticipant(portalStore.getProjects());
  },

  async saveVCRecord(data: any): Promise<RandomVCRecord> {
    try {
      const res = await fetch('/api/vc/records', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    const user = getStoredUser();
    return vcProvider.saveVCRecord({
      ...data,
      conductedByUserId: user.id,
      conductedByUserName: user.name,
    });
  },

  // Attendance
  async getAttendance(projectId?: string): Promise<{ summary: any; data: AttendanceRecord[] }> {
    try {
      const url = projectId ? `/api/attendance?projectId=${projectId}` : '/api/attendance';
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return { summary: json.summary, data: json.data };
      }
    } catch {
      // fallback
    }
    const data = await attendanceProvider.getAttendanceRecords(projectId);
    const summary = attendanceProvider.getAttendanceSummary(data);
    return { summary, data };
  },

  async getAttendanceTrend(projectId: string): Promise<any[]> {
    try {
      const res = await fetch(`/api/attendance/trend/${projectId}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    const proj = portalStore.getProjectById(projectId);
    if (!proj) return [];
    return attendanceProvider.generate30DayTrend(proj.id, proj.beneficiaryCount, proj.averageAttendancePercent);
  },

  // AI
  async analyzeProjectWithAI(projectId: string): Promise<any> {
    const res = await fetch('/api/ai/analyze-project', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ projectId }),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
    throw new Error('AI analysis temporarily unavailable.');
  },

  async summarizeInspectionWithAI(inspectionId: string): Promise<any> {
    const res = await fetch('/api/ai/summarize-inspection', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ inspectionId }),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
    throw new Error('AI inspection summary unavailable.');
  },

  async getAIAlerts(): Promise<AIAnomalyAlert[]> {
    try {
      const res = await fetch('/api/ai/alerts', { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return portalStore.getAIAlerts();
  },

  async dismissAIAlert(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/ai/alerts/${id}/dismiss`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    return portalStore.dismissAIAlert(id);
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await fetch('/api/notifications', { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return portalStore.getNotifications(getStoredUser().role);
  },

  async markNotificationRead(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    return portalStore.markNotificationRead(id);
  },

  async markNotificationAsRead(id: string): Promise<boolean> {
    return this.markNotificationRead(id);
  },

  async markAllNotificationsRead(): Promise<void> {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
    } catch {
      // fallback
    }
    portalStore.markAllNotificationsRead(getStoredUser().role);
  },

  async markAllNotificationsAsRead(): Promise<void> {
    return this.markAllNotificationsRead();
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await fetch('/api/audit-logs', { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return portalStore.getAuditLogs();
  },

  async createAuditLog(payload: {
    action: AuditLog['action'];
    targetType: AuditLog['targetType'];
    targetId?: string;
    targetName?: string;
    metadata?: Record<string, unknown>;
  }): Promise<AuditLog> {
    const user = getStoredUser();
    try {
      const res = await fetch('/api/audit-logs', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return portalStore.addAuditLog(
      user.id,
      user.name,
      user.role,
      payload.action,
      payload.targetType,
      payload.targetId,
      payload.targetName,
      payload.metadata
    );
  },

  // Users
  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/users', { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return portalStore.getUsers();
  },

  async createUser(data: any): Promise<User> {
    const author = getStoredUser();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return portalStore.createUser(data, author);
  },

  async updateUserRole(id: string, role: UserRole): Promise<User | null> {
    const author = getStoredUser();
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return portalStore.updateUserRole(id, role, author);
  },

  // Reset Demo
  async resetDemoData(): Promise<void> {
    try {
      await fetch('/api/reset-demo', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {
      // fallback
    }
    portalStore.resetToSeed();
  },

  // Upload
  async uploadEvidence(payload: {
    fileName: string;
    fileType: string;
    fileSize: number;
    category?: 'PHOTO' | 'VIDEO' | 'DOCUMENT';
    caption?: string;
    dataUrl?: string;
  }): Promise<any> {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'File upload failed');
    }
    const json = await res.json();
    return json.data;
  },
};
