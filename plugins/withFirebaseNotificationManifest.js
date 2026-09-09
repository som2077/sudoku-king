const { withAndroidManifest } = require('expo/config-plugins');

const FIREBASE_NOTIFICATION_COLOR =
  'com.google.firebase.messaging.default_notification_color';

/**
 * Firebase Messaging declares a default notification color. Expo Notifications
 * supplies this app's configured color, so it must win during manifest merge.
 */
module.exports = function withFirebaseNotificationManifest(config) {
  return withAndroidManifest(config, (mod) => {
    const application = mod.modResults.manifest.application?.[0];

    if (!application) {
      throw new Error('Android manifest application element is missing.');
    }

    const notificationColor = (application['meta-data'] || []).find(
      (item) => item.$?.['android:name'] === FIREBASE_NOTIFICATION_COLOR
    );

    if (notificationColor) {
      notificationColor.$['tools:replace'] = 'android:resource';
    }

    return mod;
  });
};
