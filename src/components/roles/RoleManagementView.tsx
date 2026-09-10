import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Lock,
  Edit,
  Key,
  Info,
  BadgeCheck,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { getRoleCategory } from '../../utils/rbac';

interface RoleManagementViewProps {
  users: User[];
  onUpdateUserRole?: (userId: string, newRole: UserRole) => void;
}

interface RoleDefinition {
  role: UserRole;
  title: string;
  category: string;
  description: string;
  permissions: {
    dashboard: boolean;
    cctv: boolean;
    inspectionsManage: boolean;
    inspectionsConduct: boolean;
    usersManage: boolean;
    schemesManage: boolean;
    reportsFull: boolean;
    auditLogs: boolean;
    settings: boolean;
  };
}

export const RoleManagementView: React.FC<RoleManagementViewProps> = ({ users }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPER_ADMIN');

  const roleDefinitions: RoleDefinition[] = [
    {
      role: 'SUPER_ADMIN',
      title: 'Admin (Apex Command)',
      category: 'System Administrator',
      description:
        'Full unrestricted administrative access across the entire national infrastructure, user registries, system configurations, and cryptographic audit trails.',
      permissions: {
        dashboard: true,
        cctv: true,
        inspectionsManage: true,
        inspectionsConduct: true,
        usersManage: true,
        schemesManage: true,
        reportsFull: true,
        auditLogs: true,
        settings: true,
      },
    },
    {
      role: 'INSPECTION_OFFICER',
      title: 'Inspection Officer',
      category: 'Field Directorate',
      description:
        'Dedicated inspection and audit workflow: conducts on-site checks, uploads geotagged photo evidence, fills statutory digital dossiers, and files non-compliance alerts.',
      permissions: {
        dashboard: true,
        cctv: false,
        inspectionsManage: false,
        inspectionsConduct: true,
        usersManage: false,
        schemesManage: false,
        reportsFull: true,
        auditLogs: false,
        settings: false,
      },
    },
    {
      role: 'DEPARTMENT_OFFICIAL',
      title: 'Supervisor / Senior Officer',
      category: 'Scheme Directorate',
      description:
        'Supervisory oversight across zonal inspections, report sign-offs, officer performance scorecards, live telemetry observation, and risk escalations.',
      permissions: {
        dashboard: true,
        cctv: true,
        inspectionsManage: true,
        inspectionsConduct: false,
        usersManage: false,
        schemesManage: true,
        reportsFull: true,
        auditLogs: true,
        settings: false,
      },
    },
    {
      role: 'NGO_INSTITUTE',
      title: 'Field Staff / Field Officer',
      category: 'Institutional & Field Unit',
      description:
        'Field-level task execution: today schedule tracking, checklist completion, physical evidence upload, and routine task report submissions.',
      permissions: {
        dashboard: true,
        cctv: false,
        inspectionsManage: false,
        inspectionsConduct: true,
        usersManage: false,
        schemesManage: false,
        reportsFull: false,
        auditLogs: false,
        settings: false,
      },
    },
    {
      role: 'STATE_DISTRICT_AUTHORITY',
      title: 'Viewer / General User',
      category: 'Monitoring & Review',
      description:
        'Read-only monitoring of live camera feeds, published inspection dossiers, analytical compliance charts, and broadcast notifications.',
      permissions: {
        dashboard: true,
        cctv: true,
        inspectionsManage: false,
        inspectionsConduct: false,
        usersManage: false,
        schemesManage: false,
        reportsFull: true,
        auditLogs: false,
        settings: false,
      },
    },
  ];

  const currentDef = roleDefinitions.find((r) => r.role === selectedRole) || roleDefinitions[0];
  const usersWithRole = users.filter((u) => getRoleCategory(u.role) === getRoleCategory(selectedRole));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h1 className="text-base font-bold text-slate-900">
              Role &amp; Permission Management (RBAC)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically enforced role definitions, granular privileges, and officer authority matrices.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200">
          <BadgeCheck className="w-4 h-4 text-indigo-600" />
          <span>5 Sovereign RBAC Profiles Active</span>
        </div>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {roleDefinitions.map((def) => {
          const isSelected = selectedRole === def.role;
          const count = users.filter((u) => getRoleCategory(u.role) === getRoleCategory(def.role)).length;

          return (
            <button
              key={def.role}
              onClick={() => setSelectedRole(def.role)}
              className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-[#0B2545] border-[#0B2545] text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div>
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {def.category}
                </span>
                <h3 className="font-bold text-xs mt-1 leading-snug line-clamp-1">{def.title}</h3>
              </div>
              <span className={`text-[11px] font-semibold ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                {count} {count === 1 ? 'User' : 'Users'} Enrolled
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Role Specifications Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Role Description & Enrolled Personnel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {currentDef.title} Overview
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">{currentDef.description}</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Assigned Personnel</span>
              <span className="text-slate-400 font-normal">({usersWithRole.length})</span>
            </h2>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
              {usersWithRole.length === 0 ? (
                <div className="text-slate-400 py-3 text-center">No users currently in this role</div>
              ) : (
                usersWithRole.map((u) => (
                  <div key={u.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#0B2545] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      {u.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 truncate">{u.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{u.designation}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Permission Matrix */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Functional Permission Matrix</h2>
              <p className="text-xs text-slate-500">Privileges authorized for {currentDef.title}</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Main Dashboard Access</span>
                <span className="text-slate-500 text-[11px]">View high-level telemetry indicators and system alerts</span>
              </div>
              {currentDef.permissions.dashboard ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                  <XCircle className="w-3.5 h-3.5" /> Denied
                </span>
              )}
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Command Center / Live CCTV Feeds</span>
                <span className="text-slate-500 text-[11px]">Real-time RTSP surveillance streaming and PTZ controls</span>
              </div>
              {currentDef.permissions.cctv ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                  <XCircle className="w-3.5 h-3.5" /> Denied
                </span>
              )}
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Inspection Management &amp; Assignment</span>
                <span className="text-slate-500 text-[11px]">Assign surprise visits, set priorities, and dispatch inspectors</span>
              </div>
              {currentDef.permissions.inspectionsManage ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                  <XCircle className="w-3.5 h-3.5" /> Denied
                </span>
              )}
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Field Inspection Execution</span>
                <span className="text-slate-500 text-[11px]">GPS-stamped statutory checklists, evidence upload & submission</span>
              </div>
              {currentDef.permissions.inspectionsConduct ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                  <XCircle className="w-3.5 h-3.5" /> Denied
                </span>
              )}
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">User Credential Management</span>
                <span className="text-slate-500 text-[11px]">Create officer accounts, change passwords, and manage logins</span>
              </div>
              {currentDef.permissions.usersManage ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                  <XCircle className="w-3.5 h-3.5" /> Denied
                </span>
              )}
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Scheme &amp; Program Configuration</span>
                <span className="text-slate-500 text-[11px]">PM-AJAY, SMILE, and institution registry configuration</span>
              </div>
              {currentDef.permissions.schemesManage ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                  <XCircle className="w-3.5 h-3.5" /> Denied
                </span>
              )}
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Full Reports &amp; Analytics Export</span>
                <span className="text-slate-500 text-[11px]">Download consolidated MIS dossiers in PDF & CSV formats</span>
              </div>
              {currentDef.permissions.reportsFull ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                  <XCircle className="w-3.5 h-3.5" /> Denied
                </span>
              )}
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Cryptographic Audit Logs</span>
                <span className="text-slate-500 text-[11px]">View statutory tamper-evident user activity log chains</span>
              </div>
              {currentDef.permissions.auditLogs ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                  <XCircle className="w-3.5 h-3.5" /> Denied
                </span>
              )}
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Portal System Settings</span>
                <span className="text-slate-500 text-[11px]">Toll-Free gateway routing, AI weights, and security parameters</span>
              </div>
              {currentDef.permissions.settings ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Granted
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                  <XCircle className="w-3.5 h-3.5" /> Denied
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
