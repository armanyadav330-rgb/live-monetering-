import React, { useState } from 'react';
import {
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  LogIn,
  Zap,
} from 'lucide-react';

interface LandingNavProps {
  isDarkMode: boolean;
  lang: 'EN' | 'HI';
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onLoginClick: () => void;
  onLaunchDashboard: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  isDarkMode,
  lang,
  onToggleLang,
  onToggleTheme,
  onLoginClick,
  onLaunchDashboard,
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
    <header id="landing-header" className="sticky top-0 z-50 bg-white border-b border-slate-300 shadow-sm shrink-0 font-sans transition-colors duration-300">
      {/* 1. TOP GOVERNMENT CITIZEN UTILITY BAR (Matching Header.tsx) */}
      <div className="bg-[#0B2545] text-slate-200 text-[11px] px-4 sm:px-6 lg:px-8 py-1 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 font-medium tracking-wide">
          <span className="text-amber-400 font-semibold">{lang === 'HI' ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}</span>
          <span className="text-slate-400">|</span>
          <span className="hidden xs:inline">{lang === 'HI' ? 'GOVERNMENT OF INDIA' : 'भारत सरकार'}</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300 text-[10px]">
            {lang === 'HI' ? 'सामाजिक न्याय और अधिकारिता मंत्रालय' : 'Ministry of Social Justice and Empowerment'}
          </span>
        </div>

