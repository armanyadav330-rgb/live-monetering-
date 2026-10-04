import en from './en';
import hi from './hi';
import bn from './bn';
import te from './te';
import mr from './mr';
import ta from './ta';
import gu from './gu';
import kn from './kn';
import ml from './ml';
import pa from './pa';
import or from './or';
import as from './as';
import ur from './ur';

export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'bn'
  | 'te'
  | 'mr'
  | 'ta'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'as'
  | 'ur';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  short: string;
  isRtl?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', short: 'EN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', short: 'HI' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', short: 'BN' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', short: 'TE' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', short: 'MR' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', short: 'TA' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', short: 'GU' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', short: 'KN' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', short: 'ML' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', short: 'PA' },
  { code: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ', short: 'OR' },
  { code: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া', short: 'AS' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', short: 'UR', isRtl: true },
];

export const translations: Record<SupportedLanguage, Record<string, string>> = {
  en,
  hi,
  bn,
  te,
  mr,
  ta,
  gu,
  kn,
  ml,
  pa,
  or,
  as,
  ur,
};

export { en, hi, bn, te, mr, ta, gu, kn, ml, pa, or, as, ur };
