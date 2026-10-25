import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from './client';

// Sends one piece of feedback. This is a POST, which the client never retries on its own, so a slow connection cannot
// create duplicates. The device details help the team reproduce a bug report.
export async function sendFeedback({ category, rating, message, question }) {
  const { data } = await api.post('/api/feedback', {
    category,
    rating: rating || undefined,
    message,
    question,
    platform: Platform.OS,
    appVersion: Constants.expoConfig?.version,
  });
  return data;
}
