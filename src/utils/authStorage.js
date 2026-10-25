import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// The session holds the login token, so on a phone it lives in the system keychain / keystore. Earlier versions kept it
// in AsyncStorage, which is plain storage: that copy is moved across the first time it is read. The web build has no
// secure storage and keeps using AsyncStorage.
const SESSION_KEY = 'c3app.session';
const LEGACY_SESSION_KEY = '@c3app/session';

const useSecureStore = Platform.OS !== 'web';

export async function saveSession(session) {
    try {
        const raw = JSON.stringify(session);
        if (useSecureStore) {
            await SecureStore.setItemAsync(SESSION_KEY, raw);
            await AsyncStorage.removeItem(LEGACY_SESSION_KEY);
        } else {
            await AsyncStorage.setItem(LEGACY_SESSION_KEY, raw);
        }
    } catch (err) {
        console.log('Failed to save session:', err);
    }
}

export async function getSession() {
    try {
        if (!useSecureStore) {
            const raw = await AsyncStorage.getItem(LEGACY_SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        }

        const secured = await SecureStore.getItemAsync(SESSION_KEY);
        if (secured) return JSON.parse(secured);

        const legacy = await AsyncStorage.getItem(LEGACY_SESSION_KEY);
        if (!legacy) return null;
        const session = JSON.parse(legacy);
        await saveSession(session);
        return session;
    } catch (err) {
        console.log('Failed to load session:', err);
        return null;
    }
}

export async function clearSession() {
    try {
        if (useSecureStore) await SecureStore.deleteItemAsync(SESSION_KEY);
        await AsyncStorage.removeItem(LEGACY_SESSION_KEY);
    } catch (err) {
        console.log('Failed to clear session:', err);
    }
}
