import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { AIAnomalyAlert, Project, Inspection } from '../../types';
import { api } from '../../services/api';

interface AlertsFeedProps {
  alerts?: AIAnomalyAlert[];
  highRiskProjects?: Project[];
  recentInspections?: Inspection[];
  onSelectProject?: (projectId: string) => void;
  onSelectInspection?: (inspectionId: string) => void;
  onNavigate?: (view: string) => void;
}

export const AlertsFeed: React.FC<AlertsFeedProps> = ({
  alerts: propAlerts,
  highRiskProjects: propHighRisk,
  recentInspections: propInspections,
  onSelectProject,
  onSelectInspection,
  onNavigate,
}) => {
  const handleSelectProject = (projectId: string) => {
    if (onSelectProject) onSelectProject(projectId);
  };
  const handleSelectInspection = (inspectionId: string) => {
    if (onSelectInspection) onSelectInspection(inspectionId);
  };
  const handleNavigate = (view: string) => {
    if (onNavigate) onNavigate(view);
  };

  const [internalAlerts, setInternalAlerts] = useState<AIAnomalyAlert[]>([]);
  const [internalProjects, setInternalProjects] = useState<Project[]>([]);
  const [internalInspections, setInternalInspections] = useState<Inspection[]>([]);

  useEffect(() => {
    if (!propAlerts) {
      api.getAIAlerts().then((a) => setInternalAlerts(Array.isArray(a) ? a : []));
    }
    if (!propHighRisk) {
      api.getProjects().then((p) => {
        const arr = Array.isArray(p) ? p : [];
        setInternalProjects(arr.filter((item) => item.riskLevel === 'CRITICAL' || item.riskLevel === 'HIGH'));
      });
    }
    if (!propInspections) {
      api.getInspections().then((i) => setInternalInspections(Array.isArray(i) ? i : []));
    }
  }, [propAlerts, propHighRisk, propInspections]);

  const alerts = Array.isArray(propAlerts) ? propAlerts : internalAlerts;
  const highRiskProjects = Array.isArray(propHighRisk) ? propHighRisk : internalProjects;
  const recentInspections = Array.isArray(propInspections) ? propInspections : internalInspections;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Live AI Anomaly Alerts */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                AI Anomaly Alerts
              </h3>
            </div>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-100">
              Gemini Telemetry
            </span>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition cursor-pointer"
                onClick={() => handleSelectProject(a.projectId)}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      a.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : a.severity === 'HIGH_ATTENTION'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {a.severity.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Conf: {a.confidenceScore}%
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-900 mt-1.5">{a.title}</div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{a.description}</p>
                <div className="mt-2 text-[10px] text-indigo-700 font-medium flex items-center justify-between">
                  <span>{a.projectName}</span>
                  <span className="flex items-center">
                    Review <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleNavigate('analytics')}
          className="mt-3 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
        >
          <span>View All AI Insights</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. High Risk Watchlist */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Priority Inspection Queue
              </h3>
            </div>
            <span className="text-[10px] bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-full border border-rose-100">
              Risk &ge; 50
            </span>
          </div>

          <div className="space-y-2.5">
            {highRiskProjects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectProject(p.id)}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-xs transition cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {p.projectName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {p.district}, {p.state} · CCTV: {p.cctvStatus}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                      p.riskLevel === 'CRITICAL'
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    Risk {p.riskScore}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{p.scheme.split('(')[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleNavigate('projects')}
          className="mt-3 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition border border-slate-200"
        >
          <span>Explore All Projects</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Recent Inspection Submissions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Field Audits
              </h3>
            </div>
            <span className="text-[10px] text-slate-500">Official Logs</span>
          </div>

          <div className="space-y-2.5">
            {recentInspections.slice(0, 4).map((i) => (
              <div
                key={i.id}
                onClick={() => handleSelectInspection(i.id)}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-xs transition cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {i.projectName}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    Insp. {i.inspectorName}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                      i.overallResult === 'COMPLIANT'
                        ? 'bg-emerald-100 text-emerald-800'
                        : i.overallResult === 'NON_COMPLIANT'
                        ? 'bg-rose-100 text-rose-800'
                        : i.status === 'PENDING'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {i.overallResult || i.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{i.scheduledDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleNavigate('inspections')}
          className="mt-3 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition border border-emerald-200"
        >
          <span>All Inspections &amp; Reports</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
