import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Search,
  Filter,
  Eye,
  FileCheck2,
  Layers,
  ArrowUpDown,
  Building2,
  User,
  Calendar,
  RefreshCw,
  Inbox,
} from 'lucide-react';
import { NGOReport, NGOReportStatus, User as UserType } from '../../types';
import { api } from '../../services/api';
import { AdminReportDetailModal } from './AdminReportDetailModal';

interface AdminReportsViewProps {
  currentUser: UserType;
  isCompactDashboardWidget?: boolean;
  onNavigateToFull?: () => void;
}

export const AdminReportsView: React.FC<AdminReportsViewProps> = ({
  currentUser,
  isCompactDashboardWidget = false,
  onNavigateToFull,
}) => {
  const [reports, setReports] = useState<NGOReport[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    underReview: 0,
    resubmissionRequired: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Selected report for modal
  const [selectedReport, setSelectedReport] = useState<NGOReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReportsAndStats = async () => {
    setLoading(true);
    try {
      const [rList, sData] = await Promise.all([
        api.getNGOReports(),
        api.getNGOReportStats(),
      ]);
      setReports(Array.isArray(rList) ? rList : []);
      if (sData) setStats(sData);
    } catch (err) {
      console.error('Error fetching reports data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsAndStats();
  }, []);

  const handleOpenDetail = (report: NGOReport) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleStatusUpdated = (updated: NGOReport) => {
    setReports((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    setSelectedReport(updated);
    // Refresh stats
    api.getNGOReportStats().then((s) => s && setStats(s));
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesStatus =
      statusFilter === 'ALL' || r.status === statusFilter;
    const matchesType =
      typeFilter === 'ALL' || r.reportType === typeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      r.reportId.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.ngoName.toLowerCase().includes(q) ||
      r.submittedByUserName.toLowerCase().includes(q) ||
      r.projectName.toLowerCase().includes(q);

    return matchesStatus && matchesType && matchesQuery;
  });

  const displayedReports = isCompactDashboardWidget
    ? filteredReports.slice(0, 6)
    : filteredReports;

  const getStatusBadge = (status: NGOReportStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
        );
      case 'Resubmission Required':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <RotateCcw className="w-3 h-3 text-purple-600" />
            Resubmission Required
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            Under Review
          </span>
        );
      case 'Pending Review':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* 5. DASHBOARD SUMMARY CARDS (Top of Section) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Reports */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Reports
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#0B2545] mt-0.5">
              {stats.total}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">All submitted dossiers</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200 shrink-0">
            <FileText className="w-5 h-5 text-[#0B2545]" />
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-amber-200/80 shadow-2xs hover:border-amber-300 transition flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Pending Review
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-900 mt-0.5">
              {stats.pendingReview}
            </div>
            <div className="text-[10px] text-amber-600 mt-0.5">Awaiting scrutiny</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200 shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-emerald-200/80 shadow-2xs hover:border-emerald-300 transition flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Approved
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-900 mt-0.5">
              {stats.approved}
            </div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Audited & accepted</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-rose-200/80 shadow-2xs hover:border-rose-300 transition flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
              Rejected
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-900 mt-0.5">
              {stats.rejected}
            </div>
            <div className="text-[10px] text-rose-600 mt-0.5">Non-compliant / declined</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700 border border-rose-200 shrink-0">
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
        </div>
      </div>

      {/* 2. SUBMITTED REPORTS CARD / SECTION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Section Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0B2545]" />
              <h2 className="text-sm sm:text-base font-bold text-[#0B2545] tracking-wide">
                Submitted Reports
              </h2>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {filteredReports.length} {filteredReports.length === 1 ? 'Report' : 'Reports'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review, scrutinize, and verify periodic reports submitted by authorized NGO Superintendents and field facilities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchReportsAndStats}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs transition cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {isCompactDashboardWidget && onNavigateToFull && (
              <button
                onClick={onNavigateToFull}
                className="px-3 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#13315C] text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
              >
                View All Submitted Reports &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-3 sm:p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, title, NGO name..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-slate-900 bg-white"
            />
          </div>

          {/* Status & Type Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Resubmission Required">Resubmission Required</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Report Types</option>
              <option value="Monthly Activity Report">Monthly Activity Report</option>
              <option value="Project Progress Report">Project Progress Report</option>
              <option value="Fund Utilization Report">Fund Utilization Report</option>
              <option value="Inspection/Field Report">Inspection/Field Report</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto">
          {displayedReports.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-slate-300" />
              <div className="text-xs font-semibold text-slate-600">No submitted reports found</div>
              <p className="text-[11px] text-slate-400">
                {searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL'
                  ? 'Try clearing the search or status filters.'
                  : 'Submitted NGO reports will appear here automatically for review.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3 sm:px-4">Report ID</th>
                  <th className="py-2.5 px-3 sm:px-4">Report Title</th>
                  <th className="py-2.5 px-3 sm:px-4">NGO Name</th>
                  <th className="py-2.5 px-3 sm:px-4">Submitted By</th>
                  <th className="py-2.5 px-3 sm:px-4">Report Type</th>
                  <th className="py-2.5 px-3 sm:px-4">Period</th>
                  <th className="py-2.5 px-3 sm:px-4">Submission Date</th>
                  <th className="py-2.5 px-3 sm:px-4 text-center">Status</th>
                  <th className="py-2.5 px-3 sm:px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {displayedReports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => handleOpenDetail(report)}
                    className="hover:bg-blue-50/50 transition cursor-pointer group"
                  >
                    {/* Report ID */}
                    <td className="py-3 px-3 sm:px-4 font-mono font-bold text-[#0B2545] whitespace-nowrap">
                      {report.reportId}
                    </td>

                    {/* Report Title */}
                    <td className="py-3 px-3 sm:px-4 font-semibold text-slate-900 max-w-[200px] truncate" title={report.title}>
                      <span className="group-hover:text-blue-700 transition">
                        {report.title}
                      </span>
                      {report.documents && report.documents.length > 0 && (
                        <span className="ml-1.5 text-[10px] text-slate-400 font-normal">
                          📎 {report.documents.length}
                        </span>
                      )}
                    </td>

                    {/* NGO Name */}
                    <td className="py-3 px-3 sm:px-4 text-slate-700 max-w-[180px] truncate" title={report.ngoName}>
                      {report.ngoName}
                    </td>

                    {/* Submitted By */}
                    <td className="py-3 px-3 sm:px-4 text-slate-700 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{report.submittedByUserName}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                        {report.submittedByUserDesignation || 'NGO User'}
                      </div>
                    </td>

                    {/* Report Type */}
                    <td className="py-3 px-3 sm:px-4 text-slate-600 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px]">
                        {report.reportType}
                      </span>
                    </td>

                    {/* Reporting Period */}
                    <td className="py-3 px-3 sm:px-4 text-slate-600 whitespace-nowrap">
                      {report.reportingPeriod}
                    </td>

                    {/* Submission Date */}
                    <td className="py-3 px-3 sm:px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                      {new Date(report.submissionDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(report);
                        }}
                        className="px-2.5 py-1 rounded bg-[#0B2545] hover:bg-[#13315C] text-white text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3 h-3 text-amber-400" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>
            Showing {displayedReports.length} of {reports.length} total reports
          </span>
          <span className="text-slate-400">
            Click any row to view complete dossier, audit documents & approve / reject
          </span>
        </div>
      </div>

      {/* 3. ADMIN REPORT DETAILS MODAL */}
      <AdminReportDetailModal
        report={selectedReport}
        isOpen={isModalOpen}
        currentUser={currentUser}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdated={handleStatusUpdated}
      />
    </div>
  );
};
