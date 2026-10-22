import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from '../api/client';

// Small JSON cache so content opens without a connection. Keys are scoped to the signed-in user.
const PREFIX = '@c3app/cache/';
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

const storageKey = (key) => `${PREFIX}${getUserId() || 'anon'}/${key}`;

export async function readCache(key) {
  try {
    const raw = await AsyncStorage.getItem(storageKey(key));
    if (!raw) return null;
    const { savedAt, value } = JSON.parse(raw);
    return Date.now() - savedAt > MAX_AGE_MS ? null : value ?? null;
  } catch {
    return null;
  }
}

export async function writeCache(key, value) {
  try {
    await AsyncStorage.setItem(storageKey(key), JSON.stringify({ savedAt: Date.now(), value }));
  } catch {
    // The cache is best-effort; a failed write must never break the screen.
  }
}

export async function clearCache() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys.filter((key) => key.startsWith(PREFIX)));
  } catch {
    // Nothing to do: stale entries are scoped by user and expire on their own.
  }
}

/**
 * Network first, saved copy second: returns fresh data when the request works (and saves it), and the last saved
 * copy when it does not. Throws only when there is nothing saved. The fetcher receives request options so a screen
 * that already has a saved copy does not wait through the retry delays before falling back.
 */
export async function networkFirst(key, fetcher) {
  const cached = await readCache(key);
  try {
    const fresh = await fetcher(cached != null ? { maxRetries: 0 } : {});
    writeCache(key, fresh);
    return fresh;
  } catch (err) {
    if (cached != null) return cached;
    throw err;
  }
}
