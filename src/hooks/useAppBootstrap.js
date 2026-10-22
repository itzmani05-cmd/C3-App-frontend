import { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import { useFonts } from 'expo-font';
import api from '../api/client';
import { getSession } from '../utils/authStorage';
import { registerForPushNotifications } from '../utils/pushNotifications';

const FONTS = {
  InterRegular: require('../../assets/fonts/Inter_400Regular.ttf'),
  InterMedium: require('../../assets/fonts/Inter_500Medium.ttf'),
  InterSemiBold: require('../../assets/fonts/Inter_600SemiBold.ttf'),
  InterBold: require('../../assets/fonts/Inter_700Bold.ttf'),
  JakartaBold: require('../../assets/fonts/PlusJakartaSans_700Bold.ttf'),
  JakartaExtraBold: require('../../assets/fonts/PlusJakartaSans_800ExtraBold.ttf'),
};

async function applyPendingUpdate() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (err) {
    console.log('Update check error:', err?.message || err);
  }
}

function wakeServer() {
  api.get('/api/test').catch(() => {});
}

export default function useAppBootstrap() {
  const [fontsLoaded] = useFonts(FONTS);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    applyPendingUpdate();
    wakeServer();

    getSession().then((session) => {
      if (session?.userId) {
        global.user = session;
        global.userId = session.userId;
        registerForPushNotifications(session.userId);
        setInitialRoute('MainApp');
      } else {
        setInitialRoute('Login');
      }
    });
  }, []);

  return { ready: fontsLoaded && initialRoute !== null, initialRoute };
}
