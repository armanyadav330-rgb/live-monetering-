import {
  LayoutDashboard,
  Video,
  Users,
  ShieldCheck,
  ClipboardCheck,
  FolderKanban,
  FileBarChart,
  AlertTriangle,
  ScrollText,
  Bell,
  Settings,
  UserCircle,
  ClipboardList,
  CalendarDays,
  CheckSquare,
  PlayCircle,
  UploadCloud,
  FileText,
  Clock,
  AlertCircle,
  Clock3,
  SearchCheck,
  Stamp,
  Award,
  CheckSquare2,
  CalendarClock,
  ListChecks,
  Camera,
  Send,
  Eye,
  FileSearch,
  FileCheck2,
  UserCheck,
  Globe,
  LucideIcon,
} from 'lucide-react';
import { UserRole } from '../types';

export type AppRoleCategory =
  | 'ADMIN'
  | 'INSPECTION_OFFICER'
  | 'SUPERVISOR'
  | 'FIELD_OFFICER'
  | 'VIEWER';

export interface RoleMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  category?: 'primary' | 'workflow' | 'system';
}

/**
 * Maps any stored UserRole into one of the 5 official role personas:
 * 1. ADMIN (Super Admin / Admin)
 * 2. INSPECTION_OFFICER (Field Inspection Officer)
 * 3. SUPERVISOR (Supervisor / Senior Department Official)
 * 4. FIELD_OFFICER (Field Staff / Institution Personnel)
 * 5. VIEWER (General User / Read-Only Observer)
 */
export function getRoleCategory(role: UserRole): AppRoleCategory {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'ADMIN';
    case 'INSPECTION_OFFICER':
      return 'INSPECTION_OFFICER';
    case 'DEPARTMENT_OFFICIAL':
    case 'SUPERVISOR':
      return 'SUPERVISOR';
    case 'NGO_INSTITUTE':
    case 'FIELD_OFFICER':
      return 'FIELD_OFFICER';
    case 'STATE_DISTRICT_AUTHORITY':
    case 'VIEWER':
    default:
      return 'VIEWER';
  }
}

export function getRoleDisplayName(role: UserRole): string {
  const cat = getRoleCategory(role);
  switch (cat) {
    case 'ADMIN':
      return 'Admin (Apex Command)';
    case 'INSPECTION_OFFICER':
      return 'Inspection Officer';
    case 'SUPERVISOR':
      return 'Supervisor / Senior Officer';
    case 'FIELD_OFFICER':
      return 'Field Staff / Field Officer';
    case 'VIEWER':
      return 'Viewer / General User';
  }
}

export function getRoleBadge(role: UserRole): { text: string; bg: string; textCol: string } {
  const cat = getRoleCategory(role);
  switch (cat) {
    case 'ADMIN':
      return { text: 'ADMINISTRATOR', bg: 'bg-rose-100 border-rose-300', textCol: 'text-rose-900' };
    case 'INSPECTION_OFFICER':
      return { text: 'INSPECTION OFFICER', bg: 'bg-indigo-100 border-indigo-300', textCol: 'text-indigo-900' };
    case 'SUPERVISOR':
      return { text: 'SUPERVISOR', bg: 'bg-amber-100 border-amber-300', textCol: 'text-amber-900' };
    case 'FIELD_OFFICER':
      return { text: 'FIELD STAFF', bg: 'bg-emerald-100 border-emerald-300', textCol: 'text-emerald-900' };
    case 'VIEWER':
      return { text: 'GENERAL VIEWER', bg: 'bg-slate-100 border-slate-300', textCol: 'text-slate-800' };
  }
}

/**
 * Explicit sidebar menu items per role, strictly matching specifications.
 */
