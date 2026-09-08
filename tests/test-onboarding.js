async function run() {
  const { TRANSLATIONS } = await import('../src/i18n/translations.ts');

  console.log('Verifying Onboarding & Welcome screen strings...');
  const en = TRANSLATIONS['en'];

  const requiredWelcomeKeys = [
    'welcome.title',
    'welcome.subtitle',
    'welcome.feat1Title',
    'welcome.feat1Desc',
    'welcome.feat2Title',
    'welcome.feat2Desc',
    'welcome.feat3Title',
    'welcome.feat3Desc',
    'welcome.getStarted',
    'welcome.quickPlay'
  ];

  for (const key of requiredWelcomeKeys) {
    if (!en[key]) {
      throw new Error(`Missing welcome key: "${key}" in English translations`);
    }
  }

  const requiredOnboardingKeys = [
    'onboarding.skip',
    'onboarding.continue',
    'onboarding.start',
    'onboarding.s1Title',
    'onboarding.s1Subtitle',
    'onboarding.s2Title',
    'onboarding.s2Subtitle',
    'onboarding.s3Title',
    'onboarding.s3Subtitle'
  ];

  for (const key of requiredOnboardingKeys) {
    if (!en[key]) {
      throw new Error(`Missing onboarding key: "${key}" in English translations`);
    }
  }

  console.log('✅ Welcome & Onboarding translation keys verified successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
