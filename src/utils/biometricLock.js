import AsyncStorage from '@react-native-async-storage/async-storage';

// The native module is only present in builds made after it was added. Load it defensively, like the web view in
// MathText: older builds keep running and simply do not offer the lock.
let LocalAuthentication = null;
try {
  LocalAuthentication = require('expo-local-authentication');
} catch (error) {
  LocalAuthentication = null;
}

const ENABLED_KEY = '@c3app/biometric_lock';

// How long the app can sit in the background before it asks again.
export const LOCK_AFTER_MS = 2 * 60 * 1000;

export async function isBiometricAvailable() {
  if (!LocalAuthentication) return false;
  try {
    return (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync());
  } catch {
    return false;
  }
}

export async function isBiometricLockEnabled() {
  try {
    return (await AsyncStorage.getItem(ENABLED_KEY)) === '1';
  } catch {
    return false;
  }
}

export async function setBiometricLockEnabled(enabled) {
  try {
    if (enabled) await AsyncStorage.setItem(ENABLED_KEY, '1');
    else await AsyncStorage.removeItem(ENABLED_KEY);
  } catch {
    // The setting simply will not stick; nothing else depends on it.
  }
}

// True when the student passed the fingerprint / face check (or the phone's PIN, which the system offers as a fallback).
export async function authenticateWithBiometrics(promptMessage = 'Unlock C3 Institute') {
  if (!LocalAuthentication) return false;
  try {
    const result = await LocalAuthentication.authenticateAsync({ promptMessage, cancelLabel: 'Cancel' });
    return !!result.success;
  } catch {
    return false;
  }
}
