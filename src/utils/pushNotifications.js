import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Requests permission, resolves the Expo push token, and saves it on the student's account so the
// server can send Daily Challenge reminders. Silently no-ops on simulators/emulators (no push
// capability) and if permission is denied — this is a best-effort background step, never blocking.
export async function registerForDailyChallengePushNotifications(userId) {
  try {
    if (!userId || !Device.isDevice) return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }
    if (status !== 'granted') return;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const { data: token } = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    if (!token) return;

    await axios.post(
      `${API_BASE_URL}/api/user/push-token`,
      { token },
      { headers: { userid: userId } }
    );
  } catch (err) {
    console.log('Push notification registration error:', err);
  }
}
