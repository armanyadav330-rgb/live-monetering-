import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Video,
  PhoneCall,
  ClipboardCheck,
  MapPin,
  Sparkles,
  FileBarChart,
  Bell,
  ScrollText,
  Users,
  Settings,
  Bot,
  Globe,
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentView?: string;
  activeView?: string;
  onNavigate: (view: string) => void;
  userRole: UserRole;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  activeView,
  onNavigate,
  userRole,
  isOpen = false,
  onClose,
}) => {
  const effectiveView = currentView || activeView || 'dashboard';
  const navItems = [
    {
      id: 'home',
      label: 'Homepage & Gateway',
      icon: Globe,
      badge: 'GATEWAY',
      roles: ['SUPER_ADMIN', 'DEPARTMENT_OFFICIAL', 'INSPECTION_OFFICER', 'STATE_DISTRICT_AUTHORITY', 'NGO_INSTITUTE'],
    },
    {
      id: 'dashboard',
      label: 'Main Dashboard',
      icon: LayoutDashboard,
      roles: ['SUPER_ADMIN', 'DEPARTMENT_OFFICIAL', 'INSPECTION_OFFICER', 'STATE_DISTRICT_AUTHORITY', 'NGO_INSTITUTE'],
    },
    {
      id: 'projects',
      label: 'Project Management',
      icon: FolderKanban,
      roles: ['SUPER_ADMIN', 'DEPARTMENT_OFFICIAL', 'STATE_DISTRICT_AUTHORITY', 'NGO_INSTITUTE'],
    },
    {
      id: 'inspections',
      label: 'Inspections & Audits',
      icon: ClipboardCheck,
      roles: ['SUPER_ADMIN', 'DEPARTMENT_OFFICIAL', 'INSPECTION_OFFICER', 'STATE_DISTRICT_AUTHORITY', 'NGO_INSTITUTE'],
    },
    {
      id: 'cctv',
      label: 'CCTV Monitoring',
      icon: Video,
      badge: 'SIM',
      roles: ['SUPER_ADMIN', 'DEPARTMENT_OFFICIAL'],
    },
    {
      id: 'vc',
      label: 'Random Call & Video (Toll-Free)',
      icon: PhoneCall,
      badge: 'LIVE',
      roles: ['SUPER_ADMIN', 'DEPARTMENT_OFFICIAL', 'INSPECTION_OFFICER', 'STATE_DISTRICT_AUTHORITY'],
    },
    {
      id: 'ai-assistant',
      label: 'AI Officer (Voice & Video)',
      icon: Bot,
      badge: 'ORAL',
      roles: ['SUPER_ADMIN', 'DEPARTMENT_OFFICIAL', 'INSPECTION_OFFICER', 'STATE_DISTRICT_AUTHORITY', 'NGO_INSTITUTE'],
    },
    {
      id: 'map',
      label: 'GIS Project Map',
      icon: MapPin,
      roles: ['SUPER_ADMIN', 'DEPARTMENT_OFFICIAL', 'INSPECTION_OFFICER', 'STATE_DISTRICT_AUTHORITY'],
    },
    {
      id: 'analytics',
      label: 'AI & Attendance',
      icon: Sparkles,
      badge: 'AI',
      roles: ['SUPER_ADMIN', 'DEPARTMENT_OFFICIAL', 'STATE_DISTRICT_AUTHORITY'],
    },
    {
      id: 'reports',
      label: 'Reports & Exports',
      icon: FileBarChart,
      badge: 'MIS',
      roles: ['SUPER_ADMIN', 'DEPARTMENT_OFFICIAL', 'INSPECTION_OFFICER', 'STATE_DISTRICT_AUTHORITY', 'NGO_INSTITUTE'],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      roles: ['SUPER_ADMIN', 'DEPARTMENT_OFFICIAL', 'INSPECTION_OFFICER', 'STATE_DISTRICT_AUTHORITY', 'NGO_INSTITUTE'],
    },
    {
      id: 'audit-logs',
      label: 'Audit Trail',
      icon: ScrollText,
      roles: ['SUPER_ADMIN', 'DEPARTMENT_OFFICIAL', 'STATE_DISTRICT_AUTHORITY', 'INSPECTION_OFFICER'],
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      roles: ['SUPER_ADMIN'],
    },
    {
      id: 'settings',
      label: 'Portal Settings',
      icon: Settings,
      roles: ['SUPER_ADMIN', 'DEPARTMENT_OFFICIAL', 'INSPECTION_OFFICER', 'STATE_DISTRICT_AUTHORITY', 'NGO_INSTITUTE'],
    },
  ];

  const allowedItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B2545] text-slate-100 shrink-0 h-full flex flex-col justify-between border-r border-[#13315C] overflow-hidden select-none transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-2.5 space-y-0.5 flex-1 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between px-2.5 py-1 mb-1 border-b border-[#13315C] pb-2">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏛️</span>
              <span>PORTAL MODULES</span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="md:hidden text-slate-400 hover:text-white p-1 rounded-sm"
                aria-label="Close sidebar"
              >
                ✕
              </button>
            )}
          </div>
          <div className="space-y-0.5">
            {allowedItems.map((item) => {
              const Icon = item.icon;
              const viewStr = effectiveView || '';
              const isActive =
                viewStr === item.id ||
                (item.id === 'projects' && (viewStr.startsWith('projects/') || viewStr === 'project-detail')) ||
                (item.id === 'inspections' &&
                  (viewStr.startsWith('inspections/') ||
                    viewStr === 'inspection-form' ||
                    viewStr === 'inspection-report'));

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[#1E3A8A] text-white font-semibold border-l-4 border-amber-400 shadow-sm'
                      : 'text-slate-200 hover:bg-[#13315C] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ml-1.5 ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-extrabold'
                          : 'bg-[#13315C] text-amber-300 border border-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* System Operational Status */}
        <div className="p-2.5 border-t border-[#13315C] bg-[#07162C] text-[11px] text-slate-300 shrink-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-slate-400 text-[10px] font-medium">NIC National Cloud</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              GOV SECURE
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate">
            DoSJE-MIS-v2.4 · 256-Bit Encrypted
          </div>
        </div>
      </aside>
    </>
  );
};
