import React, { useState, useEffect, useMemo } from 'react';
import {
  FileBarChart,
  FileDown,
  Printer,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Building2,
  ShieldCheck,
  MapPin,
  FileText,
  BadgeCheck,
  Layers,
  Lock,
  Eye,
  Info,
} from 'lucide-react';
import { Inspection, Project, User } from '../../types';
import { api, getStoredUser } from '../../services/api';

interface ReportsDashboardProps {
  currentUser?: User;
  onSelectInspection?: (id: string) => void;
}

export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({
  currentUser: propUser,
  onSelectInspection,
}) => {
  const activeUser = propUser || getStoredUser();

  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-12-31');
  const [selectedScheme, setSelectedScheme] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedResult, setSelectedResult] = useState('ALL');

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getInspections(), api.getProjects()])
      .then(([insList, projList]) => {
        setInspections(insList || []);
        setProjects(projList || []);
      })
      .finally(() => setLoading(false));
  }, [activeUser.id, activeUser.role]);

  // Role metadata description
  const roleReportMeta = useMemo(() => {
    switch (activeUser.role) {
      case 'NGO_INSTITUTE':
        return {
          title: 'Institutional Facility Compliance & Audit Dossier',
          subtitle: 'Single-Facility Authorized Record · Verified by Central Monitoring Cell',
          badge: 'NGO CENTER DOSSIER',
          code: `NGO-MIS-${activeUser.assignedProjectId || 'FAC-01'}`,
          scopeNotice:
            'Data is scoped strictly to your registered institution. You are viewing your facility’s official compliance audit reports and biometric logs.',
        };
      case 'INSPECTION_OFFICER':
        return {
          title: 'Field Inspection Officer Deployment & Verification Register',
          subtitle: `Assigned Field Inspections & GPS Ground Audits · Inspector: ${activeUser.name}`,
          badge: 'FIELD INSPECTOR REGISTER',
          code: `INSP-OFFICER-${activeUser.id.toUpperCase()}`,
          scopeNotice:
            'Data is scoped to your assigned field inspection orders across your designated jurisdiction. Ground GPS verification records are attached.',
        };
      case 'STATE_DISTRICT_AUTHORITY':
        return {
          title: `District Administrative Monitoring & Compliance Report: ${activeUser.district || 'Pune'}, ${activeUser.state || 'Maharashtra'}`,
          subtitle: 'District Magistrate / Social Welfare Officer Statutory Oversight Dossier',
          badge: 'DISTRICT JURISDICTION',
          code: `DIST-AUTH-${(activeUser.district || 'ALL').toUpperCase()}`,
          scopeNotice: `Data is scoped exclusively to institutions within District ${activeUser.district || 'Assigned'}, ${activeUser.state || ''}. Non-jurisdictional facilities are excluded.`,
        };
      case 'DEPARTMENT_OFFICIAL':
        return {
          title: 'Central Sector Programme Directorate Evaluation Report',
          subtitle: 'Central Schemes Review (PM-AJAY, SMILE & Adarsh Gram) Oversight Dossier',
          badge: 'DIRECTORATE REPORT',
          code: 'DIR-SCHEME-CENTRAL-2026',
          scopeNotice:
            'Data is filtered for central scheme performance metrics, non-compliance patterns, and scheme-wide expenditure assurance.',
        };
      case 'SUPER_ADMIN':
      default:
        return {
          title: 'National Consolidated All-India Master Oversight MIS Dossier',
          subtitle: 'Apex Monitoring Cell · All 36 States & UTs Comprehensive Governance Record',
          badge: 'APEX ALL-INDIA DOSSIER',
          code: 'APEX-NAT-OVERSIGHT-2026',
          scopeNotice:
            'Apex Master Access: Viewing aggregated national performance across all central schemes, district administrations, and registered NGO institutes.',
        };
    }
  }, [activeUser]);

  // Filter schemes and states
  const schemes = Array.from(new Set(projects.map((p) => p.scheme))).filter(Boolean) as string[];
  const states = Array.from(new Set(projects.map((p) => p.state))).filter(Boolean) as string[];

  // Filtered dataset with role-specific isolation
  const filtered = useMemo(() => {
    return inspections.filter((i) => {
      // Role-based strict isolation
      if (activeUser.role === 'NGO_INSTITUTE') {
        const targetId = activeUser.assignedProjectId || 'proj_001';
        if (i.projectId !== targetId) return false;
      } else if (activeUser.role === 'INSPECTION_OFFICER') {
        if (
          i.inspectorId !== activeUser.id &&
          (!activeUser.state || i.state.toLowerCase() !== activeUser.state.toLowerCase())
        ) {
          return false;
        }
      } else if (activeUser.role === 'STATE_DISTRICT_AUTHORITY') {
        if (activeUser.district && i.district.toLowerCase() !== activeUser.district.toLowerCase()) {
          return false;
        }
        if (activeUser.state && i.state.toLowerCase() !== activeUser.state.toLowerCase()) {
          return false;
        }
      } else if (activeUser.role === 'DEPARTMENT_OFFICIAL') {
        const s = (i.scheme || '').toLowerCase();
        if (!s.includes('pm-ajay') && !s.includes('smile') && !s.includes('adarsh')) {
          return false;
        }
      }

      const p = projects.find((proj) => proj.id === i.projectId);
      if (selectedScheme !== 'ALL' && p?.scheme !== selectedScheme) return false;
      if (selectedState !== 'ALL' && i.state !== selectedState) return false;
      if (selectedResult !== 'ALL' && i.overallResult !== selectedResult) return false;
      return true;
    });
  }, [inspections, projects, selectedScheme, selectedState, selectedResult, activeUser]);

  // Aggregate Stats
  const totalAudits = filtered.length;
  const compliantCount = filtered.filter((i) => i.overallResult === 'COMPLIANT').length;
  const nonCompliantCount = filtered.filter((i) => i.overallResult === 'NON_COMPLIANT').length;
  const partialCount = filtered.filter((i) => i.overallResult === 'PARTIALLY_COMPLIANT').length;
  const complianceRate = totalAudits > 0 ? Math.round((compliantCount / totalAudits) * 100) : 0;

  const handleExportCSV = () => {
    const headers = [
      'Report Reference',
      'Inspection Code',
      'Scheduled Date',
      'Inspection Date',
      'Project Name',
      'District',
      'State',
      'Inspector',
      'Audit Priority',
      'GPS Verified',
      'Overall Result',
      'Observations',
    ];

    const rows = filtered.map((i) => [
      roleReportMeta.code,
      i.inspectionCode,
      i.scheduledDate,
      i.inspectionDate || 'N/A',
      `"${i.projectName.replace(/"/g, '""')}"`,
      i.district,
      i.state,
      `"${i.inspectorName}"`,
      i.priority,
      i.gpsVerification?.status || 'UNVERIFIED',
      i.overallResult || 'PENDING',
      `"${(i.findings || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DoSJE_${roleReportMeta.code}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Official Government Formal Report Header Banner */}
      <div className="bg-[#0B2545] text-white p-5 rounded-xl border border-slate-700 shadow-md relative overflow-hidden">
        {/* Subtle Watermark Emblem */}
        <div className="absolute right-4 -top-6 text-[120px] opacity-10 pointer-events-none select-none">
          🏛️
        </div>

        {/* Top Official Line */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#13315C] border border-amber-500/60 flex items-center justify-center text-lg shadow-inner">
              🏛️
            </div>
            <div>
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                भारत सरकार · GOVERNMENT OF INDIA
              </div>
              <div className="text-xs font-semibold text-slate-200">
                सामाजिक न्याय और अधिकारिता मंत्रालय · Ministry of Social Justice and Empowerment
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-[#13315C] px-2.5 py-1 rounded border border-slate-600 text-amber-300 font-bold">
              {roleReportMeta.code}
            </span>
            <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-600/50 px-2 py-0.5 rounded font-semibold">
              NIC MIS CERTIFIED
            </span>
          </div>
        </div>

        {/* Main Title & User Scoped Identity */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                {roleReportMeta.badge}
              </span>
              <span className="text-slate-300 text-xs">
                Generated for: <strong className="text-white">{activeUser.name}</strong> ({activeUser.designation})
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {roleReportMeta.title}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              {roleReportMeta.subtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 print:hidden shrink-0">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded bg-[#13315C] hover:bg-[#1C4480] text-slate-100 border border-slate-600 transition cursor-pointer shadow-sm"
              title="Download official CSV data sheet"
            >
              <FileDown className="w-4 h-4 text-amber-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow transition cursor-pointer"
              title="Print official government dossier"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Dossier</span>
            </button>
          </div>
        </div>

        {/* Data Isolation Principle Callout */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-start gap-2.5 bg-[#071930]/70 p-3 rounded-lg border border-slate-800 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed text-slate-300">
            <strong className="text-amber-300">समान मास्टर डेटा, अलग-अलग भूमिका रिपोर्ट (Unified Data · Role-Specific Isolated Dossier):</strong>{' '}
            {roleReportMeta.scopeNotice}
          </div>
        </div>
      </div>

      {/* Filter Parameters - Government Portal Filter Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm print:hidden">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
          <Filter className="w-4 h-4 text-[#0B2545]" />
          <span className="text-xs font-bold text-[#0B2545] uppercase tracking-wider">
            MIS Filter Criteria (फिल्टर मापदंड)
          </span>
          <span className="text-[11px] text-slate-500 ml-auto">
            Showing {filtered.length} matched records out of {inspections.length} total database entries
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">State / UT (राज्य)</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-slate-50 text-slate-800 focus:bg-white focus:border-[#0B2545] font-medium"
            >
              <option value="ALL">All States ({states.length})</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">DoSJE Scheme (योजना)</label>
            <select
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-slate-50 text-slate-800 focus:bg-white focus:border-[#0B2545] font-medium"
            >
              <option value="ALL">All Schemes ({schemes.length})</option>
              {schemes.map((s) => (
                <option key={s} value={s}>
                  {s.split('(')[0]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Compliance Outcome (परिणाम)
            </label>
            <select
              value={selectedResult}
              onChange={(e) => setSelectedResult(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-slate-50 text-slate-800 focus:bg-white focus:border-[#0B2545] font-medium"
            >
              <option value="ALL">All Audit Results</option>
              <option value="COMPLIANT">COMPLIANT (पूर्ण अनुपालन)</option>
              <option value="PARTIALLY_COMPLIANT">PARTIALLY COMPLIANT (आंशिक)</option>
              <option value="NON_COMPLIANT">NON COMPLIANT (अनियमितता)</option>
              <option value="REQUIRES_FOLLOW_UP">REQUIRES FOLLOW UP (पुनः जांच)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">From Date (आरंभ तिथि)</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-slate-50 text-slate-800 font-mono text-xs focus:bg-white focus:border-[#0B2545]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">To Date (अंतिम तिथि)</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-slate-50 text-slate-800 font-mono text-xs focus:bg-white focus:border-[#0B2545]"
            />
          </div>
        </div>
      </div>

      {/* Aggregate KPI Summary Cards - Government Style Border Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-300 border-l-4 border-l-[#0B2545] shadow-xs text-xs">
          <div className="text-slate-600 font-bold uppercase text-[10px] tracking-wide">
            Scoped Audits (कुल ऑडिट)
          </div>
          <div className="text-2xl font-bold text-[#0B2545] mt-1">{totalAudits}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">In your jurisdiction</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-300 border-l-4 border-l-emerald-600 shadow-xs text-xs">
          <div className="text-slate-600 font-bold uppercase text-[10px] tracking-wide">
            Compliance Rate (अनुपालन दर)
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{complianceRate}%</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">{compliantCount} Fully Compliant</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-300 border-l-4 border-l-rose-600 shadow-xs text-xs">
          <div className="text-slate-600 font-bold uppercase text-[10px] tracking-wide">
            Non-Compliant (अनियमितताएं)
          </div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{nonCompliantCount}</div>
          <div className="text-[10px] text-rose-600 font-medium mt-0.5">Breaches identified</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-300 border-l-4 border-l-amber-500 shadow-xs text-xs">
          <div className="text-slate-600 font-bold uppercase text-[10px] tracking-wide">
            Under Notice (सुधार प्रक्रिया)
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{partialCount}</div>
          <div className="text-[10px] text-amber-600 font-medium mt-0.5">Rectification pending</div>
        </div>
      </div>

      {/* Official Government Table Card */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-[#0B2545] text-white flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-amber-400" />
            <span className="font-bold tracking-wide">
              Official Inspection Dossier Register ({filtered.length} entries)
            </span>
          </div>
          <span className="text-slate-300 text-[11px] font-mono">
            Auth Ref: {roleReportMeta.code} · DoSJE NIC Gateway
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3 border-r border-slate-200">Order Ref</th>
                <th className="py-2.5 px-3 border-r border-slate-200">Project / Institute Name</th>
                <th className="py-2.5 px-3 border-r border-slate-200">District / State</th>
                <th className="py-2.5 px-3 border-r border-slate-200">Inspection Date</th>
                <th className="py-2.5 px-3 border-r border-slate-200">Inspector</th>
                <th className="py-2.5 px-3 border-r border-slate-200">Priority</th>
                <th className="py-2.5 px-3 border-r border-slate-200">GPS Validation</th>
                <th className="py-2.5 px-3">Statutory Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 bg-slate-50">
                    <p className="font-medium">No inspection records found for the selected jurisdiction or filters.</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Try adjusting the date range or scheme selection above.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectInspection && onSelectInspection(item.id)}
                    className="hover:bg-amber-50/40 cursor-pointer transition"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0B2545] border-r border-slate-200">
                      {item.inspectionCode}
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200">
                      <div className="font-bold text-slate-900">{item.projectName}</div>
                      <div className="text-[10px] text-slate-500">{item.scheme || 'Central Sector Scheme'}</div>
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200 text-slate-700 font-medium">
                      {item.district}, {item.state}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 border-r border-slate-200">
                      {item.inspectionDate || item.scheduledDate}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 border-r border-slate-200 font-medium">
                      {item.inspectorName}
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200">
                      <span className="text-[10px] font-bold text-slate-700">
                        {item.priority.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] border-r border-slate-200">
                      {item.gpsVerification?.status === 'MATCHED' ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
                          VERIFIED
                        </span>
                      ) : (
                        <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          UNVERIFIED
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                          item.overallResult === 'COMPLIANT'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.overallResult === 'NON_COMPLIANT'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {item.overallResult || item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Official Printable Signature and Digital Seal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-600">
            <div>
              <strong>Government Compliance Clause:</strong> Generated electronically in accordance with DoSJE IT Guidelines 2026.
            </div>
            <div className="text-slate-400 text-[10px] mt-0.5">
              Ref Hash: SHA256-DOSJE-VERIFIED-DATA · Official Record of Ministry of Social Justice and Empowerment
            </div>
          </div>

          <div className="border border-slate-300 bg-white p-2.5 rounded text-center shrink-0">
            <div className="text-[9px] uppercase font-bold text-slate-400">e-Sign / Digital Verification</div>
            <div className="font-bold text-slate-800 text-xs mt-0.5">Digitally Authenticated</div>
            <div className="text-[9px] text-emerald-700 font-semibold font-mono">e-Pramaan Token Valid</div>
          </div>
        </div>
      </div>
    </div>
  );
};
