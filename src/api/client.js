import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export function getUserId() {
  return global.userId || global.user?.userId || null;
}

// The free-tier backend sleeps when idle, so a cold start can take a while: allow it, and retry reads that fail
// because the server is still waking up.
const api = axios.create({ baseURL: API_BASE_URL, timeout: 45000 });
const MAX_RETRIES = 2;
const RETRY_STATUSES = [502, 503, 504];
const LOGIN_PATH = '/api/auth/login';

let unauthorizedHandler = null;
let handlingUnauthorized = false;

// Called once when the server rejects the saved session (an expired or invalid token) so the app can sign out.
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

api.interceptors.request.use((config) => {
  const userId = getUserId();
  if (userId && !config.headers?.userid) {
    config.headers.userid = userId;
  }

  const token = global.user?.token;
  if (token && !config.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(undefined, async (error) => {
  const config = error.config;

  // A 401 on any route except login itself means the saved session is no longer valid.
  if (error.response?.status === 401 && config && !String(config.url || '').includes(LOGIN_PATH) && unauthorizedHandler && !handlingUnauthorized) {
    handlingUnauthorized = true;
    Promise.resolve(unauthorizedHandler()).finally(() => {
      handlingUnauthorized = false;
    });
    throw error;
  }

  const isRead = config?.method === 'get';
  const retryable = !error.response || RETRY_STATUSES.includes(error.response.status);

  if (!config || !isRead || !retryable) throw error;

  config.retryCount = (config.retryCount || 0) + 1;
  if (config.retryCount > (config.maxRetries ?? MAX_RETRIES)) throw error;

  await new Promise((resolve) => setTimeout(resolve, config.retryCount * 2000));
  return api(config);
});

export default api;
