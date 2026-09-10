import React from 'react';
import {
  UserCircle,
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  LogOut,
  KeyRound,
  CheckCircle2,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { User } from '../../types';
import { getRoleCategory, getRoleDisplayName, getRoleBadge } from '../../utils/rbac';

interface UserProfileViewProps {
  currentUser: User;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentUser,
  onLogout,
  onNavigate,
}) => {
  const roleCategory = getRoleCategory(currentUser.role);
  const roleBadge = getRoleBadge(currentUser.role);
  const displayName = getRoleDisplayName(currentUser.role);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B2545] to-[#13315C] text-white p-6 rounded-2xl shadow-md border border-[#13315C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">
            {currentUser.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${roleBadge.bg} ${roleBadge.textCol}`}>
                {roleBadge.text}
              </span>
              <span className="text-xs text-slate-300 font-mono">Dossier #{currentUser.id}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1 text-white">{currentUser.name}</h1>
            <p className="text-xs text-slate-300">{currentUser.designation}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit / Sign Out</span>
        </button>
      </div>

      {/* Official Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personnel Details */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <UserCircle className="w-5 h-5 text-[#0B2545]" />
            <h2 className="text-sm font-bold text-slate-900">Officer Dossier Particulars</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Official Name:</span>
              <span className="font-bold text-slate-800">{currentUser.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Designation:</span>
              <span className="font-semibold text-slate-800">{currentUser.designation}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">System Role:</span>
              <span className="font-bold text-indigo-700">{displayName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Ministry / Dept:</span>
              <span className="font-medium text-slate-800">{currentUser.department || 'Ministry of Social Justice and Empowerment'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Account Status:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Active & Verified
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Jurisdiction */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-[#0B2545]" />
            <h2 className="text-sm font-bold text-slate-900">Jurisdiction & Contact Info</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Official Email:</span>
              <span className="font-mono text-slate-800">{currentUser.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Gov Phone / Ext:</span>
              <span className="font-mono text-slate-800">{currentUser.phone || '+91 11 2338 1234'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Assigned State:</span>
              <span className="font-semibold text-slate-800">{currentUser.state || 'National Headquarters (New Delhi)'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">District Jurisdiction:</span>
              <span className="font-semibold text-slate-800">{currentUser.district || 'All-India Nodal Scope'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 font-medium">Creation Timestamp:</span>
              <span className="text-slate-600 font-mono text-[11px]">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Access Capabilities */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Assigned Role Capabilities & Permissions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
          {roleCategory === 'ADMIN' && (
            <>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">System Administration</span>
                <span className="text-slate-500 text-[11px]">Full create, update, delete across users, schemes, audits & settings</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">Command Center 24×7</span>
                <span className="text-slate-500 text-[11px]">Direct RTSP CCTV feeds, AI telemetry radar & anomaly triage</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">Statutory Audit Trail</span>
                <span className="text-slate-500 text-[11px]">Read-write access to cryptographic log chains & export dossiers</span>
              </div>
            </>
          )}

          {roleCategory === 'INSPECTION_OFFICER' && (
            <>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">Field Inspections</span>
                <span className="text-slate-500 text-[11px]">Execute statutory on-site checklists with GPS verification</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">Evidence Ingestion</span>
                <span className="text-slate-500 text-[11px]">Upload geo-tagged evidence photographs and physical records</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">Dossier Submission</span>
                <span className="text-slate-500 text-[11px]">Compile and transmit formal audit reports for senior sign-off</span>
              </div>
            </>
          )}

          {roleCategory === 'SUPERVISOR' && (
            <>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">Supervisory Oversight</span>
                <span className="text-slate-500 text-[11px]">Review completed audits, verify evidence and sign off reports</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">Officer Performance</span>
                <span className="text-slate-500 text-[11px]">Monitor inspection officers, completion rates and turnaround times</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">Live Monitoring</span>
                <span className="text-slate-500 text-[11px]">Real-time camera observation and surprise VC checks</span>
              </div>
            </>
          )}

          {roleCategory === 'FIELD_OFFICER' && (
            <>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">Daily Field Tasks</span>
                <span className="text-slate-500 text-[11px]">View assigned schedule, complete pending checklists and upload findings</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">On-Site Evidence</span>
                <span className="text-slate-500 text-[11px]">Take verified photo evidence and file immediate task completions</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">Field Reports</span>
                <span className="text-slate-500 text-[11px]">Submit statutory daily reports to jurisdictional directorates</span>
              </div>
            </>
          )}

          {roleCategory === 'VIEWER' && (
            <>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">Read-Only Observation</span>
                <span className="text-slate-500 text-[11px]">Monitor live CCTV feeds and review published inspection dossiers</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">MIS Reports Access</span>
                <span className="text-slate-500 text-[11px]">Browse statistical compliance summaries and regional status charts</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block">System Notifications</span>
                <span className="text-slate-500 text-[11px]">Receive official broadcasts and compliance milestones</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
