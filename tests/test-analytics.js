// Automated test for Firebase Analytics setup and configuration
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('🧪 Verifying Firebase Analytics Configuration & Architecture...');

  // 1. Verify package.json contains @react-native-firebase/analytics and app
  const packageJsonPath = path.resolve('package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = packageJson.dependencies || {};

  if (!dependencies['@react-native-firebase/analytics']) {
    throw new Error('@react-native-firebase/analytics missing in package.json');
  }
  if (!dependencies['@react-native-firebase/app']) {
    throw new Error('@react-native-firebase/app missing in package.json');
  }
  console.log('  ✔ @react-native-firebase/analytics and app dependencies verified');

  // 2. Verify google-services.json
  const googleServicesPath = path.resolve('google-services.json');
  if (!fs.existsSync(googleServicesPath)) {
    throw new Error('google-services.json missing from project root');
  }
  const googleServices = JSON.parse(fs.readFileSync(googleServicesPath, 'utf8'));
  const projectId = googleServices?.project_info?.project_id;
  const packageName = googleServices?.client?.[0]?.client_info?.android_client_info?.package_name;

  if (projectId !== 'sudoku-king-997d9') {
    throw new Error(`Unexpected Firebase Project ID: ${projectId}`);
  }
  if (packageName !== 'com.sudokuking.android') {
    throw new Error(`Unexpected Package Name: ${packageName}`);
  }
  console.log(`  ✔ google-services.json valid (Project: ${projectId}, Package: ${packageName})`);

  // 3. Verify app.json contains @react-native-firebase/analytics plugin
  const appJsonPath = path.resolve('app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  const plugins = appJson?.expo?.plugins || [];

  const hasAnalyticsPlugin = plugins.some((p) =>
    typeof p === 'string'
      ? p === '@react-native-firebase/analytics'
      : p[0] === '@react-native-firebase/analytics'
  );
  if (!hasAnalyticsPlugin) {
    throw new Error('@react-native-firebase/analytics plugin missing from app.json');
  }
  console.log('  ✔ app.json includes @react-native-firebase/analytics plugin');

  // 4. Verify firebase.json root configuration
  const firebaseJsonPath = path.resolve('firebase.json');
  if (!fs.existsSync(firebaseJsonPath)) {
    throw new Error('firebase.json missing from project root');
  }
  const firebaseConfig = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
  const rnConfig = firebaseConfig?.['react-native'];
  if (!rnConfig || rnConfig.analytics_auto_collection_enabled !== true) {
    throw new Error('firebase.json must have react-native.analytics_auto_collection_enabled set to true');
  }
  console.log('  ✔ firebase.json configured with analytics_auto_collection_enabled: true');

  // 5. Verify src/services/analyticsService.ts
  const analyticsServicePath = path.resolve('src/services/analyticsService.ts');
  if (!fs.existsSync(analyticsServicePath)) {
    throw new Error('src/services/analyticsService.ts does not exist');
  }
  const analyticsCode = fs.readFileSync(analyticsServicePath, 'utf8');

  const expectedMethods = [
    'logCustomEvent',
    'logScreenView',
    'logGameStarted',
    'logGameWon',
    'logGameLost',
    'logGameRestarted',
    'logHintUsed',
    'logSecondChanceUsed',
    'logDailyChallengeStarted',
    'logDailyChallengeCompleted',
    'logOnboardingStep',
    'logOnboardingCompleted',
    'logTutorialCompleted',
    'logTutorialSkipped',
    'logPaywallViewed',
    'logTrialStarted',
    'logPurchaseStarted',
    'logPurchaseSuccess',
    'logPurchaseRestored',
    'logAdEvent',
    'setUserProperty',
    'setUserId',
  ];

  for (const method of expectedMethods) {
    if (!analyticsCode.includes(method)) {
      throw new Error(`analyticsService.ts missing required method: ${method}`);
    }
  }
  console.log('  ✔ analyticsService.ts exports all standard GA4 & game lifecycle methods');

  // 6. Verify App.tsx integration
  const appTsxPath = path.resolve('App.tsx');
  const appTsxCode = fs.readFileSync(appTsxPath, 'utf8');
  if (!appTsxCode.includes('analyticsService.logGameWon')) {
    throw new Error('App.tsx must use analyticsService.logGameWon');
  }
  if (!appTsxCode.includes('analyticsService.logGameLost')) {
    throw new Error('App.tsx must use analyticsService.logGameLost');
  }
  if (!appTsxCode.includes('analyticsService.logScreenView')) {
    throw new Error('App.tsx must use analyticsService.logScreenView');
  }
  console.log('  ✔ App.tsx wired with screen tracking, game_won, and game_lost');

  // 7. Verify useGameStore.ts integration
  const storePath = path.resolve('src/store/useGameStore.ts');
  const storeCode = fs.readFileSync(storePath, 'utf8');
  if (!storeCode.includes('analyticsService.logGameStarted')) {
    throw new Error('useGameStore.ts must use analyticsService.logGameStarted');
  }
  if (!storeCode.includes('analyticsService.logHintUsed')) {
    throw new Error('useGameStore.ts must use analyticsService.logHintUsed');
  }
  if (!storeCode.includes('analyticsService.logDailyChallengeStarted')) {
    throw new Error('useGameStore.ts must use analyticsService.logDailyChallengeStarted');
  }
  if (!storeCode.includes('analyticsService.logDailyChallengeCompleted')) {
    throw new Error('useGameStore.ts must use analyticsService.logDailyChallengeCompleted');
  }
  console.log('  ✔ useGameStore.ts wired with game_started, hint_used, and daily challenges');

  // 8. Verify HomeScreen.tsx tab screen views
  const homeScreenPath = path.resolve('src/screens/HomeScreen.tsx');
  const homeScreenCode = fs.readFileSync(homeScreenPath, 'utf8');
  if (!homeScreenCode.includes('analyticsService.logScreenView')) {
    throw new Error('HomeScreen.tsx must track screen views for tabs');
  }
  console.log('  ✔ HomeScreen.tsx wired with tab navigation screen view tracking');

  // 9. Verify purchaseService.ts and adManager.ts integration
  const purchaseServiceCode = fs.readFileSync(path.resolve('src/services/purchaseService.ts'), 'utf8');
  if (!purchaseServiceCode.includes('analyticsService.logPurchaseSuccess')) {
    throw new Error('purchaseService.ts must use analyticsService.logPurchaseSuccess');
  }
  const adManagerCode = fs.readFileSync(path.resolve('src/services/adManager.ts'), 'utf8');
  if (!adManagerCode.includes('analyticsService.logAdEvent')) {
    throw new Error('adManager.ts must use analyticsService.logAdEvent');
  }
  console.log('  ✔ purchaseService.ts & adManager.ts wired with analytics');

  console.log('🎉 ALL FIREBASE ANALYTICS SETUP TESTS PASSED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
