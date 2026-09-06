import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle,
  Video,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Project, RiskLevel, CCTVStatus, UserRole } from '../../types';

interface ProjectListProps {
  projects?: Project[];
  userRole: UserRole;
  onSelectProject: (id: string) => void;
  onAddProject?: () => void;
  onOpenAddModal?: () => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (id: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects = [],
  userRole,
  onSelectProject,
  onAddProject,
  onOpenAddModal,
  onEditProject,
  onDeleteProject,
}) => {
  const handleAdd = () => {
    if (onAddProject) onAddProject();
    else if (onOpenAddModal) onOpenAddModal();
  };

  const safeProjects = Array.isArray(projects) ? projects : [];
  const [search, setSearch] = useState('');
  const [schemeFilter, setSchemeFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [cctvFilter, setCctvFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'riskScore' | 'projectName' | 'beneficiaries'>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Extract distinct schemes and states for filter dropdowns
  const schemes = useMemo(() => {
    return Array.from(new Set(safeProjects.map((p) => p.scheme)));
  }, [safeProjects]);

  const states = useMemo(() => {
    return Array.from(new Set(safeProjects.map((p) => p.state))).sort();
  }, [safeProjects]);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    let result = safeProjects.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        p.projectName.toLowerCase().includes(q) ||
        p.projectId.toLowerCase().includes(q) ||
        p.ngoName.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q);

      const matchesScheme = schemeFilter === 'ALL' || p.scheme === schemeFilter;
      const matchesRisk = riskFilter === 'ALL' || p.riskLevel === riskFilter;
      const matchesCctv = cctvFilter === 'ALL' || p.cctvStatus === cctvFilter;
      const matchesState = stateFilter === 'ALL' || p.state === stateFilter;

      return matchesSearch && matchesScheme && matchesRisk && matchesCctv && matchesState;
    });

    result.sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];
      if (sortBy === 'beneficiaries') {
        valA = a.beneficiaryCount;
        valB = b.beneficiaryCount;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [safeProjects, search, schemeFilter, riskFilter, cctvFilter, stateFilter, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage]);

  const canManage = userRole === 'SUPER_ADMIN' || userRole === 'DEPARTMENT_OFFICIAL';

  const getRiskBadge = (level: RiskLevel, score: number) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            CRITICAL ({score})
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
            HIGH ({score})
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            MEDIUM ({score})
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            LOW ({score})
          </span>
        );
    }
  };

  const getCCTVIndicator = (status: CCTVStatus, active: number, total: number) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ONLINE ({active}/{total})
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            WARNING ({active}/{total})
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            OFFLINE (0/{total})
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Add Project */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span>Scheme Project Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository of all DoSJE assisted NGOs, rehabilitation shelters, and institutions.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register Project</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by project name, ID, NGO, district..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Scheme Filter */}
          <select
            value={schemeFilter}
            onChange={(e) => {
              setSchemeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="ALL">All Schemes ({schemes.length})</option>
            {schemes.map((s) => (
              <option key={s} value={s}>
                {s.split('(')[0]}
              </option>
            ))}
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">CRITICAL Risk</option>
            <option value="HIGH">HIGH Risk</option>
            <option value="MEDIUM">MEDIUM Risk</option>
            <option value="LOW">LOW Risk</option>
          </select>

          {/* CCTV Filter */}
          <select
            value={cctvFilter}
            onChange={(e) => {
              setCctvFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="ALL">All CCTV Status</option>
            <option value="ONLINE">ONLINE</option>
            <option value="WARNING">WARNING</option>
            <option value="OFFLINE">OFFLINE</option>
          </select>
        </div>

        {/* State filter & Sort row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>State:</span>
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1 text-xs rounded border border-slate-200 bg-slate-50"
            >
              <option value="ALL">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <span className="text-slate-400">|</span>
            <span>
              Showing <strong className="text-slate-900">{filteredProjects.length}</strong> matching
              projects
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <button
              onClick={() => {
                setSortBy('riskScore');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`px-2 py-1 rounded text-xs transition ${
                sortBy === 'riskScore'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'hover:bg-slate-100'
              }`}
            >
              Risk Score {sortBy === 'riskScore' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              onClick={() => {
                setSortBy('projectName');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`px-2 py-1 rounded text-xs transition ${
                sortBy === 'projectName'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'hover:bg-slate-100'
              }`}
            >
              Name {sortBy === 'projectName' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              onClick={() => {
                setSortBy('beneficiaries');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`px-2 py-1 rounded text-xs transition ${
                sortBy === 'beneficiaries'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'hover:bg-slate-100'
              }`}
            >
              Beneficiaries {sortBy === 'beneficiaries' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Projects Table (Desktop) & Cards (Mobile) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Project &amp; Code</th>
                <th className="py-3 px-4">Scheme &amp; NGO</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Beneficiaries</th>
                <th className="py-3 px-4">CCTV Feed</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No projects found matching the selected search criteria.
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{p.projectName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.projectId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{p.scheme.split('(')[0]}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px] mt-0.5">
                        {p.ngoName}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-900 font-medium">{p.district}</div>
                      <div className="text-[11px] text-slate-500">{p.state}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{p.beneficiaryCount} Registered</div>
                      <div className="text-[10px] text-slate-500">
                        Avg. Att: {p.averageAttendancePercent}%
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getCCTVIndicator(p.cctvStatus, p.activeCamerasCount, p.totalCamerasCount)}
                    </td>
                    <td className="py-3 px-4">{getRiskBadge(p.riskLevel, p.riskScore)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectProject(p.id)}
                          className="p-1.5 rounded-md hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canManage && (
                          <>
                            <button
                              onClick={() => onEditProject(p)}
                              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition"
                              title="Edit Project"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to remove project "${p.projectName}"? This action will be audited.`
                                  )
                                ) {
                                  onDeleteProject(p.id);
                                }
                              }}
                              className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card-Based List View */}
        <div className="md:hidden divide-y divide-slate-100">
          {paginatedProjects.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No projects found matching the selected search criteria.
            </div>
          ) : (
            paginatedProjects.map((p) => (
              <div key={p.id} className="p-3.5 space-y-2.5 hover:bg-slate-50/70 transition">
                {/* Header: Project Name, ID & Risk */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-xs text-slate-900 leading-snug">
                      {p.projectName}
                    </h4>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {p.projectId} • {p.district}, {p.state}
                    </div>
                  </div>
                  <div className="shrink-0">{getRiskBadge(p.riskLevel, p.riskScore)}</div>
                </div>

                {/* Scheme & NGO details */}
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1">
                  <div className="font-medium text-slate-800 truncate">
                    {p.scheme.split('(')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    NGO: {p.ngoName}
                  </div>
                </div>

                {/* Metrics Row: Beneficiaries & CCTV status */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
                  <div>
                    <span className="font-semibold text-slate-900">{p.beneficiaryCount}</span>{' '}
                    <span className="text-[10px] text-slate-500">Beneficiaries ({p.averageAttendancePercent}% Att.)</span>
                  </div>
                  <div>{getCCTVIndicator(p.cctvStatus, p.activeCamerasCount, p.totalCamerasCount)}</div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => onSelectProject(p.id)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  {canManage && (
                    <>
                      <button
                        onClick={() => onEditProject(p)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to remove project "${p.projectName}"? This action will be audited.`
                            )
                          ) {
                            onDeleteProject(p.id);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-500 transition"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Page <strong className="text-slate-900">{currentPage}</strong> of{' '}
            <strong className="text-slate-900">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
