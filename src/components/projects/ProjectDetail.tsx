import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  User,
  Users,
  Video,
  ClipboardList,
  Sparkles,
  PhoneCall,
  Calendar,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { Project, Inspection, CCTVCamera, AttendanceRecord, UserRole } from '../../types';
import { api } from '../../services/api';

interface ProjectDetailProps {
  projectId: string;
  userRole?: UserRole;
  onBack: () => void;
  onSelectInspection?: (inspectionId: string) => void;
  onNavigateToCCTV?: (projectId: string) => void;
  onOpenCCTV?: (projectId: string) => void;
  onNavigateToVC?: (projectId: string) => void;
  onOpenVC?: (projectId: string) => void;
  onOpenAssignModal?: (projectId: string) => void;
  onScheduleInspection?: (projectId: string) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  projectId,
  userRole,
  onBack,
  onSelectInspection,
  onNavigateToCCTV,
  onOpenCCTV,
  onNavigateToVC,
  onOpenVC,
  onOpenAssignModal,
  onScheduleInspection,
}) => {
  const handleSelectInspection = (inspectionId: string) => {
    if (onSelectInspection) onSelectInspection(inspectionId);
  };
  const handleCCTV = () => {
    if (onNavigateToCCTV) onNavigateToCCTV(projectId);
    else if (onOpenCCTV) onOpenCCTV(projectId);
  };
  const handleVC = () => {
    if (onNavigateToVC) onNavigateToVC(projectId);
    else if (onOpenVC) onOpenVC(projectId);
  };
  const handleAssign = () => {
    if (onOpenAssignModal) onOpenAssignModal(projectId);
    else if (onScheduleInspection) onScheduleInspection(projectId);
  };

  const [project, setProject] = useState<Project | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [cameras, setCameras] = useState<CCTVCamera[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'cctv' | 'attendance' | 'inspections' | 'aiRisk' | 'location'
  >('overview');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  useEffect(() => {
    api.getProject(projectId).then((p) => {
      if (p) {
        setProject(p);
      }
    });
    api.getInspections({ projectId }).then((list) => setInspections(Array.isArray(list) ? list : []));
    api.getCameras(projectId).then((cams) => setCameras(Array.isArray(cams) ? cams : []));
    api.getAttendance(projectId).then((att) => setAttendance(att && Array.isArray(att.data) ? att.data : []));
  }, [projectId]);

  if (!project) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2" />
        Loading Project Telemetry...
      </div>
    );
  }

  const handleRunAiAnalysis = async () => {
    setAiLoading(true);
    try {
      const res = await api.analyzeProjectWithAI(project.id);
      setAiResult(res);
      setActiveTab('aiRisk');
    } catch (err: any) {
      alert(err.message || 'AI analysis temporarily unavailable.');
    } finally {
      setAiLoading(false);
    }
  };

  const bd = project.riskBreakdown || {
    attendanceAnomaly: 4,
    cctvDowntime: 2,
    inspectionHistory: 5,
    gpsVerification: 4,
    complianceHistory: 6,
    otherSignals: 3,
    total: project.riskScore,
    notes: [],
  };

  return (
    <div className="space-y-4">
      {/* Back Button & Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Back to Projects"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {project.projectId}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  project.riskLevel === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-800'
                    : project.riskLevel === 'HIGH'
                    ? 'bg-orange-100 text-orange-800'
                    : project.riskLevel === 'MEDIUM'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                Risk Score: {project.riskScore}/100 ({project.riskLevel})
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-semibold">{project.projectStatus}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              {project.projectName}
            </h1>
            <p className="text-xs text-slate-500">
              {project.scheme} · Implemented by {project.ngoName}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRunAiAnalysis}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{aiLoading ? 'Analyzing...' : 'Run AI Risk Audit'}</span>
          </button>

          <button
            onClick={handleAssign}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
          >
            <ClipboardList className="w-3.5 h-3.5 text-emerald-600" />
            <span>Schedule Inspection</span>
          </button>

          <button
            onClick={handleCCTV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition"
          >
            <Video className="w-3.5 h-3.5 text-sky-600" />
            <span>Live CCTV</span>
          </button>

          <button
            onClick={handleVC}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Random Call &amp; Video</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white px-4 border-b border-slate-200 rounded-t-xl flex gap-6 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Stats' },
          { id: 'aiRisk', label: 'AI Risk Factors (20-15-20-20-15-10)' },
          { id: 'cctv', label: `CCTV Feeds (${cameras.length})` },
          { id: 'attendance', label: 'Attendance Telemetry' },
          { id: 'inspections', label: `Inspection History (${inspections.length})` },
          { id: 'location', label: 'GIS Location & Map' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-2xs">
        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 uppercase font-semibold">
                  Registered Beneficiaries
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">
                  {project.beneficiaryCount}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Average Attendance: {project.averageAttendancePercent}%
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 uppercase font-semibold">
                  Sanctioned Staff
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">{project.staffCount}</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Incharge: {project.projectIncharge}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 uppercase font-semibold">
                  CCTV Telemetry
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      project.cctvStatus === 'ONLINE'
                        ? 'bg-emerald-500'
                        : project.cctvStatus === 'WARNING'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                  <span>{project.cctvStatus}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {project.activeCamerasCount} of {project.totalCamerasCount} cameras streaming
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 uppercase font-semibold">
                  Last Inspection
                </div>
                <div className="text-sm font-bold text-slate-900 mt-1">
                  {project.lastInspectionDate ? project.lastInspectionDate.split('T')[0] : 'None recorded'}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Result: {project.lastInspectionResult || 'Pending First Audit'}
                </div>
              </div>
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Institutional Contacts
                </h3>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Project Incharge</span>
                  <span className="col-span-2 font-medium text-slate-900">{project.projectIncharge}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100 items-center">
                  <span className="text-slate-500">Official Phone</span>
                  <div className="col-span-2 flex items-center justify-between flex-wrap gap-2">
                    <span className="font-medium text-slate-900 font-mono">{project.contact}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleVC}
                        className="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                        title="Start In-App WhatsApp Video Call"
                      >
                        <MessageCircle className="w-3 h-3 fill-current" />
                        <span>WhatsApp VC</span>
                      </button>
                      <a
                        href={`https://wa.me/${project.contact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${project.projectIncharge}, this is official video verification for DoSJE project: "${project.projectName}". Please join this WhatsApp video call.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition"
                        title="Open in WhatsApp Web/App"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Chat</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Official Email</span>
                  <span className="col-span-2 font-medium text-slate-900">{project.email || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Implementing NGO</span>
                  <span className="col-span-2 font-medium text-slate-900">{project.ngoName}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Geographical Identification
                </h3>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">State / UT</span>
                  <span className="col-span-2 font-medium text-slate-900">{project.state}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">District</span>
                  <span className="col-span-2 font-medium text-slate-900">{project.district}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Registered Coordinates</span>
                  <span className="col-span-2 font-mono text-indigo-700 font-semibold">
                    {project.latitude.toFixed(4)}° N, {project.longitude.toFixed(4)}° E
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Address</span>
                  <span className="col-span-2 font-medium text-slate-900">{project.address}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. AI RISK FACTOR BREAKDOWN */}
        {activeTab === 'aiRisk' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Transparent Multi-Factor Risk Scoring Engine</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Weighted algorithm computing overall inspection urgency score (0 - 100).
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">{project.riskScore}</span>
                  <span className="text-xs text-slate-500"> / 100</span>
                </div>
              </div>

              {/* 6 Factors Bar Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Attendance Anomaly</span>
                    <strong className="text-slate-900">{bd.attendanceAnomaly} / 20</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${(bd.attendanceAnomaly / 20) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Weight: 20% max</div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>CCTV Downtime</span>
                    <strong className="text-slate-900">{bd.cctvDowntime} / 15</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-sky-600 h-full rounded-full"
                      style={{ width: `${(bd.cctvDowntime / 15) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Weight: 15% max</div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Inspection History</span>
                    <strong className="text-slate-900">{bd.inspectionHistory} / 20</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full"
                      style={{ width: `${(bd.inspectionHistory / 20) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Weight: 20% max</div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>GPS Verification Deviation</span>
                    <strong className="text-slate-900">{bd.gpsVerification} / 20</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-rose-600 h-full rounded-full"
                      style={{ width: `${(bd.gpsVerification / 20) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Weight: 20% max</div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Compliance Deficiencies</span>
                    <strong className="text-slate-900">{bd.complianceHistory} / 15</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: `${(bd.complianceHistory / 15) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Weight: 15% max</div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Other Telemetry Signals</span>
                    <strong className="text-slate-900">{bd.otherSignals} / 10</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${(bd.otherSignals / 10) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Weight: 10% max</div>
                </div>
              </div>
            </div>

            {/* Live or Cached Gemini Result */}
            {aiResult && (
              <div className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-900 text-xs">
                      Gemini Server-Side Assessment
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono">
                      {aiResult.modelUsed}
                    </span>
                  </div>
                  <span className="text-[11px] text-indigo-700 font-semibold">
                    Confidence: {aiResult.calculatedConfidenceScore}%
                  </span>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-lg border border-indigo-100">
                  {aiResult.riskSummary}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 text-[11px] uppercase tracking-wider text-rose-700">
                      Potential Telemetry Anomalies
                    </h4>
                    <ul className="space-y-1 text-slate-700 list-disc pl-4">
                      {aiResult.possibleAnomalies.map((a: string, idx: number) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 text-[11px] uppercase tracking-wider text-emerald-700">
                      Recommended Follow-Up Actions
                    </h4>
                    <ul className="space-y-1 text-slate-700 list-disc pl-4">
                      {aiResult.recommendedFollowUpActions.map((a: string, idx: number) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 italic bg-amber-50 p-2.5 rounded border border-amber-200">
                  {aiResult.disclaimer}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. CCTV */}
        {activeTab === 'cctv' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Installed Camera Matrix ({cameras.length})
              </h3>
              <button
                onClick={handleCCTV}
                className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Open Live CCTV Matrix</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cameras.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-xs">{c.cameraName}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        c.status === 'ONLINE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Location: {c.location}</div>
                  <div className="text-[10px] text-slate-400 mt-2 font-mono flex justify-between">
                    <span>{c.resolution}</span>
                    <span>Uptime: {c.uptimePercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Daily Roll-Call Logs
              </h3>
              <span className="text-xs text-slate-500">
                Baseline Registered: {project.beneficiaryCount}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Beneficiaries</th>
                    <th className="py-2.5 px-3">Staff</th>
                    <th className="py-2.5 px-3">Log Source</th>
                    <th className="py-2.5 px-3">Anomaly Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendance.map((att) => (
                    <tr key={att.id}>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{att.date}</td>
                      <td className="py-2.5 px-3">
                        {att.presentBeneficiaries} / {att.registeredBeneficiaries} (
                        {Math.round((att.presentBeneficiaries / att.registeredBeneficiaries) * 100)}%)
                      </td>
                      <td className="py-2.5 px-3">
                        {att.presentStaff} / {att.registeredStaff}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                        {att.source}
                      </td>
                      <td className="py-2.5 px-3">
                        {att.anomalyFlag ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            FLAGGED: {att.anomalyReason || 'Variance'}
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-medium">Nominal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. INSPECTION HISTORY */}
        {activeTab === 'inspections' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Inspection &amp; Verification Records
              </h3>
              <button
                onClick={handleAssign}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-xs"
              >
                Schedule New Inspection
              </button>
            </div>

            {inspections.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No past inspections recorded yet for this project.
              </div>
            ) : (
              <div className="space-y-3">
                {inspections.map((i) => (
                  <div
                    key={i.id}
                    onClick={() => handleSelectInspection(i.id)}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{i.inspectionCode}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            i.overallResult === 'COMPLIANT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : i.overallResult === 'NON_COMPLIANT'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {i.overallResult || i.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Inspector: {i.inspectorName} ({i.inspectorDesignation}) · Date:{' '}
                        {i.inspectionDate || i.scheduledDate}
                      </div>
                      {i.findings && (
                        <div className="text-[11px] text-slate-600 mt-1 italic line-clamp-1">
                          "{i.findings}"
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                      View Report →
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. LOCATION */}
        {activeTab === 'location' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Registered Site Geo-Coordinates
              </h3>
              <p className="text-slate-600">
                During field inspections, the inspector's browser Geolocation API will calculate
                real-time distance against these coordinates to prevent off-site report fabrications.
              </p>
              <div className="mt-3 flex items-center gap-4 font-mono font-bold text-indigo-700">
                <span>Latitude: {project.latitude.toFixed(6)}° N</span>
                <span>Longitude: {project.longitude.toFixed(6)}° E</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Physical Site Address</div>
                <div className="text-slate-600 mt-0.5">{project.address}</div>
              </div>
              <a
                href={`https://www.openstreetmap.org/?mlat=${project.latitude}&mlon=${project.longitude}#map=16/${project.latitude}/${project.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold flex items-center gap-1.5 transition"
              >
                <span>Open in OpenStreetMap</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
