import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Search,
  Building,
  Users,
  Video,
  FileSpreadsheet,
} from 'lucide-react';

interface ChecklistCategory {
  id: string;
  name: string;
  icon: any;
  items: {
    code: string;
    description: string;
    statutoryRef: string;
    criticality: 'CRITICAL' | 'MAJOR' | 'MINOR';
  }[];
}

export const StatutoryChecklistView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('INFRA');
  const [search, setSearch] = useState('');

  const categories: ChecklistCategory[] = [
    {
      id: 'INFRA',
      name: 'Physical Infrastructure & Safety',
      icon: Building,
      items: [
        { code: 'INF-01', description: 'Adequate barrier-free ramp access with statutory slope (1:12) and dual handrails as per RPwD Act 2016.', statutoryRef: 'Section 45, RPwD Act 2016', criticality: 'CRITICAL' },
        { code: 'INF-02', description: 'Operational fire prevention systems, fire extinguishers with active inspection tag, and clear emergency egress pathways.', statutoryRef: 'NBC 2016 Part 4', criticality: 'CRITICAL' },
        { code: 'INF-03', description: 'Separated, accessible, clean sanitation blocks with running water for male and female beneficiaries.', statutoryRef: 'DoSJE Scheme Guidelines', criticality: 'MAJOR' },
        { code: 'INF-04', description: 'Hygienic food preparation area / kitchen with certified pest-control records and potable drinking water.', statutoryRef: 'FSSAI Standards', criticality: 'MAJOR' },
      ],
    },
    {
      id: 'SURV',
      name: 'CCTV & Biometric Telemetry',
      icon: Video,
      items: [
        { code: 'SUR-01', description: 'Continuous 24×7 IP camera surveillance operational at main entry/exit points and common dining/assembly halls.', statutoryRef: 'Mandatory CCoE Directive', criticality: 'CRITICAL' },
        { code: 'SUR-02', description: 'Minimum 30-day non-erasable local NVR storage backup with synchronized standard NTP timestamps.', statutoryRef: 'DoSJE CCTV Protocol', criticality: 'CRITICAL' },
        { code: 'SUR-03', description: 'Aadhaar-enabled biometric attendance device (ABAS) functional with active network synchronization.', statutoryRef: 'Statutory Directives 2024', criticality: 'MAJOR' },
      ],
    },
    {
      id: 'BENEF',
      name: 'Beneficiary Care & Welfare',
      icon: Users,
      items: [
        { code: 'BEN-01', description: 'Physical headcount matches registered live portal enrollment within admissible +/- 5% variance.', statutoryRef: 'Scheme Section 8.2', criticality: 'CRITICAL' },
        { code: 'BEN-02', description: 'Availability of qualified medical doctor / visiting physician records and first-aid emergency medical chest.', statutoryRef: 'Standard Operating Procedures', criticality: 'MAJOR' },
        { code: 'BEN-03', description: 'Nutritious meal schedule posted prominently in local regional language matching statutory dietary norms.', statutoryRef: 'DoSJE Welfare Manual', criticality: 'MINOR' },
      ],
    },
    {
      id: 'ACCOUNTS',
      name: 'Statutory Registers & Accounts',
      icon: FileSpreadsheet,
      items: [
        { code: 'ACC-01', description: 'Grant-in-Aid utilization register properly maintained with corresponding audited voucher entries.', statutoryRef: 'GFR 2017 Rule 238', criticality: 'CRITICAL' },
        { code: 'ACC-02', description: 'Staff attendance and salary disbursement through DBT / direct bank account transfers with bank statements.', statutoryRef: 'Govt. Direct Benefit Transfer Norms', criticality: 'MAJOR' },
        { code: 'ACC-03', description: 'Visitors logbook and surprise inspection remarks register signed by previous visiting dignitaries.', statutoryRef: 'DoSJE Protocol', criticality: 'MINOR' },
      ],
    },
  ];

  const currentCat = categories.find((c) => c.id === selectedCategory) || categories[0];

  const filteredItems = currentCat.items.filter(
    (i) =>
      !search ||
      i.code.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase()) ||
      i.statutoryRef.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600" />
            <h1 className="text-base font-bold text-slate-900">
              Statutory Inspection &amp; Audit Checklist
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prescribed verification parameters under DoSJE Scheme Guidelines, GFR 2017, and RPwD Act standards.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Sovereign Quality Standards v3.2</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-3 ${
                isSelected
                  ? 'bg-[#0B2545] border-[#0B2545] text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isSelected ? 'bg-white/10 text-amber-300' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">{cat.name}</div>
                <div className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  {cat.items.length} Checkpoints
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Checklist Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {currentCat.name} Checklist Checkpoints
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search checklist criteria..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {filteredItems.map((item) => (
            <div key={item.code} className="p-4 flex items-start gap-4 hover:bg-slate-50/80 transition">
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded text-[11px] shrink-0">
                {item.code}
              </span>

              <div className="flex-1 space-y-1">
                <p className="font-semibold text-slate-900 text-xs leading-relaxed">{item.description}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-400">Statutory Authority:</span>
                  <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.statutoryRef}
                  </span>
                </div>
              </div>

              <span
                className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                  item.criticality === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : item.criticality === 'MAJOR'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-blue-100 text-blue-800 border-blue-300'
                }`}
              >
                {item.criticality}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
