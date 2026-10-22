import api from './client';
import { networkFirst } from '../utils/offlineCache';

export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
}

export async function changePassword(oldPassword, newPassword) {
  const { data } = await api.post('/api/auth/change-password', { oldPassword, newPassword });
  return data;
}

export async function getProfile() {
  const { data } = await api.get('/api/user/profile');
  return data || null;
}

export async function getDashboard() {
  const { data } = await api.get('/api/user/dashboard');
  return data;
}

export function getMyExams() {
  return networkFirst('exams', async (options) => {
    const { data } = await api.get('/api/user/exams', options);
    return Array.isArray(data?.exams) ? data.exams : [];
  });
}

export async function savePushToken(token) {
  await api.post('/api/user/push-token', { token });
}

export async function removePushToken(token) {
  await api.delete('/api/user/push-token', { data: token ? { token } : {} });
}
