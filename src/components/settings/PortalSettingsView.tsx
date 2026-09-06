import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Phone,
  Sparkles,
  MapPin,
  Bell,
  Lock,
  Save,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Clock,
  User,
  Sliders,
  Radio,
  FileSpreadsheet,
  Check,
  Globe,
  Camera,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { PortalSettings, User as UserType } from '../../types';
import { api } from '../../services/api';

interface PortalSettingsViewProps {
  currentUser: UserType;
  onNavigateToView?: (view: string) => void;
}

export const PortalSettingsView: React.FC<PortalSettingsViewProps> = ({
  currentUser,
  onNavigateToView,
}) => {
  const [settings, setSettings] = useState<PortalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'telephony' | 'risk' | 'inspection' | 'notifications' | 'security'>('general');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load Settings on Mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const calculateTotalRiskWeight = (weights: PortalSettings['riskWeights']) => {
    return (
      Number(weights.attendanceAnomaly || 0) +
      Number(weights.cctvDowntime || 0) +
      Number(weights.inspectionHistory || 0) +
      Number(weights.gpsVerification || 0) +
      Number(weights.complianceHistory || 0) +
      Number(weights.otherSignals || 0)
    );
  };

  const handleSave = async () => {
    if (!settings) return;

    // Check risk weights total
    const totalWeight = calculateTotalRiskWeight(settings.riskWeights);
    if (totalWeight !== 100) {
      showToast(`Warning: AI Risk Model weights must sum to 100% (currently ${totalWeight}%). Please normalize before saving.`, 'error');
      setActiveTab('risk');
      return;
    }

    setSaving(true);
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      showToast('Portal configuration saved and applied across all modules!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all portal settings to central government defaults?')) {
      setSaving(true);
      try {
        const reset = await api.resetSettings();
        setSettings(reset);
        showToast('All settings reset to default DoSJE parameters');
      } catch (err: any) {
        showToast(err.message || 'Failed to reset settings', 'error');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleExportJson = () => {
    if (!settings) return;
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dosje_portal_settings_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Configuration exported as JSON');
  };

  const normalizeWeights = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      riskWeights: {
        attendanceAnomaly: 20,
        cctvDowntime: 15,
        inspectionHistory: 20,
        gpsVerification: 20,
        complianceHistory: 15,
        otherSignals: 10,
      },
    });
    showToast('Weights normalized to official 20-15-20-20-15-10 standard');
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading Portal Configuration...</span>
        </div>
      </div>
    );
  }

  const totalRiskWeight = calculateTotalRiskWeight(settings.riskWeights);

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border transition-all animate-in slide-in-from-bottom-5 ${
            toastMessage.type === 'success'
              ? 'bg-slate-900 text-emerald-400 border-emerald-500/40'
              : 'bg-rose-900 text-rose-100 border-rose-500/40'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Settings className="w-3 h-3 text-emerald-400" />
                DoSJE Central Administration Console
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                FY {settings.financialYear}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Portal Settings &amp; Policy Governance
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Configure system parameters, official Toll-Free IVR gateway, 6-pillar AI risk algorithm weights, geo-fencing tolerance, and regulatory compliance dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            <button
              onClick={handleExportJson}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Export Settings to JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleReset}
              disabled={saving}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Reset all settings to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              <Save className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>Last Updated: <strong className="text-slate-200 font-mono">{new Date(settings.updatedAt || Date.now()).toLocaleString('en-IN')}</strong></span>
            <span>·</span>
            <span>By: <strong className="text-slate-200">{settings.updatedBy || 'Super Admin'}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold text-[11px]">System Live &amp; Synchronized</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-t-xl border-b border-slate-200 px-4 flex gap-2 overflow-x-auto">
        {[
          { id: 'general', label: 'General & Organization', icon: Building2 },
          { id: 'telephony', label: 'Toll-Free & Telephony Hub', icon: Phone },
          { id: 'risk', label: 'AI Risk Formula (20-15-20-20-15-10)', icon: Sparkles },
          { id: 'inspection', label: 'Inspection & Geofencing Rules', icon: MapPin },
          { id: 'notifications', label: 'Notification & Alerts', icon: Bell },
          { id: 'security', label: 'Security & Access Control', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 border-b-2 text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form Content Container */}
      <div className="bg-white rounded-b-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-6">
        {/* ==================================================== */}
        {/* TAB 1: GENERAL & ORGANIZATION */}
        {/* ==================================================== */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">General &amp; Department Information</h2>
              <p className="text-xs text-slate-500">Configure global metadata and institutional identifiers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Portal Display Title
                </label>
                <input
                  type="text"
                  value={settings.portalTitle}
                  onChange={(e) => setSettings({ ...settings, portalTitle: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  value={settings.departmentName}
                  onChange={(e) => setSettings({ ...settings, departmentName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ministry Name
                </label>
                <input
                  type="text"
                  value={settings.ministryName}
                  onChange={(e) => setSettings({ ...settings, ministryName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Financial Year
                  </label>
                  <select
                    value={settings.financialYear}
                    onChange={(e) => setSettings({ ...settings, financialYear: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 text-slate-900 font-semibold"
                  >
                    <option value="2026-2027">2026-2027 (Current)</option>
                    <option value="2025-2026">2025-2026</option>
                    <option value="2024-2025">2024-2025</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Interface Language
                  </label>
                  <select
                    value={settings.defaultLanguage}
                    onChange={(e: any) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 text-slate-900 font-semibold"
                  >
                    <option value="en">English (Official)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Simulation Mode Switch */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Sandbox &amp; Telephony Simulation Mode</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Allows safe realistic simulation of CCTV heartbeats, VoIP calls, and simulated field officer positions without triggering actual statutory notices.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={settings.simulationMode}
                  onChange={(e) => setSettings({ ...settings, simulationMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: TOLL-FREE & TELEPHONY HUB */}
        {/* ==================================================== */}
        {activeTab === 'telephony' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Toll-Free Verification &amp; IVR Trunk Configuration</h2>
              <p className="text-xs text-slate-500">
                Manage the national 1800-XXX-XXXX toll-free hotline and video call bridge gateway used during random verification calls.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Toll-Free Gateway (1800)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.primaryTollFree}
                    onChange={(e) => setSettings({ ...settings, primaryTollFree: e.target.value })}
                    placeholder="1800-180-4921"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 text-emerald-800 font-mono font-bold"
                  />
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    ACTIVE TRUNK
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Zero-charge All-India gateway for beneficiaries and officials.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Secondary / Failover Toll-Free Trunk
                </label>
                <input
                  type="text"
                  value={settings.secondaryTollFree}
                  onChange={(e) => setSettings({ ...settings, secondaryTollFree: e.target.value })}
                  placeholder="1800-200-8890"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 text-slate-900 font-mono font-medium"
                />
                <p className="text-[11px] text-slate-400 mt-1">Secondary carrier route for high-concurrency peak hours.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Automated IVR Voice Dialect
                </label>
                <select
                  value={settings.ivrLanguage}
                  onChange={(e: any) => setSettings({ ...settings, ivrLanguage: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 text-slate-900 font-semibold"
                >
                  <option value="bilingual">Bilingual (Hindi + Indian English)</option>
                  <option value="hi-IN">हिन्दी (Hindi Voice Synthesis)</option>
                  <option value="en-IN">Indian English (Government Accent)</option>
                </select>
              </div>

              <div className="space-y-3 pt-1">
                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer">
                  <div className="pr-2">
                    <span className="text-xs font-bold text-slate-800">Auto Video Call Bridge (Key 1)</span>
                    <p className="text-[11px] text-slate-500">Allow caller to immediately switch into video call by pressing 1 on keypad.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoVideoCallBridge}
                    onChange={(e) => setSettings({ ...settings, autoVideoCallBridge: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer">
                  <div className="pr-2">
                    <span className="text-xs font-bold text-slate-800">Regulatory Consent Advisory</span>
                    <p className="text-[11px] text-slate-500">Play mandatory announcement: &quot;This call is recorded for DoSJE audit purposes&quot;.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.recordingConsentNotice}
                    onChange={(e) => setSettings({ ...settings, recordingConsentNotice: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: AI RISK FORMULA CALIBRATION */}
        {/* ==================================================== */}
        {activeTab === 'risk' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">AI Risk Assessment Model Weights (20-15-20-20-15-10)</h2>
                <p className="text-xs text-slate-500">
                  Configure the mathematical weight distribution across the 6 inspection pillars. Total must equal 100%.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold border ${
                    totalRiskWeight === 100
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                  }`}
                >
                  Total: {totalRiskWeight}% / 100%
                </span>

                {totalRiskWeight !== 100 && (
                  <button
                    onClick={normalizeWeights}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition"
                  >
                    Normalize
                  </button>
                )}
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Factor 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">1. Attendance Anomaly &amp; Proxy Rate</span>
                  <span className="font-mono font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {settings.riskWeights.attendanceAnomaly}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.riskWeights.attendanceAnomaly}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      riskWeights: { ...settings.riskWeights, attendanceAnomaly: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">Penalizes repetitive biometric patterns and abnormal attendance drops.</p>
              </div>

              {/* Factor 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">2. CCTV Downtime &amp; Feed Interruption</span>
                  <span className="font-mono font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {settings.riskWeights.cctvDowntime}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.riskWeights.cctvDowntime}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      riskWeights: { ...settings.riskWeights, cctvDowntime: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">Tracks hours offline, packet drops, and camera obstruction events.</p>
              </div>

              {/* Factor 3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">3. Past Inspection Infractions</span>
                  <span className="font-mono font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {settings.riskWeights.inspectionHistory}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.riskWeights.inspectionHistory}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      riskWeights: { ...settings.riskWeights, inspectionHistory: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">Historical non-compliance records, show-cause notices, and adverse remarks.</p>
              </div>

              {/* Factor 4 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">4. GPS &amp; Geo-Verification Variance</span>
                  <span className="font-mono font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {settings.riskWeights.gpsVerification}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.riskWeights.gpsVerification}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      riskWeights: { ...settings.riskWeights, gpsVerification: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">Detects inspectors or beneficiaries verifying outside the official perimeter.</p>
              </div>

              {/* Factor 5 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">5. Statutory Compliance &amp; UC Defaults</span>
                  <span className="font-mono font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {settings.riskWeights.complianceHistory}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.riskWeights.complianceHistory}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      riskWeights: { ...settings.riskWeights, complianceHistory: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">Delayed Utilization Certificates (UC), PFMS mismatches, and audit objections.</p>
              </div>

              {/* Factor 6 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">6. Geographic Remoteness &amp; Operational Signals</span>
                  <span className="font-mono font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {settings.riskWeights.otherSignals}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={settings.riskWeights.otherSignals}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      riskWeights: { ...settings.riskWeights, otherSignals: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">Terrain accessibility, border district considerations, and staff attrition.</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: INSPECTION & GEOFENCING RULES */}
        {/* ==================================================== */}
        {activeTab === 'inspection' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Physical Inspection &amp; Geofencing Enforcement</h2>
              <p className="text-xs text-slate-500">
                Define the mandatory on-ground thresholds that inspectors and centers must fulfill.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Geofence Tolerance Perimeter</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {settings.geofenceRadiusMeters} meters
                  </span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="500"
                  step="25"
                  value={settings.geofenceRadiusMeters}
                  onChange={(e) => setSettings({ ...settings, geofenceRadiusMeters: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Officer must be within this physical radius of the institute to submit an inspection report.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Mandatory Watermarked Photos</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {settings.mandatoryPhotosCount} photos
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={settings.mandatoryPhotosCount}
                  onChange={(e) => setSettings({ ...settings, mandatoryPhotosCount: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Minimum number of geotagged evidence photographs required to complete an inspection.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Minimum Monthly CCTV Uptime</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {settings.minCctvUptimePercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="99"
                  value={settings.minCctvUptimePercent}
                  onChange={(e) => setSettings({ ...settings, minCctvUptimePercent: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Centers falling below this percentage are automatically flagged for physical surprise inspection.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Offline Caching &amp; Background Sync</span>
                    <p className="text-[11px] text-slate-500">Allows mobile officers in rural/remote zones to draft inspections offline.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.offlineSyncEnabled}
                    onChange={(e) => setSettings({ ...settings, offlineSyncEnabled: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Auto Surprise Inspection on Critical AI Anomaly</span>
                    <p className="text-[11px] text-slate-500">Auto-assigns nearest district officer when risk score crosses 80 points.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoSurpriseAuditTrigger}
                    onChange={(e) => setSettings({ ...settings, autoSurpriseAuditTrigger: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: NOTIFICATIONS & ALERTS */}
        {/* ==================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Notification Triggers &amp; Official Alert Dispatch</h2>
              <p className="text-xs text-slate-500">
                Manage automated alerts sent to Ministry leadership, State Directors, and District Magistrates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monitoring Officer Email Address
                </label>
                <input
                  type="email"
                  value={settings.alertEmailRecipient}
                  onChange={(e) => setSettings({ ...settings, alertEmailRecipient: e.target.value })}
                  placeholder="monitoring-officer@dosje.gov.in"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 text-slate-900 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">Recipient for high-risk summaries, CCTV outage digests, and show-cause alerts.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Executive Digest Frequency
                </label>
                <select
                  value={settings.emailDigestFrequency}
                  onChange={(e: any) => setSettings({ ...settings, emailDigestFrequency: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 text-slate-900 font-semibold"
                >
                  <option value="IMMEDIATE">Immediate (Real-Time per Critical Incident)</option>
                  <option value="DAILY">Daily Consolidated Briefing (08:00 AM IST)</option>
                  <option value="WEEKLY">Weekly Administrative Digest</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800">SMS Gateway Alerts</span>
                  <p className="text-[11px] text-slate-500">Send instant SMS notifications for sudden roll-call cancellations or offline cameras.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.smsAlertsEnabled}
                  onChange={(e) => setSettings({ ...settings, smsAlertsEnabled: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800">WhatsApp Official Bot Alerts</span>
                  <p className="text-[11px] text-slate-500">Push inspection assignment links &amp; VC requests directly via WhatsApp Business API.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.whatsappAlertsEnabled}
                  onChange={(e) => setSettings({ ...settings, whatsappAlertsEnabled: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0"
                />
              </label>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 6: SECURITY & ACCESS CONTROL */}
        {/* ==================================================== */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Security &amp; Audit Compliance Parameters</h2>
              <p className="text-xs text-slate-500">
                National Informatics Centre (NIC) and CERT-In security compliance rules for administrative access.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Session Inactivity Auto-Logout
                </label>
                <select
                  value={settings.sessionTimeoutMinutes}
                  onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 text-slate-900 font-semibold"
                >
                  <option value={15}>15 Minutes (Strict Security Mode)</option>
                  <option value={30}>30 Minutes (Recommended)</option>
                  <option value={60}>60 Minutes (Standard Operation)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Mandatory 2FA for Administrators</span>
                    <p className="text-[11px] text-slate-500">Enforce OTP verification for Super Admins and Ministry officials.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enforce2FA}
                    onChange={(e) => setSettings({ ...settings, enforce2FA: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Watermark Exported PDF Dossiers</span>
                    <p className="text-[11px] text-slate-500">Embed officer name, IP address, and date stamp on all generated inspection reports.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.watermarkExportedReports}
                    onChange={(e) => setSettings({ ...settings, watermarkExportedReports: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0"
                  />
                </label>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold">Audit Ledger &amp; Role-Based Access Control</div>
                <div className="text-[11px] text-slate-400">
                  Manage individual official credentials, assign jurisdiction states, or view cryptographic audit trails.
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {onNavigateToView && (
                  <>
                    <button
                      onClick={() => onNavigateToView('users')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      Manage Users
                    </button>
                    <button
                      onClick={() => onNavigateToView('audit-logs')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                    >
                      Audit Trail
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
