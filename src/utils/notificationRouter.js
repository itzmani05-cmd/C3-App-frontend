import { markNotificationRead } from '../api/notifications';
import { getUserId } from '../api/client';

const DAILY_CHALLENGE_ROUTE = () => ({ screen: 'DailyChallengeScreen' });

const ROUTES = {
  daily_challenge_published: DAILY_CHALLENGE_ROUTE,
  daily_challenge_reminder: DAILY_CHALLENGE_ROUTE,
  daily_challenge_ending_soon: DAILY_CHALLENGE_ROUTE,
};

const FALLBACK = { screen: 'NotificationsScreen' };

export const NOTIFICATION_ICONS = {
  daily_challenge_published: '🔔',
  daily_challenge_reminder: '⏰',
  daily_challenge_ending_soon: '⚠️',
  assignment_new: '📝',
  assignment_deadline: '⏳',
  quiz_new: '🧠',
  quiz_deadline: '⏳',
  course_new: '📚',
  material_new: '📄',
  announcement: '📢',
  important_announcement: '🚨',
  trainer_message: '💬',
  project_update: '🛠️',
};

function resolveNotificationRoute(data) {
  const resolver = data?.type && ROUTES[data.type];
  if (!resolver && data?.dailyChallengeId) return DAILY_CHALLENGE_ROUTE();
  return (resolver && resolver(data)) || FALLBACK;
}

export async function markRead(notificationId) {
  if (!notificationId || !getUserId()) return;
  try {
    await markNotificationRead(notificationId);
  } catch (err) {
    console.log('Mark notification read error:', err);
  }
}

export function openNotification(navigation, data, { skipIfCurrent } = {}) {
  const { screen, params } = resolveNotificationRoute(data);
  if (skipIfCurrent && screen === skipIfCurrent) return;
  navigation.navigate(screen, params);
}
