import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { COLORS } from '../../theme';

const LOGO = require('../../../assets/C3AppLogo.png');

const SEEN_KEY = '@c3app/splash_seen';
const EXIT_MS = 450;

// The full intro plays the first time the app opens; after that a shorter version gets returning students in quickly.
// Each timing is [delay, duration].
const MODES = {
  full: { minVisible: 2600, glow: 900, tile: 150, sweep: [500, 950], title: [700, 650], tagline: [1050, 600], line: [800, 1500], ring: true },
  // reduce-motion: no movement at all, just the logo for a moment
  reduced: { minVisible: 700, glow: 0, tile: 0, sweep: null, title: null, tagline: null, line: null, ring: false },
  quick: { minVisible: 1100, glow: 400, tile: 0, sweep: [200, 600], title: [200, 400], tagline: [380, 350], line: null, ring: false },
};
const TILE = 124;

const useNative = { useNativeDriver: true };
const ease = Easing.out(Easing.cubic);

// Soft radial-looking glow: stacked translucent circles, since a blur is not available in plain React Native.
function Glow({ size, color, style, opacity }) {
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size, opacity }, style]}>
      {[1, 0.74, 0.5, 0.3].map((scale, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            width: size * scale,
            height: size * scale,
            borderRadius: size,
            left: (size - size * scale) / 2,
            top: (size - size * scale) / 2,
            backgroundColor: color,
            opacity: 0.1,
          }}
        />
      ))}
    </Animated.View>
  );
}

/**
 * Branded launch screen. It plays a short intro (logo tile, light sweep, title, progress line) and, once both the
 * intro has had time to play and `ready` is true, fades out and calls `onDone`. The app is mounted underneath, so the
 * fade reveals the login page (or the home tabs for a signed-in student).
 */
export default function SplashScreen({ ready = true, onDone }) {
  const [mode, setMode] = useState(null);
  const [fontsLoaded] = useFonts({ JakartaExtraBold: require('../../../assets/fonts/PlusJakartaSans_800ExtraBold.ttf') });

  const glow = useRef(new Animated.Value(0)).current;
  const tile = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(0)).current;
  const title = useRef(new Animated.Value(0)).current;
  const tagline = useRef(new Animated.Value(0)).current;
  const line = useRef(new Animated.Value(0)).current;
  const exit = useRef(new Animated.Value(0)).current;
  const introDone = useRef(false);
  const exiting = useRef(false);
  const readyRef = useRef(ready);
  readyRef.current = ready;

  const startExit = () => {
    if (exiting.current) return;
    exiting.current = true;
    Animated.timing(exit, { toValue: 1, duration: EXIT_MS, easing: Easing.in(Easing.cubic), ...useNative }).start(() => onDone?.());
  };

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(SEEN_KEY), AccessibilityInfo.isReduceMotionEnabled()])
      .then(([seen, reduce]) => setMode(reduce ? 'reduced' : seen ? 'quick' : 'full'))
      .catch(() => setMode('full'));
  }, []);

  useEffect(() => {
    if (!mode) return undefined;
    const t = MODES[mode];
    if (mode === 'full') AsyncStorage.setItem(SEEN_KEY, '1').catch(() => {});

    if (mode === 'reduced') {
      [glow, tile, sweep, title, tagline, line].forEach((value) => value.setValue(1));
      const reducedTimer = setTimeout(() => {
        introDone.current = true;
        if (readyRef.current) startExit();
      }, t.minVisible);
      return () => clearTimeout(reducedTimer);
    }

    const after = ([delay, duration], value, easing = ease) =>
      Animated.sequence([Animated.delay(delay), Animated.timing(value, { toValue: 1, duration, easing, ...useNative })]);

    Animated.parallel([
      Animated.timing(glow, { toValue: 1, duration: t.glow, easing: ease, ...useNative }),
      Animated.sequence([Animated.delay(t.tile), Animated.spring(tile, { toValue: 1, friction: 6, tension: 80, ...useNative })]),
      after(t.sweep, sweep, Easing.inOut(Easing.quad)),
      after(t.title, title),
      after(t.tagline, tagline),
      t.line ? after(t.line, line, Easing.inOut(Easing.cubic)) : Animated.delay(0),
    ]).start();

    let pulse = null;
    let pulseTimer = null;
    if (t.ring) {
      pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(ring, { toValue: 1, duration: 1500, easing: Easing.out(Easing.quad), ...useNative }),
          Animated.timing(ring, { toValue: 0, duration: 0, ...useNative }),
        ])
      );
      pulseTimer = setTimeout(() => pulse.start(), 600);
    }

    const introTimer = setTimeout(() => {
      introDone.current = true;
      if (readyRef.current) startExit();
    }, t.minVisible);

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(introTimer);
      pulse?.stop();
    };
    // Each mode's intro runs once; `ready` is read through a ref.
  }, [mode]);

  useEffect(() => {
    if (ready && introDone.current) startExit();
  }, [ready]);

  const titleStyle = {
    opacity: title,
    transform: [{ translateY: title.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
  };
  const headingFont = fontsLoaded ? { fontFamily: 'JakartaExtraBold' } : { fontWeight: '800' };

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        {
          opacity: exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
          transform: [{ scale: exit.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }],
        },
      ]}
    >
      <StatusBar style="light" />

      <Glow size={460} color={COLORS.brand600} opacity={glow} style={{ top: -170, right: -190 }} />
      <Glow size={380} color={COLORS.brand500} opacity={glow} style={{ bottom: -150, left: -170 }} />

      <View style={styles.center}>
        <View style={{ width: TILE, height: TILE, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ring,
              {
                opacity: ring.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
                transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] }) }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.tile,
              {
                opacity: tile,
                transform: [{ scale: tile.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }) }],
              },
            ]}
          >
            <Image source={LOGO} style={styles.logo} />
            <Animated.View
              pointerEvents="none"
              style={[
                styles.sweep,
                { transform: [{ translateX: sweep.interpolate({ inputRange: [0, 1], outputRange: [-TILE, TILE * 1.4] }) }, { rotate: '18deg' }] },
              ]}
            />
          </Animated.View>
        </View>

        <Animated.View style={[{ alignItems: 'center', marginTop: 30 }, titleStyle]}>
          <Text style={[styles.title, headingFont]}>C³ Institute</Text>
        </Animated.View>
        <Animated.Text style={[styles.tagline, { opacity: tagline }]}>EMPOWERING CIVIL ENGINEERS</Animated.Text>
      </View>

      <View style={styles.footer}>
        {mode === 'full' ? (
        <View style={styles.track}>
          <Animated.View
            style={[
              styles.fill,
              { transform: [{ scaleX: line }], transformOrigin: 'left' },
            ]}
          />
        </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.ink900, zIndex: 100, overflow: 'hidden' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tile: {
    width: TILE,
    height: TILE,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.brand500,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 14,
  },
  logo: { width: TILE - 28, height: TILE - 28, resizeMode: 'contain' },
  sweep: { position: 'absolute', top: -20, bottom: -20, width: 36, backgroundColor: 'rgba(255,255,255,0.75)' },
  ring: {
    position: 'absolute',
    width: TILE,
    height: TILE,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.brand500,
  },
  title: { fontSize: 30, color: COLORS.white, letterSpacing: -0.6 },
  tagline: { marginTop: 10, fontSize: 11, letterSpacing: 3, color: COLORS.slate400 },
  footer: { alignItems: 'center', paddingBottom: 56 },
  track: { width: 120, height: 3, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden' },
  fill: { width: 120, height: 3, borderRadius: 3, backgroundColor: COLORS.brand500 },
});
