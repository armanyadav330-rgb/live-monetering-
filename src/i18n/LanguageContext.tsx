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
  isRtl: boolean;
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
      return 'en';
    } catch {
      return 'en';
    }
  });

  const isRtl = useMemo(() => language === 'ur', [language]);

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
      if (language === 'ur') {
        document.documentElement.dir = 'rtl';
        document.documentElement.classList.add('rtl');
        document.documentElement.classList.remove('ltr');
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.classList.add('ltr');
        document.documentElement.classList.remove('rtl');
      }
    } catch {
      // safe fallback
    }
  }, [language]);

  const currentLanguageInfo = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const t = (key: string, fallback?: string, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations['en'];
    let text = langDict?.[key];

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

    return text || '';
  };

  // Helper to translate user roles dynamically in the active language
  const tRole = (role?: string): string => {
    if (!role) return '';
    const cleanRole = role.toUpperCase();
    const roleKey = `role.${cleanRole.toLowerCase()}`;
    const translated = t(roleKey, '');
    if (translated && translated !== roleKey) {
      return translated;
    }

    // Role fallbacks across common Indian languages
    const roleLabels: Record<string, Record<string, string>> = {
      SUPER_ADMIN: {
        en: 'Super Admin (Apex Command)',
        hi: 'सुपर एडमिन (केंद्रीय मंत्रालय)',
        bn: 'সুপার অ্যাডমিন (কেন্দ্রীয় মন্ত্রণালয়)',
        te: 'సూపర్ అడ్మిన్ (కేంద్ర మంత్రిత్వ శాఖ)',
        mr: 'सुपर ॲडमिन (केंद्रीय मंत्रालय)',
        ta: 'முதன்மை நிர்வாகி (மத்திய அமைச்சகம்)',
        gu: 'સુપર એડમિન (કેન્દ્રીય મંત્રાલય)',
        kn: 'ಸೂಪರ್ ಅಡ್ಮಿನ್ (ಕೇಂದ್ರ ಸಚಿವಾಲಯ)',
        ml: 'സൂപ്പർ അഡ്മിൻ (കേന്ദ്ര മന്ത്രാലയം)',
        pa: 'ਸੁਪਰ ਐਡਮਿਨ (ਕੇਂਦਰੀ ਮੰਤਰਾਲਾ)',
        or: 'ସୁପର ଆଡମିନ (କେନ୍ଦ୍ରୀୟ ମନ୍ତ୍ରଣାଳୟ)',
        as: 'ছুপাৰ এডমিন (কেন্দ্ৰীয় মন্ত্ৰালয়)',
        ur: 'سپر ایڈمن (مرکزی وزارت)',
      },
      DEPARTMENT_OFFICIAL: {
        en: 'Department Official (Joint Secretary)',
        hi: 'विभागीय अधिकारी (संयुक्त सचिव / राज्य स्तर)',
        bn: 'বিভাগীয় কর্মকর্তা (যুগ্ম সচিব)',
        te: 'విభాగ అధికారి (జాయింట్ సెక్రటరీ)',
        mr: 'विभागीय अधिकारी (संयुक्त सचिव)',
        ta: 'துறை அதிகாரி (இணைச் செயலாளர்)',
        gu: 'વિભાગીય અધિકારી (સંયુક્ત સચિવ)',
        kn: 'ಇಲಾಖಾ ಅಧಿಕಾರಿ (ಜಂಟಿ ಕಾರ್ಯದರ್ಶಿ)',
        ml: 'വകുപ്പ് ഉദ്യോഗസ്ഥൻ (ജോയിന്റ് സെക്രട്ടറി)',
        pa: 'ਵਿਭਾਗੀ ਅਧਿਕਾਰੀ (ਸੰਯੁਕਤ ਸਕੱਤਰ)',
        or: 'ବିଭାଗୀୟ ଅଧିକାରୀ (ଯୁଗ୍ମ ସଚିବ)',
        as: 'বিভাগীয় বিষয়া (যুটীয়া সচিব)',
        ur: 'محکمہ جاتی افسر (جوائنٹ سکریٹری)',
      },
      INSPECTION_OFFICER: {
        en: 'Field Inspection Officer',
        hi: 'निरीक्षण अधिकारी (फील्ड ऑडिटर)',
        bn: 'মাঠ পরিদর্শন কর্মকর্তা',
        te: 'ఫీల్డ్ తనిఖీ అధికారి',
        mr: 'क्षेत्रीय तपासणी अधिकारी',
        ta: 'கள ஆய்வு அதிகாரி',
        gu: 'ક્ષેત્ર નિરીક્ષણ અધિકારી',
        kn: 'ಕ್ಷೇತ್ರ ಪರಿಶೀಲನಾ ಅಧಿಕಾರಿ',
        ml: 'ഫീൽഡ് പരിശോധനാ ഉദ്യോഗസ്ഥൻ',
        pa: 'ਫੀਲਡ ਨਿਰੀਖਣ ਅਧਿਕਾਰੀ',
        or: 'କ୍ଷେତ୍ର ପରିଦର୍ଶନ ଅଧିକାରୀ',
        as: 'ক্ষেত্ৰ পৰিদৰ্শন বিষয়া',
        ur: 'فیلڈ معائنہ افسر',
      },
      STATE_DISTRICT_AUTHORITY: {
        en: 'District Authority (DSWO)',
        hi: 'जिला समाज कल्याण अधिकारी (DSWO)',
        bn: 'জেলা সমাজকল্যাণ কর্মকর্তা (DSWO)',
        te: 'జిల్లా సాంఘిక సంక్షేమ అధికారి (DSWO)',
        mr: 'जिल्हा समाजकल्याण अधिकारी (DSWO)',
        ta: 'மாவட்ட சமூக நல அலுவலர் (DSWO)',
        gu: 'જિલ્લા સમાજ કલ્યાણ અધિકારી (DSWO)',
        kn: 'ಜಿಲ್ಲಾ ಸಮಾಜ ಕಲ್ಯಾಣಾಧಿಕಾರಿ (DSWO)',
        ml: 'ജില്ലാ സാമൂഹിക ക്ഷേമ ഓഫീസർ (DSWO)',
        pa: 'ਜ਼ਿਲ੍ਹਾ ਸਮਾਜ ਭਲਾਈ ਅਧਿਕਾਰੀ (DSWO)',
        or: 'ଜିଲ୍ଲା ସମାଜ ମଙ୍ଗଳ ଅଧିକାରୀ (DSWO)',
        as: 'জিলা সমাজ কল্যাণ বিষয়া (DSWO)',
        ur: 'ضلعی سماجی بہبود افسر (DSWO)',
      },
      NGO_INSTITUTE: {
        en: 'NGO / Institute Superintendent',
        hi: 'एनजीओ / संस्थान अधीक्षक',
        bn: 'এনজিও / প্রতিষ্ঠান সুপারিনটেনডেন্ট',
        te: 'ఎన్జీఓ / సంస్థ సూపరింటెండెంట్',
        mr: 'एनजीओ / संस्था अधीक्षक',
        ta: 'என்ஜிஓ / நிறுவன கண்காணிப்பாளர்',
        gu: 'એનજીઓ / સંસ્થા અધિક્ષક',
        kn: 'ಎನ್‌ಜಿಒ / ಸಂಸ್ಥೆಯ ಅಧೀಕ್ಷಕರು',
        ml: 'എൻ‌ജി‌ഒ / ഇൻസ്റ്റിറ്റ്യൂട്ട് സൂപ്രണ്ട്',
        pa: 'ਐਨਜੀਓ / ਸੰਸਥਾ ਸੁਪਰਡੈਂਟ',
        or: 'ଏନଜିଓ / ଅନୁଷ୍ଠାନ ଅଧୀକ୍ଷକ',
        as: 'এনজিঅ’ / প্ৰতিষ্ঠান অধীক্ষক',
        ur: 'این جی او / ادارہ سپرنٹنڈنٹ',
      },
      VIEWER: {
        en: 'Public Observer',
        hi: 'सार्वजनिक पर्यवेक्षक',
        bn: 'সাধারণ পর্যবেক্ষক',
        te: 'ప్రజా పరిశీలకుడు',
        mr: 'सार्वजनिक निरीक्षक',
        ta: 'பொது பார்வையாளர்',
        gu: 'જાહેર નિરીક્ષક',
        kn: 'ಸಾರ್ವಜನಿಕ ವೀಕ್ಷಕರು',
        ml: 'പൊതു നിരീക്ഷകൻ',
        pa: 'ਜਨਤਕ ਨਿਰੀਖਕ',
        or: 'ସର୍ବସାଧାରଣ ପର୍ଯ୍ୟବେକ୍ଷକ',
        as: 'সাধাৰণ পৰ্যবেক্ষক',
        ur: 'عوامی مبصر',
      },
    };

    const map = roleLabels[cleanRole];
    if (map) {
      return map[language] || map['en'] || cleanRole.replace(/_/g, ' ');
    }
    return role.replace(/_/g, ' ');
  };

  // Helper to translate status tags dynamically
  const tStatus = (status?: string): string => {
    if (!status) return '';
    const clean = status.toUpperCase();
    const statusKey = `status.${clean.toLowerCase()}`;
    const translated = t(statusKey, '');
    if (translated && translated !== statusKey) {
      return translated;
    }

    const statusMap: Record<string, Record<string, string>> = {
      ACTIVE: {
        en: 'Active',
        hi: 'सक्रिय',
        bn: 'সক্রিয়',
        te: 'యాక్టివ్',
        mr: 'सक्रिय',
        ta: 'செயலில்',
        gu: 'સક્રિય',
        kn: 'ಸಕ್ರಿಯ',
        ml: 'സജീവം',
        pa: 'ਸਰਗਰਮ',
        or: 'ସକ୍ରିୟ',
        as: 'সক্ৰিয়',
        ur: 'فعال',
      },
      PENDING: {
        en: 'Pending',
        hi: 'लंबित',
        bn: 'মুলতবি',
        te: 'పెండింగ్',
        mr: 'प्रलंबित',
        ta: 'நிலுவையில்',
        gu: 'બાકી',
        kn: 'ಬಾಕಿ',
        ml: 'തീർച്ചപ്പെടുത്തിയിട്ടില്ല',
        pa: 'ਬਕਾਇਆ',
        or: 'ବାକି',
        as: 'বাকী থকা',
        ur: 'زیر التواء',
      },
      IN_PROGRESS: {
        en: 'In Progress',
        hi: 'प्रगति पर',
        bn: 'চলমান',
        te: 'పురోగతిలో ఉంది',
        mr: 'प्रगतीपथावर',
        ta: 'செயல்பாட்டில்',
        gu: 'પ્રગતિમાં',
        kn: 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
        ml: 'പുരോഗമിക്കുന്നു',
        pa: 'ਪ੍ਰਗਤੀ ਅਧੀਨ',
        or: 'ଚାଲୁଅଛି',
        as: 'চলি থকা',
        ur: 'جاری ہے',
      },
      COMPLETED: {
        en: 'Completed',
        hi: 'पूर्ण',
        bn: 'সম্পন্ন',
        te: 'పూర్తయింది',
        mr: 'पूर्ण',
        ta: 'முடிந்தது',
        gu: 'પૂર્ણ',
        kn: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
        ml: 'പൂർത്തിയായി',
        pa: 'ਮੁਕੰਮਲ',
        or: 'ସମ୍ପନ୍ନ',
        as: 'সম্পূৰ্ণ হ’ল',
        ur: 'مکمل',
      },
      VERIFIED: {
        en: 'Verified',
        hi: 'सत्यापित',
        bn: 'যাচাইকৃত',
        te: 'ధృవీకరించబడింది',
        mr: 'सत्यापित',
        ta: 'சரிபார்க்கப்பட்டது',
        gu: 'ચકાસાયેલ',
        kn: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
        ml: 'പരിശോധിച്ചു',
        pa: 'ਪ੍ਰਮਾਣਿਤ',
        or: 'ଯାଞ୍ଚ ହୋଇଛି',
        as: 'পৰীক্ষিত',
        ur: 'تصدیق شدہ',
      },
      SUSPENDED: {
        en: 'Suspended',
        hi: 'निलंबित',
        bn: 'স্থগিত',
        te: 'సస్పెండ్ చేయబడింది',
        mr: 'निलंबित',
        ta: 'நிறுத்தி வைக்கப்பட்டது',
        gu: 'નિલંબિત',
        kn: 'ಅಮಾನತುಗೊಳಿಸಲಾಗಿದೆ',
        ml: 'സസ്പെൻഡ് ചെയ്തു',
        pa: 'ਮੁਅੱਤਲ',
        or: 'ନିଲମ୍ବିତ',
        as: 'স্থগিত',
        ur: 'معطل',
      },
      UNDER_REVIEW: {
        en: 'Under Review',
        hi: 'समीक्षाधीन',
        bn: 'পর্যালোচনাধীন',
        te: 'సమీక్షలో ఉంది',
        mr: 'पुनरावलोकनाधीन',
        ta: 'மதிப்பாய்வில்',
        gu: 'સમીક્ષા હેઠળ',
        kn: 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
        ml: 'പരിശോധനയിലാണ്',
        pa: 'ਸਮੀਖਿਆ ਅਧੀਨ',
        or: 'ସମୀକ୍ଷାଧୀନ',
        as: 'পৰ্যালোচনাত আছে',
        ur: 'زیر غور',
      },
      SCHEDULED: {
        en: 'Scheduled',
        hi: 'निर्धारित',
        bn: 'নির্ধারিত',
        te: 'షెడ్యూల్ చేయబడింది',
        mr: 'नियोजित',
        ta: 'திட்டமிடப்பட்டது',
        gu: 'નિયુક્ત',
        kn: 'ನಿಗದಿಪಡಿಸಲಾಗಿದೆ',
        ml: 'ഷെഡ്യൂൾ ചെയ്തു',
        pa: 'ਨਿਰਧਾਰਤ',
        or: 'ନିର୍ଦ୍ଧାରିତ',
        as: 'নিৰ্ধাৰিত',
        ur: 'طے شدہ',
      },
      CANCELLED: {
        en: 'Cancelled',
        hi: 'रद्द',
        bn: 'বাতিল',
        te: 'రద్దు చేయబడింది',
        mr: 'रद्द केले',
        ta: 'ரத்து செய்யப்பட்டது',
        gu: 'રદ',
        kn: 'ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ',
        ml: 'റദ്ദാക്കി',
        pa: 'ਰੱਦ ਕੀਤਾ ਗਿਆ',
        or: 'ବାତିଲ',
        as: 'বাতিল',
        ur: 'منسوخ',
      },
    };

    const map = statusMap[clean];
    if (map) {
      return map[language] || map['en'] || status;
    }
    return status;
  };

  // Helper to translate risk ratings dynamically
  const tRisk = (risk?: string): string => {
    if (!risk) return '';
    const clean = risk.toUpperCase();
    const riskKey = `risk.${clean.toLowerCase()}`;
    const translated = t(riskKey, '');
    if (translated && translated !== riskKey) {
      return translated;
    }

    const riskMap: Record<string, Record<string, string>> = {
      CRITICAL: {
        en: 'Critical Risk',
        hi: 'गंभीर जोखिम',
        bn: 'সংকটজনক ঝুঁকি',
        te: 'కీలకమైన రిస్క్',
        mr: 'गंभीर जोखीम',
        ta: 'மிக முக்கியமான ஆபத்து',
        gu: 'ગંભીર જોખમ',
        kn: 'ಗಂಭೀರ ಅಪಾಯ',
        ml: 'ഗുരുതരമായ അപകടസാധ്യത',
        pa: 'ਗੰਭੀਰ ਜੋਖਮ',
        or: 'ଗୁରୁତର ବିପଦ',
        as: 'গুৰুতৰ বিপদ',
        ur: 'انتہائی خطرناک',
      },
      HIGH: {
        en: 'High Risk',
        hi: 'उच्च जोखिम',
        bn: 'উচ্চ ঝুঁকি',
        te: 'అధిక రిస్క్',
        mr: 'उच्च जोखीम',
        ta: 'அதிக ஆபத்து',
        gu: 'ઉચ્ચ જોખમ',
        kn: 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
        ml: 'ഉയർന്ന അപകടസാധ്യത',
        pa: 'ਉੱਚ ਜੋਖਮ',
        or: 'ଉଚ୍ଚ ବିପଦ',
        as: 'উচ্চ বিপদ',
        ur: 'زیادہ خطرہ',
      },
      MEDIUM: {
        en: 'Medium Risk',
        hi: 'मध्यम जोखिम',
        bn: 'মাঝারি ঝুঁকি',
        te: 'మధ్యస్థ రిస్క్',
        mr: 'मध्यम जोखीम',
        ta: 'நடுத்தர ஆபத்து',
        gu: 'મધ્યમ જોખમ',
        kn: 'ಮಧ್ಯಮ ಅಪಾಯ',
        ml: 'ഇടത്തരം അപകടസാധ്യത',
        pa: 'ਦਰਮਿਆਨਾ ਜੋਖਮ',
        or: 'ମଧ୍ୟମ ବିପଦ',
        as: 'মধ্যম বিপদ',
        ur: 'درمیانہ خطرہ',
      },
      LOW: {
        en: 'Low Risk',
        hi: 'निम्न जोखिम',
        bn: 'কম ঝুঁকি',
        te: 'తక్కువ రిస్క్',
        mr: 'कमी जोखीम',
        ta: 'குறைந்த ஆபத்து',
        gu: 'ઓછું જોખમ',
        kn: 'ಕಡಿಮೆ ಅಪಾಯ',
        ml: 'കുറഞ്ഞ അപകടസാധ്യത',
        pa: 'ਘੱਟ ਜੋਖਮ',
        or: 'କମ ବିପଦ',
        as: 'কম বিপদ',
        ur: 'کم خطرہ',
      },
    };

    const map = riskMap[clean];
    if (map) {
      return map[language] || map['en'] || risk;
    }
    return risk;
  };

  const value: LanguageContextType = {
    language,
    lang: language,
    setLanguage,
    languages: SUPPORTED_LANGUAGES,
    currentLanguageInfo,
    isRtl,
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
