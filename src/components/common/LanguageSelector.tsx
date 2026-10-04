import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { SupportedLanguage } from '../../i18n/translations';
import { AllIndianLanguagesModal } from './AllIndianLanguagesModal';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'nav' | 'header' | 'inline' | 'compact';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { language, setLanguage, languages, currentLanguageInfo, t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close dropdown on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dropdownOpen) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dropdownOpen]);

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setDropdownOpen(false);
  };

  const isCompact = variant === 'compact';

  return (
    <div ref={dropdownRef} className={`relative inline-flex items-center text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        id="global-language-selector-btn"
        onClick={() => setDropdownOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        aria-label={`Select Language - currently ${currentLanguageInfo.nativeLabel}`}
        className={`group font-semibold text-emerald-200 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-600/60 hover:border-emerald-400 cursor-pointer transition-all duration-150 flex items-center gap-1.5 active:scale-95 shrink-0 select-none shadow-xs hover:shadow-emerald-900/30 ${
          isCompact ? 'px-2 py-1 text-[10px] rounded' : 'px-2.5 py-1.5 text-[11px] rounded-md'
        }`}
        title="Select Language / भाषा चुनें"
      >
        <div className="flex items-center gap-1 shrink-0">
          <Globe className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform duration-200 shrink-0" />
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <span className="font-semibold tracking-tight text-white">
          {currentLanguageInfo.nativeLabel} ({currentLanguageInfo.short})
        </span>

        <ChevronDown
          className={`w-3 h-3 text-emerald-300 transition-transform duration-200 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Language Dropdown Menu */}
      {dropdownOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-1.5 w-56 sm:w-64 max-h-[80vh] overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-xl z-50 py-1.5 text-slate-800 text-xs animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#0B2545]">
            <span>{t('app.select_language', 'Select Language')}</span>
            <span className="text-[10px] text-slate-400 font-mono">13 Bhasha</span>
          </div>

          {/* List of 13 supported languages */}
          <div className="py-1">
            {languages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelectLanguage(item.code)}
                  className={`w-full px-3 py-1.5 flex items-center justify-between transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-semibold">{item.nativeLabel}</span>
                    <span className="text-[10px] text-slate-400">({item.label})</span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Extended Directory Modal Trigger */}
          <div className="pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                setIsModalOpen(true);
              }}
              className="w-full px-3 py-2 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/70 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              <span>{t('app.more_languages', '22+ Bhasha Directory & Audio...')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Complete All Indian Languages Modal / Dedicated Page Overlay */}
      <AllIndianLanguagesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
