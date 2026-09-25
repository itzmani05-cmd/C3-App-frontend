import api from './client';

export async function getNotifications() {
  const { data } = await api.get('/api/notifications');
  return Array.isArray(data) ? data : [];
}

export async function getUnreadCount() {
  const { data } = await api.get('/api/notifications/unread-count');
  return data?.count || 0;
}

export async function markNotificationRead(notificationId) {
  await api.post(`/api/notifications/${notificationId}/read`, {});
}

export async function markAllNotificationsRead() {
  await api.post('/api/notifications/read-all', {});
}
