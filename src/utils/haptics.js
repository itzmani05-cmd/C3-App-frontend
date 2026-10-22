import { Platform, Vibration } from 'react-native';

// A very short tick when an answer is chosen. Android only: iOS ignores the duration and buzzes for far too long.
export const haptics = {
  tap() {
    if (Platform.OS !== 'android') return;
    try {
      Vibration.vibrate(8);
    } catch {
      // Vibration is a nicety; never let it break a tap.
    }
  },
};
