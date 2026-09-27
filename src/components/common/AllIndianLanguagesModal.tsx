import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  Volume2,
  Check,
  Globe,
  Sparkles,
  Award,
  BookOpen,
  MapPin,
  Users,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { INDIAN_LANGUAGES, IndianLanguage } from '../../data/indianLanguages';
import { useTranslation } from '../../i18n/LanguageContext';
import { SupportedLanguage } from '../../i18n/translations';

interface AllIndianLanguagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterCategory = 'all' | 'schedule8' | 'classical' | 'regional_tribal' | 'north' | 'south' | 'east' | 'west' | 'northeast' | 'central';

export const AllIndianLanguagesModal: React.FC<AllIndianLanguagesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [playingLangId, setPlayingLangId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Filter languages based on search and category
  const filteredLanguages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return INDIAN_LANGUAGES.filter((item) => {
      // Category filter
      if (activeCategory === 'schedule8' && !item.schedule8) return false;
      if (activeCategory === 'classical' && !item.isClassical) return false;
      if (activeCategory === 'regional_tribal' && item.category !== 'regional' && item.category !== 'tribal') return false;
      if (activeCategory === 'north' && item.region !== 'north') return false;
      if (activeCategory === 'south' && item.region !== 'south') return false;
      if (activeCategory === 'east' && item.region !== 'east') return false;
      if (activeCategory === 'west' && item.region !== 'west') return false;
      if (activeCategory === 'northeast' && item.region !== 'northeast') return false;
      if (activeCategory === 'central' && item.region !== 'central') return false;

      // Text search
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.nativeName.toLowerCase().includes(query) ||
        item.script.toLowerCase().includes(query) ||
        item.family.toLowerCase().includes(query) ||
        item.primaryStates.some((st) => st.toLowerCase().includes(query)) ||
        item.description.toLowerCase().includes(query)
      );
    });
  }, [searchTerm, activeCategory]);

  // Pronounce or speak greeting
  const handlePlayGreeting = (lang: IndianLanguage) => {
    if (!('speechSynthesis' in window)) {
      setToastMessage(`Audio playback not supported in this browser.`);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      setPlayingLangId(lang.id);

      const utterance = new SpeechSynthesisUtterance(lang.sampleGreeting);
      // Try to assign appropriate language code if voice exists
      utterance.lang = lang.bhashiniCode || (lang.portalCode ? lang.portalCode : 'hi-IN');
      utterance.rate = 0.9;

      utterance.onend = () => {
        setPlayingLangId(null);
      };
      utterance.onerror = () => {
        setPlayingLangId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setPlayingLangId(null);
    }
  };

  // Switch or activate language
  const handleSelectLanguage = (lang: IndianLanguage) => {
    if (lang.supportedInPortalUI && lang.portalCode) {
      setLanguage(lang.portalCode as SupportedLanguage);
      setToastMessage(`Portal language switched to ${lang.nativeName} (${lang.name})!`);
      // Optional: keep modal or auto close after 1s
    } else {
      // Non-portal UI language: activate AI assistant Bhashini mode for this language
      setToastMessage(
        `AI Multilingual Engine activated for ${lang.nativeName} (${lang.name}). Voice & AI queries will respond in ${lang.name}!`
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="all-indian-languages-modal-overlay"
      className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="all-indian-languages-modal"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
      >
        {/* MODAL HEADER WITH TRICOLOR TOP BAR */}
        <div className="h-1.5 w-full grid grid-cols-3 shrink-0">
          <div className="bg-[#FF9933]" />
          <div className="bg-white" />
          <div className="bg-[#138808]" />
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-[#0B2545] text-white flex items-center justify-between gap-3 shrink-0 border-b border-blue-900">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-amber-400 shrink-0">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight truncate">
                  Languages of India / भारत की भाषाएं
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                  {INDIAN_LANGUAGES.length} Documented Tongues
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                  8th Schedule &amp; Classical
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate mt-0.5">
                Constitution of India (Eighth Schedule) · Census Linguistic Survey · Bhashini AI Multilingual Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              id="close-indian-languages-modal-btn"
              className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer"
              title="Close (Esc)"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between gap-2 shadow-inner shrink-0 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/80 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* CONTROLS: SEARCH & CATEGORY FILTER TABS */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 space-y-3 shrink-0">
          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="indian-languages-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by language name (Hindi, বাংলা, Tamil, Maithili), script (Devanagari, Ol Chiki), state (Bihar, Assam, Kerala)..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* FILTER PILLS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Category:
            </span>
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg font-medium transition shrink-0 cursor-pointer text-xs ${
                activeCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All Languages ({INDIAN_LANGUAGES.length})
            </button>
            <button
              onClick={() => setActiveCategory('schedule8')}
              className={`px-3 py-1 rounded-lg font-medium transition shrink-0 cursor-pointer text-xs ${
                activeCategory === 'schedule8'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              8th Schedule Official (22)
            </button>
            <button
              onClick={() => setActiveCategory('classical')}
              className={`px-3 py-1 rounded-lg font-medium transition shrink-0 cursor-pointer text-xs ${
                activeCategory === 'classical'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Classical Languages (6)
            </button>
            <button
              onClick={() => setActiveCategory('regional_tribal')}
              className={`px-3 py-1 rounded-lg font-medium transition shrink-0 cursor-pointer text-xs ${
                activeCategory === 'regional_tribal'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Regional &amp; Tribal (15)
            </button>

            <span className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1 shrink-0" />

            <button
              onClick={() => setActiveCategory('north')}
              className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 cursor-pointer text-xs ${
                activeCategory === 'north'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              North
            </button>
            <button
              onClick={() => setActiveCategory('south')}
              className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 cursor-pointer text-xs ${
                activeCategory === 'south'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              South
            </button>
            <button
              onClick={() => setActiveCategory('east')}
              className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 cursor-pointer text-xs ${
                activeCategory === 'east'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              East
            </button>
            <button
              onClick={() => setActiveCategory('west')}
              className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 cursor-pointer text-xs ${
                activeCategory === 'west'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              West
            </button>
            <button
              onClick={() => setActiveCategory('northeast')}
              className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 cursor-pointer text-xs ${
                activeCategory === 'northeast'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Northeast
            </button>
            <button
              onClick={() => setActiveCategory('central')}
              className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 cursor-pointer text-xs ${
                activeCategory === 'central'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Central
            </button>
          </div>
        </div>

        {/* SCROLLABLE LANGUAGE CARDS GRID */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* QUICK PROMINENT STATUS BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-200 dark:border-blue-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-blue-900 dark:text-blue-200">
                  8th Schedule
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  22 Recognized Official Languages
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-900 dark:text-emerald-200">
                  Classical Tongues
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  6 Ancient Classical Languages
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-200">
                  Speakers Covered
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  140+ Crore Citizens
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-bold text-indigo-900 dark:text-indigo-200">
                  Bhashini AI Engine
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  Live Voice &amp; Chat Synthesis
                </div>
              </div>
            </div>
          </div>

          {/* EMPTY SEARCH RESULT */}
          {filteredLanguages.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Globe className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No Indian languages found matching &ldquo;{searchTerm}&rdquo;.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for another state, script, or language name (e.g. Hindi, Bengali, Tamil, Punjabi, Odia).
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
                className="mt-3 px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          )}

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredLanguages.map((lang) => {
              const isCurrentPortalLanguage =
                lang.supportedInPortalUI && lang.portalCode === language;
              const isAudioPlaying = playingLangId === lang.id;

              return (
                <div
                  key={lang.id}
                  id={`indian-lang-card-${lang.id}`}
                  className={`relative p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isCurrentPortalLanguage
                      ? 'bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/30 dark:to-slate-900 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
                  }`}
                >
                  {/* CARD HEADER */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {/* Native Script Display */}
                        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight font-serif">
                          {lang.nativeName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            {lang.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {lang.family}
                          </span>
                        </div>
                      </div>

                      {/* BADGES */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {isCurrentPortalLanguage && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-2xs">
                            <Check className="w-3 h-3" />
                            <span>Active Portal</span>
                          </span>
                        )}

                        {lang.schedule8 && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            8th Schedule
                          </span>
                        )}

                        {lang.isClassical && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                            Classical
                          </span>
                        )}

                        {lang.category === 'tribal' && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                            Tribal Tongue
                          </span>
                        )}
                      </div>
                    </div>

                    {/* METRICS & SCRIPT INFO */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                          Speakers in India
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {lang.speakers} ({lang.speakerPercentage})
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                          Writing Script
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                          {lang.script}
                        </span>
                      </div>
                    </div>

                    {/* PRIMARY STATES */}
                    <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <div className="leading-snug">
                        <span className="font-semibold text-slate-700 dark:text-slate-200 mr-1">
                          States:
                        </span>
                        <span>{lang.primaryStates.slice(0, 4).join(', ')}</span>
                        {lang.primaryStates.length > 4 && (
                          <span className="text-slate-400">
                            {' '}
                            +{lang.primaryStates.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* SAMPLE GREETING & AUDIO */}
                    <div className="mt-3 p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                          Official Greeting / अभिवादन
                        </span>
                        <button
                          onClick={() => handlePlayGreeting(lang)}
                          className={`p-1 rounded-md text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                            isAudioPlaying
                              ? 'bg-blue-600 text-white animate-pulse'
                              : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200'
                          }`}
                          title={`Listen to ${lang.name} greeting`}
                        >
                          <Volume2 className="w-3 h-3" />
                          <span className="text-[9px]">
                            {isAudioPlaying ? 'Playing...' : 'Pronounce'}
                          </span>
                        </button>
                      </div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 italic font-serif">
                        &ldquo;{lang.sampleGreeting}&rdquo;
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {lang.sampleGreetingEnglish}
                      </p>
                    </div>
                  </div>

                  {/* ACTION BUTTON */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {lang.supportedInPortalUI ? (
                      <button
                        onClick={() => handleSelectLanguage(lang)}
                        disabled={isCurrentPortalLanguage}
                        id={`btn-select-lang-${lang.id}`}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          isCurrentPortalLanguage
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        }`}
                      >
                        {isCurrentPortalLanguage ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Currently Active in Portal / सक्रिय</span>
                          </>
                        ) : (
                          <>
                            <Globe className="w-3.5 h-3.5" />
                            <span>Set as Portal Language / भाषा चुनें</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectLanguage(lang)}
                        id={`btn-activate-ai-lang-${lang.id}`}
                        className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                        title="Enable AI Voice & Chatbot interaction in this Indian language"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Enable AI Bhashini Voice Assistant</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-4 sm:px-6 py-3 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              National Digital Bhashini Mission · Department of Social Justice &amp; Empowerment (DoSJE)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              Showing {filteredLanguages.length} of {INDIAN_LANGUAGES.length} Indian Languages
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#0B2545] hover:bg-blue-900 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Close / बंद करें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
