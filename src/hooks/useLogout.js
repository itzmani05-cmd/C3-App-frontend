import { useCallback } from 'react';
import { Alert } from 'react-native';
import { clearSession } from '../utils/authStorage';
import { clearCache } from '../utils/offlineCache';
import { unregisterPushNotifications } from '../utils/pushNotifications';
import { getUserId } from '../api/client';

function getRootNavigation(navigation) {
  let root = navigation;
  while (root?.getParent?.()) root = root.getParent();
  return root;
}

export default function useLogout(navigation) {
  return useCallback(() => {
    Alert.alert('Logout', 'Do you want to log out now?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await unregisterPushNotifications(getUserId());
          await clearSession();
          await clearCache();
          global.userId = null;
          global.user = null;
          getRootNavigation(navigation).reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  }, [navigation]);
}
