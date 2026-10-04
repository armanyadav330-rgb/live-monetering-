import React from 'react';
import { Info, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

export const SimulationBanner: React.FC<{ context?: string }> = ({ context }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-amber-50 border-y border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-2 shadow-2xs">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider bg-amber-200 text-amber-950 px-2 py-0.5 rounded-sm border border-amber-300">
          <Info className="w-3 h-3 text-amber-900" />
          {t('simulation.banner_title', 'SIMULATION / DEMO ENVIRONMENT')}
        </span>
        <span className="text-amber-800">
          {context || t('simulation.banner_default')}
        </span>
      </div>
      <div className="hidden md:flex items-center gap-1 text-[11px] text-amber-700 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>{t('simulation.ai_active', 'Gemini 3.8 Flash & Leaflet active')}</span>
      </div>
    </div>
  );
};
