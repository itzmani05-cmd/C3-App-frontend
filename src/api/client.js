import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export function getUserId() {
  return global.userId || global.user?.userId || null;
}

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const userId = getUserId();
  if (userId && !config.headers?.userid) {
    config.headers.userid = userId;
  }
  return config;
});

export default api;
