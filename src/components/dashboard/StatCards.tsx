import React from 'react';
import {
  Building2,
  Video,
  ClipboardList,
  AlertTriangle,
  Users,
  CheckCircle2,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Projects Metric */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Projects
          </span>
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{totalProjects}</span>
          <span className="text-xs font-medium text-emerald-600">
            {activeProjects} Active
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-2">
          <span>Under Review: {underReview}</span>
          <span>Beneficiaries: {totalBeneficiaries.toLocaleString()}</span>
        </div>
      </div>

      {/* 2. CCTV Status */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            CCTV Availability
          </span>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <Video className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-600">{cctvOnline}</span>
          <span className="text-xs text-slate-500 font-medium">Online Feeds</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-2">
          <span className="text-rose-600 font-semibold">{cctvOffline} Offline</span>
          <span className="text-amber-600 font-semibold">{cctvWarning} Warning</span>
        </div>
      </div>

      {/* 3. Inspections Metric */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Field Inspections
          </span>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
            <ClipboardList className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{completedInspections}</span>
          <span className="text-xs font-medium text-slate-500">Completed</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-2">
          <span className="text-amber-600 font-medium">
            Pending Queue: {pendingInspections}
          </span>
          <span className="text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Audit Ready
          </span>
        </div>
      </div>

      {/* 4. High Attention / Risk */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Risk &amp; Anomalies
          </span>
          <div className="p-2 rounded-lg bg-rose-50 text-rose-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-rose-600">
            {criticalProjects + highProjects}
          </span>
          <span className="text-xs text-rose-800 font-semibold">Priority Watch</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-2">
          <span className="text-rose-700 font-medium">{criticalProjects} Critical</span>
          <span className="text-amber-600 font-medium">{highProjects} High Attention</span>
        </div>
      </div>
    </div>
  );
};
