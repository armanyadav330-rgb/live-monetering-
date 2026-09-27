import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  LanguageOption,
  translations,
} from './translations';

const STORAGE_KEY = 'satya_nirakshak_language';

interface LanguageContextType {
  language: SupportedLanguage;
  lang: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  languages: LanguageOption[];
  currentLanguageInfo: LanguageOption;
  t: (key: string, fallback?: string, params?: Record<string, string | number>) => string;
  tRole: (role?: string) => string;
  tStatus: (status?: string) => string;
  tRisk: (risk?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) {
        return stored;
      }
      // Check browser language or default to 'en'
      return 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (newLang: SupportedLanguage) => {
    if (SUPPORTED_LANGUAGES.some((l) => l.code === newLang)) {
      setLanguageState(newLang);
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch (err) {
        console.warn('Failed to persist language in localStorage', err);
      }
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // safe fallback
    }
  }, [language]);

  const currentLanguageInfo = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const t = (key: string, fallback?: string, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations['en'];
    let text = langDict[key];

    if (!text && language !== 'en') {
      // Fallback to English
      text = translations['en']?.[key];
    }

    if (!text) {
      if (fallback !== undefined) {
        text = fallback;
      } else {
        // Humanize key instead of showing raw key
        const lastPart = key.split('.').pop() || key;
        text = lastPart
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }

    if (params && typeof text === 'string') {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return text;
  };

  // Helper to translate user roles dynamically in the active language
  const tRole = (role?: string): string => {
    if (!role) return '';
    const cleanRole = role.toUpperCase();
    const roleKey = `role.${cleanRole.toLowerCase()}`;

    // Common role labels in each language
    const roleLabels: Record<SupportedLanguage, Record<string, string>> = {
      en: {
        SUPER_ADMIN: 'Super Admin (Apex Command)',
        DEPARTMENT_OFFICIAL: 'Department Official (Joint Secretary)',
        INSPECTION_OFFICER: 'Field Inspection Officer',
        STATE_DISTRICT_AUTHORITY: 'District Authority (DSWO)',
        NGO_INSTITUTE: 'NGO / Institute Superintendent',
        VIEWER: 'Public Observer',
      },
      hi: {
        SUPER_ADMIN: 'सुपर एडमिन (केंद्रीय मंत्रालय)',
        DEPARTMENT_OFFICIAL: 'विभागीय अधिकारी (संयुक्त सचिव / राज्य स्तर)',
        INSPECTION_OFFICER: 'निरीक्षण अधिकारी (फील्ड ऑडिटर)',
        STATE_DISTRICT_AUTHORITY: 'जिला समाज कल्याण अधिकारी (DSWO)',
        NGO_INSTITUTE: 'एनजीओ / संस्थान अधीक्षक',
        VIEWER: 'सार्वजनिक पर्यवेक्षक',
      },
      bn: {
        SUPER_ADMIN: 'সুপার অ্যাডমিন (কেন্দ্রীয় মন্ত্রণালয়)',
        DEPARTMENT_OFFICIAL: 'বিভাগীয় কর্মকর্তা (যুগ্ম সচিব)',
        INSPECTION_OFFICER: 'মাঠ পরিদর্শন কর্মকর্তা',
        STATE_DISTRICT_AUTHORITY: 'জেলা সমাজকল্যাণ কর্মকর্তা (DSWO)',
        NGO_INSTITUTE: 'এনজিও / প্রতিষ্ঠান সুপারিনটেনডেন্ট',
        VIEWER: 'সাধারণ পর্যবেক্ষক',
      },
      ta: {
        SUPER_ADMIN: 'முதன்மை நிர்வாகி (மத்திய அமைச்சகம்)',
        DEPARTMENT_OFFICIAL: 'துறை அதிகாரி (இணைச் செயலாளர்)',
        INSPECTION_OFFICER: 'கள ஆய்வு அதிகாரி',
        STATE_DISTRICT_AUTHORITY: 'மாவட்ட சமூக நல அலுவலர் (DSWO)',
        NGO_INSTITUTE: 'என்ஜிஓ / நிறுவன கண்காணிப்பாளர்',
        VIEWER: 'பொது பார்வையாளர்',
      },
      te: {
        SUPER_ADMIN: 'సూపర్ అడ్మిన్ (కేంద్ర మంత్రిత్వ శాఖ)',
        DEPARTMENT_OFFICIAL: 'విభాగ అధికారి (జాయింట్ సెక్రటరీ)',
        INSPECTION_OFFICER: 'ఫీల్డ్ తనిఖీ అధికారి',
        STATE_DISTRICT_AUTHORITY: 'జిల్లా సాంఘిక సంక్షేమ అధికారి (DSWO)',
        NGO_INSTITUTE: 'ఎన్జీఓ / సంస్థ సూపరింటెండెంట్',
        VIEWER: 'ప్రజా పరిశీలకుడు',
      },
      mr: {
        SUPER_ADMIN: 'सुपर ॲडमिन (केंद्रीय मंत्रालय)',
        DEPARTMENT_OFFICIAL: 'विभागीय अधिकारी (संयुक्त सचिव)',
        INSPECTION_OFFICER: 'क्षेत्रीय तपासणी अधिकारी',
        STATE_DISTRICT_AUTHORITY: 'जिल्हा समाजकल्याण अधिकारी (DSWO)',
        NGO_INSTITUTE: 'एनजीओ / संस्था अधीक्षक',
        VIEWER: 'सार्वजनिक निरीक्षक',
      },
    };

    const currentDict = roleLabels[language] || roleLabels['en'];
    return currentDict[cleanRole] || roleLabels['en'][cleanRole] || role.replace(/_/g, ' ');
  };

  // Helper to translate status tags dynamically
  const tStatus = (status?: string): string => {
    if (!status) return '';
    const clean = status.toUpperCase();
    const statusMap: Record<SupportedLanguage, Record<string, string>> = {
      en: {
        ACTIVE: 'Active',
        PENDING: 'Pending',
        IN_PROGRESS: 'In Progress',
        COMPLETED: 'Completed',
        VERIFIED: 'Verified',
        SUSPENDED: 'Suspended',
        UNDER_REVIEW: 'Under Review',
        SCHEDULED: 'Scheduled',
        CANCELLED: 'Cancelled',
      },
      hi: {
        ACTIVE: 'सक्रिय',
        PENDING: 'लंबित',
        IN_PROGRESS: 'प्रगति पर',
        COMPLETED: 'पूर्ण',
        VERIFIED: 'सत्यापित',
        SUSPENDED: 'निलंबित',
        UNDER_REVIEW: 'समीक्षाधीन',
        SCHEDULED: 'निर्धारित',
        CANCELLED: 'रद्द',
      },
      bn: {
        ACTIVE: 'সক্রিয়',
        PENDING: 'মুলতবি',
        IN_PROGRESS: 'চলমান',
        COMPLETED: 'সম্পন্ন',
        VERIFIED: 'যাচাইকৃত',
        SUSPENDED: 'স্থগিত',
        UNDER_REVIEW: 'পর্যালোচনাধীন',
        SCHEDULED: 'নির্ধারিত',
        CANCELLED: 'বাতিল',
      },
      ta: {
        ACTIVE: 'செயலில்',
        PENDING: 'நிலுவையில்',
        IN_PROGRESS: 'செயல்பாட்டில்',
        COMPLETED: 'முடிந்தது',
        VERIFIED: 'சரிபார்க்கப்பட்டது',
        SUSPENDED: 'நிறுத்தி வைக்கப்பட்டது',
        UNDER_REVIEW: 'மதிப்பாய்வில்',
        SCHEDULED: 'திட்டமிடப்பட்டது',
        CANCELLED: 'ரத்து செய்யப்பட்டது',
      },
      te: {
        ACTIVE: 'యాక్టివ్',
        PENDING: 'పెండింగ్',
        IN_PROGRESS: 'పురోగతిలో ఉంది',
        COMPLETED: 'పూర్తయింది',
        VERIFIED: 'ధృవీకరించబడింది',
        SUSPENDED: 'సస్పెండ్ చేయబడింది',
        UNDER_REVIEW: 'సమీక్షలో ఉంది',
        SCHEDULED: 'షెడ్యూల్ చేయబడింది',
        CANCELLED: 'రద్దు చేయబడింది',
      },
      mr: {
        ACTIVE: 'सक्रिय',
        PENDING: 'प्रलंबित',
        IN_PROGRESS: 'प्रगतीपथावर',
        COMPLETED: 'पूर्ण',
        VERIFIED: 'सत्यापित',
        SUSPENDED: 'निलंबित',
        UNDER_REVIEW: 'पुनरावलोकनाधीन',
        SCHEDULED: 'नियोजित',
        CANCELLED: 'रद्द केले',
      },
    };

    const dict = statusMap[language] || statusMap['en'];
    return dict[clean] || statusMap['en'][clean] || status;
  };

  // Helper to translate risk ratings dynamically
  const tRisk = (risk?: string): string => {
    if (!risk) return '';
    const clean = risk.toUpperCase();
    const riskMap: Record<SupportedLanguage, Record<string, string>> = {
      en: {
        CRITICAL: 'Critical Risk',
        HIGH: 'High Risk',
        MEDIUM: 'Medium Risk',
        LOW: 'Low Risk',
      },
      hi: {
        CRITICAL: 'गंभीर जोखिम',
        HIGH: 'उच्च जोखिम',
        MEDIUM: 'मध्यम जोखिम',
        LOW: 'निम्न जोखिम',
      },
      bn: {
        CRITICAL: 'সংকটজনক ঝুঁকি',
        HIGH: 'উচ্চ ঝুঁকি',
        MEDIUM: 'মাঝারি ঝুঁকি',
        LOW: 'কম ঝুঁকি',
      },
      ta: {
        CRITICAL: 'மிக முக்கியமான ஆபத்து',
        HIGH: 'அதிக ஆபத்து',
        MEDIUM: 'நடுத்தர ஆபத்து',
        LOW: 'குறைந்த ஆபத்து',
      },
      te: {
        CRITICAL: 'కీలకమైన రిస్క్',
        HIGH: 'అధిక రిస్క్',
        MEDIUM: 'మధ్యస్థ రిస్క్',
        LOW: 'తక్కువ రిస్క్',
      },
      mr: {
        CRITICAL: 'गंभीर जोखीम',
        HIGH: 'उच्च जोखीम',
        MEDIUM: 'मध्यम जोखीम',
        LOW: 'कमी जोखीम',
      },
    };

    const dict = riskMap[language] || riskMap['en'];
    return dict[clean] || riskMap['en'][clean] || risk;
  };

  const value: LanguageContextType = {
    language,
    lang: language,
    setLanguage,
    languages: SUPPORTED_LANGUAGES,
    currentLanguageInfo,
    t,
    tRole,
    tStatus,
    tRisk,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
