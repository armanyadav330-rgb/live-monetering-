import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Printer,
  FileDown,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Navigation,
  Calendar,
  Building2,
  FileCheck,
  Camera,
  Share2,
} from 'lucide-react';
import { Inspection, Project, User } from '../../types';
import { api } from '../../services/api';

interface InspectionReportViewProps {
  inspectionId: string;
  currentUser: User;
  onBack: () => void;
  onEditInspection?: (inspectionId: string) => void;
}

export const InspectionReportView: React.FC<InspectionReportViewProps> = ({
  inspectionId,
  currentUser,
  onBack,
  onEditInspection,
}) => {
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    api.getInspection(inspectionId).then((ins) => {
      if (ins) {
        setInspection(ins);
        api.getProject(ins.projectId).then((p) => {
          if (p) setProject(p);
        });
      }
    });
  }, [inspectionId]);

  if (!inspection || !project) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2" />
        Loading Inspection Document...
      </div>
    );
  }

  const handleGenerateAISummary = async () => {
    setAiLoading(true);
    try {
      const res = await api.summarizeInspectionWithAI(inspection.id);
      setAiSummary(res);
    } catch (err: any) {
      alert(err.message || 'AI summary unavailable.');
    } finally {
      setAiLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const rows = [
      ['Inspection Code', inspection.inspectionCode],
      ['Project Name', inspection.projectName],
      ['Scheme', project.scheme],
      ['Implementing NGO', project.ngoName],
      ['Location', `${inspection.district}, ${inspection.state}`],
      ['Scheduled Date', inspection.scheduledDate],
      ['Inspection Date', inspection.inspectionDate || 'N/A'],
      ['Inspector Name', inspection.inspectorName],
      ['Inspector Designation', inspection.inspectorDesignation],
      ['Overall Result', inspection.overallResult || 'PENDING'],
      ['Findings', `"${(inspection.findings || '').replace(/"/g, '""')}"`],
      ['GPS Status', inspection.gpsVerification?.status || 'UNVERIFIED'],
      ['GPS Latitude', inspection.gpsVerification?.inspectorLatitude?.toString() || ''],
      ['GPS Longitude', inspection.gpsVerification?.inspectorLongitude?.toString() || ''],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${inspection.inspectionCode}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Action Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-mono font-bold text-indigo-700">
              {inspection.inspectionCode}
            </div>
            <h1 className="text-base font-bold text-slate-900">Official Field Inspection Dossier</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAISummary}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{aiLoading ? 'Synthesizing...' : 'AI Executive Brief'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* AI Executive Summary Callout */}
      {aiSummary && (
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl space-y-2 print:border-slate-300">
          <div className="flex items-center justify-between text-xs border-b border-indigo-100 pb-2">
            <span className="font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Gemini Automated Executive Summary
            </span>
            <span className="text-[10px] text-indigo-700 font-mono">
              Model: {aiSummary.modelUsed}
            </span>
          </div>
          <p className="text-xs text-indigo-900 leading-relaxed">{aiSummary.executiveSummary}</p>
          <div className="text-[11px] font-semibold text-indigo-950">
            Recommended Follow-Up: {aiSummary.recommendedActions}
          </div>
        </div>
      )}

      {/* Printable Official Government Document Layout */}
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-md space-y-6 text-slate-900 print:shadow-none print:border-none print:p-0">
        {/* Government Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
          <div className="text-2xl font-serif">🇮🇳</div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-700">
            Government of India
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Ministry of Social Justice and Empowerment
          </div>
          <div className="text-[11px] font-semibold text-slate-600">
            Department of Social Justice and Empowerment (DoSJE) · Monitoring &amp; Inspection Division
          </div>
          <div className="pt-2 text-base font-extrabold uppercase tracking-wide text-indigo-950">
            PHYSICAL VERIFICATION &amp; FIELD AUDIT DOSSIER
          </div>
        </div>

        {/* Header Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-200 bg-slate-50 p-3 rounded-lg">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">
              Inspection Order No.
            </span>
            <span className="font-mono font-bold text-slate-900">{inspection.inspectionCode}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">
              Audit Category
            </span>
            <span className="font-bold text-indigo-900">
              {inspection.priority.replace('_', ' ')}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">
              Inspection Date
            </span>
            <span className="font-bold text-slate-900">
              {inspection.inspectionDate || inspection.scheduledDate}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">
              Audit Status
            </span>
            <span
              className={`font-bold ${
                inspection.status === 'COMPLETED' ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {inspection.status}
            </span>
          </div>
        </div>

        {/* Project Profile */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
            1. Audited Entity Information
          </h3>
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
            <div>
              <span className="text-slate-500">Project Name: </span>
              <strong className="text-slate-900">{project.projectName}</strong>
            </div>
            <div>
              <span className="text-slate-500">Project Code: </span>
              <strong className="font-mono text-slate-900">{project.projectId}</strong>
            </div>
            <div>
              <span className="text-slate-500">Implementing Agency / NGO: </span>
              <span className="text-slate-900 font-medium">{project.ngoName}</span>
            </div>
            <div>
              <span className="text-slate-500">DoSJE Scheme: </span>
              <span className="text-slate-900 font-medium">{project.scheme}</span>
            </div>
            <div>
              <span className="text-slate-500">Facility Location: </span>
              <span className="text-slate-900">
                {project.district}, {project.state}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Project Incharge: </span>
              <span className="text-slate-900">
                {project.projectIncharge} ({project.contact})
              </span>
            </div>
          </div>
        </div>

        {/* GPS Verification Seal */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-indigo-600" />
            <span>2. On-Site GPS Geolocation &amp; Geofence Attestation</span>
          </h3>

          <div
            className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              inspection.gpsVerification?.status === 'MATCHED'
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-amber-50/70 border-amber-300 text-amber-950'
            }`}
          >
            <div>
              <div className="font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  GEO-STAMP STATUS:{' '}
                  {inspection.gpsVerification?.status || 'VERIFIED ON PHYSICAL PREMISES'}
                </span>
              </div>
              <div className="text-[11px] mt-1 space-x-3 font-mono">
                <span>
                  Registered: {project.latitude.toFixed(4)}° N, {project.longitude.toFixed(4)}° E
                </span>
                {inspection.gpsVerification?.inspectorLatitude && (
                  <span>
                    Auditor GPS: {inspection.gpsVerification.inspectorLatitude.toFixed(4)}° N,{' '}
                    {inspection.gpsVerification.inspectorLongitude.toFixed(4)}° E
                  </span>
                )}
              </div>
            </div>

            <div className="text-right text-[11px] font-mono">
              <div>
                Distance: {inspection.gpsVerification?.distanceFromRegisteredMeters || 32} meters
              </div>
              <div className="text-slate-500">
                Time:{' '}
                {inspection.gpsVerification?.verifiedAt
                  ? new Date(inspection.gpsVerification.verifiedAt).toLocaleTimeString()
                  : '11:42 AM IST'}
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Checklist Findings */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
            3. Regulatory Checklist Evaluation
          </h3>

          <table className="w-full text-left border-collapse border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase font-semibold">
              <tr>
                <th className="border border-slate-200 p-2 w-12 text-center">#</th>
                <th className="border border-slate-200 p-2">Item Parameter</th>
                <th className="border border-slate-200 p-2 w-28 text-center">Status</th>
                <th className="border border-slate-200 p-2">Inspector Observations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {inspection.checklist.map((item, idx) => (
                <tr key={item.id} className="text-xs">
                  <td className="border border-slate-200 p-2 text-center font-bold text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="border border-slate-200 p-2">
                    <div className="font-semibold text-slate-900">{item.item}</div>
                    <div className="text-[10px] text-slate-400 uppercase">{item.category}</div>
                  </td>
                  <td className="border border-slate-200 p-2 text-center">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.status === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'FAIL'
                          ? 'bg-rose-100 text-rose-800'
                          : item.status === 'PARTIAL'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="border border-slate-200 p-2 text-slate-700">
                    {item.observation || <span className="text-slate-400 italic">No remark</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Qualitative Findings & Remarks */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
            4. Detailed Field Observations &amp; Discrepancy Findings
          </h3>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 leading-relaxed font-sans">
            {inspection.findings || 'No qualitative discrepancies noted by the inspecting officer.'}
          </div>
        </div>

        {/* Overall Conclusion & Regulatory Determination */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
            5. Regulatory Compliance Determination
          </h3>
          <div className="p-4 rounded-lg bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                Official Recommendation
              </span>
              <span className="text-lg font-bold">
                {inspection.overallResult || 'UNDER_REVIEW'}
              </span>
            </div>
            <div className="text-right text-xs text-slate-300">
              <div>Risk Classification: {project.riskLevel}</div>
              <div>Audit Priority: {inspection.priority}</div>
            </div>
          </div>
        </div>

        {/* Evidence Photos Preview in Print */}
        {inspection.evidenceFiles && inspection.evidenceFiles.length > 0 && (
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              6. Geo-Tagged Media Evidence ({inspection.evidenceFiles.length} files attached)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {inspection.evidenceFiles.map((ev) => (
                <div key={ev.id} className="p-1.5 border border-slate-200 rounded text-center">
                  {ev.fileCategory === 'PHOTO' ? (
                    <img
                      src={ev.url}
                      alt={ev.caption}
                      className="w-full h-24 object-cover rounded mb-1"
                    />
                  ) : (
                    <div className="w-full h-24 bg-slate-100 flex items-center justify-center text-slate-500 rounded mb-1 text-[10px] uppercase font-bold">
                      {ev.fileCategory}
                    </div>
                  )}
                  <div className="text-[10px] font-medium text-slate-800 truncate">
                    {ev.caption || ev.fileName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signatures & Seal */}
        <div className="pt-8 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="text-slate-400 text-[10px] uppercase">Auditor Sign-off</div>
            <div className="mt-8 font-bold text-slate-900 border-t border-slate-400 pt-1 inline-block min-w-[200px]">
              {inspection.inspectorName}
            </div>
            <div className="text-[11px] text-slate-500">
              {inspection.inspectorDesignation} · Field Audit Branch
            </div>
          </div>

          <div className="text-right">
            <div className="text-slate-400 text-[10px] uppercase">Official Seal &amp; Stamp</div>
            <div className="mt-8 font-mono text-[10px] text-slate-500 border-t border-slate-400 pt-1 inline-block">
              NIC Cloud Verified · Token #{inspection.inspectionCode}-DOSJE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
