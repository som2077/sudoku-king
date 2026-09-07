export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  priority: 'Tier 1' | 'Tier 2' | 'Tier 3';
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  // ── Tier 1: Core Launch Languages (80% Global Revenue) ──
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global', priority: 'Tier 1', flag: '🇺🇸' },
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文', region: 'China', priority: 'Tier 1', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'Japan', priority: 'Tier 1', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'South Korea', priority: 'Tier 1', flag: '🇰🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'Spain & LATAM', priority: 'Tier 1', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Germany & Austria', priority: 'Tier 1', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'France & Canada', priority: 'Tier 1', flag: '🇫🇷' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', region: 'Brazil', priority: 'Tier 1', flag: '🇧🇷' },

  // ── Tier 2: Growth Markets (90% Revenue Coverage) ──
  { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Eastern Europe', priority: 'Tier 2', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'Italy', priority: 'Tier 2', flag: '🇮🇹' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'MENA', priority: 'Tier 2', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'India', priority: 'Tier 2', flag: '🇮🇳' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Indonesia', priority: 'Tier 2', flag: '🇮🇩' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', region: 'Turkey', priority: 'Tier 2', flag: '🇹🇷' },

  // ── Tier 3: Scale & Niche High-ARPU Markets ──
  { code: 'th', name: 'Thai', nativeName: 'ไทย', region: 'Thailand', priority: 'Tier 3', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Vietnam', priority: 'Tier 3', flag: '🇻🇳' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', region: 'Poland', priority: 'Tier 3', flag: '🇵🇱' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', region: 'Taiwan & HK', priority: 'Tier 3', flag: '🇹🇼' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', region: 'Netherlands & Belgium', priority: 'Tier 3', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', region: 'Sweden & Nordic', priority: 'Tier 3', flag: '🇸🇪' },
];

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];
