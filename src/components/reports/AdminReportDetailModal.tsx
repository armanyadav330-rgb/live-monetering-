import React, { useState } from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Building2,
  Calendar,
  Users,
  Paperclip,
  IndianRupee,
  AlertCircle,
  Clock,
  ShieldCheck,
  Download,
  Eye,
  MessageSquare,
  FileCheck2,
} from 'lucide-react';
import { NGOReport, NGOReportStatus, User } from '../../types';
import { api } from '../../services/api';

interface AdminReportDetailModalProps {
  report: NGOReport | null;
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onStatusUpdated: (updatedReport: NGOReport) => void;
}

export const AdminReportDetailModal: React.FC<AdminReportDetailModalProps> = ({
  report,
  isOpen,
  currentUser,
  onClose,
  onStatusUpdated,
}) => {
  const [adminRemarks, setAdminRemarks] = useState('');
  const [selectedAction, setSelectedAction] = useState<NGOReportStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'activities' | 'finance' | 'documents'>('details');

  if (!isOpen || !report) return null;

  const handleActionClick = async (action: NGOReportStatus) => {
    setValidationError(null);

    // If rejecting or requesting resubmission, remarks are mandatory
    if ((action === 'Rejected' || action === 'Resubmission Required') && !adminRemarks.trim()) {
      setSelectedAction(action);
      setValidationError(
        `A reason/remark is mandatory when ${
          action === 'Rejected' ? 'rejecting a report' : 'requesting a resubmission'
        }. Please enter remarks below.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await api.updateNGOReportStatus(
        report.id,
        action,
        adminRemarks.trim()
      );
      onStatusUpdated(updated);
      setSelectedAction(null);
      setAdminRemarks('');
    } catch (err: any) {
      setValidationError(err.message || 'Failed to update report status.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Pending Review
          </span>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900 my-auto animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#0B2545] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#13315C] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-amber-400 shrink-0 border border-white/15">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-400 bg-white/10 px-2 py-0.5 rounded border border-white/20">
                  {report.reportId}
                </span>
                <span className="text-[11px] text-slate-300 uppercase tracking-wider hidden sm:inline">
                  {report.reportType}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate mt-0.5" title={report.title}>
                {report.title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {getStatusBadge(report.status)}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Tabs Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 flex items-center gap-2 text-xs font-semibold overflow-x-auto shrink-0 py-1">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-2 border-b-2 transition cursor-pointer ${
              activeTab === 'details'
                ? 'border-[#0B2545] text-[#0B2545] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Entity
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-3 py-2 border-b-2 transition cursor-pointer ${
              activeTab === 'activities'
                ? 'border-[#0B2545] text-[#0B2545] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Activities & Challenges
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-3 py-2 border-b-2 transition cursor-pointer ${
              activeTab === 'finance'
                ? 'border-[#0B2545] text-[#0B2545] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Fund Utilization & Remarks
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-2 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'border-[#0B2545] text-[#0B2545] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Attached Documents</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
              {report.documents.length}
            </span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
          {/* TAB 1: OVERVIEW & ENTITY */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              {/* Primary Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">NGO Organization</span>
                  <span className="font-bold text-slate-900 mt-0.5 block truncate" title={report.ngoName}>
                    {report.ngoName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Sanctioned Project</span>
                  <span className="font-bold text-slate-900 mt-0.5 block truncate" title={report.projectName}>
                    {report.projectName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Reporting Cycle</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {report.reportingPeriod}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Beneficiaries Reached</span>
                  <span className="font-extrabold text-blue-900 mt-0.5 text-base block">
                    {report.beneficiaryCount.toLocaleString()} individuals
                  </span>
                </div>
              </div>

              {/* Submitter Credentials Capsule */}
              <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-[#0B2545] border border-slate-300 shrink-0">
                    {report.submittedByUserName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{report.submittedByUserName}</div>
                    <div className="text-[11px] text-slate-500">
                      {report.submittedByUserDesignation || 'Authorized Signatory'} · {report.submittedByUserEmail || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500">
                  <div>Submitted on:</div>
                  <div className="font-mono font-semibold text-slate-800">
                    {new Date(report.submissionDate).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'medium',
                    })}
                  </div>
                </div>
              </div>

              {/* Description / Summary */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Executive Narrative / Summary
                </h3>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-line">
                  {report.description || 'No description provided.'}
                </div>
              </div>

              {/* Existing Review Info if available */}
              {report.reviewedAt && (
                <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-blue-950">
                    <span>Reviewed By: {report.reviewedByUserName || 'Department Admin'}</span>
                    <span className="font-mono text-[11px]">
                      {new Date(report.reviewedAt).toLocaleString('en-IN', { dateStyle: 'medium' })}
                    </span>
                  </div>
                  {report.adminRemarks && (
                    <p className="text-blue-900 italic">&ldquo;{report.adminRemarks}&rdquo;</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVITIES & CHALLENGES */}
          {activeTab === 'activities' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Activities & Milestones Completed</span>
                </h3>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed font-mono text-xs whitespace-pre-line">
                  {report.activitiesCompleted || 'No activities documented.'}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Ground Issues & Operational Challenges</span>
                </h3>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-line">
                  {report.issuesChallenges || 'No major issues or bottlenecks reported.'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINANCE & REMARKS */}
          {activeTab === 'finance' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <span>Fund Utilization Summary</span>
                </h3>
                <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200 text-slate-800 leading-relaxed whitespace-pre-line">
                  {report.fundUtilizationSummary || 'No expenditure breakdown provided.'}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  NGO Superintendent General Remarks
                </h3>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-line">
                  {report.remarks || 'No additional remarks attached.'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ATTACHED DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Uploaded Verifiable Evidences & Statutory Certificates ({report.documents.length})
              </h3>

              {report.documents.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Paperclip className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>No supporting documents uploaded with this report.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {report.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-blue-300 transition"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate" title={doc.name}>
                            {doc.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {formatFileSize(doc.size)} · Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          alert(`Simulated Secure Document Viewer: Downloading/opening "${doc.name}" from DoSJE Encrypted Vault.`);
                        }}
                        className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer shrink-0"
                        title="View or download document"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>View</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer: Admin Actions & Remarks */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 shrink-0 space-y-3">
          {validationError && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{validationError}</span>
            </div>
          )}

          {/* Admin Remarks Input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Admin Remarks / Audit Evaluation</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Mandatory when Rejecting or Requesting Resubmission
              </span>
            </label>
            <textarea
              rows={2}
              value={adminRemarks}
              onChange={(e) => {
                setAdminRemarks(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Enter official review feedback, compliance notes, or instructions for the NGO..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs text-slate-900 bg-white"
            />
          </div>

          {/* Action Buttons Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Reviewer: {currentUser.name} ({currentUser.role})</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>

              {/* Request Resubmission */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleActionClick('Resubmission Required')}
                className="px-3.5 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                <span>Request Resubmission</span>
              </button>

              {/* Reject */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleActionClick('Rejected')}
                className="px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Reject</span>
              </button>

              {/* Approve */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleActionClick('Approved')}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Approve Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
