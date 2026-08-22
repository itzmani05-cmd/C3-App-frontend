import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@c3app/session';

export async function saveSession(session) {
    try {
        await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (err) {
        console.log('Failed to save session:', err);
    }
}

export async function getSession() {
    try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        console.log('Failed to load session:', err);
        return null;
    }
}

export async function clearSession() {
    try {
        await AsyncStorage.removeItem(SESSION_KEY);
    } catch (err) {
        console.log('Failed to clear session:', err);
    }
}
