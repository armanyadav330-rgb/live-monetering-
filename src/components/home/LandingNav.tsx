import React, { useState } from 'react';
import {
  Menu,
  X,
  Shield,
  Headphones,
  Mail,
  Globe,
  CheckCircle2,
} from 'lucide-react';

interface LandingNavProps {
  isDarkMode?: boolean;
  lang: 'EN' | 'HI';
  onToggleLang: () => void;
  onToggleTheme?: () => void;
  onLoginClick: () => void;
  onLaunchDashboard?: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  isDarkMode: _isDarkMode,
  lang,
  onToggleLang,
  onToggleTheme: _onToggleTheme,
  onLoginClick,
  onLaunchDashboard: _onLaunchDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="landing-header"
      className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs shrink-0 font-sans transition-colors duration-200 w-full max-w-full"
    >
      {/* 1. TOP CITIZEN & GOVT UTILITY STRIP */}
      <div className="bg-[#0B2545] text-slate-200 text-[10px] sm:text-[11px] px-3 sm:px-6 lg:px-8 py-1 border-b border-slate-800 flex items-center justify-between gap-2 w-full max-w-full">
        <div className="flex items-center gap-1.5 sm:gap-3 font-medium tracking-wide min-w-0">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[9px] sm:text-[10px] truncate shrink-0">
            {lang === 'HI' ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-300 text-[9px] sm:text-[10px] truncate hidden md:inline">
            {lang === 'HI'
              ? 'सामाजिक न्याय और अधिकारिता मंत्रालय'
              : 'Ministry of Social Justice & Empowerment'}
          </span>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center gap-2 text-[10px] shrink-0">
          {/* Font Resizing Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-[#13315C] px-1.5 py-0.5 rounded border border-slate-700 text-amber-300 font-bold text-[10px]">
            <button
              onClick={() => setFontSize('normal')}
              className={`cursor-pointer hover:text-white px-0.5 ${fontSize === 'normal' ? 'text-white underline font-extrabold' : ''}`}
              title="Standard Font Size"
            >
              A-
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => setFontSize('large')}
              className={`cursor-pointer hover:text-white px-0.5 ${fontSize === 'large' ? 'text-white underline font-extrabold' : ''}`}
              title="Medium Font Size"
            >
              A
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => setFontSize('larger')}
              className={`cursor-pointer hover:text-white px-0.5 ${fontSize === 'larger' ? 'text-white underline font-extrabold' : ''}`}
              title="Large Font Size"
            >
              A+
            </button>
          </div>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700/50 cursor-pointer transition flex items-center gap-1 text-[10px] active:scale-95 shrink-0"
            title={lang === 'EN' ? 'हिंदी में स्विच करें (Switch to Hindi)' : 'Switch to English'}
          >
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>{lang === 'EN' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Verification Badge */}
          <span className="hidden sm:inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700/50 text-[9px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{lang === 'HI' ? 'सुरक्षित एनआईसी नोड' : 'NIC Sovereign Node'}</span>
          </span>
        </div>
      </div>

      {/* 2. SUBTLE TRICOLOR ACCENT BORDER */}
      <div className="h-0.5 w-full grid grid-cols-3">
        <div className="bg-[#FF9933]" />
        <div className="bg-white" />
        <div className="bg-[#138808]" />
      </div>

      {/* 3. MAIN HEADER: LEFT SECTION & CENTER BRAND SECTION */}
      <div className="bg-white px-3 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-slate-200 flex items-center justify-between gap-3 sm:gap-6 w-full max-w-full">
        {/* Brand Group Container */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 sm:gap-5 min-w-0">
          {/* LEFT SECTION: Institution Logo & Title */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            {/* Clean Government / Institution Style Icon */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0B2545] text-amber-400 border border-amber-500/50 shadow-2xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <span className="text-xl sm:text-2xl leading-none select-none">🏛️</span>
            </div>

            <div className="min-w-0">
              <div className="text-sm sm:text-base md:text-lg font-black text-[#0B2545] tracking-tight leading-snug">
                Satya Nirakshak
              </div>
              <div className="text-[10px] sm:text-xs font-semibold tracking-normal leading-tight text-slate-600">
                {lang === 'HI' ? (
                  <>
                    <div className="font-semibold text-slate-700">सामाजिक न्याय एवं अधिकारिता मंत्रालय</div>
                    <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">भारत सरकार</div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-slate-700">Ministry of Social Justice and Empowerment</div>
                    <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Government of India</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* CENTER / BRAND SECTION: Vertical Divider & Main System Identity */}
          <div className="hidden md:flex items-center gap-4 border-l border-slate-200 pl-4 py-0.5 min-w-0">
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-black text-[#0B2545] tracking-tight leading-snug">
                Satya Nirakshak
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-600 tracking-normal leading-tight">
                {lang === 'HI'
                  ? 'राष्ट्रीय निगरानी एवं निरीक्षण कमान ग्रिड'
                  : 'National Surveillance & Inspection Command Grid'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Status / Mobile Menu Action */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px]">
              {lang === 'HI' ? 'सक्रिय एवं सुरक्षित ग्रिड' : 'Active & Verified Grid'}
            </span>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer border border-slate-200 bg-white shadow-2xs shrink-0"
            title="Toggle Navigation Menu"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* 4. BOTTOM / SECONDARY HEADER AREA */}
      <div className="bg-slate-50/60 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 w-full max-w-full">
        {/* Left: System Support / Assistance with Existing Project Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0B2545] shadow-2xs shrink-0">
            <Headphones className="w-4 h-4 text-[#0B2545]" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-[#0B2545] leading-tight">
              {lang === 'HI' ? 'सिस्टम सहायता / संपर्क' : 'System Support / Assistance'}
            </div>
            <a
              href="mailto:support-dosje@nic.in"
              className="text-[11px] text-slate-600 hover:text-[#0B2545] hover:underline font-medium flex items-center gap-1.5 leading-tight transition"
            >
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">support-dosje@nic.in</span>
            </a>
          </div>
        </div>

        {/* Center: Module Navigation Anchors (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-600">
          <button
            onClick={() => scrollToSection('features')}
            className="px-2.5 py-1.5 rounded-md hover:text-[#0B2545] hover:bg-slate-200/60 transition cursor-pointer whitespace-nowrap"
          >
            {lang === 'HI' ? 'प्रमुख मॉड्यूल' : 'Key Modules'}
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="px-2.5 py-1.5 rounded-md hover:text-[#0B2545] hover:bg-slate-200/60 transition cursor-pointer whitespace-nowrap"
          >
            {lang === 'HI' ? 'कार्यप्रणाली' : 'How It Works'}
          </button>
          <button
            onClick={() => scrollToSection('preview')}
            className="px-2.5 py-1.5 rounded-md hover:text-[#0B2545] hover:bg-slate-200/60 transition cursor-pointer whitespace-nowrap"
          >
            {lang === 'HI' ? 'निगरानी ग्रिड' : 'Surveillance Grid'}
          </button>
          <button
            onClick={() => scrollToSection('status')}
            className="px-2.5 py-1.5 rounded-md hover:text-[#0B2545] hover:bg-slate-200/60 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>{lang === 'HI' ? 'क्लस्टर स्थिति' : 'Cluster Status'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </nav>

        {/* Right: Existing Login / Access Portal Button Styled as Dark-Blue Government Button */}
        <div className="flex items-center shrink-0">
          <button
            id="header-access-portal-btn"
            onClick={onLoginClick}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-[#0B2545] hover:bg-[#13315C] active:bg-[#071930] text-white shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer border border-[#0B2545] shrink-0"
          >
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {lang === 'HI' ? 'लॉगिन' : 'Login'}
            </span>
          </button>
        </div>
      </div>

      {/* 5. MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-5 border-b border-slate-200 space-y-3 bg-white text-slate-900 shadow-lg animate-in slide-in-from-top duration-200">
          {/* Mobile Identity Subtitle */}
          <div className="pb-2 border-b border-slate-100">
            <div className="text-xs font-bold text-[#0B2545]">Satya Nirakshak</div>
            <div className="text-[11px] text-slate-500 font-medium">
              {lang === 'HI'
                ? 'राष्ट्रीय निगरानी एवं निरीक्षण कमान ग्रिड'
                : 'National Surveillance & Inspection Command Grid'}
            </div>
          </div>

          <div className="flex flex-col space-y-1 text-xs font-semibold text-slate-700">
            <button
              onClick={() => scrollToSection('features')}
              className="w-full text-left px-3 py-2 rounded-md hover:text-[#0B2545] hover:bg-slate-50 transition cursor-pointer"
            >
              {lang === 'HI' ? 'प्रमुख मॉड्यूल' : 'Key Modules'}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="w-full text-left px-3 py-2 rounded-md hover:text-[#0B2545] hover:bg-slate-50 transition cursor-pointer"
            >
              {lang === 'HI' ? 'कार्यप्रणाली' : 'How It Works'}
            </button>
            <button
              onClick={() => scrollToSection('preview')}
              className="w-full text-left px-3 py-2 rounded-md hover:text-[#0B2545] hover:bg-slate-50 transition cursor-pointer"
            >
              {lang === 'HI' ? 'निगरानी ग्रिड' : 'Surveillance Grid'}
            </button>
            <button
              onClick={() => scrollToSection('status')}
              className="w-full text-left px-3 py-2 rounded-md hover:text-[#0B2545] hover:bg-slate-50 transition flex items-center justify-between cursor-pointer"
            >
              <span>{lang === 'HI' ? 'क्लस्टर स्थिति' : 'System Status'}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {lang === 'HI' ? '99.99% सक्रिय' : '99.99% Operational'}
              </span>
            </button>
          </div>

          {/* Mobile Font Size & Language Controls */}
          <div className="pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-medium">
                {lang === 'HI' ? 'फ़ॉन्ट:' : 'Font:'}
              </span>
              <div className="flex items-center gap-1 bg-[#13315C] px-1.5 py-0.5 rounded border border-slate-700 text-amber-300 font-bold text-[10px]">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`cursor-pointer hover:text-white px-1 ${fontSize === 'normal' ? 'text-white underline font-extrabold' : ''}`}
                >
                  A-
                </button>
                <span className="text-slate-500">|</span>
                <button
                  onClick={() => setFontSize('large')}
                  className={`cursor-pointer hover:text-white px-1 ${fontSize === 'large' ? 'text-white underline font-extrabold' : ''}`}
                >
                  A
                </button>
                <span className="text-slate-500">|</span>
                <button
                  onClick={() => setFontSize('larger')}
                  className={`cursor-pointer hover:text-white px-1 ${fontSize === 'larger' ? 'text-white underline font-extrabold' : ''}`}
                >
                  A+
                </button>
              </div>
            </div>

            <button
              onClick={onToggleLang}
              className="font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300 text-[11px] cursor-pointer flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'EN' ? 'हिन्दी में देखें' : 'Switch to English'}</span>
            </button>
          </div>

          {/* Mobile Action Button */}
          <div className="pt-3 border-t border-slate-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
              className="w-full py-2.5 rounded-lg bg-[#0B2545] hover:bg-[#13315C] text-white text-xs font-bold text-center cursor-pointer transition shadow-xs flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {lang === 'HI' ? 'लॉगिन' : 'Login'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

