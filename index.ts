import { registerRootComponent } from 'expo';

import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import App from './App';

// Register background and quit state notification handler for FCM
try {
  const messaging = getMessaging();
  setBackgroundMessageHandler(messaging, async (remoteMessage) => {
    console.log('🌙 [FCM] Background/Quit message received:', remoteMessage);
  });
} catch (error) {
  console.warn('⚠️ [FCM] Failed to set background message handler:', error);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
