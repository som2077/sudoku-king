import { Platform } from 'react-native';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'sudoku-notifications' });
const SCHEDULED_VERSION_KEY = 'daily_6_notifications_version';
const CURRENT_VERSION = 'v2_english_slots_2026';

let NotificationsModule: any = null;
try {
  NotificationsModule = require('expo-notifications');
} catch {
  // Native module will be active once recompiled with expo run:android
}

export interface NotificationSlotConfig {
  id: string;
  hour: number;
  minute: number;
  title: string;
  body: string;
  action: 'daily' | 'play' | 'quick_game';
  difficulty?: 'easy' | 'medium' | 'hard';
}

export const DAILY_6_NOTIFICATION_SLOTS: NotificationSlotConfig[] = [
  {
    id: 'sudoku_slot_1_morning',
    hour: 9,
    minute: 0,
    title: "Today's Daily Puzzle is Ready! ☕",
    body: 'Kickstart your morning with today handcrafted challenge! 🧩',
    action: 'daily',
  },
  {
    id: 'sudoku_slot_2_lunch',
    hour: 13,
    minute: 0,
    title: '3-Minute Quick Break? 🥪',
    body: 'Refresh your mind after lunch with a relaxing Easy Sudoku!',
    action: 'quick_game',
    difficulty: 'easy',
  },
  {
    id: 'sudoku_slot_3_afternoon',
    hour: 16,
    minute: 30,
    title: 'Free Hint Unlocked! 💡',
    body: 'Beat the afternoon slump — solve a quick puzzle and recharge!',
    action: 'play',
  },
  {
    id: 'sudoku_slot_4_evening',
    hour: 19,
    minute: 0,
    title: 'Unwind with Sudoku King 👑',
    body: 'Leave the day behind and relax with an evening puzzle.',
    action: 'play',
    difficulty: 'medium',
  },
  {
    id: 'sudoku_slot_5_streak',
    hour: 21,
    minute: 30,
    title: 'Streak in Danger! Only 2.5 hrs left 🔥',
    body: "Don't break your winning streak! Solve today's puzzle now.",
    action: 'daily',
  },
  {
    id: 'sudoku_slot_6_night',
    hour: 23,
    minute: 15,
    title: 'One Last Puzzle Before Sleep? 🌙',
    body: 'Unwind your mind for restful sleep. Sweet dreams & Good Night! ✨',
    action: 'play',
  },
];

class LocalNotificationScheduler {
  private isConfigured = false;

  private getNotifications() {
    if (!NotificationsModule) {
      try {
        NotificationsModule = require('expo-notifications');
      } catch {
        return null;
      }
    }
    return NotificationsModule;
  }

  /**
   * Configure notification channel for Android and set global behavior.
   */
  async configureNotificationChannel(): Promise<void> {
    const notifications = this.getNotifications();
    if (!notifications?.setNotificationChannelAsync) return;

    if (Platform.OS === 'android') {
      try {
        await notifications.setNotificationChannelAsync('sudoku_daily_reminders', {
          name: 'Daily Sudoku Reminders',
          importance: notifications.AndroidImportance?.HIGH ?? 4,
          vibrationPattern: [0, 250, 250, 250],
          enableLights: true,
          lightColor: '#2563EB',
        });
      } catch (err) {
        console.warn('⚠️ [Daily Scheduler] Failed to set notification channel:', err);
      }
    }
  }

  /**
   * Schedule the 6 daily recurring notifications on the device.
   * Cancels prior schedules if version changes, ensuring idempotency.
   */
  async scheduleDailyNotifications(force: boolean = false): Promise<void> {
    try {
      if (this.isConfigured && !force) return;

      const notifications = this.getNotifications();
      if (!notifications?.scheduleNotificationAsync) {
        console.log('ℹ️ [Daily Scheduler] Local native scheduler available after next build.');
        return;
      }

      const lastVersion = storage.getString(SCHEDULED_VERSION_KEY);
      if (lastVersion === CURRENT_VERSION && !force) {
        console.log('✅ [Daily Scheduler] 6 daily notifications already scheduled.');
        return;
      }

      await this.configureNotificationChannel();

      // Cancel previous scheduled notifications to avoid duplicates
      if (notifications.cancelAllScheduledNotificationsAsync) {
        await notifications.cancelAllScheduledNotificationsAsync();
        console.log('🧹 [Daily Scheduler] Cleared old scheduled notifications.');
      }

      const dailyType = notifications.SchedulableTriggerInputTypes?.DAILY ?? 'daily';

      // Schedule all 6 slots
      for (const slot of DAILY_6_NOTIFICATION_SLOTS) {
        await notifications.scheduleNotificationAsync({
          identifier: slot.id,
          content: {
            title: slot.title,
            body: slot.body,
            data: {
              action: slot.action,
              difficulty: slot.difficulty,
              slotId: slot.id,
            },
            sound: true,
            color: '#2563EB',
          },
          trigger: {
            type: dailyType,
            hour: slot.hour,
            minute: slot.minute,
            channelId: 'sudoku_daily_reminders',
          },
        });
        console.log(
          `⏰ [Daily Scheduler] Scheduled ${slot.id} at ${slot.hour
            .toString()
            .padStart(2, '0')}:${slot.minute.toString().padStart(2, '0')}`,
        );
      }

      storage.set(SCHEDULED_VERSION_KEY, CURRENT_VERSION);
      this.isConfigured = true;
      console.log('🎉 [Daily Scheduler] Successfully scheduled all 6 daily campaigns!');
    } catch (error) {
      console.warn('⚠️ [Daily Scheduler] Scheduling notification warning:', error);
    }
  }

  /**
   * Cancel all daily scheduled notifications on device.
   */
  async cancelAllDailyNotifications(): Promise<void> {
    try {
      const notifications = this.getNotifications();
      if (notifications?.cancelAllScheduledNotificationsAsync) {
        await notifications.cancelAllScheduledNotificationsAsync();
        storage.remove(SCHEDULED_VERSION_KEY);
        this.isConfigured = false;
        console.log('🛑 [Daily Scheduler] Cancelled all daily scheduled notifications.');
      }
    } catch (error) {
      console.warn('⚠️ [Daily Scheduler] Failed to cancel notifications:', error);
    }
  }

  /**
   * Get all currently scheduled notifications for inspection.
   */
  async getScheduledNotifications() {
    const notifications = this.getNotifications();
    if (!notifications?.getAllScheduledNotificationsAsync) return [];
    return await notifications.getAllScheduledNotificationsAsync();
  }
}

export const localNotificationScheduler = new LocalNotificationScheduler();
