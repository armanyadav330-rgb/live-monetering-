import React from 'react';
import { Activity, ClipboardCheck, FileSpreadsheet, HeartHandshake, ShieldCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      title: 'NGO Activity Monitoring',
      desc: 'Real-time oversight of daily facility operations, registered beneficiary presence, and ground service continuity across verified welfare centers.',
      icon: Activity,
      badge: 'Live Telemetry',
    },
    {
      title: 'Field Inspections',
      desc: 'Systematic ground verifications conducted by authorized inspection officers with geo-fenced GPS tracking, statutory checklists, and physical evidence.',
      icon: ClipboardCheck,
      badge: 'On-Site Audits',
    },
    {
      title: 'Digital Report Submission',
      desc: 'Streamlined digital submission of Monthly Activity Reports, Project Progress Dossiers, and Fund Utilization statements with supporting document archives.',
      icon: FileSpreadsheet,
      badge: 'Paperless Filing',
    },
    {
      title: 'Public Impact & Accountability',
      desc: 'Transparent verification ensuring government grant-in-aid and public contributions translate directly into measurable welfare for marginalized citizens.',
      icon: HeartHandshake,
      badge: 'Verified Impact',
    },
  ];

  return (
    <section id="about" className="py-14 sm:py-20 bg-slate-50/60 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-[#0B4A99] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>About Satya Nirakshak</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            Promoting Transparency & Accountability in Social Welfare
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Satya Nirakshak is an official digital oversight ecosystem engineered to bridge social welfare organizations, field inspection authorities, and departmental administration under one unified transparency framework.
          </p>
        </div>

        {/* 4 Clean Focus Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-blue-50 text-[#0B4A99] border border-blue-100 flex items-center justify-center group-hover:bg-[#0B4A99] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0B2545] mb-2 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
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
