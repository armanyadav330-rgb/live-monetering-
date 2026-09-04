import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Activity,
  Calendar,
  Building2,
  CheckCircle2,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Project, AIAnomalyAlert } from '../../types';
import { api } from '../../services/api';

export const AIAnalyticsDashboard: React.FC<{ onSelectProject?: (id: string) => void }> = ({
  onSelectProject,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [alerts, setAlerts] = useState<AIAnomalyAlert[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    api.getProjects().then((p) => {
      setProjects(p);
      if (p.length > 0) {
        setSelectedProjectId(p[0].id);
      }
    });
    api.getAIAlerts().then((a) => setAlerts(a));
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      api.getAttendanceTrend(selectedProjectId).then((data) => setTrendData(data));
      setAiAnalysis(null);
    }
  }, [selectedProjectId]);

  const selectedProj = projects.find((p) => p.id === selectedProjectId);

  const handleRunAI = async () => {
    if (!selectedProjectId) return;
    setLoadingAi(true);
    try {
      const res = await api.analyzeProjectWithAI(selectedProjectId);
      setAiAnalysis(res);
    } catch (err: any) {
      alert(err.message || 'AI assessment unavailable.');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleDismissAlert = async (id: string) => {
    await api.dismissAIAlert(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h1 className="text-base font-bold text-slate-900">
              AI Anomaly &amp; Biometric Attendance Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Powered by Google Gemini 3.8 Flash to detect attendance variance, synthetic head-count
            fabrication, and facility risk signals.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Select Project:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-900"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectName} (Risk: {p.riskScore})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Project Summary & Trigger */}
      {selectedProj && (
        <div className="p-4 rounded-xl bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-indigo-300 font-bold bg-white/10 px-2 py-0.5 rounded">
                {selectedProj.projectId}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedProj.riskLevel === 'CRITICAL'
                    ? 'bg-rose-500 text-white'
                    : selectedProj.riskLevel === 'HIGH'
                    ? 'bg-orange-500 text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {selectedProj.riskLevel} RISK ({selectedProj.riskScore}/100)
              </span>
            </div>
            <h2 className="text-base font-bold mt-1 text-white">{selectedProj.projectName}</h2>
            <div className="text-xs text-indigo-200 mt-0.5">
              {selectedProj.ngoName} · {selectedProj.district}, {selectedProj.state} · Registered
              Beneficiaries: {selectedProj.beneficiaryCount}
            </div>
          </div>

          <button
            onClick={handleRunAI}
            disabled={loadingAi}
            className="px-5 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-2 self-start md:self-auto shrink-0 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loadingAi ? 'Synthesizing with Gemini...' : 'Run Gemini AI Risk Analysis'}</span>
          </button>
        </div>
      )}

      {/* 30-Day Attendance Trend Recharts */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              30-Day Daily Attendance &amp; Anomaly Curve
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Biometric &amp; Aadhaar Roll Call</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Attendance Rate']}
                contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="attendanceRate"
                stroke="#4f46e5"
                strokeWidth={2}
                name="Present %"
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-1 text-rose-600 font-semibold">
            <TrendingDown className="w-3.5 h-3.5" /> Drops &gt; 25% Flagged as Potential Phantom Enrolment
          </span>
          <span className="flex items-center gap-1 text-amber-600 font-semibold">
            <Activity className="w-3.5 h-3.5" /> 100% Synthetic Flatline Triggers Biometric Audit
          </span>
        </div>
      </div>

      {/* Gemini AI Detailed Assessment Box */}
      {aiAnalysis && (
        <div className="bg-white p-5 rounded-xl border border-indigo-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Gemini Server-Side Risk Assessment
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  Model: {aiAnalysis.modelUsed} · Confidence: {aiAnalysis.calculatedConfidenceScore}%
                </span>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700">
              Evaluated: {new Date(aiAnalysis.evaluatedAt).toLocaleTimeString()}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-800 leading-relaxed font-medium">
            {aiAnalysis.riskSummary}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg border border-rose-100 bg-rose-50/50">
              <h4 className="font-bold text-rose-900 mb-2 uppercase text-[10px] tracking-wider">
                Detected Telemetry &amp; Field Anomalies
              </h4>
              <ul className="space-y-1.5 text-slate-700 list-disc pl-4">
                {aiAnalysis.possibleAnomalies.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/50">
              <h4 className="font-bold text-emerald-900 mb-2 uppercase text-[10px] tracking-wider">
                Recommended Departmental Follow-Up Actions
              </h4>
              <ul className="space-y-1.5 text-slate-700 list-disc pl-4">
                {aiAnalysis.recommendedFollowUpActions.map((act: string, idx: number) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* AI Anomaly Alerts Feed */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Active Automated Anomaly Alerts Feed</span>
          </h2>
          <span className="text-xs text-slate-500 font-semibold">{alerts.length} Active Alerts</span>
        </div>

        <div className="space-y-2.5">
          {alerts.map((al) => (
            <div
              key={al.id}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      al.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {al.severity.replace('_', ' ')}
                  </span>
                  <strong className="text-slate-900">{al.title}</strong>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Conf: {al.confidenceScore}%
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{al.description}</p>
                <div className="text-[10px] text-slate-400">
                  Target: <strong className="text-slate-700">{al.projectName}</strong> · Type:{' '}
                  {al.anomalyType}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {onSelectProject && (
                  <button
                    onClick={() => onSelectProject(al.projectId)}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  >
                    View Project
                  </button>
                )}
                <button
                  onClick={() => handleDismissAlert(al.id)}
                  className="px-2.5 py-1 text-xs font-medium rounded border border-slate-300 hover:bg-slate-100 text-slate-600"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
