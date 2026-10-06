import React from 'react';
import { Heart, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface FinalDonationCTAProps {
  onDonateClick: () => void;
}

export const FinalDonationCTA: React.FC<FinalDonationCTAProps> = ({
  onDonateClick,
}) => {
  return (
    <section className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex items-center justify-center overflow-hidden py-16 sm:py-24 bg-slate-950 text-white">
      {/* Background Image: Authentic Indian NGO Education & Child Support Drive */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/444444444444444.webp"
          alt="Satya Nirakshak Child Education & Community Welfare Mission"
          className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.indexOf('ngo_education_drive_new.jpg') === -1) {
              target.src = '/assets/donations/ngo_education_drive_new.jpg';
            }
          }}
        />

        {/* Natural photo presentation with clean dark gradient for optimal clarity and text contrast */}
        <div className="absolute inset-0 bg-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-black/30" />
      </div>

      {/* Main Content Container with High-Contrast Editorial Typography */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 text-center space-y-6 sm:space-y-8">
        {/* Small Tracked Editorial Label */}
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs sm:text-sm font-semibold tracking-[0.22em] text-emerald-300 uppercase select-none shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>SATYA NIRAKSHAK · CHILD EDUCATION MISSION</span>
          </span>
        </div>

        {/* Razor-Sharp Main Headline */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto text-balance">
          <span>Be the Reason Someone&apos;s</span>
          <br />
          <span className="text-emerald-300 font-extrabold">Tomorrow Is Better.</span>
        </h2>

        {/* Clean Supporting Prose */}
        <p className="text-lg sm:text-xl lg:text-2xl text-slate-200 font-normal tracking-wide max-w-2xl mx-auto leading-relaxed">
          Your small contribution can become someone&apos;s opportunity, hope, and future.
        </p>

        {/* High-Contrast Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          {/* Primary CTA: Crisp Solid White Button */}
          <button
            type="button"
            onClick={onDonateClick}
            className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-lg bg-white hover:bg-emerald-50 text-slate-900 font-semibold text-sm sm:text-base tracking-wide transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2.5 group"
          >
            <Heart className="w-4 h-4 fill-emerald-600 text-emerald-600 transition-transform group-hover:scale-110" />
            <span>Donate Now</span>
            <ArrowRight className="w-4 h-4 text-slate-900 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Secondary CTA: Translucent Glass Button */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('impact-section') || document.getElementById('donation-amount-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm sm:text-base border border-white/25 hover:border-white/40 backdrop-blur-xs transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            <span>Explore Causes</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-200 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>50% Tax Deduction under Sec 80G</span>
          </div>
          <span className="text-white/40 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant Audited 80G Certificate</span>
          </div>
          <span className="text-white/40 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Verified Field Deployment</span>
          </div>
        </div>
      </div>

      {/* Quiet Environmental Marker */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 z-10 hidden sm:flex items-center gap-2 text-[11px] sm:text-xs text-white/70 font-light tracking-wide select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Early Childhood Education NGO Initiative, India</span>
      </div>
    </section>
  );
};
