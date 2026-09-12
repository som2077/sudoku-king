const { withAndroidManifest } = require('expo/config-plugins');

const FIREBASE_NOTIFICATION_COLOR =
  'com.google.firebase.messaging.default_notification_color';
const FIREBASE_NOTIFICATION_ICON =
  'com.google.firebase.messaging.default_notification_icon';

/**
 * Firebase Messaging declares a default notification color and icon. Expo Notifications
 * supplies this app's configured color and icon, so they must win during manifest merge.
 */
module.exports = function withFirebaseNotificationManifest(config) {
  return withAndroidManifest(config, (mod) => {
    const application = mod.modResults.manifest.application?.[0];

    if (!application) {
      throw new Error('Android manifest application element is missing.');
    }

    application['meta-data'] = application['meta-data'] || [];

    const notificationColor = application['meta-data'].find(
      (item) => item.$?.['android:name'] === FIREBASE_NOTIFICATION_COLOR
    );

    if (notificationColor) {
      notificationColor.$['tools:replace'] = 'android:resource';
    }

    let notificationIcon = application['meta-data'].find(
      (item) => item.$?.['android:name'] === FIREBASE_NOTIFICATION_ICON
    );

    if (!notificationIcon) {
      notificationIcon = {
        $: {
          'android:name': FIREBASE_NOTIFICATION_ICON,
          'android:resource': '@drawable/notification_icon',
        },
      };
      application['meta-data'].push(notificationIcon);
    } else {
      notificationIcon.$['android:resource'] = '@drawable/notification_icon';
      notificationIcon.$['tools:replace'] = 'android:resource';
    }

    return mod;
  });
};
