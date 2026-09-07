import React, { useState, useEffect } from 'react';
import {
  Bell,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  ChevronDown,
  RefreshCw,
  Building2,
  Menu,
  Settings,
  Globe,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { api, setStoredUser } from '../../services/api';

interface HeaderProps {
  currentUser: User;
  allUsers?: User[];
  onUserChange: (user: User) => void;
  onNavigate?: (view: string) => void;
  onResetDemo?: () => void;
  onToggleSidebar?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers: propUsers,
  onUserChange,
  onNavigate = (_view: string) => {},
  onResetDemo = () => window.location.reload(),
  onToggleSidebar,
  onOpenNotifications,
  unreadNotificationsCount,
}) => {
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (propUsers && propUsers.length > 0) {
      setAvailableUsers(propUsers);
    } else {
      api.getUsers().then((u) => setAvailableUsers(u));
    }
    fetchNotifications();
  }, [currentUser, propUsers]);

  const fetchNotifications = () => {
    api.getNotifications().then((list) => {
      setNotifications(list.slice(0, 5));
      setUnreadCount(list.filter((n) => !n.read).length);
    });
  };

  const handleRoleSelect = (role: UserRole) => {
    const match = availableUsers.find((u) => u.role === role);
    if (match) {
      setStoredUser(match);
      onUserChange(match);
      setShowRoleMenu(false);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'DEPARTMENT_OFFICIAL':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'INSPECTION_OFFICER':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'STATE_DISTRICT_AUTHORITY':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'NGO_INSTITUTE':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-300 shadow-sm shrink-0 font-sans">
      {/* Top Government Citizen Utility Bar (Standard on Indian Gov Portals) */}
      <div className="bg-[#0B2545] text-slate-200 text-[11px] px-4 sm:px-6 py-1 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 font-medium tracking-wide">
          <span className="text-amber-400 font-semibold">भारत सरकार</span>
          <span className="text-slate-400">|</span>
          <span className="hidden xs:inline">GOVERNMENT OF INDIA</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300 text-[10px]">सामाजिक न्याय और अधिकारिता मंत्रालय</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="hidden md:inline text-slate-300 font-mono">NIC-SECURE-NODE-2026</span>
          <div className="flex items-center gap-1 bg-[#13315C] px-1.5 py-0.5 rounded border border-slate-700 text-amber-300 font-bold">
            <span className="cursor-pointer hover:text-white" title="Decrease Font">A-</span>
            <span className="text-slate-500">|</span>
            <span className="cursor-pointer hover:text-white" title="Normal Font">A</span>
            <span className="text-slate-500">|</span>
            <span className="cursor-pointer hover:text-white" title="Increase Font">A+</span>
          </div>
          <span className="font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/50">
            हिंदी / English
          </span>
        </div>
      </div>

      {/* Top Government Tricolor Stripe (Saffron, White, Green) */}
      <div className="h-1 w-full grid grid-cols-3">
        <div className="bg-[#FF9933]" />
        <div className="bg-white" />
        <div className="bg-[#138808]" />
      </div>

      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 bg-slate-50/70">
        {/* Government Identity Branding */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="flex flex-col items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#0B2545] text-amber-400 border-2 border-amber-500/80 shadow-xs shrink-0 p-1">
            <span className="text-base sm:text-lg leading-none">🏛️</span>
            <span className="text-[8px] font-bold tracking-tighter text-amber-300 uppercase">सत्यमेव जयते</span>
          </div>
          <div className="min-w-0">
            <div className="text-[9px] xs:text-[10px] sm:text-[11px] font-bold text-[#0B2545] tracking-wider uppercase truncate max-w-[170px] sm:max-w-none">
              Ministry of Social Justice and Empowerment · Government of India
            </div>
            <h1 className="text-xs xs:text-sm sm:text-base md:text-lg font-extrabold text-[#0B2545] leading-tight truncate max-w-[160px] xs:max-w-[220px] sm:max-w-md md:max-w-none">
              National Institutional Monitoring &amp; Inspection Portal
            </h1>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Quick Role Switcher for Evaluators */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
              title="Switch user role for testing"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="hidden md:inline text-slate-500">Role:</span>
              <span className="font-semibold text-slate-900 truncate max-w-[75px] xs:max-w-[110px] sm:max-w-[140px]">
                {currentUser.role.replace('_', ' ')}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1 w-64 max-w-[calc(100vw-1.5rem)] bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-50 text-xs">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Switch Demo Role
                </div>
                {(
                  [
                    'SUPER_ADMIN',
                    'DEPARTMENT_OFFICIAL',
                    'INSPECTION_OFFICER',
                    'STATE_DISTRICT_AUTHORITY',
                    'NGO_INSTITUTE',
                  ] as UserRole[]
                ).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSelect(r)}
                    className={`w-full text-left px-2.5 py-2 my-0.5 rounded-md flex items-center justify-between transition ${
                      currentUser.role === r
                        ? 'bg-indigo-50 text-indigo-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{r.replace(/_/g, ' ')}</span>
                    {currentUser.role === r && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetDemo}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition"
            title="Reset database to initial seed dataset"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {(unreadNotificationsCount !== undefined ? unreadNotificationsCount : unreadCount) > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white ring-2 ring-white">
                  {unreadNotificationsCount !== undefined ? unreadNotificationsCount : unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden text-xs">
                <div className="px-3 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Notifications</span>
                  <button
                    onClick={() => {
                      api.markAllNotificationsRead();
                      setUnreadCount(0);
                    }}
                    className="text-[11px] text-indigo-600 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">No recent notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 hover:bg-slate-50 cursor-pointer ${
                          !n.read ? 'bg-indigo-50/40' : ''
                        }`}
                        onClick={() => {
                          api.markNotificationRead(n.id);
                          setShowNotifMenu(false);
                          if (n.link) onNavigate(n.link.replace('/', ''));
                        }}
                      >
                        <div className="font-medium text-slate-900">{n.title}</div>
                        <div className="text-slate-500 mt-0.5 line-clamp-2">{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    if (onOpenNotifications) {
                      onOpenNotifications();
                    } else {
                      onNavigate('notifications');
                    }
                  }}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-center font-medium text-indigo-600 border-t border-slate-100"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>

          {/* Portal Settings Quick Button */}
          {onNavigate && (
            <button
              onClick={() => onNavigate('settings')}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              title="Portal Settings"
              aria-label="Open Portal Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Live Monitor Homepage Gateway */}
          {onNavigate && (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border border-blue-200 bg-blue-50/90 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
              title="Return to Live Monitor Homepage Gateway"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Homepage</span>
            </button>
          )}

          {/* Current User Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold text-xs shrink-0">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                {currentUser.designation}
              </div>
            </div>
          </div>

          {/* Three-Line Menu Toggle Button (Shifted to Right Side) */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer border border-slate-200 bg-white shadow-2xs shrink-0"
              title="Open Navigation Menu"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
