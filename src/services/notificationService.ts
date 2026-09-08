import {
  getMessaging,
  requestPermission,
  hasPermission,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  getInitialNotification,
  subscribeToTopic,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import type { RemoteMessage } from "@react-native-firebase/messaging";
import { Platform, PermissionsAndroid, Alert } from "react-native";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({ id: "sudoku-notifications" });
const FCM_TOKEN_STORAGE_KEY = "fcm_device_token";

export interface NotificationPayload {
  title?: string;
  body?: string;
  data?: Record<string, string>;
}

export type NotificationActionHandler = (payload: NotificationPayload) => void;

class NotificationService {
  private isInitialized = false;
  private actionHandler: NotificationActionHandler | null = null;

  /**
   * Request notification permissions from the user.
   * Handles Android 13+ (POST_NOTIFICATIONS) and iOS APNS authorization.
   */
  async requestUserPermission(): Promise<boolean> {
    try {
      if (Platform.OS === "android" && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("⚠️ [FCM] Android POST_NOTIFICATIONS permission denied");
          return false;
        }
      }

      // Also request via expo-notifications for local reminders
      try {
        const Notifications = require('expo-notifications');
        if (Notifications?.requestPermissionsAsync) {
          await Notifications.requestPermissionsAsync({
            ios: {
              allowAlert: true,
              allowBadge: true,
              allowSound: true,
            },
          });
        }
      } catch {
        // ignore if expo-notifications not loaded in current environment
      }

      try {
        const messagingInstance = getMessaging();
        const authStatus = await requestPermission(messagingInstance);
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;

        console.log(
          "🔔 [FCM] Authorization status:",
          authStatus,
          "Enabled:",
          enabled,
        );
        return enabled;
      } catch (fcmErr) {
        console.log("ℹ️ [FCM] Running in fallback mode without FCM:", fcmErr);
        return true;
      }
    } catch (error) {
      console.warn(
        "⚠️ [FCM] Failed to request notification permission:",
        error,
      );
      return false;
    }
  }

  /**
   * Fetch and store FCM device token.
   * Returns the token string or null if unavailable.
   */
  async getDeviceToken(): Promise<string | null> {
    try {
      const messagingInstance = getMessaging();
      const token = await getToken(messagingInstance);
      if (token) {
        storage.set(FCM_TOKEN_STORAGE_KEY, token);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📱 [FCM DEVICE TOKEN]:", token);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      }
      return token;
    } catch (error) {
      console.warn("⚠️ [FCM] Error fetching device token:", error);
      return null;
    }
  }

  /**
   * Get cached token from local storage.
   */
  getCachedToken(): string | null {
    return storage.getString(FCM_TOKEN_STORAGE_KEY) || null;
  }

  /**
   * Subscribe to common broadcast topics (e.g. 'all_users', 'daily_challenge').
   */
  async subscribeToTopics(): Promise<void> {
    try {
      const messagingInstance = getMessaging();
      await subscribeToTopic(messagingInstance, "all_users");
      await subscribeToTopic(messagingInstance, "daily_challenge");
      console.log("✅ [FCM] Subscribed to topics: all_users, daily_challenge");
    } catch (error) {
      console.warn("⚠️ [FCM] Topic subscription error:", error);
    }
  }

  /**
   * Register a custom callback when user taps on a notification.
   */
  private foregroundHandler: NotificationActionHandler | null = null;

  /**
   * Register a custom callback for foreground notifications (e.g. InAppNotificationBanner).
   */
  setForegroundHandler(handler: NotificationActionHandler) {
    this.foregroundHandler = handler;
  }

  /**
   * Check if notification permission has already been granted without prompting the user.
   */
  async checkPermission(): Promise<boolean> {
    try {
      if (Platform.OS === "android" && Platform.Version >= 33) {
        return await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }
      const messagingInstance = getMessaging();
      const authStatus = await hasPermission(messagingInstance);
      return (
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL
      );
    } catch {
      return false;
    }
  }

  /**
   * Initialize all notification listeners for foreground, background tap, and initial quit launch.
   * NOTE: This DOES NOT show any permission popups on app launch.
   */
  async initialize(
    onNotificationAction?: NotificationActionHandler,
    onForegroundNotification?: NotificationActionHandler,
  ): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (onNotificationAction) {
      this.actionHandler = onNotificationAction;
    }
    if (onForegroundNotification) {
      this.foregroundHandler = onForegroundNotification;
    }

    // Check if permission is ALREADY granted silently (NO dialog popup!)
    const alreadyPermitted = await this.checkPermission();
    if (alreadyPermitted) {
      await this.getDeviceToken();
      await this.subscribeToTopics();
    }
    const messagingInstance = getMessaging();

    // 3. Token refresh listener
    onTokenRefresh(messagingInstance, (newToken: string) => {
      console.log("🔄 [FCM] Device token refreshed:", newToken);
      storage.set(FCM_TOKEN_STORAGE_KEY, newToken);
    });

    // 4. Foreground message listener (when app is open and in use)
    onMessage(messagingInstance, async (remoteMessage: RemoteMessage) => {
      console.log("📩 [FCM] Foreground notification received:", remoteMessage);

      const title = remoteMessage.notification?.title || "Sudoku King";
      const body = remoteMessage.notification?.body || "";
      const payload: NotificationPayload = {
        title,
        body,
        data: remoteMessage.data as Record<string, string> | undefined,
      };

      if (this.foregroundHandler) {
        this.foregroundHandler(payload);
      }
    });

    // 5. App opened from background state via notification tap
    onNotificationOpenedApp(
      messagingInstance,
      (remoteMessage: RemoteMessage) => {
        console.log(
          "📲 [FCM] App opened from background via notification:",
          remoteMessage,
        );
        this.handleNotificationTap({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          data: remoteMessage.data as Record<string, string> | undefined,
        });
      },
    );

    // 6. App opened from completely closed (killed) state via notification tap
    try {
      const initialNotification =
        await getInitialNotification(messagingInstance);
      if (initialNotification) {
        console.log(
          "🚀 [FCM] App launched from killed state via notification:",
          initialNotification,
        );
        this.handleNotificationTap({
          title: initialNotification.notification?.title,
          body: initialNotification.notification?.body,
          data: initialNotification.data as Record<string, string> | undefined,
        });
      }
    } catch (err) {
      console.warn("⚠️ [FCM] Error checking initial notification:", err);
    }
  }

  /**
   * Route user to appropriate screen based on notification data.
   */
  private handleNotificationTap(payload: NotificationPayload) {
    if (this.actionHandler) {
      this.actionHandler(payload);
    }
  }
}

export const notificationService = new NotificationService();
