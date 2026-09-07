// Automated test for Firebase Cloud Messaging setup and configuration
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('Verifying Firebase Cloud Messaging Configuration...');

  // 1. Verify google-services.json
  const googleServicesPath = path.resolve('google-services.json');
  if (!fs.existsSync(googleServicesPath)) {
    throw new Error('google-services.json missing from project root');
  }

  const googleServices = JSON.parse(fs.readFileSync(googleServicesPath, 'utf8'));
  const projectId = googleServices?.project_info?.project_id;
  const packageName = googleServices?.client?.[0]?.client_info?.android_client_info?.package_name;

  if (!projectId || projectId !== 'sudoku-king-997d9') {
    throw new Error(`Unexpected Firebase Project ID: ${projectId}`);
  }
  if (!packageName || packageName !== 'com.sudokuking.android') {
    throw new Error(`Unexpected Package Name: ${packageName}`);
  }

  console.log(`✅ Firebase Project: ${projectId}`);
  console.log(`✅ Package Name: ${packageName}`);

  // 2. Verify app.json plugins
  const appJsonPath = path.resolve('app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  const plugins = appJson?.expo?.plugins || [];

  const hasMessagingPlugin = plugins.some((p) =>
    typeof p === 'string' ? p === '@react-native-firebase/messaging' : p[0] === '@react-native-firebase/messaging'
  );
  if (!hasMessagingPlugin) {
    throw new Error('@react-native-firebase/messaging plugin missing from app.json');
  }
  console.log('✅ app.json contains @react-native-firebase/messaging plugin');

  // 3. Verify AndroidManifest.xml permissions
  const manifestPath = path.resolve('android/app/src/main/AndroidManifest.xml');
  const manifest = fs.readFileSync(manifestPath, 'utf8');
  if (!manifest.includes('android.permission.POST_NOTIFICATIONS')) {
    throw new Error('POST_NOTIFICATIONS permission missing from AndroidManifest.xml');
  }
  console.log('✅ AndroidManifest.xml contains POST_NOTIFICATIONS permission');

  // 4. Verify notification service source exists and has key methods
  const servicePath = path.resolve('src/services/notificationService.ts');
  const serviceCode = fs.readFileSync(servicePath, 'utf8');
  const expectedTokens = [
    'requestUserPermission',
    'getDeviceToken',
    'subscribeToTopics',
    'initialize',
    'onMessage',
    'onNotificationOpenedApp',
    'getInitialNotification',
  ];

  for (const token of expectedTokens) {
    if (!serviceCode.includes(token)) {
      throw new Error(`notificationService.ts missing expected method: ${token}`);
    }
  }
  console.log('✅ notificationService.ts verified with all FCM lifecycle methods');

  // 5. Verify localNotificationScheduler has all 6 slots configured
  const schedulerPath = path.resolve('src/services/localNotificationScheduler.ts');
  const schedulerCode = fs.readFileSync(schedulerPath, 'utf8');

  const slotMatches = schedulerCode.match(/id:\s*['"]sudoku_slot_\d/g) || [];
  if (slotMatches.length !== 6) {
    throw new Error(`Expected 6 daily notification slots, found ${slotMatches.length}`);
  }

  const expectedHours = [9, 13, 16, 19, 21, 23];
  for (const hour of expectedHours) {
    if (!schedulerCode.includes(`hour: ${hour}`)) {
      throw new Error(`Missing expected notification slot hour: ${hour}`);
    }
  }
  if (!schedulerCode.includes('cancelAllDailyNotifications')) {
    throw new Error('Missing cancelAllDailyNotifications in localNotificationScheduler.ts');
  }
  console.log('✅ localNotificationScheduler.ts verified with 6 distinct daily slots and cancellation support');

  // 6. Verify Settings store has notificationsEnabled
  const storePath = path.resolve('src/store/useGameStore.ts');
  const storeCode = fs.readFileSync(storePath, 'utf8');
  if (!storeCode.includes('notificationsEnabled: boolean')) {
    throw new Error('Missing notificationsEnabled in useGameStore.ts GameSettings');
  }
  console.log('✅ useGameStore.ts verified with notificationsEnabled toggle in GameSettings');

  console.log('🎉 All Firebase & Local 6-Daily Notification tests passed!');
}

run().catch((err) => {
  console.error('❌ Notification Test Failed:', err);
  process.exit(1);
});
