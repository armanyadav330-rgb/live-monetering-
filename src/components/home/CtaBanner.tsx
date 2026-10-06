import React from 'react';
import { ArrowRight, ShieldCheck, LogIn } from 'lucide-react';

interface CtaBannerProps {
  onAccessPortal: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onAccessPortal }) => {
  return (
    <section className="bg-[#0B4A99] text-white py-14 sm:py-18 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
      <div className="max-w-4xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-100 border border-white/20 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
          <span>Government of India Standards</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Building a More Transparent NGO Ecosystem
        </h2>

        <p className="text-xs sm:text-sm lg:text-base text-blue-100 font-normal leading-relaxed max-w-2xl mx-auto">
          Empowering social organizations, field inspection authorities, and departmental administration with digital accountability to ensure every social rupee reaches genuine beneficiaries.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onAccessPortal}
            className="bg-white hover:bg-slate-100 active:bg-slate-200 text-[#0B4A99] px-8 py-3.5 rounded-md text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer select-none"
          >
            <LogIn className="w-4 h-4 text-[#0B4A99]" />
            <span>Access Portal</span>
            <ArrowRight className="w-4 h-4 text-[#0B4A99]" />
          </button>
        </div>
      </div>
    </section>
  );
};