export const ROLE_SIDEBAR_MENUS: Record<AppRoleCategory, RoleMenuItem[]> = {
  ADMIN: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cctv', label: 'Command Center / Live Monitoring', icon: Video, badge: '24×7' },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: 'Role & Permission Management', icon: ShieldCheck, badge: 'RBAC' },
    { id: 'inspections', label: 'Inspection Management', icon: ClipboardCheck },
    { id: 'officers', label: 'Inspection Officer Management', icon: UserCheck },
    { id: 'projects', label: 'Scheme / Program Management', icon: FolderKanban, badge: 'MIS' },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart },
    { id: 'alerts', label: 'Alerts & Escalations', icon: AlertTriangle, badge: 'LIVE' },
    { id: 'audit-logs', label: 'Audit Logs', icon: ScrollText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ],

  INSPECTION_OFFICER: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-inspections', label: 'My Inspections', icon: ClipboardList, badge: 'MINE' },
    { id: 'assigned-inspections', label: 'Assigned Inspections', icon: FileCheck2 },
    { id: 'inspection-schedule', label: 'Inspection Calendar / Schedule', icon: CalendarDays },
    { id: 'inspection-checklist', label: 'Inspection Checklist', icon: CheckSquare },
    { id: 'start-inspection', label: 'Start Inspection', icon: PlayCircle, badge: 'ACTION' },
    { id: 'upload-evidence', label: 'Upload Evidence', icon: UploadCloud },
    { id: 'reports', label: 'Inspection Reports', icon: FileText },
    { id: 'pending-actions', label: 'Pending Actions', icon: Clock, badge: 'DUE' },
    { id: 'alerts', label: 'Alerts / Escalations', icon: AlertCircle },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ],

  SUPERVISOR: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cctv', label: 'Live Monitoring', icon: Video, badge: 'LIVE' },
    { id: 'inspections', label: 'Inspection Overview', icon: ClipboardCheck },
    { id: 'pending-inspections', label: 'Pending Inspections', icon: Clock3, badge: 'QUEUE' },
    { id: 'review-inspections', label: 'Review Inspections', icon: SearchCheck },
    { id: 'approve-reports', label: 'Approve / Reject Reports', icon: Stamp, badge: 'SIGN-OFF' },
    { id: 'officers', label: 'Officer Performance', icon: Award },
    { id: 'alerts', label: 'Alerts & Escalations', icon: AlertTriangle, badge: 'ALERT' },
    { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart, badge: 'MIS' },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ],

  FIELD_OFFICER: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assigned-tasks', label: 'Assigned Tasks', icon: CheckSquare2, badge: 'TASKS' },
    { id: 'today-schedule', label: 'Today’s Schedule', icon: CalendarClock, badge: 'TODAY' },
    { id: 'start-inspection', label: 'Start Inspection', icon: PlayCircle, badge: 'ACTION' },
    { id: 'inspection-checklist', label: 'Inspection Checklist', icon: ListChecks },
    { id: 'upload-evidence', label: 'Upload Photos / Evidence', icon: Camera },
    { id: 'submit-report', label: 'Submit Report', icon: Send },
    { id: 'pending-tasks', label: 'Pending Tasks', icon: Clock, badge: 'DUE' },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ],

  VIEWER: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cctv', label: 'Live Monitoring', icon: Eye, badge: 'FEED' },
    { id: 'inspection-status', label: 'Inspection Status', icon: FileSearch },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ],
};

/**
 * Route authorization matrix.
 * Determines if a given role is allowed to view a particular route/view ID.
 */
const AUTHORIZED_ROUTES: Record<AppRoleCategory, string[]> = {
  ADMIN: [
    'home',
    'dashboard',
    'cctv',
    'users',
    'roles',
    'inspections',
    'officers',
    'projects',
    'project-detail',
    'reports',
    'alerts',
    'analytics',
    'audit-logs',
    'audit',
    'notifications',
    'settings',
    'profile',
    'vc',
    'map',
    'ai-assistant',
    'inspection-form',
    'inspection-report',
    'my-inspections',
    'assigned-inspections',
    'inspection-schedule',
    'inspection-checklist',
    'start-inspection',
    'upload-evidence',
    'pending-actions',
    'pending-inspections',
    'review-inspections',
    'approve-reports',
    'assigned-tasks',
    'today-schedule',
    'submit-report',
    'pending-tasks',
    'inspection-status',
  ],

  INSPECTION_OFFICER: [
    'home',
    'dashboard',
    'my-inspections',
    'assigned-inspections',
    'inspection-schedule',
    'inspection-checklist',
    'start-inspection',
    'upload-evidence',
    'reports',
    'pending-actions',
    'alerts',
    'notifications',
    'profile',
    'inspections',
    'inspection-form',
    'inspection-report',
    'vc',
    'map',
    'ai-assistant',
    'project-detail',
  ],

  SUPERVISOR: [
    'home',
    'dashboard',
    'cctv',
    'inspections',
    'pending-inspections',
    'review-inspections',
    'approve-reports',
    'officers',
    'alerts',
    'analytics',
    'reports',
    'notifications',
    'profile',
    'project-detail',
    'inspection-report',
    'map',
    'vc',
    'ai-assistant',
  ],

  FIELD_OFFICER: [
    'home',
    'dashboard',
    'assigned-tasks',
    'today-schedule',
    'start-inspection',
    'inspection-checklist',
    'upload-evidence',
    'submit-report',
    'pending-tasks',
    'notifications',
    'profile',
    'inspections',
    'inspection-form',
    'inspection-report',
    'ai-assistant',
    'project-detail',
  ],

  VIEWER: [
    'home',
    'dashboard',
    'cctv',
    'inspection-status',
    'inspections',
    'reports',
    'notifications',
    'profile',
    'inspection-report',
    'map',
    'ai-assistant',
    'project-detail',
  ],
};

/**
 * Checks whether the user's role is authorized to access the given view.
 */
export function isRouteAuthorized(role: UserRole, view: string): boolean {
  if (!view || view === 'home') return true;

  // Clean view ID if it has parameters (e.g., 'projects/123')
  const baseView = view.split('/')[0];
  const cat = getRoleCategory(role);
  const allowed = AUTHORIZED_ROUTES[cat] || [];

  return allowed.includes(baseView);
}
