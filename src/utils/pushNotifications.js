import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removePushToken, savePushToken } from '../api/user';

const ANDROID_CHANNEL_ID = 'alerts';
const TOKEN_KEY = '@c3app/pushToken';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'C3 notifications',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#2563EB',
    sound: 'default',
  });
}

async function hasNotificationPermission() {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  if (existing.canAskAgain === false) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

export async function registerForPushNotifications(userId) {
  try {
    if (!userId || !Device.isDevice) return;

    await ensureAndroidChannel();
    if (!(await hasNotificationPermission())) return;

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const { data: token } = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
    if (!token) return;

    await savePushToken(token);
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.log('Push notification registration error:', err);
  }
}

export async function unregisterPushNotifications(userId) {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    await AsyncStorage.removeItem(TOKEN_KEY);
    if (userId) await removePushToken(token);
  } catch (err) {
    console.log('Push notification unregister error:', err);
  }
}
