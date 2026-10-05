import React from 'react';
import { Heart, ArrowDown, ShieldCheck, Sparkles, Award } from 'lucide-react';

interface DonationHeroProps {
  onDonateClick: () => void;
  onExploreImpactClick: () => void;
}

export const DonationHero: React.FC<DonationHeroProps> = ({
  onDonateClick,
  onExploreImpactClick,
}) => {
  return (
    <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-hidden bg-slate-950 text-white">
      {/* 1. Meaningful NGO / Community Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/donations/donation_hero.jpg"
          alt="Community Gathering and Child Support"
          className="w-full h-full object-cover object-center transform scale-105 motion-safe:transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Subtle dark gradient overlay for optimal typography legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/65" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950/90" />
      </div>

      {/* Decorative Blue & Sky Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 2. Foreground Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        {/* Official Statutory Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md text-xs sm:text-sm font-semibold text-sky-300 shadow-lg mb-6 transition">
          <Sparkles className="w-3.5 h-3.5 text-sky-300 shrink-0" />
          <span>Official Social Welfare Mission · 100% Tax Exemption (Sec 80G)</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white max-w-4xl mx-auto">
          Together, We Can <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-200 via-white to-sky-300 bg-clip-text text-transparent">
            Make a Difference
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-5 text-base sm:text-xl text-slate-200 max-w-3xl mx-auto font-normal leading-relaxed text-balance">
          Your contribution can help us create better opportunities, support communities,
          and bring meaningful change to those who need it most.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5">
          <button
            onClick={onDonateClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black text-base shadow-xl shadow-blue-900/40 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer ring-2 ring-blue-400/40"
          >
            <Heart className="w-5 h-5 fill-white text-white" />
            <span>Donate Now</span>
          </button>

          <button
            onClick={onExploreImpactClick}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>See Our Impact</span>
            <ArrowDown className="w-4 h-4 text-blue-200" />
          </button>
        </div>

        {/* 3 Trust Signals */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
            <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">80G Tax Deductible</div>
              <div className="text-[10px] text-slate-300">Instant Gov 80G Receipt</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
            <Award className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">100% Transparent</div>
              <div className="text-[10px] text-slate-300">Ground-Audited Records</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
            <Heart className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Direct Beneficiary</div>
              <div className="text-[10px] text-slate-300">Zero Intermediary Loss</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
            <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">256-Bit SSL Secure</div>
              <div className="text-[10px] text-slate-300">Bank-Grade Protection</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
