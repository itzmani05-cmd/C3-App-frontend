import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from './AppText';
import AppButton from './AppButton';
import { authenticateWithBiometrics } from '../../utils/biometricLock';
import { COLORS, tw } from '../../theme';

const LOGO = require('../../../assets/C3AppLogo.png');

// Covers the app until the student passes the fingerprint / face check. It asks automatically once `autoPrompt` is true
// (after the splash has gone), and has a button to ask again plus a way out for a student who cannot unlock.
export default function LockScreen({ autoPrompt, onUnlock, onLogout }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const busyRef = useRef(false);

  const attempt = async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    const ok = await authenticateWithBiometrics();
    busyRef.current = false;
    setBusy(false);
    if (ok) onUnlock();
    else setFailed(true);
  };

  useEffect(() => {
    if (autoPrompt) attempt();
    // Prompt once when allowed to; later attempts come from the button.
  }, [autoPrompt]);

  // The screens underneath are still mounted, so keep the Android back button from navigating them.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, []);

  return (
    <View style={[StyleSheet.absoluteFill, tw`bg-ink-900 items-center justify-center px-8`, { zIndex: 50 }]} accessibilityViewIsModal importantForAccessibility="yes">
      <View style={tw`w-24 h-24 rounded-3xl bg-white items-center justify-center mb-6`}>
        <Image source={LOGO} style={{ width: 70, height: 70, resizeMode: 'contain' }} />
      </View>
      <AppText type="title" style={tw`text-white text-center`}>
        C³ Institute is locked
      </AppText>
      <AppText type="small" style={tw`mt-2 text-slate-300 text-center`}>
        {failed ? "That didn't work. Try again." : 'Use your fingerprint or face to continue.'}
      </AppText>

      <AppButton label={busy ? 'Checking...' : 'Unlock'} onPress={attempt} disabled={busy} size="lg" style={tw`mt-8 self-stretch rounded-lg`} />

      <TouchableOpacity onPress={onLogout} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} accessibilityRole="button" style={tw`mt-5`}>
        <AppText variant="semiBold" style={tw`text-[13px] text-slate-300`}>
          Log out instead
        </AppText>
      </TouchableOpacity>
    </View>
  );
}
