import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Play,
  Activity,
  Cpu,
  Radio,
  Server,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Video,
  ShieldCheck,
  RefreshCw,
  Zap,
  Eye,
  Sliders,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface HeroSectionProps {
  isDarkMode: boolean;
  onStartMonitoring: () => void;
  onExploreDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isDarkMode,
  onStartMonitoring,
  onExploreDemo,
}) => {
  // Interactive preview tab
  const [activeTab, setActiveTab] = useState<'metrics' | 'cctv' | 'anomalies'>('metrics');
  const [isSimulating, setIsSimulating] = useState(true);

  // Live telemetry state
  const [telemetry, setTelemetry] = useState({
    cpu: 34,
    memory: 61,
    latency: 7.8,
    activeStreams: 148,
    throughput: '1.42 GB/s',
    uptime: '99.99%',
  });

  // Dynamic chart data
  const [chartData, setChartData] = useState([
    { time: '10:00', load: 32, streams: 140, latency: 8.2 },
    { time: '10:05', load: 45, streams: 142, latency: 7.9 },
    { time: '10:10', load: 38, streams: 145, latency: 8.4 },
    { time: '10:15', load: 52, streams: 146, latency: 7.5 },
    { time: '10:20', load: 41, streams: 147, latency: 8.1 },
    { time: '10:25', load: 49, streams: 148, latency: 7.8 },
    { time: '10:30', load: 37, streams: 148, latency: 7.6 },
  ]);

  // Alert simulation state
  const [alertDismissed, setAlertDismissed] = useState(false);

  // Live interval ticker
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      const jitterCpu = Math.floor(28 + Math.random() * 22);
      const jitterLatency = Number((6.5 + Math.random() * 2.8).toFixed(1));
      const jitterStreams = 148 + Math.floor(Math.random() * 5);

      setTelemetry((prev) => ({
        ...prev,
        cpu: jitterCpu,
        latency: jitterLatency,
        activeStreams: jitterStreams,
      }));

      setChartData((prev) => {
        const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newEntry = {
          time: nextTime,
          load: jitterCpu,
          streams: jitterStreams,
          latency: jitterLatency,
        };
        return [...prev.slice(1), newEntry];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-12 pb-16 lg:pb-20">
      {/* Ambient background subtle wash */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl bg-gradient-to-b from-amber-500/5 via-slate-500/5 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header with Authentic Government Identity */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          {/* Official GOI Emblem & Ministry Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#0b2545]/10 dark:bg-white/10 text-[#0b2545] dark:text-amber-300 border border-[#0b2545]/20 dark:border-amber-400/30 shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF671F] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF671F]" />
            </span>
            <span>भारत सरकार • सामाजिक न्याय और अधिकारिता मंत्रालय | Department of Social Justice &amp; Empowerment</span>
          </div>

          {/* Bilingual Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-[#0b2545] dark:text-white">
            राष्ट्रीय संस्थागत निगरानी एवं{' '}
            <span className="bg-gradient-to-r from-[#FF671F] via-[#c94500] to-[#046A38] bg-clip-text text-transparent">
              निरीक्षण कमान
            </span>
          </h1>
          <div className="text-sm sm:text-base font-bold text-[#FF671F] uppercase tracking-wider">
            National Institutional Live Surveillance &amp; Audit Command Grid
          </div>

          {/* Simple, Understandable Citizen Explanation */}
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            देश भर के <strong>1,200+ अनुदान-प्राप्त वृद्धाश्रमों, नशा मुक्ति केंद्रों (IRCAs) और दिव्यांगजन पुनर्वास संस्थानों</strong> में 24×7 लाइव सीसीटीवी टेलीमेट्री, बायोमेट्रिक उपस्थिति मिलान, औचक वीडियो कॉल और एआई विसंगति ऑडिट की केंद्रीय प्रणाली। पारदर्शी शासन एवं सीधे लाभार्थियों तक सरकारी सहायता।
          </p>

          {/* Flagship Government Schemes Tags */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs">
            <span className="px-3 py-1 rounded-full font-bold bg-[#FF671F]/10 text-[#E65100] border border-[#FF671F]/30">
              🏛️ PM-AJAY (पीएम-अजय)
            </span>
            <span className="px-3 py-1 rounded-full font-bold bg-blue-500/10 text-[#0b2545] dark:text-blue-300 border border-blue-500/20">
              👴 AVAY (अटल वयो अभ्युदय - वृद्धाश्रम)
            </span>
            <span className="px-3 py-1 rounded-full font-bold bg-emerald-500/10 text-[#046A38] dark:text-emerald-400 border border-emerald-500/30">
              🚭 NMBA (नशा मुक्त भारत अभियान)
            </span>
            <span className="px-3 py-1 rounded-full font-bold bg-purple-500/10 text-purple-800 dark:text-purple-300 border border-purple-500/20">
              ♿ DDRS (दिव्यांगजन पुनर्वास योजना)
            </span>
          </div>

          {/* Action CTAs in Sovereign Colors */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onStartMonitoring}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FF671F] to-[#E65100] hover:from-[#e55917] hover:to-[#c94500] text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-amber-300/40"
            >
              <Zap className="w-4 h-4 text-amber-200" />
              <span>कमांड पोर्टल में प्रवेश करें (Enter Command Portal)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDemo}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:border-slate-600'
                  : 'border-[#0b2545]/40 bg-white hover:bg-slate-50 text-[#0b2545] hover:border-[#0b2545] shadow-xs'
              }`}
            >
              <Play className="w-4 h-4 text-[#FF671F] fill-[#FF671F]" />
              <span>लाइव सीसीटीवी ग्रिड देखें (View Live CCTV Grid)</span>
            </button>
          </div>

          {/* Quick Role-based Access Guide (Very User Friendly & Understandable) */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div
              onClick={onStartMonitoring}
              className={`p-3 rounded-xl border transition cursor-pointer group ${
                isDarkMode
                  ? 'bg-slate-900/70 border-slate-800 hover:border-amber-500/50'
                  : 'bg-white border-slate-200 hover:border-[#0b2545] shadow-xs'
              }`}
            >
              <div className="text-lg">🏢</div>
              <div className="font-bold text-xs text-[#0b2545] dark:text-white mt-1 group-hover:text-[#FF671F] transition">
                संस्थान एवं एनजीओ (NGOs)
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                कैमरे व बायोमेट्रिक उपस्थिति जोड़ें
              </div>
            </div>

            <div
              onClick={onStartMonitoring}
              className={`p-3 rounded-xl border transition cursor-pointer group ${
                isDarkMode
                  ? 'bg-slate-900/70 border-slate-800 hover:border-amber-500/50'
                  : 'bg-white border-slate-200 hover:border-[#0b2545] shadow-xs'
              }`}
            >
              <div className="text-lg">🕵️‍♂️</div>
              <div className="font-bold text-xs text-[#0b2545] dark:text-white mt-1 group-hover:text-[#FF671F] transition">
                निरीक्षण अधिकारी (Inspectors)
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                सरप्राइज वीडियो कॉल व ऑन-साइट रिपोर्ट
              </div>
            </div>

            <div
              onClick={onStartMonitoring}
              className={`p-3 rounded-xl border transition cursor-pointer group ${
                isDarkMode
                  ? 'bg-slate-900/70 border-slate-800 hover:border-amber-500/50'
                  : 'bg-white border-slate-200 hover:border-[#0b2545] shadow-xs'
              }`}
            >
              <div className="text-lg">🏛️</div>
              <div className="font-bold text-xs text-[#0b2545] dark:text-white mt-1 group-hover:text-[#FF671F] transition">
                जिला कल्याण प्रशासन (DSWO)
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                क्षेत्रीय विसंगतियां व सत्यापन स्थिति
              </div>
            </div>

            <div
              onClick={onStartMonitoring}
              className={`p-3 rounded-xl border transition cursor-pointer group ${
                isDarkMode
                  ? 'bg-slate-900/70 border-slate-800 hover:border-amber-500/50'
                  : 'bg-white border-slate-200 hover:border-[#0b2545] shadow-xs'
              }`}
            >
              <div className="text-lg">🇮🇳</div>
              <div className="font-bold text-xs text-[#0b2545] dark:text-white mt-1 group-hover:text-[#FF671F] transition">
                केंद्रीय मंत्रालय (Ministry Apex)
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                राष्ट्रीय ऑडिट, बजट व कैग अनुमोदन
              </div>
            </div>
          </div>
        </div>

        {/* HERO VISUAL / INTERACTIVE MOCKUP */}
        <div id="preview" className="mt-10 sm:mt-12 max-w-5xl mx-auto scroll-mt-24">
          <div
            className={`rounded-2xl border p-3 sm:p-5 shadow-2xl transition-all ${
              isDarkMode
                ? 'bg-slate-900/90 border-slate-700/80 shadow-black/50 backdrop-blur-xl'
                : 'bg-white/95 border-slate-200 shadow-slate-200/80 backdrop-blur-xl'
            }`}
          >
            {/* Mockup Window Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 pl-1 truncate max-w-[200px] xs:max-w-none">
                  live-cluster-01.monitoring.dosje.gov.in
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  CONNECTED
                </span>
              </div>

              {/* View Switcher Tabs & Live Sim Toggle */}
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveTab('metrics')}
                    className={`px-2.5 py-1 rounded-md transition whitespace-nowrap cursor-pointer ${
                      activeTab === 'metrics'
                        ? 'bg-[#0b2545] text-amber-300 dark:bg-slate-900 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Telemetry
                  </button>
                  <button
                    onClick={() => setActiveTab('cctv')}
                    className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                      activeTab === 'cctv'
                        ? 'bg-[#0b2545] text-amber-300 dark:bg-slate-900 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Video className="w-3 h-3" />
                    <span>CCTV Grid</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('anomalies')}
                    className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                      activeTab === 'anomalies'
                        ? 'bg-[#0b2545] text-amber-300 dark:bg-slate-900 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    <span>AI Radar</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition shrink-0 cursor-pointer ${
                    isSimulating
                      ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
                      : 'border-slate-300 dark:border-slate-700 text-slate-400'
                  }`}
                  title={isSimulating ? 'Simulation Active (Click to pause)' : 'Simulation Paused'}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* LIVE ALERT BANNER (Dismissable / Interactive) */}
            {!alertDismissed && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-semibold">
                    Automated Alert: CCTV Feed Node-07 (Dehradun Shelter) packet latency spiked to 24ms. AI Re-routed via Backup Gateway.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onExploreDemo}
                    className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 font-bold text-[11px] cursor-pointer"
                  >
                    Inspect
                  </button>
                  <button
                    onClick={() => setAlertDismissed(true)}
                    className="text-slate-400 hover:text-slate-600 text-xs px-1"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* QUICK STATS STRIP (CPU, Latency, Streams, Uptime) */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                className={`p-3 rounded-xl border transition ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>System CPU</span>
                  <Cpu className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {telemetry.cpu}%
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500">Normal</span>
                </div>
                <div className="mt-1.5 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${telemetry.cpu}%` }}
                  />
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border transition ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Active Live Streams</span>
                  <Radio className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {telemetry.activeStreams}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="mt-1.5 text-[10px] text-slate-400">
                  {telemetry.throughput} processed
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border transition ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Packet Latency</span>
                  <Activity className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                    {telemetry.latency} ms
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500">Ultra-Low</span>
                </div>
                <div className="mt-1.5 text-[10px] text-slate-400">
                  Global edge pings
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border transition ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Cluster Uptime</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {telemetry.uptime}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500">SLA Met</span>
                </div>
                <div className="mt-1.5 text-[10px] text-slate-400">
                  365 days monitored
                </div>
              </div>
            </div>

            {/* TAB CONTENT: REAL-TIME CHARTS & FEEDS */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              {activeTab === 'metrics' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span>Live Cluster Throughput &amp; Load Index</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">
                      Updated: Just now (Interval 2.8s)
                    </span>
                  </div>

                  {/* High-Contrast Telemetry Area Chart */}
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="heroLoadGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="time"
                          stroke={isDarkMode ? '#64748b' : '#94a3b8'}
                          fontSize={10}
                          tickLine={false}
                        />
                        <YAxis
                          stroke={isDarkMode ? '#64748b' : '#94a3b8'}
                          fontSize={10}
                          domain={[0, 100]}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                            borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                            borderRadius: '0.5rem',
                            fontSize: '11px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="load"
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#heroLoadGrad)"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'cctv' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'CAM-01', name: 'Main Dining & Assembly Hall', fps: '30 FPS', status: 'LIVE', latency: '6ms' },
                    { id: 'CAM-02', name: 'Biometric Gate & Reception', fps: '30 FPS', status: 'LIVE', latency: '8ms' },
                    { id: 'CAM-03', name: 'Vocational Training Lab 2', fps: '25 FPS', status: 'LIVE', latency: '7ms' },
                  ].map((cam) => (
                    <div
                      key={cam.id}
                      onClick={onExploreDemo}
                      className="p-3 rounded-xl bg-slate-950 text-white relative overflow-hidden border border-slate-800 hover:border-blue-500/70 hover:shadow-lg hover:shadow-blue-500/10 transition-all flex flex-col justify-between h-40 cursor-pointer group"
                      title="Click to launch interactive CCTV Monitor"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="bg-red-600 px-1.5 py-0.5 rounded font-bold tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          {cam.status}
                        </span>
                        <span className="font-mono text-slate-400">{cam.fps} · {cam.latency}</span>
                      </div>

                      <div className="text-center py-2">
                        <Video className="w-8 h-8 text-slate-500 group-hover:text-blue-400 mx-auto opacity-70 group-hover:opacity-100 transition-colors" />
                        <div className="text-xs font-bold mt-1 text-slate-200 group-hover:text-white transition-colors">{cam.id}</div>
                        <div className="text-[10px] text-slate-400 truncate">{cam.name}</div>
                        <div className="text-[9px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold mt-0.5">Click to expand stream &rarr;</div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-emerald-400 border-t border-slate-800 pt-1 font-mono">
                        <span>AI Motion: Normal</span>
                        <span>Stream 1080p</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'anomalies' && (
                <div className="space-y-2.5">
                  {[
                    { title: 'Biometric Attendance Variance', entity: 'Prerana Rehabilitation Center', score: 94, level: 'HIGH' },
                    { title: 'Off-Hours Movement Detected', entity: 'Suraksha Senior Home', score: 78, level: 'MEDIUM' },
                    { title: 'Scheduled Audit Overdue', entity: 'Deen Dayal Institute Ward 4', score: 88, level: 'HIGH' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isDarkMode ? 'bg-slate-800/50 border-slate-700/70' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {item.entity}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">
                          Risk {item.score}/100
                        </span>
                        <button
                          onClick={onExploreDemo}
                          className="text-xs font-bold text-blue-500 hover:text-blue-400"
                        >
                          View &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Bar: Action to Launch Full Portal */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>Synchronized with National Ministry Monitoring Grid</span>
              </div>

              <button
                onClick={onStartMonitoring}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Launch Full Operational Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
