import React, { useState } from 'react';
import {
  Activity,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  Shield,
  LogIn,
  Zap,
  Globe2,
  CheckCircle2,
} from 'lucide-react';

interface LandingNavProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLoginClick: () => void;
  onLaunchDashboard: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  isDarkMode,
  onToggleTheme,
  onLoginClick,
  onLaunchDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header id="landing-header" className="sticky top-0 z-50 shadow-md transition-colors duration-300">
      {/* 1. OFFICIAL GOI TOP TRICOLOR STRIPE */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF671F] via-white to-[#046A38] flex" />

      {/* 2. OFFICIAL CITIZEN ACCESSIBILITY & MINISTRY STRIP */}
      <div
        className={`px-4 sm:px-6 lg:px-8 py-1 text-[11px] font-medium border-b flex flex-wrap items-center justify-between gap-2 ${
          isDarkMode
            ? 'bg-[#081b33] border-slate-800 text-slate-300'
            : 'bg-[#0b2545] border-[#071a30] text-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold tracking-wide text-amber-300">
            {lang === 'HI' ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-200 truncate max-w-[200px] sm:max-w-none">
            {lang === 'HI'
              ? 'सामाजिक न्याय और अधिकारिता मंत्रालय'
              : 'Ministry of Social Justice and Empowerment'}
          </span>
        </div>

        {/* GIGW Accessibility & Language Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 border-r border-slate-700 pr-3">
            <span className="text-[10px] text-slate-400">Font:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1 rounded text-[10px] font-bold ${fontSize === 'normal' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              title="Standard Text Size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1 rounded text-[11px] font-bold ${fontSize === 'large' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              title="Medium Text Size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('larger')}
              className={`px-1 rounded text-[12px] font-bold ${fontSize === 'larger' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}
              title="Large Text Size"
            >
              A+
            </button>
          </div>

          <button
            onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] transition cursor-pointer"
            title="Toggle Language"
          >
            {lang === 'EN' ? 'हिन्दी (Hindi)' : 'English'}
          </button>

          <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            NIC Cloud Verified
          </span>
        </div>
      </div>

      {/* 3. MAIN EMBLEM & PORTAL IDENTITY HEADER */}
      <div
        className={`border-b transition-colors duration-300 ${
          isDarkMode
            ? 'bg-[#0a192f]/95 backdrop-blur-md border-slate-800 text-slate-100'
            : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Brand Logo with Indian State Emblem */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Ashoka Emblem Badge */}
              <div className="w-12 h-12 rounded-xl bg-[#0b2545] border-2 border-amber-500/60 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="State Emblem of India"
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-[#0b2545] dark:text-white">
                    Live<span className="text-[#FF671F]">Monitor</span>
                  </span>
                  <span className="inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#046A38]/15 text-[#046A38] dark:text-emerald-400 border border-[#046A38]/30">
                    GOV.IN
                  </span>
                  <span className="hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#0b2545]/10 dark:bg-white/10 text-[#0b2545] dark:text-amber-300">
                    DoSJE
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">
                  {lang === 'HI'
                    ? 'राष्ट्रीय लाइव निगरानी एवं निरीक्षण ग्रिड'
                    : 'National Live Surveillance & Inspection Portal'}
                </div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400 hidden xs:block">
                  {lang === 'HI'
                    ? 'सामाजिक न्याय और अधिकारिता मंत्रालय, भारत सरकार'
                    : 'Ministry of Social Justice and Empowerment, Govt. of India'}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700 dark:text-slate-300">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#FF671F] dark:hover:text-[#FF671F] transition-colors cursor-pointer"
            >
              {lang === 'HI' ? 'विशेषताएं' : 'Key Modules'}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#FF671F] dark:hover:text-[#FF671F] transition-colors cursor-pointer"
            >
              {lang === 'HI' ? 'कार्यप्रणाली' : 'How It Works'}
            </button>
            <button
              onClick={() => scrollToSection('preview')}
              className="hover:text-[#FF671F] dark:hover:text-[#FF671F] transition-colors cursor-pointer"
            >
              {lang === 'HI' ? 'लाइव ग्रिड' : 'Surveillance Grid'}
            </button>
            <button
              onClick={() => scrollToSection('status')}
              className="hover:text-[#FF671F] dark:hover:text-[#FF671F] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{lang === 'HI' ? 'क्लस्टर स्थिति' : 'Cluster Status'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-[#FF671F] dark:hover:text-[#FF671F] transition-colors cursor-pointer"
            >
              {lang === 'HI' ? 'सरकारी टियर' : 'Deployment Tiers'}
            </button>
          </nav>

          {/* Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
              title={isDarkMode ? 'Switch to Official Light Mode' : 'Switch to NOC Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Official Log In Button */}
            <button
              onClick={onLoginClick}
              className={`px-3.5 py-2 rounded-lg border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                isDarkMode
                  ? 'border-slate-700 hover:border-slate-600 text-slate-200 hover:bg-slate-800/80'
                  : 'border-[#0b2545]/30 hover:border-[#0b2545] text-[#0b2545] bg-[#0b2545]/5 hover:bg-[#0b2545]/10'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-[#0b2545] dark:text-blue-400" />
              <span>Official Login</span>
            </button>

            {/* Launch Live Dashboard (Primary Sovereign CTA) */}
            <button
              onClick={onLaunchDashboard}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF671F] to-[#E65100] hover:from-[#e55917] hover:to-[#c94500] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-amber-400/40"
            >
              <Zap className="w-3.5 h-3.5 text-white" />
              <span>Enter Command Portal</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Mobile Hamburger & Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleTheme}
              className={`p-1.5 rounded-lg border ${
                isDarkMode ? 'border-slate-800 text-slate-300' : 'border-slate-300 text-slate-700'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'border-slate-800 text-slate-200 hover:bg-slate-800'
                  : 'border-slate-300 text-slate-800 hover:bg-slate-100'
              }`}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. OFFICIAL GOVERNMENT NOTICE & ALERT TICKER (Authentic GOI Feature) */}
      <div
        className={`px-4 sm:px-6 lg:px-8 py-1.5 text-xs border-b flex items-center gap-3 overflow-hidden ${
          isDarkMode
            ? 'bg-[#061527] border-slate-800 text-slate-200'
            : 'bg-amber-50/80 border-amber-200/80 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-1.5 shrink-0 font-bold text-[#FF671F] uppercase text-[10px] tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#FF671F] animate-ping" />
          <span>{lang === 'HI' ? 'नवीनतम सूचना' : 'Official Notice'}:</span>
        </div>
        <div className="overflow-x-auto scrollbar-none whitespace-nowrap text-[11px] sm:text-xs flex items-center gap-6">
          <span className="font-semibold text-[#0b2545] dark:text-amber-200">
            {lang === 'HI'
              ? '📢 सभी अनुदान-प्राप्त संस्थानों (वृद्धाश्रम, नशा मुक्ति केंद्र, दिव्यांगजन केंद्र) के लिए 24×7 सीसीटीवी एवं बायोमेट्रिक उपस्थिति का सीधा लाइव लिंक अनिवार्य।'
              : '📢 Mandatory 24x7 Live CCTV & Biometric Stream Integration for all Grant-in-Aid institutions (Senior Citizen Homes, De-addiction & Divyangjan Centers).'}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
            {lang === 'HI'
              ? '✅ वित्तीय वर्ष 2026-27 के लिए एआई विसंगति ऑडिट मॉड्यूल सक्रिय।'
              : '✅ Automated AI Anomaly Audit Engine Active for FY 2026-27.'}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600 dark:text-slate-300">
            {lang === 'HI'
              ? '📞 तकनीकी सहायता हेल्पलाइन: 1800-11-2026 (टोल-फ्री)'
              : '📞 Central Support Helpline: 1800-11-2026 (Toll-Free)'}
          </span>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-4 pt-3 pb-5 border-b space-y-3 transition-colors ${
            isDarkMode ? 'bg-[#0a192f] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex flex-col space-y-2.5 text-sm font-bold">
            <button
              onClick={() => scrollToSection('features')}
              className="text-left py-1.5 hover:text-[#FF671F] transition cursor-pointer"
            >
              {lang === 'HI' ? 'विशेषताएं (Key Modules)' : 'Key Features'}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left py-1.5 hover:text-[#FF671F] transition cursor-pointer"
            >
              {lang === 'HI' ? 'कार्यप्रणाली (How It Works)' : 'How It Works'}
            </button>
            <button
              onClick={() => scrollToSection('preview')}
              className="text-left py-1.5 hover:text-[#FF671F] transition cursor-pointer"
            >
              {lang === 'HI' ? 'लाइव ग्रिड (Surveillance Grid)' : 'Surveillance Grid'}
            </button>
            <button
              onClick={() => scrollToSection('status')}
              className="text-left py-1.5 hover:text-[#FF671F] transition flex items-center justify-between cursor-pointer"
            >
              <span>{lang === 'HI' ? 'क्लस्टर स्थिति (Cluster Status)' : 'System Status'}</span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                99.99% Operational
              </span>
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-left py-1.5 hover:text-[#FF671F] transition cursor-pointer"
            >
              {lang === 'HI' ? 'सरकारी टियर (Deployment Tiers)' : 'Deployment Tiers'}
            </button>
          </div>

          {/* Mobile Font Size & Language Controls */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500">Text Size:</span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${fontSize === 'normal' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 dark:text-slate-400'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-[12px] font-bold ${fontSize === 'large' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 dark:text-slate-400'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('larger')}
                className={`px-1.5 py-0.5 rounded text-[13px] font-bold ${fontSize === 'larger' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 dark:text-slate-400'}`}
              >
                A+
              </button>
            </div>

            <button
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="px-2.5 py-1 rounded bg-[#0b2545]/10 dark:bg-white/10 text-xs font-bold"
            >
              {lang === 'EN' ? 'हिन्दी में देखें' : 'Switch to English'}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
              className={`py-2.5 rounded-lg border text-xs font-bold text-center cursor-pointer transition ${
                isDarkMode ? 'border-slate-700 text-slate-200 bg-slate-900 hover:bg-slate-800' : 'border-slate-300 text-slate-800 bg-slate-100 hover:bg-slate-200'
              }`}
            >
              Official Login
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchDashboard();
              }}
              className="py-2.5 rounded-lg bg-gradient-to-r from-[#FF671F] to-[#E65100] text-white text-xs font-bold text-center flex items-center justify-center gap-1 shadow-sm cursor-pointer active:scale-95"
            >
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
