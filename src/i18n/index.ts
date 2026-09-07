import { SUPPORTED_LANGUAGES, LanguageMeta, LanguageCode } from './languages';
import { TRANSLATIONS, TranslationKey } from './translations';
import { useGameStore } from '../store/useGameStore';

export { SUPPORTED_LANGUAGES, LanguageMeta, LanguageCode, TranslationKey };

export function getTranslation(key: TranslationKey, lang?: string): string {
  const currentLang = lang || useGameStore.getState().settings?.language || 'en';
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
  return dict[key] || TRANSLATIONS['en']?.[key] || key;
}

export function useTranslation() {
  const language = useGameStore((s) => s.settings?.language) || 'en';
  const t = (key: TranslationKey, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS['en'];
    return dict[key] || TRANSLATIONS['en']?.[key] || fallback || key;
  };
  return { t, language, supportedLanguages: SUPPORTED_LANGUAGES };
}
