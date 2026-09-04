import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Project } from '../../types';

interface RiskChartProps {
  projects?: Project[];
}

export const RiskChart: React.FC<RiskChartProps> = ({ projects = [] }) => {
  const safeProjects = Array.isArray(projects) ? projects : [];

  // Risk Distribution Data
  const riskCounts = {
    LOW: safeProjects.filter((p) => p.riskLevel === 'LOW').length,
    MEDIUM: safeProjects.filter((p) => p.riskLevel === 'MEDIUM').length,
    HIGH: safeProjects.filter((p) => p.riskLevel === 'HIGH').length,
    CRITICAL: safeProjects.filter((p) => p.riskLevel === 'CRITICAL').length,
  };

  const riskData = [
    { name: 'Low Risk', value: riskCounts.LOW, color: '#10b981' },
    { name: 'Medium Risk', value: riskCounts.MEDIUM, color: '#f59e0b' },
    { name: 'High Risk', value: riskCounts.HIGH, color: '#ea580c' },
    { name: 'Critical Risk', value: riskCounts.CRITICAL, color: '#e11d48' },
  ];

  // Scheme Distribution
  const schemeMap: Record<string, { count: number; beneficiaries: number }> = {};
  safeProjects.forEach((p) => {
    const sName = (p.scheme || 'Other').split('(')[0].trim();
    if (!schemeMap[sName]) {
      schemeMap[sName] = { count: 0, beneficiaries: 0 };
    }
    schemeMap[sName].count += 1;
    schemeMap[sName].beneficiaries += p.beneficiaryCount || 0;
  });

  const schemeData = Object.keys(schemeMap).map((k) => ({
    name: k.length > 15 ? k.substring(0, 15) + '...' : k,
    projects: schemeMap[k].count,
    beneficiaries: Math.round(schemeMap[k].beneficiaries / 10), // scaled for display
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Risk Tier Breakdown */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Risk Classification Distribution
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">Algorithmic Scoring</span>
        </div>
        <div className="h-60 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={45}
                paddingAngle={4}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number) => [`${val} Projects`, 'Count']}
                contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
          {riskData.map((r) => (
            <div key={r.name} className="px-1">
              <div className="text-[10px] text-slate-500 truncate">{r.name}</div>
              <div className="text-sm font-bold" style={{ color: r.color }}>
                {r.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Scheme Distribution */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Projects by Scheme Category
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">Active Portfolios</span>
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={schemeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="projects" fill="#4f46e5" name="Projects Count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-slate-100">
          Encompassing PM-AJAY, SMILE, SHREYAS, NAPDDR, &amp; Senior Citizen Welfare Initiatives
        </div>
      </div>
    </div>
  );
};
