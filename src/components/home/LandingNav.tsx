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
        className="px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] font-medium border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 bg-white text-black"
      >
        <div className="flex items-center gap-3">
          <span className="font-black tracking-wide text-black">
            {lang === 'HI' ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-black font-bold truncate max-w-[200px] sm:max-w-none">
            {lang === 'HI'
              ? 'सामाजिक न्याय और अधिकारिता मंत्रालय'
              : 'Ministry of Social Justice and Empowerment'}
          </span>
        </div>

        {/* GIGW Accessibility & Language Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 border-r border-slate-300 pr-3">
            <span className="text-[10px] text-black font-bold">Font:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${fontSize === 'normal' ? 'bg-black text-white border-black' : 'text-black border-slate-300 hover:bg-slate-100'}`}
              title="Standard Text Size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold border ${fontSize === 'large' ? 'bg-black text-white border-black' : 'text-black border-slate-300 hover:bg-slate-100'}`}
              title="Medium Text Size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('larger')}
              className={`px-1.5 py-0.5 rounded text-[12px] font-bold border ${fontSize === 'larger' ? 'bg-black text-white border-black' : 'text-black border-slate-300 hover:bg-slate-100'}`}
              title="Large Text Size"
            >
              A+
            </button>
          </div>

          <button
            onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
            className="px-2.5 py-0.5 rounded bg-white hover:bg-slate-100 text-black border border-slate-300 font-bold text-[10px] transition cursor-pointer"
            title="Toggle Language"
          >
            {lang === 'EN' ? 'हिन्दी (Hindi)' : 'English'}
          </button>

          <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-black font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            NIC Cloud Verified
          </span>
        </div>
      </div>

      {/* 3. MAIN EMBLEM & PORTAL IDENTITY HEADER */}
      <div
        className="border-b border-slate-200 bg-white text-black shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Brand Logo with Indian State Emblem */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Ashoka Emblem Badge */}
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-slate-300 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                  alt="State Emblem of India"
                  className="w-full h-full object-contain filter brightness-0"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg sm:text-xl tracking-tight text-black">
                    Live<span className="text-[#FF671F]">Monitor</span>
                  </span>
                  <span className="inline-block text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-black border border-slate-300">
                    GOV.IN
                  </span>
                  <span className="hidden sm:inline-block text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-black border border-slate-300">
                    DoSJE
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs font-black text-black leading-tight">
                  {lang === 'HI'
                    ? 'राष्ट्रीय लाइव निगरानी एवं निरीक्षण ग्रिड'
                    : 'National Live Surveillance & Inspection Portal'}
                </div>
                <div className="text-[9px] text-black font-semibold hidden xs:block">
                  {lang === 'HI'
                    ? 'सामाजिक न्याय और अधिकारिता मंत्रालय, भारत सरकार'
                    : 'Ministry of Social Justice and Empowerment, Govt. of India'}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-black text-black">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#FF671F] transition-colors cursor-pointer text-black"
            >
              {lang === 'HI' ? 'विशेषताएं' : 'Key Modules'}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#FF671F] transition-colors cursor-pointer text-black"
            >
              {lang === 'HI' ? 'कार्यप्रणाली' : 'How It Works'}
            </button>
            <button
              onClick={() => scrollToSection('preview')}
              className="hover:text-[#FF671F] transition-colors cursor-pointer text-black"
            >
              {lang === 'HI' ? 'लाइव ग्रिड' : 'Surveillance Grid'}
            </button>
            <button
              onClick={() => scrollToSection('status')}
              className="hover:text-[#FF671F] transition-colors cursor-pointer flex items-center gap-1.5 text-black"
            >
              <span>{lang === 'HI' ? 'क्लस्टर स्थिति' : 'Cluster Status'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-[#FF671F] transition-colors cursor-pointer text-black"
            >
              {lang === 'HI' ? 'सरकारी टियर' : 'Deployment Tiers'}
            </button>
          </nav>

          {/* Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-black transition-colors cursor-pointer"
              title={isDarkMode ? 'Switch to Official Light Mode' : 'Switch to NOC Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-black" />}
            </button>

            {/* Official Log In Button */}
            <button
              onClick={onLoginClick}
              className="px-3.5 py-2 rounded-lg border border-slate-300 hover:border-black text-xs font-black transition cursor-pointer flex items-center gap-1.5 text-black bg-white hover:bg-slate-100"
            >
              <LogIn className="w-3.5 h-3.5 text-black" />
              <span>Official Login</span>
            </button>

            {/* Launch Live Dashboard (Primary Sovereign CTA) */}
            <button
              onClick={onLaunchDashboard}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF671F] to-[#E65100] hover:from-[#e55917] hover:to-[#c94500] text-white text-xs font-black shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-amber-400/40"
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
              className="p-1.5 rounded-lg border border-slate-300 text-black"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-black" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-300 text-black hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5 text-black" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. OFFICIAL GOVERNMENT NOTICE & ALERT TICKER (Authentic GOI Feature - Pure White Background & Crisp Black Text) */}
      <div
        className="px-4 sm:px-6 lg:px-8 py-2 text-xs border-b border-slate-200 flex items-center gap-3 overflow-hidden bg-white text-black shadow-2xs"
      >
        <div className="flex items-center gap-1.5 shrink-0 font-black text-black uppercase text-[10px] sm:text-[11px] tracking-wider bg-slate-100 px-2.5 py-1 rounded-full border border-slate-300">
          <span className="w-2 h-2 rounded-full bg-[#FF671F] animate-ping" />
          <span>{lang === 'HI' ? 'नवीनतम सूचना' : 'Official Notice'}:</span>
        </div>
        <div className="overflow-x-auto scrollbar-none whitespace-nowrap text-[11px] sm:text-xs flex items-center gap-6 font-bold text-black">
          <span className="font-bold text-black">
            {lang === 'HI'
              ? '📢 सभी अनुदान-प्राप्त संस्थानों (वृद्धाश्रम, नशा मुक्ति केंद्र, दिव्यांगजन केंद्र) के लिए 24×7 सीसीटीवी एवं बायोमेट्रिक उपस्थिति का सीधा लाइव लिंक अनिवार्य।'
              : '📢 Mandatory 24x7 Live CCTV & Biometric Stream Integration for all Grant-in-Aid institutions (Senior Citizen Homes, De-addiction & Divyangjan Centers).'}
          </span>
          <span className="text-slate-400 font-normal">|</span>
          <span className="text-black font-extrabold">
            {lang === 'HI'
              ? '✅ वित्तीय वर्ष 2026-27 के लिए एआई विसंगति ऑडिट मॉड्यूल सक्रिय।'
              : '✅ Automated AI Anomaly Audit Engine Active for FY 2026-27.'}
          </span>
          <span className="text-slate-400 font-normal">|</span>
          <span className="text-black font-bold">
            {lang === 'HI'
              ? '📞 तकनीकी सहायता हेल्पलाइन: 1800-11-2026 (टोल-फ्री)'
              : '📞 Central Support Helpline: 1800-11-2026 (Toll-Free)'}
          </span>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden px-4 pt-3 pb-5 border-b border-slate-200 space-y-3 bg-white text-black"
        >
          <div className="flex flex-col space-y-2.5 text-sm font-black text-black">
            <button
              onClick={() => scrollToSection('features')}
              className="text-left py-1.5 hover:text-[#FF671F] transition cursor-pointer text-black"
            >
              {lang === 'HI' ? 'विशेषताएं (Key Modules)' : 'Key Features'}
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-left py-1.5 hover:text-[#FF671F] transition cursor-pointer text-black"
            >
              {lang === 'HI' ? 'कार्यप्रणाली (How It Works)' : 'How It Works'}
            </button>
            <button
              onClick={() => scrollToSection('preview')}
              className="text-left py-1.5 hover:text-[#FF671F] transition cursor-pointer text-black"
            >
              {lang === 'HI' ? 'लाइव ग्रिड (Surveillance Grid)' : 'Surveillance Grid'}
            </button>
            <button
              onClick={() => scrollToSection('status')}
              className="text-left py-1.5 hover:text-[#FF671F] transition flex items-center justify-between cursor-pointer text-black"
            >
              <span className="text-black">{lang === 'HI' ? 'क्लस्टर स्थिति (Cluster Status)' : 'System Status'}</span>
              <span className="inline-flex items-center gap-1 text-xs text-black font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                99.99% Operational
              </span>
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-left py-1.5 hover:text-[#FF671F] transition cursor-pointer text-black"
            >
              {lang === 'HI' ? 'सरकारी टियर (Deployment Tiers)' : 'Deployment Tiers'}
            </button>
          </div>

          {/* Mobile Font Size & Language Controls */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-black">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-black font-bold">Text Size:</span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold border ${fontSize === 'normal' ? 'bg-black text-white border-black' : 'text-black border-slate-300'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-[12px] font-bold border ${fontSize === 'large' ? 'bg-black text-white border-black' : 'text-black border-slate-300'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('larger')}
                className={`px-1.5 py-0.5 rounded text-[13px] font-bold border ${fontSize === 'larger' ? 'bg-black text-white border-black' : 'text-black border-slate-300'}`}
              >
                A+
              </button>
            </div>

            <button
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold text-black border border-slate-300"
            >
              {lang === 'EN' ? 'हिन्दी में देखें' : 'Switch to English'}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
              className="py-2.5 rounded-lg border border-slate-300 text-black bg-white hover:bg-slate-100 text-xs font-bold text-center cursor-pointer transition"
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
