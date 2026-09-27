import React, { useState } from 'react';
import { Globe, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { AllIndianLanguagesModal } from './AllIndianLanguagesModal';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'nav' | 'header' | 'inline';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
}) => {
  const { currentLanguageInfo } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Global Language Selector Button */}
      <button
        type="button"
        id="global-language-selector-btn"
        onClick={() => setIsModalOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Select Language - currently ${currentLanguageInfo.nativeLabel}. Click to open Indian Languages directory`}
        className="group font-semibold text-emerald-200 bg-emerald-950/90 hover:bg-emerald-900 px-2.5 py-1 rounded-md border border-emerald-600/60 hover:border-emerald-400 cursor-pointer transition-all duration-150 flex items-center gap-1.5 text-[11px] active:scale-95 shrink-0 select-none shadow-xs hover:shadow-emerald-900/30"
        title="Click to view all languages spoken in India / भारत में बोली जाने वाली सभी भाषाएं देखें"
      >
        <div className="flex items-center gap-1 shrink-0">
          <Globe className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform duration-200 shrink-0" />
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <span className="font-medium tracking-tight text-white">
          {currentLanguageInfo.nativeLabel} ({currentLanguageInfo.short})
        </span>

        <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          <span>22+ Languages</span>
        </span>
      </button>

      {/* Complete All Indian Languages Modal / Dedicated Page Overlay */}
      <AllIndianLanguagesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

