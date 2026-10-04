import React from 'react';
import { ShieldCheck, Mail } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface LandingFooterProps {
  isDarkMode?: boolean;
  lang?: string;
  onNavigateSection?: (id: string) => void;
  onLaunchDashboard?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  isDarkMode: _isDarkMode,
  onNavigateSection: _onNavigateSection,
  onLaunchDashboard: _onLaunchDashboard,
  onOpenPrivacy = () => {},
  onOpenTerms = () => {},
}) => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 bg-white text-black">
      {/* Official Tricolor Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF671F] via-slate-300 to-[#046A38]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
          {/* Official Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0B2545] text-amber-400 border border-amber-500/80 flex items-center justify-center text-base shrink-0">
              🏛️
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#0B2545] uppercase tracking-wider">
                {t('footer.ministry')}
              </div>
              <div className="font-extrabold text-sm text-[#0B2545]">
                Satya Nirakshak · {t('footer.subtitle')}
              </div>
            </div>
          </div>

          {/* Quick Statutory Links & Contacts */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-[#0B2545] hover:underline cursor-pointer"
            >
              {t('footer.privacy')}
            </button>
            <span>•</span>
            <button
              onClick={onOpenTerms}
              className="hover:text-[#0B2545] hover:underline cursor-pointer"
            >
              {t('footer.terms')}
            </button>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-slate-600">
              <Mail className="w-3 h-3 text-slate-500" />
              <span>support-dosje@nic.in</span>
            </div>
          </div>
        </div>

        {/* Disclaimer & Accreditation */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
          <div>
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t('footer.compliance')}
            </span>
            <span>•</span>
            <span className="font-mono text-slate-500">{t('footer.node_status')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
