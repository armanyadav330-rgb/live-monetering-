import React from 'react';
import { useTranslation } from '../../i18n/LanguageContext';

interface HeroSectionProps {
  isDarkMode?: boolean;
  lang?: string;
  onStartMonitoring: () => void;
  onExploreDemo: () => void;
  onOpenInspectionOfficerDashboard?: () => void;
  onOpenSuperAdminDashboard?: () => void;
  onOpenDistrictDashboard?: () => void;
  onOpenMinistryDashboard?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isDarkMode: _isDarkMode,
  onStartMonitoring,
  onExploreDemo: _onExploreDemo,
  onOpenInspectionOfficerDashboard,
  onOpenSuperAdminDashboard,
  onOpenDistrictDashboard,
  onOpenMinistryDashboard,
}) => {
  const { t } = useTranslation();

  return (
    <section id="preview" className="relative overflow-hidden pt-8 sm:pt-12 pb-12 sm:pb-16 bg-white text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Official GOI Emblem & Ministry Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-50 text-black border border-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF671F] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF671F]" />
            </span>
            <span>
              {t('hero.badge')}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug text-[#0B2545]">
            {t('hero.title')}
          </h1>

          <div className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
            {t('hero.dept')}
          </div>

          {/* Simple, Understandable Purpose Statement */}
          <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium">
            {t('hero.desc')}
          </p>

          {/* Quick Role-based Access Guide */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            <div
              id="super-admin-hero-card"
              onClick={onOpenSuperAdminDashboard || onStartMonitoring}
              className="relative p-3.5 rounded-xl border-2 border-amber-500/90 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-600 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group ring-2 ring-amber-500/20 transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🛡️</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-600 text-white tracking-wider shadow-2xs">
                  {t('role.super_admin', 'SUPER ADMIN')}
                </span>
              </div>
              <div className="font-bold text-xs sm:text-sm text-amber-950 mt-1 flex items-center justify-between group-hover:text-amber-700 transition">
                <span>{t('hero.super_admin_title')}</span>
                <span className="text-amber-600 font-bold transition-transform group-hover:translate-x-1">→</span>
              </div>
              <div className="text-[11px] text-slate-700 mt-1 leading-tight">
                {t('hero.super_admin_desc')}
              </div>
              <div className="mt-2.5 pt-1.5 border-t border-amber-200/70 flex items-center justify-between text-[10px] font-bold text-amber-700 group-hover:text-amber-900">
                <span>{t('hero.super_admin_login')}</span>
                <span className="text-xs font-mono">🔒</span>
              </div>
            </div>

            <div
              id="inspection-officer-hero-card"
              onClick={onOpenInspectionOfficerDashboard || onStartMonitoring}
              className="relative p-3.5 rounded-xl border-2 border-indigo-600/90 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-700 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group ring-2 ring-indigo-500/20 transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🕵️‍♂️</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-600 text-white tracking-wider shadow-2xs">
                  {t('role.inspection_officer', 'INSPECTOR')}
                </span>
              </div>
              <div className="font-bold text-xs sm:text-sm text-indigo-950 mt-1 flex items-center justify-between group-hover:text-indigo-600 transition">
                <span>{t('hero.inspector_title')}</span>
                <span className="text-indigo-600 font-bold transition-transform group-hover:translate-x-1">→</span>
              </div>
              <div className="text-[11px] text-slate-700 mt-1 leading-tight">
                {t('hero.inspector_desc')}
              </div>
              <div className="mt-2.5 pt-1.5 border-t border-indigo-200/70 flex items-center justify-between text-[10px] font-bold text-indigo-700 group-hover:text-indigo-900">
                <span>{t('hero.inspector_login')}</span>
                <span className="text-xs font-mono">🔒</span>
              </div>
            </div>

            <div
              id="district-authority-hero-card"
              onClick={onOpenDistrictDashboard || onStartMonitoring}
              className="relative p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#0B2545] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group transform hover:-translate-y-0.5"
            >
              <div className="text-xl">🏛️</div>
              <div className="font-bold text-xs sm:text-sm text-black mt-1 group-hover:text-[#0B2545] transition flex items-center justify-between">
                <span>{t('hero.district_title')}</span>
                <span className="text-slate-400 group-hover:text-[#0B2545] font-bold transition-transform group-hover:translate-x-1">→</span>
              </div>
              <div className="text-[11px] text-slate-600 mt-1 leading-tight">
                {t('hero.district_desc')}
              </div>
              <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-600 group-hover:text-[#0B2545]">
                <span>{t('hero.district_login')}</span>
                <span className="text-xs font-mono">🔒</span>
              </div>
            </div>

            <div
              id="central-ministry-hero-card"
              onClick={onOpenMinistryDashboard || onStartMonitoring}
              className="relative p-3.5 rounded-xl border border-slate-200 bg-white hover:border-[#0B2545] shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group transform hover:-translate-y-0.5"
            >
              <div className="text-xl">🇮🇳</div>
              <div className="font-bold text-xs sm:text-sm text-black mt-1 group-hover:text-[#0B2545] transition flex items-center justify-between">
                <span>{t('hero.ministry_title')}</span>
                <span className="text-slate-400 group-hover:text-[#0B2545] font-bold transition-transform group-hover:translate-x-1">→</span>
              </div>
              <div className="text-[11px] text-slate-600 mt-1 leading-tight">
                {t('hero.ministry_desc')}
              </div>
              <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-600 group-hover:text-[#0B2545]">
                <span>{t('hero.ministry_login')}</span>
                <span className="text-xs font-mono">🔒</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
