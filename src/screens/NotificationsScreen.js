import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import AppText from '../components/AppText';
import { API_BASE_URL } from '../config/api';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';

const TYPE_ICON = {
  daily_challenge_published: '🔔',
  daily_challenge_reminder: '⏰',
  daily_challenge_ending_soon: '⚠️',
};

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

function userHeaders() {
  const userId = global.userId || global.user?.userId;
  return { userid: userId };
}

export default function NotificationsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notifications`, { headers: userHeaders() });
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log('Fetch notifications error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/notifications/read-all`, {}, { headers: userHeaders() });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.log('Mark all read error:', err);
    }
  };

  const handlePress = async (notification) => {
    if (!notification.read) {
      try {
        await axios.post(`${API_BASE_URL}/api/notifications/${notification._id}/read`, {}, { headers: userHeaders() });
        setNotifications((prev) => prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n)));
      } catch (err) {
        console.log('Mark read error:', err);
      }
    }

    if (notification.dailyChallengeId) {
      navigation.navigate('DailyChallengeScreen');
    }
  };

  const hasUnread = notifications.some((n) => !n.read);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
        <Header title="Notifications" showBack onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.brand600} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
      <Header
        title="Notifications"
        showBack
        onBackPress={() => navigation.goBack()}
        rightLabel={hasUnread ? 'Mark all read' : undefined}
        onRightPress={markAllRead}
        rightLabelColor={COLORS.brand600}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchNotifications(true)} />}
      >
        {notifications.length === 0 ? (
          <AppText style={{ marginTop: 40, color: COLORS.slate500, textAlign: 'center' }}>
            No notifications yet.
          </AppText>
        ) : (
          notifications.map((n) => (
            <TouchableOpacity
              key={n._id}
              activeOpacity={0.8}
              onPress={() => handlePress(n)}
              style={[cardStyle, !n.read ? unreadCardStyle : null]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <AppText style={{ fontSize: 18, marginRight: 10 }}>{TYPE_ICON[n.type] || '🔔'}</AppText>
                <View style={{ flex: 1 }}>
                  <AppText variant="bold" style={{ fontSize: 14, color: COLORS.slate900 }}>
                    {n.title}
                  </AppText>
                  <AppText style={{ marginTop: 4, fontSize: 13, color: COLORS.slate600, lineHeight: 19 }}>
                    {n.message}
                  </AppText>
                  <AppText style={{ marginTop: 6, fontSize: 11, color: COLORS.slate400 }}>
                    {formatDateTime(n.createdAt)}
                  </AppText>
                </View>
                {!n.read ? <View style={unreadDotStyle} /> : null}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const cardStyle = {
  marginTop: 12,
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxl,
  padding: 14,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  ...SHADOWS.sm,
};

const unreadCardStyle = {
  borderColor: COLORS.brand100,
  backgroundColor: COLORS.brand50,
};

const unreadDotStyle = {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: COLORS.brand600,
  marginTop: 4,
};
