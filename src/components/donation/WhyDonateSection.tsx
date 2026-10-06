import React from 'react';
import {
  ShieldCheck,
  Eye,
  HeartHandshake,
  CheckCircle2,
  Lock,
  FileCheck2,
  Users2,
  Sparkles,
} from 'lucide-react';

export const WhyDonateSection: React.FC = () => {
  const points = [
    {
      title: 'Transparent Use of Funds',
      icon: Eye,
      color: 'text-slate-800 bg-slate-100 border-slate-300',
      description:
        'Every rupee received is publicly tracked with live audited financial statements. Real-time CCTV and geotagged field reports verify that all resources reach the designated ground programs.',
      badge: '100% Audited',
    },
    {
      title: 'Direct Community Impact',
      icon: HeartHandshake,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      description:
        'Over 91% of every contribution is directly deployed into ground beneficiaries, student scholarships, meal logistics, and healthcare clinics, keeping overhead minimal.',
      badge: '91%+ Direct Deployment',
    },
    {
      title: 'Real Stories, Real Change',
      icon: Users2,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      description:
        'We measure our success not through empty claims, but through verified beneficiary transformations, academic diplomas, recovered health, and sustainable self-reliance.',
      badge: 'Biometric Verified',
    },
    {
      title: 'Secure Donations & 80G Benefit',
      icon: Lock,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      description:
        'All donations are encrypted through 256-bit bank-grade SSL security. Donors receive an automated digital receipt and 80G tax exemption certificate eligible for 50% deduction.',
      badge: 'Sec 80G Certified',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guaranteed Integrity & Accountability</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Why Your Support Matters
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Every contribution helps our NGO support vulnerable people, improve communities,
            provide life-changing opportunities, and build sustainable social impact that lasts
            for generations.
          </p>
        </div>

        {/* 4 Visual Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start gap-4 text-left"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${pt.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{pt.title}</span>
                    </h3>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {pt.badge}
                    </span>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pt.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Government Regulatory Compliance Banner */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-lg shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                Compliant with DoSJE & NGO Darpan Governance Guidelines
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Registered under Societies Registration Act · Unique Darpan ID: DL/2021/0294819
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Section 12A & 80G Certified</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
