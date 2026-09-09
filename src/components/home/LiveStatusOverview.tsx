import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface LiveStatusOverviewProps {
  isDarkMode: boolean;
  lang: 'EN' | 'HI';
  onLaunchDashboard: () => void;
  onOpenDocs?: () => void;
}

export const LiveStatusOverview: React.FC<LiveStatusOverviewProps> = ({
  isDarkMode: _isDarkMode,
  lang,
  onLaunchDashboard,
  onOpenDocs = () => {},
}) => {
  const regions = [
    {
      name:
        lang === 'HI'
          ? 'उत्तरी ग्रिड • North (दिल्ली / पंजाब / हरियाणा / उप्र)'
          : 'Northern Grid • North (Delhi / PB / HR / UP)',
      latency: '5.2ms',
      status: lang === 'HI' ? 'कार्यशील' : 'Operational',
      uptime: '99.99%',
      load: '32%',
    },
    {
      name:
        lang === 'HI'
          ? 'पश्चिमी ग्रिड • West (महाराष्ट्र / गुजरात / राजस्थान)'
          : 'Western Grid • West (MH / GJ / RJ)',
      latency: '6.8ms',
      status: lang === 'HI' ? 'कार्यशील' : 'Operational',
      uptime: '100%',
      load: '28%',
    },
    {
      name:
        lang === 'HI'
          ? 'दक्षिणी ग्रिड • South (कर्नाटक / तमिलनाडु / आंध्र / तेलंगाना)'
          : 'Southern Grid • South (KA / TN / AP / TS)',
      latency: '7.4ms',
      status: lang === 'HI' ? 'कार्यशील' : 'Operational',
      uptime: '99.98%',
      load: '41%',
    },
    {
      name:
        lang === 'HI'
          ? 'पूर्वी एवं पूर्वोत्तर ग्रिड • East & NE (प. बंगाल / असम / ओडिशा)'
          : 'Eastern & NE Grid • East (WB / AS / OD)',
      latency: '9.1ms',
      status: lang === 'HI' ? 'कार्यशील' : 'Operational',
      uptime: '99.95%',
      load: '36%',
    },
  ];

  return (
    <section id="status" className="py-14 sm:py-16 bg-white border-t border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* REGIONAL CLUSTER STATUS */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-black border border-slate-300 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {lang === 'HI'
                    ? 'राष्ट्रीय ग्रिड स्वास्थ्य • National Grid Live Telemetry'
                    : 'National Grid Telemetry • Real-time Node Status'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black">
                {lang === 'HI'
                  ? 'लाइव क्षेत्रीय क्लस्टर स्थिति'
                  : 'Live Regional Cluster Telemetry'}
              </h2>
              <p className="text-xs sm:text-sm text-black font-semibold mt-1">
                {lang === 'HI'
                  ? 'देशभर के क्षेत्रीय सर्वर नोड्स और डेटा गेटवे से प्राप्त वास्तविक समय की कनेक्टिविटी व पिंग स्थिति।'
                  : 'Real-time connectivity, latency, and operational health metrics from regional government data gateways.'}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-black border border-slate-300 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {lang === 'HI' ? 'सभी क्षेत्रीय नोड पूर्णतया सक्रिय' : 'All Regional Nodes Operational'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regions.map((reg, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-black shadow-xs transition"
              >
                <div className="flex items-start justify-between text-xs gap-2">
                  <span className="font-black text-black leading-tight">{reg.name}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-black font-mono text-black">
                    {reg.latency}
                  </span>
                  <span className="text-[11px] font-bold text-black">
                    {lang === 'HI' ? 'अपटाइम' : 'Uptime'} {reg.uptime}
                  </span>
                </div>

                <div className="mt-2 text-[10px] text-black flex items-center justify-between border-t border-slate-200 pt-2 font-mono font-bold">
                  <span>{lang === 'HI' ? 'सर्वर लोड:' : 'Server Load:'} {reg.load}</span>
                  <span className="text-black font-black">{reg.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
