import React, { useState, useEffect } from 'react';
import {
  Send,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  IndianRupee,
  Users,
  Paperclip,
  Trash2,
  Eye,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { User, Project, NGOReport, NGOReportType, ReportDocument } from '../../types';
import { api } from '../../services/api';

interface SubmitReportSectionProps {
  currentUser: User;
  projects?: Project[];
  resubmitInitialData?: NGOReport | null;
  onNavigateToHistory?: () => void;
  onReportSubmitted?: (newReport: NGOReport) => void;
}

export const SubmitReportSection: React.FC<SubmitReportSectionProps> = ({
  currentUser,
  projects = [],
  resubmitInitialData,
  onNavigateToHistory,
  onReportSubmitted,
}) => {
  // Form State
  const [title, setTitle] = useState(resubmitInitialData?.title || '');
  const [reportType, setReportType] = useState<NGOReportType>(
    resubmitInitialData?.reportType || 'Monthly Activity Report'
  );
  const [reportingPeriod, setReportingPeriod] = useState(
    resubmitInitialData?.reportingPeriod ||
      new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    resubmitInitialData?.projectId || currentUser.assignedProjectId || ''
  );
  const [projectName, setProjectName] = useState(
    resubmitInitialData?.projectName || ''
  );
  const [description, setDescription] = useState(
    resubmitInitialData?.description || ''
  );
  const [beneficiaryCount, setBeneficiaryCount] = useState<string>(
    resubmitInitialData?.beneficiaryCount ? String(resubmitInitialData.beneficiaryCount) : ''
  );
  const [activitiesCompleted, setActivitiesCompleted] = useState(
    resubmitInitialData?.activitiesCompleted || ''
  );
  const [issuesChallenges, setIssuesChallenges] = useState(
    resubmitInitialData?.issuesChallenges || ''
  );
  const [fundUtilizationSummary, setFundUtilizationSummary] = useState(
    resubmitInitialData?.fundUtilizationSummary || ''
  );
  const [remarks, setRemarks] = useState(resubmitInitialData?.remarks || '');
  const [documents, setDocuments] = useState<ReportDocument[]>(
    resubmitInitialData?.documents || []
  );

  // Status & Validation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<NGOReport | null>(null);

  // Sync project name when selection changes
  useEffect(() => {
    if (selectedProjectId) {
      const p = projects.find((proj) => proj.id === selectedProjectId);
      if (p) {
        setProjectName(p.projectName);
      }
    } else if (projects.length > 0 && !projectName) {
      setProjectName(projects[0].projectName);
      setSelectedProjectId(projects[0].id);
    }
  }, [selectedProjectId, projects]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: ReportDocument[] = [];
    Array.from(files).forEach((file: File) => {
      const isAllowed =
        file.type.includes('pdf') ||
        file.type.includes('image') ||
        file.type.includes('word') ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx') ||
        file.name.endsWith('.pdf') ||
        file.name.endsWith('.jpg') ||
        file.name.endsWith('.png');

      if (!isAllowed) {
        setErrorMessage('Only PDF, JPG, PNG, DOC, and DOCX files are permitted.');
        return;
      }

      newDocs.push({
        id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
      });
    });

    if (newDocs.length > 0) {
      setDocuments((prev) => [...prev, ...newDocs]);
      setErrorMessage(null);
    }
    // reset file input
    e.target.value = '';
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!title.trim()) {
      setErrorMessage('Please enter a Report Title.');
      return;
    }
    if (!reportingPeriod.trim()) {
      setErrorMessage('Please specify the Reporting Period.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide a brief Description or Report Summary.');
      return;
    }
    if (!activitiesCompleted.trim()) {
      setErrorMessage('Please detail the Activities Completed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const assignedProj = projects.find((p) => p.id === selectedProjectId);
      const effectiveNgoName =
        assignedProj?.ngoName ||
        currentUser.department ||
        'Authorized NGO Welfare Center';

      const payload: Partial<NGOReport> = {
        title: title.trim(),
        reportType,
        reportingPeriod: reportingPeriod.trim(),
        projectName: projectName.trim() || assignedProj?.projectName || 'General Scheme Project',
        projectId: selectedProjectId || currentUser.assignedProjectId,
        ngoName: effectiveNgoName,
        description: description.trim(),
        beneficiaryCount: Number(beneficiaryCount) || 0,
        activitiesCompleted: activitiesCompleted.trim(),
        issuesChallenges: issuesChallenges.trim(),
        fundUtilizationSummary: fundUtilizationSummary.trim(),
        remarks: remarks.trim(),
        documents,
        resubmittedFromId: resubmitInitialData?.id,
        version: resubmitInitialData?.version ? resubmitInitialData.version + 1 : 1,
      };

      const result = await api.submitNGOReport(payload);
      setSubmittedReport(result);
      if (onReportSubmitted) {
        onReportSubmitted(result);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit report. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setReportType('Monthly Activity Report');
    setReportingPeriod(
      new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
    );
    setDescription('');
    setBeneficiaryCount('');
    setActivitiesCompleted('');
    setIssuesChallenges('');
    setFundUtilizationSummary('');
    setRemarks('');
    setDocuments([]);
    setSubmittedReport(null);
    setErrorMessage(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // SUCCESS VIEW POST-SUBMISSION
  if (submittedReport) {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-1">
              Submission Confirmed
            </span>
            <h2 className="text-2xl font-extrabold text-[#0B2545]">
              Report submitted successfully.
            </h2>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Your official report has been securely registered in the Satya Nirakshak Live Monitoring System and transmitted to the Central Oversight Cell.
            </p>
          </div>

          {/* Submission Metadata Card */}
          <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-lg p-4 text-left space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Report ID:</span>
              <span className="font-mono font-bold text-[#0B2545] text-base px-2 py-0.5 bg-blue-50 border border-blue-200 rounded">
                {submittedReport.reportId}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Title:</span>
              <span className="font-semibold text-slate-800 text-right truncate max-w-[240px]">
                {submittedReport.title}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Report Type:</span>
              <span className="font-medium text-slate-700">{submittedReport.reportType}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Reporting Period:</span>
              <span className="font-medium text-slate-700">{submittedReport.reportingPeriod}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-medium">Submission Timestamp:</span>
              <span className="font-mono text-slate-700">
                {new Date(submittedReport.submissionDate).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'medium',
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Initial Status:</span>
              <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Pending Review
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onNavigateToHistory && (
              <button
                type="button"
                onClick={onNavigateToHistory}
                className="px-5 py-2.5 rounded-lg bg-[#0B2545] hover:bg-[#13315C] text-white text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>View in My Reports</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleResetForm}
              className="px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer border border-slate-300"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Submit Another Report</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#0B2545] border border-blue-200">
              NGO Dossier Submission
            </span>
            {resubmitInitialData && (
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                Resubmitting {resubmitInitialData.reportId}
              </span>
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0B2545] mt-1 flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-600" />
            <span>Submit Official NGO Activity & Utilization Report</span>
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Submit periodic compliance, activity records, and fund accounts directly to the Department Oversight Cell.
          </p>
        </div>

        {/* User Scope Capsule */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#0B2545] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)}
          </div>
          <div>
            <div className="font-bold text-[#0B2545] leading-tight">{currentUser.name}</div>
            <div className="text-[11px] text-slate-500 leading-tight">
              {currentUser.designation} · {currentUser.department || 'Authorized NGO Institute'}
            </div>
          </div>
        </div>
      </div>

      {/* Previous Remark Notice if Resubmitting */}
      {resubmitInitialData?.adminRemarks && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-[11px] text-amber-800">
              Administrator Reason for Resubmission:
            </span>
            <p className="text-amber-900 font-medium leading-relaxed">
              &ldquo;{resubmitInitialData.adminRemarks}&rdquo;
            </p>
            <p className="text-[11px] text-amber-700">
              Please address the highlighted observations below before re-submitting.
            </p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-7 space-y-6">
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs sm:text-sm text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Report Title */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Report Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Q4 Skill Training & Rehabilitation Progress Report"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white"
            />
          </div>

          {/* Report Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Report Type <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as NGOReportType)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm text-slate-900 bg-white cursor-pointer"
              >
                <option value="Monthly Activity Report">Monthly Activity Report</option>
                <option value="Project Progress Report">Project Progress Report</option>
                <option value="Fund Utilization Report">Fund Utilization Report</option>
                <option value="Inspection/Field Report">Inspection/Field Report</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Reporting Period */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Reporting Period <span className="text-rose-500">*</span></span>
              <span className="text-[10px] text-slate-400 font-normal">e.g., March 2026, Q1 2026-27</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={reportingPeriod}
                onChange={(e) => setReportingPeriod(e.target.value)}
                placeholder="e.g., March 2026"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white"
              />
            </div>
          </div>

          {/* Project / Activity Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Project / Activity Name <span className="text-rose-500">*</span>
            </label>
            {projects.length > 0 ? (
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  const p = projects.find((proj) => proj.id === e.target.value);
                  if (p) setProjectName(p.projectName);
                }}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm text-slate-900 bg-white cursor-pointer"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.projectName} ({proj.scheme})
                  </option>
                ))}
                <option value="custom">Other / Ad-hoc Scheme Activity</option>
              </select>
            ) : (
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter sanctioned project or activity name"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm text-slate-900 bg-white"
              />
            )}
            {selectedProjectId === 'custom' && (
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Specify Activity / Center Title"
                className="w-full mt-2 px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs text-slate-900 bg-white"
              />
            )}
          </div>

          {/* Number of Beneficiaries */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Number of Beneficiaries</span>
              <span className="text-[10px] text-slate-400 font-normal">Direct recipients count</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={beneficiaryCount}
                onChange={(e) => setBeneficiaryCount(e.target.value)}
                placeholder="e.g., 184"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white"
              />
            </div>
          </div>

          {/* Description / Summary */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Description / Report Summary <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High-level narrative summarizing the scope, goals, and key highlights of this reporting cycle..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white resize-y"
            />
          </div>

          {/* Activities Completed */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Activities Completed <span className="text-rose-500">*</span></span>
              <span className="text-[10px] text-slate-400 font-normal">List milestones, workshops, or service targets</span>
            </label>
            <textarea
              required
              rows={4}
              value={activitiesCompleted}
              onChange={(e) => setActivitiesCompleted(e.target.value)}
              placeholder="1. Conducted 8 skill empowerment workshops for marginalized youth&#10;2. Provided medical diagnostics for 145 senior citizens&#10;3. Biometric muster verified with 98% validity..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white resize-y font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Issues / Challenges */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Issues / Challenges
            </label>
            <textarea
              rows={3}
              value={issuesChallenges}
              onChange={(e) => setIssuesChallenges(e.target.value)}
              placeholder="Operational constraints, local administration delays, material shortages, or CCTV downtime issues encountered..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white resize-y text-xs"
            />
          </div>

          {/* Fund Utilization Summary */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Fund Utilization Summary</span>
              <span className="text-[10px] text-slate-400 font-normal">Expenditure vs Grant</span>
            </label>
            <textarea
              rows={3}
              value={fundUtilizationSummary}
              onChange={(e) => setFundUtilizationSummary(e.target.value)}
              placeholder="e.g., Total Sanctioned: ₹4,00,000 | Spent: ₹3,45,000 (86%) | Purpose: Trainer honorarium, nutrition kit procurement, utilities..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white resize-y text-xs"
            />
          </div>

          {/* Remarks */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Remarks
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Any additional notes for the inspection officer or supervisory audit cell..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white resize-y text-xs"
            />
          </div>
        </div>

        {/* Upload Supporting Documents */}
        <div className="border-t border-slate-200 pt-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Upload Supporting Documents
              </label>
              <p className="text-[11px] text-slate-500">
                Permitted formats: <span className="font-semibold text-slate-700">PDF, JPG/PNG, DOC/DOCX</span> (Audit certificates, vouchers, attendance sheets, camp photographs)
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
              {documents.length} File{documents.length === 1 ? '' : 's'} Attached
            </span>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div className="relative border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center bg-slate-50/60 transition group cursor-pointer">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold text-slate-700">
                <span className="text-blue-600 underline">Click to upload files</span> or drag and drop here
              </div>
              <p className="text-[10px] text-slate-400">
                Max 15MB per file · Securely hashed for audit trail
              </p>
            </div>
          </div>

          {/* Uploaded Documents List */}
          {documents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      {doc.type.includes('pdf') || doc.name.endsWith('.pdf') ? (
                        <FileText className="w-4 h-4 text-rose-500" />
                      ) : doc.type.includes('image') || doc.name.endsWith('.jpg') || doc.name.endsWith('.png') ? (
                        <ImageIcon className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Paperclip className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate" title={doc.name}>
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                    title="Remove file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="border-t border-slate-200 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Authenticated under DoSJE Field Verification Guidelines</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onNavigateToHistory && (
              <button
                type="button"
                onClick={onNavigateToHistory}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
              >
                Cancel / View History
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#0B2545] hover:bg-[#13315C] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSubmitting ? 'Submitting Report...' : 'Submit Report'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
