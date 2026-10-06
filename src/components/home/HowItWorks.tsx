import React from 'react';
import { UserCheck, Activity, Send, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Register / Login',
      desc: 'Authorized NGO superintendents, field inspection officers, and state supervisors sign in with verified credentials.',
      icon: UserCheck,
    },
    {
      step: '02',
      title: 'Monitor Activities',
      desc: 'Centers record daily attendance, service delivery metrics, and maintenance telemetry across sanctioned schemes.',
      icon: Activity,
    },
    {
      step: '03',
      title: 'Submit Reports',
      desc: 'NGOs upload periodic progress, beneficiary rosters, and audited fund utilization statements with supporting evidence.',
      icon: Send,
    },
    {
      step: '04',
      title: 'Review & Verify',
      desc: 'Department officials scrutinize dossiers, evaluate on-site inspection findings, and endorse statutory clearances.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-[#0B4A99] text-xs font-bold uppercase tracking-wider">
            <span>Workflow Architecture</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            How Satya Nirakshak Works
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A seamless, 4-step digital pipeline connecting grassroots social facilities to centralized administrative verification.
          </p>
        </div>

        {/* 4 Steps Cards Grid with Arrows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative bg-white p-6 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  {/* Step Number Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-extrabold text-[#0B4A99] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                      STEP {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0B4A99] border border-blue-100 flex items-center justify-center group-hover:bg-[#0B4A99] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-[#0B2545] mb-2 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Step Flow indicator on bottom */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Phase {item.step} of 04</span>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400 hidden lg:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
