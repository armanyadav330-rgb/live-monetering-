import React, { useState, useMemo } from 'react';
import {
  ClipboardCheck,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shuffle,
} from 'lucide-react';
import { Inspection, InspectionStatus, InspectionPriority, UserRole } from '../../types';

interface InspectionListProps {
  inspections: Inspection[];
  userRole: UserRole;
  onSelectInspection: (id: string) => void;
  onConductInspection: (id: string) => void;
  onOpenAssignModal: () => void;
}

export const InspectionList: React.FC<InspectionListProps> = ({
  inspections,
  userRole,
  onSelectInspection,
  onConductInspection,
  onOpenAssignModal,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return inspections.filter((i) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        i.inspectionCode.toLowerCase().includes(q) ||
        i.projectName.toLowerCase().includes(q) ||
        i.inspectorName.toLowerCase().includes(q) ||
        i.district.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || i.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [inspections, search, statusFilter, priorityFilter]);

  const canAssign = userRole === 'SUPER_ADMIN' || userRole === 'DEPARTMENT_OFFICIAL';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-indigo-600" />
            <span>Field Inspection &amp; Audit Registry</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Surprise visits, routine audits, and geo-tagged verification records across all project units.
          </p>
        </div>

        {canAssign && (
          <button
            onClick={onOpenAssignModal}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition shrink-0"
          >
            <Shuffle className="w-4 h-4" />
            <span>Assign Random Inspection</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code, project, inspector, district..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="ALL">All Inspection Statuses</option>
            <option value="PENDING">PENDING (Scheduled)</option>
            <option value="IN_PROGRESS">IN PROGRESS (On-site Draft)</option>
            <option value="COMPLETED">COMPLETED (Submitted)</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="ALL">All Audit Priorities</option>
            <option value="SURPRISE">SURPRISE INSPECTION</option>
            <option value="CRITICAL_AUDIT">CRITICAL AUDIT</option>
            <option value="HIGH_PRIORITY">HIGH PRIORITY</option>
            <option value="ROUTINE">ROUTINE ANNUAL</option>
          </select>
        </div>
      </div>

      {/* Inspection Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order Code &amp; Date</th>
                <th className="py-3 px-4">Target Project &amp; Location</th>
                <th className="py-3 px-4">Assigned Inspector</th>
                <th className="py-3 px-4">Audit Type</th>
                <th className="py-3 px-4">GPS Geostamp</th>
                <th className="py-3 px-4">Compliance Outcome</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No inspection records found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{item.inspectionCode}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {item.inspectionDate || item.scheduledDate}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{item.projectName}</div>
                      <div className="text-[11px] text-slate-500">
                        {item.district}, {item.state}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{item.inspectorName}</div>
                      <div className="text-[10px] text-slate-500">{item.inspectorDesignation}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded ${
                          item.priority === 'CRITICAL_AUDIT'
                            ? 'bg-rose-100 text-rose-800'
                            : item.priority === 'SURPRISE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.priority.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.gpsVerification?.status === 'MATCHED' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          VERIFIED ({item.gpsVerification.distanceFromRegisteredMeters}m)
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Pending On-site</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                          item.overallResult === 'COMPLIANT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.overallResult === 'NON_COMPLIANT'
                            ? 'bg-rose-100 text-rose-800'
                            : item.overallResult === 'PARTIALLY_COMPLIANT'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.overallResult || item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status !== 'COMPLETED' ? (
                          <button
                            onClick={() => onConductInspection(item.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition"
                            title="Execute / Fill Inspection"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Conduct</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onSelectInspection(item.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs transition"
                            title="View Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Dossier</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
