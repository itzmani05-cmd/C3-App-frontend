import React from 'react';
import Screen from '../components/ui/Screen';
import EmptyState from '../components/ui/EmptyState';
import NotificationItem from '../components/notifications/NotificationItem';
import useFetch from '../hooks/useFetch';
import { getNotifications, markAllNotificationsRead } from '../api/notifications';
import { markRead, openNotification } from '../utils/notificationRouter';
import { COLORS } from '../theme';

export default function NotificationsScreen({ navigation }) {
  const { data: notifications, setData, loading, refreshing, refresh } = useFetch(getNotifications, [], { initialData: [] });
  const hasUnread = notifications.some((n) => !n.read);

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setData((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.log('Mark all read error:', err);
    }
  };

  const handlePress = async (notification) => {
    if (!notification.read) {
      await markRead(notification._id);
      setData((prev) => prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n)));
    }
    openNotification(
      navigation,
      { ...(notification.data || {}), type: notification.type, dailyChallengeId: notification.dailyChallengeId },
      { skipIfCurrent: 'NotificationsScreen' }
    );
  };

  return (
    <Screen
      title="Notifications"
      onBack={navigation.goBack}
      headerProps={{
        rightLabel: hasUnread ? 'Mark all read' : undefined,
        onRightPress: markAllRead,
        rightLabelColor: COLORS.brand600,
      }}
      loading={loading}
      refreshing={refreshing}
      onRefresh={refresh}
    >
      {notifications.length === 0 ? (
        <EmptyState message="No notifications yet." />
      ) : (
        notifications.map((n) => <NotificationItem key={n._id} notification={n} onPress={() => handlePress(n)} />)
      )}
    </Screen>
  );
}
