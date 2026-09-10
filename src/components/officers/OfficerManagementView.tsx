import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  FileCheck2,
  Filter,
} from 'lucide-react';
import { User, Inspection } from '../../types';

interface OfficerManagementViewProps {
  users: User[];
  inspections: Inspection[];
  onSelectOfficer?: (officerId: string) => void;
  onAssignInspection?: (officerId: string) => void;
  isSupervisoryView?: boolean;
}

export const OfficerManagementView: React.FC<OfficerManagementViewProps> = ({
  users,
  inspections,
  onAssignInspection,
  isSupervisoryView = false,
}) => {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');

  // Filter users that are inspection officers or field staff
  const officers = useMemo(() => {
    return users.filter(
      (u) =>
        u.role === 'INSPECTION_OFFICER' ||
        u.role === 'FIELD_OFFICER' ||
        u.role === 'NGO_INSTITUTE' ||
        u.designation.toLowerCase().includes('inspect') ||
        u.designation.toLowerCase().includes('auditor')
    );
  }, [users]);

  // Compute officer performance metrics
  const officerStats = useMemo(() => {
    return officers.map((officer) => {
      const assigned = inspections.filter((i) => i.inspectorId === officer.id || i.inspectorName === officer.name);
      const completed = assigned.filter((i) => i.status === 'COMPLETED');
      const pending = assigned.filter((i) => i.status === 'PENDING' || i.status === 'IN_PROGRESS');
      const compliant = completed.filter((i) => i.overallResult === 'COMPLIANT');

      const completionRate = assigned.length > 0 ? Math.round((completed.length / assigned.length) * 100) : 100;
      const complianceRate = completed.length > 0 ? Math.round((compliant.length / completed.length) * 100) : 85;

      return {
        ...officer,
        assignedCount: assigned.length,
        completedCount: completed.length,
        pendingCount: pending.length,
        completionRate,
        complianceRate,
        score: Math.min(98, Math.max(72, 70 + (completionRate / 100) * 20 + (completed.length * 2))),
      };
    });
  }, [officers, inspections]);

  const filteredOfficers = useMemo(() => {
    return officerStats.filter((o) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        o.name.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        (o.district && o.district.toLowerCase().includes(q)) ||
        (o.state && o.state.toLowerCase().includes(q));

      const matchesState = stateFilter === 'ALL' || o.state === stateFilter;
      return matchesSearch && matchesState;
    });
  }, [officerStats, search, stateFilter]);

  const allStates = Array.from(new Set(officers.map((o) => o.state).filter(Boolean))) as string[];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {isSupervisoryView ? (
              <Award className="w-5 h-5 text-amber-600" />
            ) : (
              <UserCheck className="w-5 h-5 text-indigo-600" />
            )}
            <h1 className="text-base font-bold text-slate-900">
              {isSupervisoryView ? 'Inspection Officer Performance Scorecard' : 'Inspection Officer Management'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isSupervisoryView
              ? 'Supervisory evaluation of field auditor productivity, completion velocity, and audit quality.'
              : 'Field auditor roster, jurisdiction assignments, contact registry, and active workload.'}
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{officers.length} Active Field Auditors Enrolled</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search officer name, district, state, or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0B2545]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value="ALL">All States</option>
            {allStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOfficers.map((officer) => (
          <div
            key={officer.id}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
          >
            <div className="space-y-3">
              {/* Header with Avatar & Score */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B2545] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    {officer.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 leading-snug">{officer.name}</h2>
                    <p className="text-[11px] text-slate-500">{officer.designation}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Score</div>
                  <div className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {officer.score}/100
                  </div>
                </div>
              </div>

              {/* Jurisdiction & Contact */}
              <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">{officer.district || 'District Nodal'}</span>
                  <span className="text-slate-400">·</span>
                  <span>{officer.state || 'All-India'}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-700">{officer.email}</span>
                </div>
                {officer.phone && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-700">{officer.phone}</span>
                  </div>
                )}
              </div>

              {/* Workload & Performance Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">Assigned</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{officer.assignedCount}</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200">
                  <div className="text-[10px] text-emerald-700 font-medium">Completed</div>
                  <div className="text-xs font-bold text-emerald-900 mt-0.5">{officer.completedCount}</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-200">
                  <div className="text-[10px] text-amber-700 font-medium">Pending</div>
                  <div className="text-xs font-bold text-amber-900 mt-0.5">{officer.pendingCount}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                  <span>Turnaround Velocity</span>
                  <span>{officer.completionRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${officer.completionRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            {onAssignInspection && (
              <button
                onClick={() => onAssignInspection(officer.id)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-100 hover:bg-[#0B2545] hover:text-white text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Assign Inspection</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
