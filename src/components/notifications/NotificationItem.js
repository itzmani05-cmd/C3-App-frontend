import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import { NOTIFICATION_ICONS } from '../../utils/notificationRouter';
import { formatDateTime } from '../../utils/format';
import { COLORS } from '../../theme';

export default function NotificationItem({ notification, onPress }) {
  const unread = !notification.read;

  return (
    <Card
      onPress={onPress}
      style={[{ marginTop: 12, padding: 14 }, unread ? { borderColor: COLORS.brand100, backgroundColor: COLORS.brand50 } : null]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <AppText style={{ fontSize: 18, marginRight: 10 }}>{NOTIFICATION_ICONS[notification.type] || '🔔'}</AppText>
        <View style={{ flex: 1 }}>
          <AppText variant="bold" style={{ fontSize: 14, color: COLORS.slate900 }}>
            {notification.title}
          </AppText>
          <AppText style={{ marginTop: 4, fontSize: 13, color: COLORS.slate600, lineHeight: 19 }}>
            {notification.message}
          </AppText>
          <AppText style={{ marginTop: 6, fontSize: 11, color: COLORS.slate400 }}>
            {formatDateTime(notification.createdAt)}
          </AppText>
        </View>
        {unread ? <View style={unreadDotStyle} /> : null}
      </View>
    </Card>
  );
}

const unreadDotStyle = {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: COLORS.brand600,
  marginTop: 4,
};
