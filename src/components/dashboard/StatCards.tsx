import React from 'react';
import {
  Building2,
  Video,
  ClipboardList,
  AlertTriangle,
  Users,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { Project, Inspection } from '../../types';

interface StatCardsProps {
  projects?: Project[];
  inspections?: Inspection[];
}

export const StatCards: React.FC<StatCardsProps> = ({ projects = [], inspections = [] }) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeInspections = Array.isArray(inspections) ? inspections : [];

  const totalProjects = safeProjects.length;
  const activeProjects = safeProjects.filter((p) => p.projectStatus === 'ACTIVE').length;
  const underReview = safeProjects.filter((p) => p.projectStatus === 'UNDER_REVIEW').length;

  const cctvOnline = safeProjects.filter((p) => p.cctvStatus === 'ONLINE').length;
  const cctvOffline = safeProjects.filter((p) => p.cctvStatus === 'OFFLINE').length;
  const cctvWarning = safeProjects.filter((p) => p.cctvStatus === 'WARNING').length;

  const pendingInspections = safeInspections.filter((i) => i.status === 'PENDING').length;
  const completedInspections = safeInspections.filter((i) => i.status === 'COMPLETED').length;

  const criticalProjects = safeProjects.filter((p) => p.riskLevel === 'CRITICAL').length;
  const highProjects = safeProjects.filter((p) => p.riskLevel === 'HIGH').length;

  const totalBeneficiaries = safeProjects.reduce((acc, p) => acc + (p.beneficiaryCount || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {/* 1. Projects Metric - Ashoka Deep Navy */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 border-l-4 border-l-[#0B2545] shadow-xs hover:border-slate-400 transition">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#0B2545] uppercase tracking-wider block">
              Total Projects
            </span>
            <span className="text-[10px] text-slate-500 font-medium">कुल परियोजनाएं</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0B2545]/10 text-[#0B2545]">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#0B2545]">{totalProjects}</span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            {activeProjects} Active
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-600 flex justify-between border-t border-slate-200 pt-2 font-medium">
          <span>Review Queue: {underReview}</span>
          <span className="font-semibold text-slate-800">{totalBeneficiaries.toLocaleString()} Beneficiaries</span>
        </div>
      </div>

      {/* 2. CCTV Status - Government Forest Green */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 border-l-4 border-l-[#047857] shadow-xs hover:border-slate-400 transition">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#047857] uppercase tracking-wider block">
              CCTV Surveillance
            </span>
            <span className="text-[10px] text-slate-500 font-medium">सीसीटीवी लाइव निगरानी</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <Video className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-700">{cctvOnline}</span>
          <span className="text-xs text-slate-600 font-semibold">Active Feeds</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-600 flex justify-between border-t border-slate-200 pt-2 font-medium">
          <span className="text-rose-700 font-bold">{cctvOffline} Offline</span>
          <span className="text-amber-700 font-bold">{cctvWarning} Degraded</span>
        </div>
      </div>

      {/* 3. Inspections Metric - Official Cobalt Blue */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 border-l-4 border-l-[#1E3A8A] shadow-xs hover:border-slate-400 transition">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider block">
              Field Audits
            </span>
            <span className="text-[10px] text-slate-500 font-medium">क्षेत्रीय निरीक्षण एवं सत्यापन</span>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
            <ClipboardList className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#1E3A8A]">{completedInspections}</span>
          <span className="text-xs font-semibold text-slate-600">Completed</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-600 flex justify-between border-t border-slate-200 pt-2 font-medium">
          <span className="text-amber-700 font-bold">Pending: {pendingInspections}</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> GPS Verified
          </span>
        </div>
      </div>

      {/* 4. Risk / Non-Compliance - Government Ochre/Crimson */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 border-l-4 border-l-[#C2410C] shadow-xs hover:border-slate-400 transition">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#C2410C] uppercase tracking-wider block">
              Compliance Watch
            </span>
            <span className="text-[10px] text-slate-500 font-medium">जोखिम एवं अनुपालन सतर्कता</span>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-rose-700">
            {criticalProjects + highProjects}
          </span>
          <span className="text-xs text-rose-800 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
            Priority Watch
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-600 flex justify-between border-t border-slate-200 pt-2 font-medium">
          <span className="text-rose-700 font-bold">{criticalProjects} Critical</span>
          <span className="text-amber-700 font-semibold">{highProjects} Under Review</span>
        </div>
      </div>
    </div>
  );
};
