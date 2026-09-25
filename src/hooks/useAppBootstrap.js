import { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import { useFonts } from 'expo-font';
import api from '../api/client';
import { getSession } from '../utils/authStorage';
import { registerForPushNotifications } from '../utils/pushNotifications';

const FONTS = {
  ManropeRegular: require('../../assets/fonts/Manrope-Regular.ttf'),
  ManropeMedium: require('../../assets/fonts/Manrope-Medium.ttf'),
  ManropeSemiBold: require('../../assets/fonts/Manrope-SemiBold.ttf'),
  ManropeBold: require('../../assets/fonts/Manrope-Bold.ttf'),
  ManropeExtraBold: require('../../assets/fonts/Manrope-ExtraBold.ttf'),
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
