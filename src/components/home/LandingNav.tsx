import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  Heart,
  ArrowUpRight,
  Shield,
  Headphones,
  Mail,
  Check,
} from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { SupportedLanguage } from '../../i18n/translations';

interface LandingNavProps {
  isDarkMode?: boolean;
  lang?: string;
  onToggleLang?: () => void;
  onToggleTheme?: () => void;
  onLoginClick: () => void;
  onLaunchDashboard?: () => void;
  onDonateClick?: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  onLoginClick,
  onLaunchDashboard,
  onDonateClick,
}) => {
  const { language, setLanguage, languages, currentLanguageInfo, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setLangDropdownOpen(false);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePortalClick = () => {
    if (onLaunchDashboard) {
      onLaunchDashboard();
    } else {
      onLoginClick();
    }
  };

  const handleDonateClick = () => {
    if (onDonateClick) {
      onDonateClick();
    } else {
      scrollToSection('donation-amount-section');
    }
  };

  return (
    <header
      id="landing-header"
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all duration-200 m-0 p-0"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4 relative">
        {/* LEFT: Brand Lockup with Attractive Community Shield Emblem */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 sm:gap-3.5 cursor-pointer group shrink-0 select-none"
        >
          {/* Polished & Attractive Shield Emblem matching user reference */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-50 via-white to-sky-50 border border-blue-200/80 shadow-2xs group-hover:shadow-md group-hover:border-blue-400 transition-all duration-300 flex items-center justify-center p-1">
            <svg
              viewBox="0 0 100 110"
              className="w-full h-full drop-shadow-xs group-hover:scale-105 transition-transform duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Satya Nirakshak Emblem"
            >
              <defs>
                <linearGradient id="shieldNavy" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E40AF" />
                  <stop offset="100%" stopColor="#0B2545" />
                </linearGradient>
                <linearGradient id="shieldBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
              </defs>

              {/* Outer Protective Shield Geometry */}
              <path
                d="M50 4 L18 18 C18 49 25 75 50 98 C75 75 82 49 82 18 Z"
                stroke="url(#shieldNavy)"
                strokeWidth="4.5"
                strokeLinejoin="round"
                fill="white"
              />

              {/* Upper Shield Chevron Arch */}
              <path
                d="M26 23 L50 12 L74 23"
                stroke="url(#shieldNavy)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Central Guardian Figure (Navy) */}
              <circle cx="50" cy="38" r="6" fill="#0B2545" />
              <path
                d="M38 57 C38 47 62 47 62 57"
                stroke="#0B2545"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Left Beneficiary Figure (Royal Blue) */}
              <circle cx="35" cy="48" r="4.5" fill="url(#shieldBlue)" />
              <path
                d="M26 66 C26 58 44 58 44 66"
                stroke="url(#shieldBlue)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Right Beneficiary Figure (Royal Blue) */}
              <circle cx="65" cy="48" r="4.5" fill="url(#shieldBlue)" />
              <path
                d="M56 66 C56 58 74 58 74 66"
                stroke="url(#shieldBlue)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Bottom Ground-Anchor Pin / Blue Accent */}
              <path
                d="M40 76 L50 88 L60 76"
                stroke="url(#shieldBlue)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Brand Typography */}
          <div className="flex flex-col text-left">
            <div className="text-base sm:text-lg md:text-xl font-black tracking-tight leading-none text-[#0B2545]">
              Satya <span className="text-blue-600 group-hover:text-blue-700 transition-colors">Nirakshak</span>
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 tracking-normal mt-1 leading-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>NGO Monitoring System</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Action Controls (Language + Donate + Monitoring Portal + Menu) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* 1. Language Dropdown Pill */}
          <div ref={langRef} className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 border border-blue-200/80 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition cursor-pointer select-none"
              aria-label="Select Language"
              title="Select Language / भाषा चुनें"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700 shrink-0" />
              <span className="uppercase text-xs sm:text-sm tracking-wide">
                {currentLanguageInfo?.short || 'EN'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-blue-600 transition-transform duration-200 ${
                  langDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Language Selection Popover */}
            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 max-h-72 overflow-y-auto rounded-2xl bg-white border border-blue-100 shadow-xl z-50 py-1.5 text-slate-800 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#0B2545]">
                  <span>{t('app.select_language', 'Select Language')}</span>
                  <span className="text-[10px] text-blue-500 font-mono">13 Languages</span>
                </div>
                <div className="py-1">
                  {languages.map((item) => {
                    const isSelected = item.code === language;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => handleSelectLanguage(item.code)}
                        className={`w-full px-3.5 py-2 flex items-center justify-between transition cursor-pointer text-left ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="text-xs">{item.nativeLabel}</span>
                        <span className="text-[10px] uppercase text-slate-400 font-semibold flex items-center gap-1">
                          {item.short}
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Donate Button (Crisp Blue & White Rounded Pill with Heart) */}
          <button
            type="button"
            onClick={handleDonateClick}
            className="bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 border border-blue-200 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold transition shadow-2xs hover:shadow-xs cursor-pointer select-none"
            title="Donate & Support Ground NGO Initiatives (80G Tax Deductible)"
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-blue-600 text-blue-600 shrink-0" />
            <span>Donate</span>
          </button>

          {/* 3. Monitoring Portal Button (Dark Royal Navy Rounded Pill with Screen Icon & Diagonal Arrow) */}
          <button
            type="button"
            onClick={handlePortalClick}
            className="hidden sm:flex items-center gap-1.5 sm:gap-2 bg-[#0B2545] hover:bg-[#133A6B] active:bg-[#071930] text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition cursor-pointer select-none border border-blue-900/30"
            title="Launch Live Satya Nirakshak Monitoring Portal"
          >
            {/* Screen / Presentation Monitor Icon matching reference */}
            <svg
              className="w-4 h-4 text-white shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <circle cx="8" cy="8" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
              <path d="M8 21h8" />
              <path d="M12 17v4" />
            </svg>
            <span>Monitoring Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200 shrink-0" strokeWidth={2.2} />
          </button>

          {/* 4. Circular Menu Button (3 Horizontal Lines) */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer select-none shrink-0"
              aria-label="Navigation Menu"
              title="Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800" strokeWidth={2.2} />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800" strokeWidth={2.2} />
              )}
            </button>

            {/* Extended Navigation Popover */}
            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-4 text-slate-800 text-xs animate-in fade-in zoom-in-95 duration-150 z-50 space-y-3">
                {/* Header in menu */}
                <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#0B2545]">Satya Nirakshak</div>
                    <div className="text-[10px] text-slate-500 font-medium">Live Surveillance & Audits</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Active Node
                  </span>
                </div>

                {/* Portal Button on Mobile (visible if screen is small) */}
                <div className="sm:hidden pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handlePortalClick();
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#133A6B] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer border border-blue-900/30"
                  >
                    <Shield className="w-4 h-4 text-blue-200" />
                    <span>Monitoring Portal</span>
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Section Links */}
                <div className="space-y-1 font-semibold text-slate-700">
                  <button
                    type="button"
                    onClick={() => scrollToSection('features')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:text-blue-700 hover:bg-blue-50/60 transition cursor-pointer flex items-center justify-between"
                  >
                    <span>Key Surveillance Modules</span>
                    <span className="text-[11px] text-blue-400">01</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('how-it-works')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:text-blue-700 hover:bg-blue-50/60 transition cursor-pointer flex items-center justify-between"
                  >
                    <span>How Field Verification Works</span>
                    <span className="text-[11px] text-blue-400">02</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('status')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:text-blue-700 hover:bg-blue-50/60 transition cursor-pointer flex items-center justify-between"
                  >
                    <span>Live NGO CCTV Grid</span>
                    <span className="text-[11px] text-blue-400">03</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection('impact-section')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:text-blue-700 hover:bg-blue-50/60 transition cursor-pointer flex items-center justify-between"
                  >
                    <span>Ground Impact Initiatives</span>
                    <span className="text-[11px] text-blue-400">04</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleDonateClick();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold transition cursor-pointer flex items-center justify-between border border-blue-200"
                  >
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                      <span>Donate & Support Programs</span>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-200/80 text-blue-900">
                      80G
                    </span>
                  </button>
                </div>

                {/* Support Contact Footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-[#0B2545]" />
                    <span>Official Support</span>
                  </span>
                  <a
                    href="mailto:support-dosje@nic.in"
                    className="text-slate-600 hover:text-[#0B2545] font-medium flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>support-dosje@nic.in</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
