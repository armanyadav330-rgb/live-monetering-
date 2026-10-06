import React from 'react';
import { Send, FileText, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface ReportingSectionProps {
  onSubmitReportClick: () => void;
}

export const ReportingSection: React.FC<ReportingSectionProps> = ({
  onSubmitReportClick,
}) => {
  return (
    <section id="reports" className="py-14 sm:py-20 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-[#0B4A99] text-xs font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                <span>Digital Compliance Desk</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2545] tracking-tight">
                Report. Review. Improve.
              </h2>

              <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
                NGO field reports can be submitted digitally and reviewed by authorized administrators. Our streamlined submission workflow eliminates administrative delays, accelerates scheme grants, and provides an audited paperless compliance record.
              </p>

              {/* 4 Value Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Periodic Activity Filings</span>
                    <span className="text-[11px] text-slate-500">Monthly progress, camp rosters & beneficiary counts</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Fund Utilization Accounts</span>
                    <span className="text-[11px] text-slate-500">Expenditure statements, invoices & CA certificates</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Supporting Evidence Vault</span>
                    <span className="text-[11px] text-slate-500">Upload PDF, JPG/PNG, and DOC statutory proofs</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Live Administrative Review</span>
                    <span className="text-[11px] text-slate-500">Real-time status updates and inspection feedback</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onSubmitReportClick}
                  className="bg-[#0B4A99] hover:bg-[#093C7D] active:bg-[#072F62] text-white px-6 sm:px-7 py-3 rounded-md text-sm sm:text-base font-bold shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer select-none"
                >
                  <Send className="w-4 h-4 text-blue-200" />
                  <span>Submit a Report</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Right Visual: Sample Report Dossier Preview */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-3.5 text-xs text-left shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono font-bold text-xs text-[#0B2545]">
                      REP-2026-0042
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded border border-blue-200">
                    Verified Digital Dossier
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-slate-900 text-sm block">
                    Monthly Activity & Beneficiary Progress Dossier
                  </span>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Authorized Institution · Scheme PM-AJAY Rehabilitation Wing
                  </p>
                </div>

                {/* Metric Summary Box */}
                <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Beneficiaries</span>
                    <span className="font-extrabold text-[#0B4A99] text-base">184 Reached</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Fund Utilization</span>
                    <span className="font-extrabold text-emerald-700 text-base">86.2% Burn</span>
                  </div>
                </div>

                {/* Status Trail */}
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center justify-between">
                  <span className="font-medium">Status: Scrutinized & Approved</span>
                  <span className="font-bold font-mono">APPROVED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
