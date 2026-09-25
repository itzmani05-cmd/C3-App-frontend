import { useCallback, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { getUserId } from '../api/client';
import { markRead, openNotification } from '../utils/notificationRouter';

export default function usePushNavigation(navigationRef) {
  const pendingRef = useRef(null);
  const handledIdsRef = useRef(new Set());

  const route = useCallback(
    (data) => {
      if (!getUserId()) return;
      markRead(data.notificationId);
      openNotification(navigationRef, data);
    },
    [navigationRef]
  );

  useEffect(() => {
    const handleResponse = (response) => {
      if (!response) return;
      const id = response.notification?.request?.identifier;
      if (id && handledIdsRef.current.has(id)) return;
      if (id) handledIdsRef.current.add(id);
      Notifications.clearLastNotificationResponseAsync().catch(() => {});

      const data = response.notification?.request?.content?.data || {};
      if (navigationRef.isReady()) route(data);
      else pendingRef.current = data;
    };

    const subscription = Notifications.addNotificationResponseReceivedListener(handleResponse);
    Notifications.getLastNotificationResponseAsync().then(handleResponse).catch(() => {});
    return () => subscription.remove();
  }, [navigationRef, route]);

  return useCallback(() => {
    const data = pendingRef.current;
    pendingRef.current = null;
    if (data) route(data);
  }, [route]);
}
