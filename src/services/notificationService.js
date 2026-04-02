import { Capacitor } from '@capacitor/core';

// Storage key for notification preferences
const NOTIFICATION_PREFS_KEY = 'studynext_notification_prefs';

// Default notification preferences
const defaultPrefs = {
    enabled: true,
    taskReminders: true,
    dailyDigest: true,
    streakReminders: true,
    sound: true
};

export const notificationService = {
    // Initialize push notifications
    async initialize() {
        if (!Capacitor.isNativePlatform()) {
            console.log('Push notifications not available on web');
            return { supported: false };
        }

        try {
            const { PushNotifications } = await import('@capacitor/push-notifications');

            // Request permission
            const permResult = await PushNotifications.requestPermissions();

            if (permResult.receive === 'granted') {
                // Register for push notifications
                await PushNotifications.register();

                // Add listeners
                PushNotifications.addListener('registration', (token) => {
                    console.log('Push registration success, token:', token.value);
                    // Store token for later use with backend
                    localStorage.setItem('fcm_token', token.value);
                });

                PushNotifications.addListener('registrationError', (error) => {
                    console.error('Push registration failed:', error.error);
                });

                PushNotifications.addListener('pushNotificationReceived', (notification) => {
                    console.log('Push notification received:', notification);
                    // Handle foreground notification
                    this.handleForegroundNotification(notification);
                });

                PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
                    console.log('Push notification action performed:', action);
                    // Handle notification tap
                    this.handleNotificationTap(action);
                });

                return { supported: true, granted: true };
            } else {
                return { supported: true, granted: false };
            }
        } catch (error) {
            console.error('Failed to initialize push notifications:', error);
            return { supported: false, error: error.message };
        }
    },

    // Handle foreground notification
    handleForegroundNotification(notification) {
        // Show in-app notification or toast
        console.log('Foreground notification:', notification.title, notification.body);
    },

    // Handle notification tap
    handleNotificationTap(action) {
        const data = action.notification.data;

        // Navigate based on notification type
        if (data?.type === 'task_reminder') {
            window.location.href = '/dashboard';
        } else if (data?.type === 'streak_reminder') {
            window.location.href = '/dashboard';
        }
    },

    // Get FCM token
    getToken() {
        return localStorage.getItem('fcm_token');
    },

    // Get notification preferences
    getPreferences() {
        try {
            const saved = localStorage.getItem(NOTIFICATION_PREFS_KEY);
            return saved ? JSON.parse(saved) : defaultPrefs;
        } catch {
            return defaultPrefs;
        }
    },

    // Update notification preferences
    updatePreferences(prefs) {
        const updated = { ...this.getPreferences(), ...prefs };
        localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(updated));
        return updated;
    },

    // Schedule local notification (for task reminders)
    async scheduleLocalNotification(options) {
        if (!Capacitor.isNativePlatform()) {
            // Use web notifications as fallback
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(options.title, {
                    body: options.body,
                    icon: '/mascot.png'
                });
            }
            return;
        }

        try {
            const { LocalNotifications } = await import('@capacitor/local-notifications');

            await LocalNotifications.schedule({
                notifications: [{
                    id: options.id || Date.now(),
                    title: options.title,
                    body: options.body,
                    schedule: options.at ? { at: new Date(options.at) } : undefined,
                    extra: options.data
                }]
            });
        } catch (error) {
            console.error('Failed to schedule local notification:', error);
        }
    },

    // Cancel scheduled notification
    async cancelNotification(id) {
        if (!Capacitor.isNativePlatform()) return;

        try {
            const { LocalNotifications } = await import('@capacitor/local-notifications');
            await LocalNotifications.cancel({ notifications: [{ id }] });
        } catch (error) {
            console.error('Failed to cancel notification:', error);
        }
    },

    // Request web notification permission (fallback for web)
    async requestWebPermission() {
        if (!('Notification' in window)) {
            return { supported: false };
        }

        const permission = await Notification.requestPermission();
        return {
            supported: true,
            granted: permission === 'granted'
        };
    },

    // Check if notifications are enabled
    async checkPermission() {
        if (Capacitor.isNativePlatform()) {
            try {
                const { PushNotifications } = await import('@capacitor/push-notifications');
                const result = await PushNotifications.checkPermissions();
                return result.receive === 'granted';
            } catch {
                return false;
            }
        } else {
            return 'Notification' in window && Notification.permission === 'granted';
        }
    }
};
