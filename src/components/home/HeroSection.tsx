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
  lang: 'EN' | 'HI';
  onStartMonitoring: () => void;
  onExploreDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isDarkMode,
  lang,
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
    <section className="relative overflow-hidden pt-8 sm:pt-12 pb-16 lg:pb-20 bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header with Authentic Government Identity & DigiLocker Clean Style */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          {/* Official GOI Emblem & Ministry Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-white text-black border border-slate-300 shadow-2xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF671F] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF671F]" />
            </span>
            <span className="text-black font-bold">
              {lang === 'HI'
                ? 'भारत सरकार • सामाजिक न्याय और अधिकारिता मंत्रालय | सामाजिक न्याय एवं अधिकारिता विभाग'
                : 'Government of India • Ministry of Social Justice and Empowerment | Department of Social Justice & Empowerment'}
            </span>
          </div>

          {/* Main Headline in Solid High-Contrast Black */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-black">
            {lang === 'HI' ? (
              <>
                राष्ट्रीय संस्थागत निगरानी एवं{' '}
                <span className="text-black underline decoration-[#FF671F] decoration-4 underline-offset-8">
                  निरीक्षण कमान
                </span>
              </>
            ) : (
              <>
                National Institutional Live Surveillance &amp;{' '}
                <span className="text-black underline decoration-[#FF671F] decoration-4 underline-offset-8">
                  Inspection Command Grid
                </span>
              </>
            )}
          </h1>
          <div className="text-xs sm:text-sm font-black text-black uppercase tracking-wider">
            {lang === 'HI'
              ? 'राष्ट्रीय संस्थागत निगरानी एवं ऑडिट कमान ग्रिड'
              : 'National Institutional Live Surveillance & Audit Command Grid'}
          </div>

          {/* Simple, Understandable Citizen Explanation in Crisp Black Text */}
          <p className="text-sm sm:text-base text-black max-w-3xl mx-auto leading-relaxed font-semibold">
            {lang === 'HI' ? (
              <>
                देश भर के <strong>1,200+ अनुदान-प्राप्त वृद्धाश्रमों, नशा मुक्ति केंद्रों (IRCAs) और दिव्यांगजन पुनर्वास संस्थानों</strong> में 24×7 लाइव सीसीटीवी टेलीमेट्री, बायोमेट्रिक उपस्थिति मिलान, औचक वीडियो कॉल और एआई विसंगति ऑडिट की केंद्रीय डिजिटल प्रणाली।
              </>
            ) : (
              <>
                Central digital oversight grid enabling <strong>24×7 live CCTV telemetry, biometric attendance reconciliation, surprise video inspections, and AI anomaly auditing</strong> across 1,200+ grant-in-aid senior citizen homes, de-addiction centers (IRCAs), and rehabilitation institutes nationwide.
              </>
            )}
          </p>

          {/* DigiLocker-Style Quick Search / Verification Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="p-2 rounded-2xl border border-slate-300 bg-white transition-all shadow-md flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2.5 px-3 py-2 w-full text-black">
                <span className="text-lg">🔍</span>
                <input
                  type="text"
                  placeholder={
                    lang === 'HI'
                      ? 'संस्थान, जिला या विशिष्ट पहचान संख्या खोजें (e.g. Suraksha Home, Delhi, NGO-102)...'
                      : 'Search institution, district, or registration ID (e.g. Suraksha Home, Delhi, NGO-102)...'
                  }
                  className="w-full bg-transparent text-xs sm:text-sm text-black placeholder:text-slate-600 font-bold focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onStartMonitoring();
                  }}
                />
              </div>
              <button
                onClick={onStartMonitoring}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shrink-0 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <span>{lang === 'HI' ? 'सत्यापित करें' : 'Verify'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* DigiLocker Quick Filter Badges */}
            <div className="pt-2.5 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs font-bold text-black">
              <span className="text-black text-[10px] sm:text-xs font-bold">
                {lang === 'HI' ? 'त्वरित श्रेणियां:' : 'Quick Categories:'}
              </span>
              <button
                onClick={onExploreDemo}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-black border border-slate-300 transition cursor-pointer font-bold"
              >
                {lang === 'HI' ? '👴 वृद्धाश्रम' : '👴 Senior Citizen Homes'}
              </button>
              <button
                onClick={onExploreDemo}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-black border border-slate-300 transition cursor-pointer font-bold"
              >
                {lang === 'HI' ? '🚭 नशा मुक्ति केंद्र (IRCAs)' : '🚭 De-Addiction Centers (IRCAs)'}
              </button>
              <button
                onClick={onExploreDemo}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-black border border-slate-300 transition cursor-pointer font-bold"
              >
                {lang === 'HI' ? '♿ दिव्यांगजन केंद्र (DDRS)' : '♿ Divyangjan Centers (DDRS)'}
              </button>
            </div>
          </div>

          {/* Action CTAs in Sovereign Colors */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onStartMonitoring}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FF671F] to-[#E65100] hover:from-[#e55917] hover:to-[#c94500] text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-amber-300/40"
            >
              <Zap className="w-4 h-4 text-amber-200" />
              <span>{lang === 'HI' ? 'कमांड पोर्टल में प्रवेश करें' : 'Enter Command Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm border-2 border-slate-300 bg-white hover:bg-slate-50 text-black hover:border-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 text-black fill-black" />
              <span>{lang === 'HI' ? 'लाइव सीसीटीवी ग्रिड देखें' : 'View Live CCTV Grid'}</span>
            </button>
          </div>

          {/* Quick Role-based Access Guide (DigiLocker High-Contrast Cards with Solid Black Text) */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div
              onClick={onStartMonitoring}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-black shadow-xs transition cursor-pointer group"
            >
              <div className="text-xl">🏢</div>
              <div className="font-black text-xs sm:text-sm text-black mt-1 group-hover:underline transition">
                {lang === 'HI' ? 'संस्थान एवं एनजीओ' : 'Institutions & NGOs'}
              </div>
              <div className="text-[11px] text-black mt-1 font-bold leading-tight">
                {lang === 'HI' ? 'कैमरे व बायोमेट्रिक उपस्थिति जोड़ें' : 'Configure CCTV feeds & attendance'}
              </div>
            </div>

            <div
              onClick={onStartMonitoring}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-black shadow-xs transition cursor-pointer group"
            >
              <div className="text-xl">🕵️‍♂️</div>
              <div className="font-black text-xs sm:text-sm text-black mt-1 group-hover:underline transition">
                {lang === 'HI' ? 'निरीक्षण अधिकारी' : 'Inspection Officers'}
              </div>
              <div className="text-[11px] text-black mt-1 font-bold leading-tight">
                {lang === 'HI' ? 'सरप्राइज वीडियो कॉल व ऑन-साइट रिपोर्ट' : 'Surprise video calls & field reports'}
              </div>
            </div>

            <div
              onClick={onStartMonitoring}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-black shadow-xs transition cursor-pointer group"
            >
              <div className="text-xl">🏛️</div>
              <div className="font-black text-xs sm:text-sm text-black mt-1 group-hover:underline transition">
                {lang === 'HI' ? 'जिला कल्याण प्रशासन (DSWO)' : 'District Authorities (DSWO)'}
              </div>
              <div className="text-[11px] text-black mt-1 font-bold leading-tight">
                {lang === 'HI' ? 'क्षेत्रीय विसंगतियां व सत्यापन स्थिति' : 'Regional anomalies & grant verification'}
              </div>
            </div>

            <div
              onClick={onStartMonitoring}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-black shadow-xs transition cursor-pointer group"
            >
              <div className="text-xl">🇮🇳</div>
              <div className="font-black text-xs sm:text-sm text-black mt-1 group-hover:underline transition">
                {lang === 'HI' ? 'केंद्रीय मंत्रालय' : 'Central Ministry Apex'}
              </div>
              <div className="text-[11px] text-black mt-1 font-bold leading-tight">
                {lang === 'HI' ? 'राष्ट्रीय ऑडिट, बजट व कैग अनुमोदन' : 'National audit, budget & CAG clearance'}
              </div>
            </div>
          </div>
        </div>

        {/* HERO VISUAL / INTERACTIVE MOCKUP */}
        <div id="preview" className="mt-10 sm:mt-12 max-w-5xl mx-auto scroll-mt-24">
          <div
            className="rounded-2xl border border-slate-200 p-3 sm:p-5 shadow-2xl transition-all bg-white text-black"
          >
            {/* Mockup Window Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5 flex-wrap min-w-0">
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono font-bold text-black pl-1 truncate max-w-[200px] xs:max-w-none">
                  live-cluster-01.monitoring.dosje.gov.in
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-black border border-slate-300 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  CONNECTED
                </span>
              </div>

              {/* View Switcher Tabs & Live Sim Toggle */}
              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-bold border border-slate-300 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveTab('metrics')}
                    className={`px-2.5 py-1 rounded-md transition whitespace-nowrap cursor-pointer ${
                      activeTab === 'metrics'
                        ? 'bg-black text-white shadow-xs'
                        : 'text-black hover:bg-slate-200'
                    }`}
                  >
                    {lang === 'HI' ? 'टेलीमेट्री' : 'Telemetry'}
                  </button>
                  <button
                    onClick={() => setActiveTab('cctv')}
                    className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                      activeTab === 'cctv'
                        ? 'bg-black text-white shadow-xs'
                        : 'text-black hover:bg-slate-200'
                    }`}
                  >
                    <Video className="w-3 h-3" />
                    <span>{lang === 'HI' ? 'सीसीटीवी ग्रिड' : 'CCTV Grid'}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('anomalies')}
                    className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                      activeTab === 'anomalies'
                        ? 'bg-black text-white shadow-xs'
                        : 'text-black hover:bg-slate-200'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    <span>{lang === 'HI' ? 'एआई रडार' : 'AI Radar'}</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition shrink-0 cursor-pointer ${
                    isSimulating
                      ? 'border-black text-black bg-slate-100'
                      : 'border-slate-300 text-slate-500 bg-white'
                  }`}
                  title={
                    isSimulating
                      ? lang === 'HI'
                        ? 'सिमुलेशन सक्रिय (रोकने हेतु क्लिक करें)'
                        : 'Simulation Active (Click to pause)'
                      : lang === 'HI'
                        ? 'सिमुलेशन रुका हुआ'
                        : 'Simulation Paused'
                  }
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-black' : 'text-slate-500'}`} />
                </button>
              </div>
            </div>

            {/* LIVE ALERT BANNER (Dismissable / Interactive) */}
            {!alertDismissed && (
              <div className="mt-3 p-2.5 rounded-xl bg-white border border-slate-300 text-black shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-start sm:items-center gap-2">
                  <span className="p-1 rounded-md bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-bold text-black leading-snug">
                    {lang === 'HI'
                      ? 'स्वचालित अलर्ट: सीसीटीवी फीड नोड-07 (देहरादून आश्रम) में लेटेंसी 24ms दर्ज। एआई द्वारा बैकअप गेटवे पर पुनः रूट किया गया।'
                      : 'Automated Alert: CCTV Feed Node-07 (Dehradun Shelter) packet latency spiked to 24ms. AI Re-routed via Backup Gateway.'}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={onExploreDemo}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-[11px] text-black cursor-pointer"
                  >
                    {lang === 'HI' ? 'जांचें' : 'Inspect'}
                  </button>
                  <button
                    onClick={() => setAlertDismissed(true)}
                    className="text-black font-bold hover:underline text-xs px-1 cursor-pointer"
                  >
                    {lang === 'HI' ? 'हटाएं' : 'Dismiss'}
                  </button>
                </div>
              </div>
            )}

            {/* QUICK STATS STRIP (CPU, Latency, Streams, Uptime) - DigiLocker Pure White & Black Typography */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs text-black"
              >
                <div className="flex items-center justify-between text-xs text-black font-bold">
                  <span>{lang === 'HI' ? 'सिस्टम सीपीयू' : 'System CPU'}</span>
                  <Cpu className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-black text-black">
                    {telemetry.cpu}%
                  </span>
                  <span className="text-[10px] font-bold text-black bg-slate-100 px-1.5 py-0.2 rounded border border-slate-300">
                    {lang === 'HI' ? 'सामान्य' : 'Normal'}
                  </span>
                </div>
                <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-black h-full rounded-full transition-all duration-500"
                    style={{ width: `${telemetry.cpu}%` }}
                  />
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs text-black"
              >
                <div className="flex items-center justify-between text-xs text-black font-bold">
                  <span>{lang === 'HI' ? 'सक्रिय सीसीटीवी' : 'Active CCTV Streams'}</span>
                  <Radio className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-black text-black">
                    {telemetry.activeStreams}
                  </span>
                  <span className="text-[10px] font-bold text-black flex items-center gap-0.5 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {lang === 'HI' ? 'लाइव' : 'LIVE'}
                  </span>
                </div>
                <div className="mt-1.5 text-[10px] font-bold text-black">
                  {lang === 'HI' ? `${telemetry.throughput} वास्तविक समय` : `${telemetry.throughput} Real-Time`}
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs text-black"
              >
                <div className="flex items-center justify-between text-xs text-black font-bold">
                  <span>{lang === 'HI' ? 'नेटवर्क विलंबता' : 'Network Latency'}</span>
                  <Activity className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-black text-black font-mono">
                    {telemetry.latency} ms
                  </span>
                  <span className="text-[10px] font-bold text-black bg-slate-100 px-1.5 py-0.2 rounded border border-slate-300">
                    {lang === 'HI' ? 'उत्कृष्ट' : 'Optimal'}
                  </span>
                </div>
                <div className="mt-1.5 text-[10px] font-bold text-black">
                  {lang === 'HI' ? 'एनआईसी क्लाउड एज पिंग' : 'NIC Cloud Edge Ping'}
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs text-black"
              >
                <div className="flex items-center justify-between text-xs text-black font-bold">
                  <span>{lang === 'HI' ? 'क्लस्टर अपटाइम' : 'Cluster Uptime'}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl sm:text-2xl font-black text-black font-mono">
                    {telemetry.uptime}
                  </span>
                  <span className="text-[10px] font-bold text-black bg-slate-100 px-1.5 py-0.2 rounded border border-slate-300">
                    100% SLA
                  </span>
                </div>
                <div className="mt-1.5 text-[10px] font-bold text-black">
                  {lang === 'HI' ? '365 दिवस अविरत सेवा' : '365-Day Uninterrupted'}
                </div>
              </div>
            </div>

            {/* TAB CONTENT: REAL-TIME CHARTS & FEEDS */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              {activeTab === 'metrics' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-black">
                    <div className="flex items-center gap-2 font-black text-black">
                      <TrendingUp className="w-4 h-4 text-black" />
                      <span>{lang === 'HI' ? 'लाइव क्लस्टर थ्रूपुट एवं लोड सूचकांक' : 'Live Cluster Throughput & Load Index'}</span>
                    </div>
                    <span className="font-mono text-[10px] text-black font-bold">
                      {lang === 'HI' ? 'अद्यतन: अभी (अंतराल 2.8s)' : 'Updated: Just now (Interval 2.8s)'}
                    </span>
                  </div>

                  {/* High-Contrast Telemetry Area Chart */}
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="heroLoadGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#000000" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#000000" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="time"
                          stroke="#000000"
                          fontSize={10}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#000000"
                          fontSize={10}
                          domain={[0, 100]}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderColor: '#000000',
                            borderRadius: '0.5rem',
                            fontSize: '11px',
                            color: '#000000',
                            fontWeight: 'bold',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="load"
                          stroke="#000000"
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
                    {
                      id: 'CAM-01',
                      name: lang === 'HI' ? 'मुख्य भोजन व सभा कक्ष' : 'Main Dining & Assembly Hall',
                      fps: '30 FPS',
                      status: 'LIVE',
                      latency: '6ms',
                    },
                    {
                      id: 'CAM-02',
                      name: lang === 'HI' ? 'बायोमेट्रिक प्रवेश द्वार व स्वागत' : 'Biometric Gate & Reception',
                      fps: '30 FPS',
                      status: 'LIVE',
                      latency: '8ms',
                    },
                    {
                      id: 'CAM-03',
                      name: lang === 'HI' ? 'व्यावसायिक प्रशिक्षण प्रयोगशाला 2' : 'Vocational Training Lab 2',
                      fps: '25 FPS',
                      status: 'LIVE',
                      latency: '7ms',
                    },
                  ].map((cam) => (
                    <div
                      key={cam.id}
                      onClick={onExploreDemo}
                      className="p-3 rounded-xl bg-black text-white relative overflow-hidden border border-black hover:shadow-lg transition-all flex flex-col justify-between h-40 cursor-pointer group"
                      title={lang === 'HI' ? 'इंटरैक्टिव सीसीटीवी मॉनिटर खोलें' : 'Click to launch interactive CCTV Monitor'}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="bg-red-600 px-1.5 py-0.5 rounded font-bold tracking-wider flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          {cam.status}
                        </span>
                        <span className="font-mono text-slate-300 font-bold">{cam.fps} · {cam.latency}</span>
                      </div>

                      <div className="text-center py-2">
                        <Video className="w-8 h-8 text-slate-400 group-hover:text-white mx-auto transition-colors" />
                        <div className="text-xs font-bold mt-1 text-white transition-colors">{cam.id}</div>
                        <div className="text-[10px] text-slate-300 truncate font-semibold">{cam.name}</div>
                        <div className="text-[9px] text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity font-bold mt-0.5">
                          {lang === 'HI' ? 'स्ट्रीम देखने हेतु क्लिक करें →' : 'Click to expand stream →'}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-emerald-400 border-t border-slate-800 pt-1 font-mono font-bold">
                        <span>{lang === 'HI' ? 'एआई गति: सामान्य' : 'AI Motion: Normal'}</span>
                        <span>Stream 1080p</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'anomalies' && (
                <div className="space-y-2.5">
                  {[
                    {
                      title: lang === 'HI' ? 'बायोमेट्रिक उपस्थिति में अंतर' : 'Biometric Attendance Variance',
                      entity: lang === 'HI' ? 'प्रेरणा पुनर्वास केंद्र' : 'Prerana Rehabilitation Center',
                      score: 94,
                      level: 'HIGH',
                    },
                    {
                      title: lang === 'HI' ? 'असामान्य समय में हलचल' : 'Off-Hours Movement Detected',
                      entity: lang === 'HI' ? 'सुरक्षा सीनियर होम' : 'Suraksha Senior Home',
                      score: 78,
                      level: 'MEDIUM',
                    },
                    {
                      title: lang === 'HI' ? 'निर्धारित ऑडिट लंबित' : 'Scheduled Audit Overdue',
                      entity: lang === 'HI' ? 'दीनदयाल संस्थान वार्ड 4' : 'Deen Dayal Institute Ward 4',
                      score: 88,
                      level: 'HIGH',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-white text-black flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-black text-black truncate">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-black font-semibold truncate">
                            {item.entity}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 text-black border border-slate-300">
                          {lang === 'HI' ? 'जोखिम' : 'Risk'} {item.score}/100
                        </span>
                        <button
                          onClick={onExploreDemo}
                          className="text-xs font-black text-black hover:underline cursor-pointer"
                        >
                          {lang === 'HI' ? 'देखें →' : 'View →'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Bar: Action to Launch Full Portal */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-black">
              <div className="flex items-center gap-2 text-black font-bold">
                <Radio className="w-3.5 h-3.5 text-black animate-pulse" />
                <span>
                  {lang === 'HI'
                    ? 'राष्ट्रीय मंत्रालय निगरानी ग्रिड के साथ समकालिक'
                    : 'Synchronized with National Ministry Monitoring Grid'}
                </span>
              </div>

              <button
                onClick={onStartMonitoring}
                className="font-black text-black hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{lang === 'HI' ? 'संपूर्ण परिचालन डैशबोर्ड खोलें' : 'Launch Full Operational Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
