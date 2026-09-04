import React, { useState, useEffect } from 'react';
import { X, Shuffle, ShieldCheck, UserCheck, Calendar, AlertTriangle } from 'lucide-react';
import { Project, User, RiskLevel, InspectionPriority } from '../../types';
import { api } from '../../services/api';

interface AssignInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProjectId?: string;
  onAssigned: () => void;
}

export const AssignInspectionModal: React.FC<AssignInspectionModalProps> = ({
  isOpen,
  onClose,
  preselectedProjectId,
  onAssigned,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [inspectors, setInspectors] = useState<User[]>([]);
  const [stateFilter, setStateFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [schemeFilter, setSchemeFilter] = useState('ALL');
  const [minRisk, setMinRisk] = useState<RiskLevel>('MEDIUM');
  const [targetProjectId, setTargetProjectId] = useState(preselectedProjectId || '');
  const [selectedInspectorId, setSelectedInspectorId] = useState('AUTO');
  const [priority, setPriority] = useState<InspectionPriority>('SURPRISE');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [assignmentResult, setAssignmentResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      api.getProjects().then((p) => setProjects(p));
      api.getUsers().then((u) =>
        setInspectors(u.filter((usr) => usr.role === 'INSPECTION_OFFICER' || usr.role === 'SUPER_ADMIN'))
      );
      if (preselectedProjectId) {
        setTargetProjectId(preselectedProjectId);
      }
    }
  }, [isOpen, preselectedProjectId]);

  if (!isOpen) return null;

  const states = Array.from(new Set(projects.map((p) => p.state))) as string[];
  const schemes = Array.from(new Set(projects.map((p) => p.scheme))) as string[];

  const handleExecute = async () => {
    setLoading(true);
    setAssignmentResult(null);
    try {
      if (targetProjectId) {
        // Direct assignment to a specified project
        const project = projects.find((p) => p.id === targetProjectId);
        if (!project) throw new Error('Project not found');

        const officer =
          selectedInspectorId !== 'AUTO'
            ? inspectors.find((i) => i.id === selectedInspectorId)
            : inspectors[Math.floor(Math.random() * inspectors.length)];

        if (!officer) throw new Error('No inspection officers available');

        // Create inspection
        const insp = await api.assignRandomInspection({
          district: project.district,
          state: project.state,
          scheme: project.scheme,
          minRiskLevel: project.riskLevel,
        });

        setAssignmentResult(insp);
      } else {
        // Randomized algorithmic assignment based on risk weighting
        const result = await api.assignRandomInspection({
          state: stateFilter !== 'ALL' ? stateFilter : undefined,
          district: districtFilter !== 'ALL' ? districtFilter : undefined,
          scheme: schemeFilter !== 'ALL' ? schemeFilter : undefined,
          minRiskLevel: minRisk,
        });

        setAssignmentResult(result);
      }
      onAssigned();
    } catch (err: any) {
      alert(err.message || 'Inspection assignment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Randomized Inspection Assignment Engine
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Algorithm Banner */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg text-indigo-900 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Anti-Collusion Algorithmic Sampling</div>
              <p className="text-[11px] text-indigo-800 mt-0.5">
                Automatically matches high-risk NGO units with unacquainted officers outside their
                immediate circle to eliminate prior notification and ensure impartial audit findings.
              </p>
            </div>
          </div>

          {/* Target Specific or Random Option */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Project</label>
            <select
              value={targetProjectId}
              onChange={(e) => setTargetProjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="">
                🎲 Algorithmic Selection (Draw from eligible high-risk pool)
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectName} ({p.district}, {p.state}) - Risk: {p.riskLevel} ({p.riskScore})
                </option>
              ))}
            </select>
          </div>

          {/* Random Filter Criteria (Only if not targeting single project) */}
          {!targetProjectId && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                Algorithm Pool Parameters
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">State Scope</label>
                  <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  >
                    <option value="ALL">All States / Pan-India</option>
                    {states.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Minimum Risk Tier</label>
                  <select
                    value={minRisk}
                    onChange={(e) => setMinRisk(e.target.value as RiskLevel)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  >
                    <option value="LOW">Any Risk Tier (LOW+)</option>
                    <option value="MEDIUM">MEDIUM or Higher (Risk &ge; 30)</option>
                    <option value="HIGH">HIGH or Higher (Risk &ge; 50)</option>
                    <option value="CRITICAL">CRITICAL Only (Risk &ge; 70)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Scheme Category</label>
                <select
                  value={schemeFilter}
                  onChange={(e) => setSchemeFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                >
                  <option value="ALL">All Schemes</option>
                  {schemes.map((sc) => (
                    <option key={sc} value={sc}>
                      {sc.split('(')[0]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Inspector Assignment & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Inspection Officer</label>
              <select
                value={selectedInspectorId}
                onChange={(e) => setSelectedInspectorId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="AUTO">🤖 Random Availability Dispatch</option>
                {inspectors.map((ins) => (
                  <option key={ins.id} value={ins.id}>
                    {ins.name} ({ins.designation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Audit Type</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as InspectionPriority)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="SURPRISE">SURPRISE INSPECTION (Zero Notice)</option>
                <option value="CRITICAL_AUDIT">CRITICAL ANOMALY AUDIT</option>
                <option value="HIGH_PRIORITY">HIGH PRIORITY VERIFICATION</option>
                <option value="ROUTINE">ROUTINE ANNUAL AUDIT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Scheduled Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono"
            />
          </div>

          {/* Success Outcome Alert */}
          {assignmentResult && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Inspection Order Successfully Dispatched</span>
              </div>
              <p className="text-[11px] text-emerald-800">{assignmentResult.message}</p>
              {assignmentResult.inspection && (
                <div className="font-mono text-[10px] text-emerald-900 mt-1 font-bold">
                  Order Code: {assignmentResult.inspection.inspectionCode} · Inspector:{' '}
                  {assignmentResult.inspection.inspectorName}
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Close
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleExecute}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{loading ? 'Dispatching...' : 'Dispatch Inspection Order'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
