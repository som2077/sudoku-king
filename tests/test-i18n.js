async function run() {
  const { SUPPORTED_LANGUAGES } = await import('../src/i18n/languages.ts');
  const { TRANSLATIONS } = await import('../src/i18n/translations.ts');

  console.log(`Checking ${SUPPORTED_LANGUAGES.length} supported languages...`);
  if (SUPPORTED_LANGUAGES.length !== 20) {
    throw new Error(`Expected exactly 20 languages, but got ${SUPPORTED_LANGUAGES.length}`);
  }

  const enKeys = Object.keys(TRANSLATIONS['en']);
  console.log(`English base dictionary contains ${enKeys.length} keys.`);

  let totalTranslations = 0;
  for (const lang of SUPPORTED_LANGUAGES) {
    const dict = TRANSLATIONS[lang.code];
    if (!dict) {
      throw new Error(`Missing translation dictionary for language code: ${lang.code} (${lang.name})`);
    }

    const langKeys = Object.keys(dict);
    totalTranslations += langKeys.length;

    // Check critical keys
    const criticalKeys = [
      'settings.language',
      'settings.title',
      'tabs.home',
      'tabs.daily',
      'tabs.settings',
      'home.newGame',
      'home.continueGame',
      'diff.easy',
      'diff.medium',
      'diff.hard',
      'game.mistakes',
      'game.undo',
      'game.hint',
      'game.paused',
      'game.leaveTitle',
      'game.leaveMessage',
      'game.ok',
      'game.cancel'
    ];

    for (const key of criticalKeys) {
      if (!dict[key]) {
        throw new Error(`Missing critical key "${key}" in language "${lang.name}" (${lang.code})`);
      }
    }
  }

  console.log(`✅ All 20 languages verified! (${totalTranslations} total localized strings across all locales)`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
