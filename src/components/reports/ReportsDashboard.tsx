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
} from 'lucide-react';
import { Inspection, Project } from '../../types';
import { api } from '../../services/api';

export const ReportsDashboard: React.FC<{ onSelectInspection?: (id: string) => void }> = ({
  onSelectInspection,
}) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-12-31');
  const [selectedScheme, setSelectedScheme] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedResult, setSelectedResult] = useState('ALL');

  useEffect(() => {
    api.getInspections().then((ins) => setInspections(ins));
    api.getProjects().then((p) => setProjects(p));
  }, []);

  const schemes = Array.from(new Set(projects.map((p) => p.scheme))) as string[];
  const states = Array.from(new Set(projects.map((p) => p.state))) as string[];

  // Filtered dataset
  const filtered = useMemo(() => {
    return inspections.filter((i) => {
      const p = projects.find((proj) => proj.id === i.projectId);
      if (selectedScheme !== 'ALL' && p?.scheme !== selectedScheme) return false;
      if (selectedState !== 'ALL' && i.state !== selectedState) return false;
      if (selectedResult !== 'ALL' && i.overallResult !== selectedResult) return false;
      return true;
    });
  }, [inspections, projects, selectedScheme, selectedState, selectedResult]);

  // Aggregate Stats
  const totalAudits = filtered.length;
  const compliantCount = filtered.filter((i) => i.overallResult === 'COMPLIANT').length;
  const nonCompliantCount = filtered.filter((i) => i.overallResult === 'NON_COMPLIANT').length;
  const partialCount = filtered.filter((i) => i.overallResult === 'PARTIALLY_COMPLIANT').length;
  const complianceRate = totalAudits > 0 ? Math.round((compliantCount / totalAudits) * 100) : 0;

  const handleExportCSV = () => {
    const headers = [
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
    link.setAttribute('download', `DoSJE_Inspection_MIS_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-indigo-600" />
            <h1 className="text-base font-bold text-slate-900">
              Departmental Reports &amp; MIS Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive audit reports, compliance summaries, and exportable government dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition"
          >
            <FileDown className="w-4 h-4" />
            <span>Export CSV Dataset</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print MIS Summary</span>
          </button>
        </div>
      </div>

      {/* Filter Parameters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">State / UT</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
            >
              <option value="ALL">All States</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">DoSJE Scheme</label>
            <select
              value={selectedScheme}
              onChange={(e) => setSelectedScheme(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
            >
              <option value="ALL">All Schemes</option>
              {schemes.map((s) => (
                <option key={s} value={s}>
                  {s.split('(')[0]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Audit Outcome
            </label>
            <select
              value={selectedResult}
              onChange={(e) => setSelectedResult(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
            >
              <option value="ALL">All Compliance Results</option>
              <option value="COMPLIANT">COMPLIANT</option>
              <option value="PARTIALLY_COMPLIANT">PARTIALLY COMPLIANT</option>
              <option value="NON_COMPLIANT">NON COMPLIANT</option>
              <option value="REQUIRES_FOLLOW_UP">REQUIRES FOLLOW UP</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Aggregate KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs">
          <div className="text-slate-500 font-semibold uppercase text-[10px]">Total Audits</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalAudits}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Filter matched</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs">
          <div className="text-slate-500 font-semibold uppercase text-[10px]">Compliance Rate</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{complianceRate}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{compliantCount} Compliant</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs">
          <div className="text-slate-500 font-semibold uppercase text-[10px]">
            Irregularities Found
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1">{nonCompliantCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Major non-compliance</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs">
          <div className="text-slate-500 font-semibold uppercase text-[10px]">
            Partial Deficiencies
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{partialCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Under rectification</div>
        </div>
      </div>

      {/* Printable MIS Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">
            Filtered Inspection Dossier List ({filtered.length} entries)
          </span>
          <span className="text-slate-500 text-[11px]">NIC Report Service · DoSJE MIS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Order Code</th>
                <th className="py-2.5 px-3">Project &amp; Location</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Inspector</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">GPS Check</th>
                <th className="py-2.5 px-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectInspection && onSelectInspection(item.id)}
                  className="hover:bg-slate-50/70 cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">
                    {item.inspectionCode}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900">{item.projectName}</div>
                    <div className="text-[10px] text-slate-500">
                      {item.district}, {item.state}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">
                    {item.inspectionDate || item.scheduledDate}
                  </td>
                  <td className="py-2.5 px-3 text-slate-800">{item.inspectorName}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-bold text-slate-600">
                      {item.priority.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[10px]">
                    {item.gpsVerification?.status === 'MATCHED' ? (
                      <span className="text-emerald-700 font-bold">VERIFIED</span>
                    ) : (
                      <span className="text-slate-400">UNVERIFIED</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.overallResult === 'COMPLIANT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.overallResult === 'NON_COMPLIANT'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.overallResult || item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
