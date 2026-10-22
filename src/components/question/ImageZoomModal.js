import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Modal, PanResponder, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Minus, Plus, RotateCcw, X } from '../../icons';

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const STEP = 0.5;
const DOUBLE_TAP_MS = 280;
const DOUBLE_TAP_SCALE = 2.5;

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const touchDistance = (touches) => {
  const [a, b] = touches;
  return Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
};

export default function ImageZoomModal({ visible, uri, onClose }) {
  const [displayScale, setDisplayScale] = useState(1);
  const [box, setBox] = useState({ width: 0, height: 0 });

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const txAnim = useRef(new Animated.Value(0)).current;
  const tyAnim = useRef(new Animated.Value(0)).current;

  const t = useRef({ scale: 1, x: 0, y: 0 }).current;
  const g = useRef({ startDist: 0, startScale: 1, startX: 0, startY: 0, touches: 0, moved: false, lastTap: 0 }).current;
  const boxRef = useRef(box);
  boxRef.current = box;

  const clampTranslate = (x, y, scale) => {
    const maxX = (boxRef.current.width * (scale - 1)) / 2;
    const maxY = (boxRef.current.height * (scale - 1)) / 2;
    return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
  };

  const apply = (scale, x, y, animate = false) => {
    const s = clamp(scale, MIN_SCALE, MAX_SCALE);
    const { x: cx, y: cy } = clampTranslate(x, y, s);
    t.scale = s;
    t.x = cx;
    t.y = cy;
    if (animate) {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: s, duration: 180, useNativeDriver: true }),
        Animated.timing(txAnim, { toValue: cx, duration: 180, useNativeDriver: true }),
        Animated.timing(tyAnim, { toValue: cy, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      scaleAnim.setValue(s);
      txAnim.setValue(cx);
      tyAnim.setValue(cy);
    }
    setDisplayScale(s);
  };

  const reset = (animate = true) => apply(1, 0, 0, animate);

  useEffect(() => {
    if (visible) reset(false);
  }, [visible, uri]);

  const beginGesture = (touches) => {
    g.touches = touches.length;
    g.startScale = t.scale;
    g.startX = t.x;
    g.startY = t.y;
    g.startDist = touches.length >= 2 ? touchDistance(touches) : 0;
    g.startPageX = touches[0]?.pageX ?? 0;
    g.startPageY = touches[0]?.pageY ?? 0;
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (evt) => {
          g.moved = false;
          beginGesture(evt.nativeEvent.touches);
        },
        onPanResponderMove: (evt) => {
          const touches = evt.nativeEvent.touches;
          if (touches.length !== g.touches) beginGesture(touches);

          if (touches.length >= 2 && g.startDist > 0) {
            g.moved = true;
            apply(g.startScale * (touchDistance(touches) / g.startDist), g.startX, g.startY);
          } else if (touches.length === 1) {
            const dx = touches[0].pageX - g.startPageX;
            const dy = touches[0].pageY - g.startPageY;
            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) g.moved = true;
            if (t.scale > 1) apply(t.scale, g.startX + dx, g.startY + dy);
          }
        },
        onPanResponderRelease: () => {
          if (!g.moved) {
            const now = Date.now();
            if (now - g.lastTap < DOUBLE_TAP_MS) {
              g.lastTap = 0;
              if (t.scale > 1) reset(true);
              else apply(DOUBLE_TAP_SCALE, 0, 0, true);
            } else {
              g.lastTap = now;
            }
            return;
          }
          if (t.scale <= 1.02) reset(true);
        },
      }),
    []
  );

  const topOffset = Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 12;
  const percent = Math.round(displayScale * 100);

  return (
    <Modal visible={visible} transparent={false} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.backdrop}>
        <View
          style={styles.stage}
          onLayout={(e) => setBox({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
          {...panResponder.panHandlers}
        >
          {uri ? (
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { transform: [{ translateX: txAnim }, { translateY: tyAnim }, { scale: scaleAnim }] },
              ]}
            >
              <Image source={{ uri }} style={styles.image} resizeMode="contain" />
            </Animated.View>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close image"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={[styles.closeBtn, { top: topOffset }]}
        >
          <X size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={() => apply(t.scale - STEP, t.x, t.y, true)}
            disabled={displayScale <= MIN_SCALE}
            accessibilityLabel="Zoom out"
            style={[styles.toolBtn, displayScale <= MIN_SCALE && styles.toolBtnDisabled]}
          >
            <Minus size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.percent}>{percent}%</Text>
          <TouchableOpacity
            onPress={() => apply(t.scale + STEP, t.x, t.y, true)}
            disabled={displayScale >= MAX_SCALE}
            accessibilityLabel="Zoom in"
            style={[styles.toolBtn, displayScale >= MAX_SCALE && styles.toolBtnDisabled]}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => reset(true)}
            disabled={displayScale === 1}
            accessibilityLabel="Reset zoom"
            style={[styles.toolBtn, displayScale === 1 && styles.toolBtnDisabled]}
          >
            <RotateCcw size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>Pinch or double-tap to zoom · drag to move</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000000',
  },
  stage: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  toolbar: {
    position: 'absolute',
    bottom: 56,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  toolBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  toolBtnDisabled: {
    opacity: 0.35,
  },
  percent: {
    minWidth: 48,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  hint: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
});
