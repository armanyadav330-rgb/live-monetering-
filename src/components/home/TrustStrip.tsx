import React from 'react';
import { Eye, FileCheck2, ClipboardCheck, Landmark } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const indicators = [
    {
      title: 'Transparent Monitoring',
      desc: 'Real-time ground telemetry & facility activity oversight',
      icon: Eye,
    },
    {
      title: 'Verified Reports',
      desc: 'Tamper-evident activity logs & utilization filings',
      icon: FileCheck2,
    },
    {
      title: 'Field Inspections',
      desc: 'Geo-tagged on-site verifications & photo evidence',
      icon: ClipboardCheck,
    },
    {
      title: 'Government Support Tracking',
      desc: 'Sanctioned grant accountability & scheme compliance',
      icon: Landmark,
    },
  ];

  return (
    <section className="bg-white border-b border-slate-200 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {indicators.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-slate-50/80 hover:bg-blue-50/50 p-4 rounded-xl border border-slate-200/90 hover:border-blue-200 transition-all flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100/70 text-[#0B4A99] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
