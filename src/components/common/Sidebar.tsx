import React from 'react';
import {
  Globe,
  LogOut,
  UserCircle,
  Shield,
} from 'lucide-react';
import { UserRole } from '../../types';
import {
  getRoleCategory,
  getRoleDisplayName,
  getRoleBadge,
  ROLE_SIDEBAR_MENUS,
  RoleMenuItem,
} from '../../utils/rbac';

interface SidebarProps {
  currentView?: string;
  activeView?: string;
  onNavigate: (view: string) => void;
  userRole: UserRole;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  activeView,
  onNavigate,
  userRole,
  isOpen = false,
  onClose,
  onLogout,
}) => {
  const effectiveView = currentView || activeView || 'dashboard';
  const roleCategory = getRoleCategory(userRole);
  const roleBadge = getRoleBadge(userRole);
  const roleTitle = getRoleDisplayName(userRole);

  // Retrieve the dedicated role-specific menu items
  const roleMenuItems: RoleMenuItem[] = ROLE_SIDEBAR_MENUS[roleCategory] || ROLE_SIDEBAR_MENUS.VIEWER;

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
        <div className="p-2.5 space-y-2 flex-1 overflow-y-auto flex flex-col">
          {/* Header Bar with Role Indication */}
          <div className="px-2 py-1.5 border-b border-[#13315C] pb-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>ROLE-BASED WORKFLOW</span>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="md:hidden text-slate-400 hover:text-white p-1 rounded-sm cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Role Badge Indicator */}
            <div className="flex items-center justify-between bg-[#07162C] px-2 py-1.5 rounded-lg border border-[#13315C]">
              <div className="min-w-0">
                <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border inline-block ${roleBadge.bg} ${roleBadge.textCol}`}>
                  {roleBadge.text}
                </span>
                <div className="text-[11px] font-bold text-slate-200 truncate mt-0.5" title={roleTitle}>
                  {roleTitle}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Gateway Link */}
          <button
            onClick={() => {
              onNavigate('home');
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-semibold text-sky-200 hover:bg-[#13315C] hover:text-white border border-dashed border-[#1E3A8A] transition cursor-pointer"
            title="Public Homepage Gateway"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Homepage Gateway</span>
            </div>
            <span className="text-[9px] font-mono text-sky-300 uppercase">GOV.IN</span>
          </button>

          {/* Dynamic Role-Based Menu Items */}
          <div className="space-y-0.5 pt-1">
            {roleMenuItems.map((item) => {
              const Icon = item.icon;
              const viewStr = effectiveView || '';
              const isActive =
                viewStr === item.id ||
                (item.id === 'projects' && (viewStr.startsWith('projects/') || viewStr === 'project-detail')) ||
                (item.id === 'inspections' &&
                  (viewStr.startsWith('inspections/') ||
                    viewStr === 'inspection-form' ||
                    viewStr === 'inspection-report')) ||
                (item.id === 'alerts' && viewStr === 'analytics');

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

        {/* Footer Area: Profile, Logout & System Integrity */}
        <div className="p-2.5 border-t border-[#13315C] bg-[#07162C] space-y-2 shrink-0">
          {/* Common Profile & Logout buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                onNavigate('profile');
                if (onClose) onClose();
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-[11px] font-semibold transition cursor-pointer ${
                effectiveView === 'profile'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#0B2545] hover:bg-[#13315C] text-slate-200 border border-[#1E3A8A]'
              }`}
              title="Official Profile"
            >
              <UserCircle className="w-3.5 h-3.5 text-indigo-300" />
              <span>Profile</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-1 py-1.5 px-2.5 rounded bg-rose-900/40 hover:bg-rose-700 text-rose-200 hover:text-white text-[11px] font-semibold border border-rose-800 transition cursor-pointer"
                title="Sign Out / Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#13315C]/60 text-[10px] text-slate-400">
            <span className="truncate">NIC Sovereign Grid</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ACTIVE
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