        {/* Accessibility & Language Controls matching Header.tsx */}
        <div className="flex items-center gap-3 text-[10px]">
          <span className="hidden md:inline text-slate-300 font-mono">NIC-SECURE-NODE-2026</span>
          <div className="flex items-center gap-1 bg-[#13315C] px-1.5 py-0.5 rounded border border-slate-700 text-amber-300 font-bold">
            <button
              onClick={() => setFontSize('normal')}
              className={`cursor-pointer hover:text-white ${fontSize === 'normal' ? 'text-white underline font-extrabold' : ''}`}
              title="Decrease / Normal Font"
            >
              A-
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => setFontSize('large')}
              className={`cursor-pointer hover:text-white ${fontSize === 'large' ? 'text-white underline font-extrabold' : ''}`}
              title="Standard Font"
            >
              A
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => setFontSize('larger')}
              className={`cursor-pointer hover:text-white ${fontSize === 'larger' ? 'text-white underline font-extrabold' : ''}`}
              title="Increase Font"
            >
              A+
            </button>
          </div>

          <button
            onClick={onToggleLang}
            className="font-semibold text-emerald-400 bg-emerald-950/80 hover:bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/50 cursor-pointer transition flex items-center gap-1"
            title={lang === 'EN' ? 'हिंदी में स्विच करें (Switch to Hindi)' : 'Switch to English'}
          >
            <span>🌐</span>
            <span>{lang === 'EN' ? 'हिन्दी' : 'English'}</span>
          </button>

          <span className="hidden lg:inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/50 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {lang === 'HI' ? 'एनआईसी क्लाउड सत्यापित' : 'NIC Cloud Verified'}
          </span>
        </div>
      </div>

      {/* 2. TOP GOVERNMENT TRICOLOR STRIPE (Matching Header.tsx) */}
      <div className="h-1 w-full grid grid-cols-3">
        <div className="bg-[#FF9933]" />
        <div className="bg-white" />
        <div className="bg-[#138808]" />
      </div>

      {/* 3. MAIN EMBLEM & PORTAL IDENTITY HEADER (Matching Header.tsx) */}
      <div className="px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 bg-slate-50/70 border-b border-slate-200">
        {/* Government Identity Branding */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0"
        >
          {/* Official Emblem Badge matching Header.tsx */}
          <div className="flex flex-col items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#0B2545] text-amber-400 border-2 border-amber-500/80 shadow-xs shrink-0 p-1 group-hover:scale-105 transition-transform">
            <span className="text-base sm:text-lg leading-none">🏛️</span>
            <span className="text-[8px] font-bold tracking-tighter text-amber-300 uppercase">सत्यमेव जयते</span>
          </div>

          <div className="min-w-0">
            <div className="text-[9px] xs:text-[10px] sm:text-[11px] font-bold text-[#0B2545] tracking-wider uppercase truncate max-w-[170px] sm:max-w-none">
              {lang === 'HI'
                ? 'सामाजिक न्याय और अधिकारिता मंत्रालय · भारत सरकार'
                : 'Ministry of Social Justice and Empowerment · Government of India'}
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs xs:text-sm sm:text-base md:text-lg font-extrabold text-[#0B2545] leading-tight truncate max-w-[160px] xs:max-w-[220px] sm:max-w-md md:max-w-none">
                {lang === 'HI'
                  ? 'राष्ट्रीय संस्थागत निगरानी एवं निरीक्षण पोर्टल'
                  : 'National Institutional Monitoring & Inspection Portal'}
              </h1>
              <span className="hidden sm:inline-block text-[9px] font-extrabold uppercase tracking-wider text-[#0B2545] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                LiveMonitor
              </span>
              <span className="hidden xl:inline-block text-[9px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                GOV.IN
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links matching internal typography */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-700">
          <button
            onClick={() => scrollToSection('features')}
            className="px-2.5 py-1.5 rounded-md hover:text-[#0B2545] hover:bg-slate-100 transition cursor-pointer"
          >
            {lang === 'HI' ? 'प्रमुख मॉड्यूल' : 'Key Modules'}
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="px-2.5 py-1.5 rounded-md hover:text-[#0B2545] hover:bg-slate-100 transition cursor-pointer"
          >
            {lang === 'HI' ? 'कार्यप्रणाली' : 'How It Works'}
          </button>
          <button
            onClick={() => scrollToSection('preview')}
            className="px-2.5 py-1.5 rounded-md hover:text-[#0B2545] hover:bg-slate-100 transition cursor-pointer"
          >
            {lang === 'HI' ? 'निगरानी ग्रिड' : 'Surveillance Grid'}
          </button>
          <button
            onClick={() => scrollToSection('status')}
            className="px-2.5 py-1.5 rounded-md hover:text-[#0B2545] hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>{lang === 'HI' ? 'क्लस्टर स्थिति' : 'Cluster Status'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="px-2.5 py-1.5 rounded-md hover:text-[#0B2545] hover:bg-slate-100 transition cursor-pointer"
          >
            {lang === 'HI' ? 'कार्यान्वयन स्तर' : 'Deployment Tiers'}
          </button>
        </nav>

        {/* Right Action Controls matching Header.tsx styling */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            title={isDarkMode ? 'Switch to Official Light Mode' : 'Switch to NOC Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Official Log In Button matching Header secondary buttons */}
          <button
            onClick={onLoginClick}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>{lang === 'HI' ? 'अधिकारी लॉगिन' : 'Official Login'}</span>
          </button>

          {/* Launch Live Dashboard matching Header primary button */}
          <button
            onClick={onLaunchDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#0B2545] hover:bg-[#13315C] text-white shadow-xs transition cursor-pointer active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">{lang === 'HI' ? 'कमांड पोर्टल प्रवेश' : 'Enter Command Portal'}</span>
            <span className="xs:hidden">{lang === 'HI' ? 'पोर्टल प्रवेश' : 'Enter Portal'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          </button>

          {/* Mobile Hamburger Button matching Header.tsx menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer border border-slate-200 bg-white shadow-2xs shrink-0"
            title="Open Navigation Menu"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* 4. OFFICIAL GOVERNMENT NOTICE & ALERT TICKER (Matching internal theme) */}
      <div className="px-4 sm:px-6 lg:px-8 py-1.5 text-xs border-b border-slate-300 flex items-center gap-3 overflow-hidden bg-white text-slate-800 shadow-2xs">
        <div className="flex items-center gap-1.5 shrink-0 font-extrabold text-[#0B2545] uppercase text-[10px] sm:text-[11px] tracking-wider bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-ping" />
          <span>{lang === 'HI' ? 'आधिकारिक सूचना' : 'Official Notice'}:</span>
        </div>
        <div className="overflow-x-auto scrollbar-none whitespace-nowrap text-[11px] sm:text-xs flex items-center gap-6 font-medium text-slate-700">
          <span className="font-semibold text-slate-800">
            {lang === 'HI'
              ? '📢 सभी अनुदान-प्राप्त संस्थानों (वृद्धाश्रम, नशा मुक्ति केंद्र, दिव्यांगजन केंद्र) के लिए 24×7 सीसीटीवी एवं बायोमेट्रिक उपस्थिति का सीधा लाइव लिंक अनिवार्य।'
              : '📢 Mandatory 24x7 Live CCTV & Biometric Stream Integration for all Grant-in-Aid institutions (Senior Citizen Homes, De-addiction & Divyangjan Centers).'}
          </span>
          <span className="text-slate-300 font-normal">|</span>
          <span className="text-[#0B2545] font-bold">
            {lang === 'HI'
              ? '✅ वित्तीय वर्ष 2026-27 के लिए स्वचालित एआई विसंगति ऑडिट इंजन सक्रिय।'
              : '✅ Automated AI Anomaly Audit Engine Active for FY 2026-27.'}
          </span>
          <span className="text-slate-300 font-normal">|</span>
          <span className="text-slate-600 font-medium">
            {lang === 'HI'
              ? '📞 तकनीकी सहायता हेल्पलाइन: 1800-11-2026 (टोल-फ्री)'
              : '📞 Central Support Helpline: 1800-11-2026 (Toll-Free)'}
          </span>
        </div>
      </div>

      {/* 5. MOBILE DRAWER MENU (Matching Header.tsx dropdown style) */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-5 border-b border-slate-300 space-y-3 bg-white text-slate-900 shadow-md">
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
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-medium">
                {lang === 'HI' ? 'फ़ॉन्ट आकार:' : 'Text Size:'}
              </span>
              <div className="flex items-center gap-1 bg-[#13315C] px-1.5 py-0.5 rounded border border-slate-700 text-amber-300 font-bold text-[10px]">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`cursor-pointer hover:text-white ${fontSize === 'normal' ? 'text-white underline font-extrabold' : ''}`}
                >
                  A-
                </button>
                <span className="text-slate-500">|</span>
                <button
                  onClick={() => setFontSize('large')}
                  className={`cursor-pointer hover:text-white ${fontSize === 'large' ? 'text-white underline font-extrabold' : ''}`}
                >
                  A
                </button>
                <span className="text-slate-500">|</span>
                <button
                  onClick={() => setFontSize('larger')}
                  className={`cursor-pointer hover:text-white ${fontSize === 'larger' ? 'text-white underline font-extrabold' : ''}`}
                >
                  A+
                </button>
              </div>
            </div>

            <button
              onClick={onToggleLang}
              className="font-semibold text-emerald-400 bg-emerald-950/80 hover:bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/50 text-[10px] cursor-pointer flex items-center gap-1"
            >
              <span>🌐</span>
              <span>{lang === 'EN' ? 'हिन्दी में देखें' : 'Switch to English'}</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
              className="py-2 rounded-md border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold text-center cursor-pointer transition shadow-2xs flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lang === 'HI' ? 'अधिकारी लॉगिन' : 'Official Login'}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchDashboard();
              }}
              className="py-2 rounded-md bg-[#0B2545] hover:bg-[#13315C] text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'HI' ? 'पोर्टल प्रवेश' : 'Enter Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
