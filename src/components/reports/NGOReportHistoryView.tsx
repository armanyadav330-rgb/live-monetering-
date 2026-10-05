import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Search,
  PlusCircle,
  AlertCircle,
  Paperclip,
  Calendar,
  Building2,
  RefreshCw,
  Eye,
  Send,
  Inbox,
  ArrowRight,
} from 'lucide-react';
import { NGOReport, NGOReportStatus, User as UserType } from '../../types';
import { api } from '../../services/api';
import { AdminReportDetailModal } from './AdminReportDetailModal';

interface NGOReportHistoryViewProps {
  currentUser: UserType;
  onNavigateToSubmit: (resubmitData?: NGOReport) => void;
}

export const NGOReportHistoryView: React.FC<NGOReportHistoryViewProps> = ({
  currentUser,
  onNavigateToSubmit,
}) => {
  const [reports, setReports] = useState<NGOReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected report for modal detail view
  const [selectedReport, setSelectedReport] = useState<NGOReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.getNGOReports();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching NGO reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesStatus =
      statusFilter === 'ALL' || r.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      r.reportId.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.projectName.toLowerCase().includes(q) ||
      r.reportType.toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: NGOReportStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      case 'Resubmission Required':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
            Resubmission Required
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Under Review
          </span>
        );
      case 'Pending Review':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#0B2545] border border-blue-200">
              NGO Activity & Compliance Archive
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {currentUser.department || 'Authorized NGO Center'}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0B2545] mt-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-700" />
            <span>My Submitted Reports & Dossier History</span>
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Track status, scrutinize admin review remarks, and execute resubmission workflows for your facility reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchReports}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs transition cursor-pointer"
            title="Refresh history"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigateToSubmit()}
            className="px-4 py-2 rounded-lg bg-[#0B2545] hover:bg-[#13315C] text-white text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Submit New Report</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Report ID, title, or project..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-slate-900 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 text-xs font-medium shrink-0">Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses ({reports.length})</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Resubmission Required">Resubmission Required</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3.5">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
            <Inbox className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No reports found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t submitted any reports matching this filter yet, or no reports have been filed.
            </p>
            <button
              onClick={() => onNavigateToSubmit()}
              className="mt-2 px-4 py-2 rounded-lg bg-[#0B2545] text-white text-xs font-semibold hover:bg-[#13315C] transition cursor-pointer inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Submit First Report</span>
            </button>
          </div>
        ) : (
          filteredReports.map((report) => {
            const needsAction =
              report.status === 'Rejected' || report.status === 'Resubmission Required';

            return (
              <div
                key={report.id}
                className={`bg-white rounded-xl border p-4 sm:p-5 shadow-2xs transition hover:shadow-xs space-y-3 ${
                  needsAction
                    ? 'border-amber-300/80 bg-amber-50/20'
                    : report.status === 'Approved'
                    ? 'border-emerald-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Top Row: IDs, Dates & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#0B2545] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {report.reportId}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {report.reportType}
                    </span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Period: {report.reportingPeriod}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(report.submissionDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {getStatusBadge(report.status)}
                  </div>
                </div>

                {/* Middle: Title, Project & Summary */}
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">{report.title}</h3>
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{report.projectName}</span>
                    {report.beneficiaryCount > 0 && (
                      <span className="ml-2 text-blue-900 font-medium">
                        · {report.beneficiaryCount} Beneficiaries Reached
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                {/* CRITICAL: Reason / Admin Remarks Display if Rejected or Resubmission Required */}
                {report.adminRemarks && (
                  <div
                    className={`p-3 rounded-lg text-xs space-y-1 border ${
                      report.status === 'Rejected'
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : report.status === 'Resubmission Required'
                        ? 'bg-purple-50 border-purple-200 text-purple-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Admin Review Remarks / Reason:</span>
                    </div>
                    <p className="font-medium pl-5 italic">&ldquo;{report.adminRemarks}&rdquo;</p>
                  </div>
                )}

                {/* Bottom Row: Documents and Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {report.documents.length}{' '}
                      {report.documents.length === 1 ? 'document attached' : 'documents attached'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReport(report);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Dossier</span>
                    </button>

                    {/* Resubmit Button (Only when Rejected or Resubmission Required) */}
                    {needsAction && (
                      <button
                        type="button"
                        onClick={() => onNavigateToSubmit(report)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#13315C] text-white text-xs font-bold transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Resubmit Report</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      <AdminReportDetailModal
        report={selectedReport}
        isOpen={isModalOpen}
        currentUser={currentUser}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdated={(updated) => {
          setReports((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r))
          );
          setSelectedReport(updated);
        }}
      />
    </div>
  );
};
