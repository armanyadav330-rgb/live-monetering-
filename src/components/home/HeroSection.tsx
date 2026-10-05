import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  isDarkMode?: boolean;
  lang?: string;
  onStartMonitoring: () => void;
  onExploreDemo?: () => void;
  onOpenInspectionOfficerDashboard?: () => void;
  onOpenSuperAdminDashboard?: () => void;
  onOpenDistrictDashboard?: () => void;
  onOpenMinistryDashboard?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartMonitoring,
  onExploreDemo,
}) => {
  const handleExplore = () => {
    const el =
      document.getElementById('features') ||
      document.getElementById('how-it-works') ||
      document.getElementById('status');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onExploreDemo) {
      onExploreDemo();
    }
  };

  return (
    <section
      id="preview"
      className="relative min-h-[82vh] sm:min-h-[86vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-slate-950 text-white"
    >
      {/* Real photograph of an Indian grassroots social welfare & community campus */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/assets/backgrounds/sabarmati_campus.jpg"
          alt="Authentic Indian grassroots NGO and social welfare community campus"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // High-fidelity fallback to local administrative center if needed
            const target = e.target as HTMLImageElement;
            if (target.src.indexOf('ngo_building_main.jpg') === -1) {
              target.src = '/assets/backgrounds/ngo_building_main.jpg';
            }
          }}
        />

        {/* Measured, natural editorial scrim: ensures WCAG AA text contrast while keeping real architectural photo dominant with deep blue harmony */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/90 via-[#0B2545]/60 to-[#0B2545]/25 sm:via-[#0B2545]/50 sm:to-[#0B2545]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/90 via-transparent to-[#0B2545]/30 sm:hidden" />
      </div>

      {/* Hero Content Container with generous whitespace & editorial typography */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-24">
        <div className="max-w-2xl space-y-6 sm:space-y-8 text-left">
          {/* Small Label */}
          <div>
            <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-sky-300 uppercase select-none">
              SATYA NIRAKSHAK
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] text-balance">
            Transparent NGO Monitoring.
          </h1>

          {/* One Short Supporting Line */}
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-200 font-normal tracking-wide">
            Monitor. Verify. Improve.
          </p>

          {/* Minimal, High-Contrast Calls to Action */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            {/* Primary CTA */}
            <button
              type="button"
              onClick={onStartMonitoring}
              className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-lg bg-white hover:bg-blue-50 text-[#0B2545] font-semibold text-sm sm:text-base tracking-wide transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2.5 group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-[#0B2545] transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            {/* Optional Secondary CTA */}
            <button
              type="button"
              onClick={handleExplore}
              className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-sm sm:text-base border border-white/30 hover:border-white/50 backdrop-blur-xs transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span>Explore</span>
              <ArrowDown className="w-4 h-4 text-blue-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Quiet, authentic environmental marker */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 z-10 hidden sm:flex items-center gap-2 text-[11px] sm:text-xs text-white/70 font-light tracking-wide select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span>Grassroots Social Welfare Campus, India</span>
      </div>
    </section>
  );
};
