import { Alert, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removePushToken, savePushToken } from '../api/user';

const ANDROID_CHANNEL_ID = 'alerts';
const TOKEN_KEY = '@c3app/pushToken';
const PRIMER_KEY = '@c3app/notification_primer';
const PRIMER_RETRY_MS = 7 * 24 * 60 * 60 * 1000;
const PRIMER_DELAY_MS = 3500; // let the student see the app before a dialog appears

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

// Says why notifications are useful before the system's own permission dialog, which students tend to refuse when it
// appears with no context. A refusal is remembered and the question is not repeated for a week.
async function studentAgreesToPrimer() {
  const saved = await AsyncStorage.getItem(PRIMER_KEY);
  if (saved === 'agreed') return true;
  if (saved && Date.now() - Number(saved) < PRIMER_RETRY_MS) return false;

  await new Promise((resolve) => setTimeout(resolve, PRIMER_DELAY_MS));
  const agreed = await new Promise((resolve) => {
    Alert.alert(
      'Stay on top of your streak',
      'Allow notifications to get a reminder when a new Daily Challenge is published and before it ends. You can change this any time in your phone settings.',
      [
        { text: 'Not now', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Allow', onPress: () => resolve(true) },
      ],
      { cancelable: false }
    );
  });
  await AsyncStorage.setItem(PRIMER_KEY, agreed ? 'agreed' : String(Date.now()));
  return agreed;
}

async function hasNotificationPermission() {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  if (existing.canAskAgain === false) return false;
  if (!(await studentAgreesToPrimer())) return false;
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
