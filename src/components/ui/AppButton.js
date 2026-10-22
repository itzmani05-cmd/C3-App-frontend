import React from 'react';
import { ActivityIndicator } from 'react-native';
import PressableScale from './PressableScale';
import AppText from './AppText';
import { COLORS, RADII } from '../../theme';

const TONES = {
  primary: { container: { backgroundColor: COLORS.blue600, borderWidth: 0 }, text: COLORS.white },
  brand: { container: { backgroundColor: COLORS.brand600, borderWidth: 0, borderRadius: RADII.xl }, text: COLORS.white },
  secondary: { container: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.gray300 }, text: COLORS.gray900 },
};

const SIZES = {
  md: { container: null, text: { fontSize: 15 }, variant: 'bold' },
  lg: { container: { height: 52, paddingVertical: 0, borderRadius: 6 }, text: { fontSize: 16 }, variant: 'medium' },
};

export default function AppButton({
  label,
  onPress,
  tone = 'primary',
  size = 'md',
  style,
  textStyle,
  disabled = false,
  loading = false,
}) {
  const toneStyle = TONES[tone] || TONES.primary;
  const sizeStyle = SIZES[size] || SIZES.md;

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      scaleTo={0.97}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading }}
      style={[baseStyle, toneStyle.container, sizeStyle.container, disabled ? disabledStyle : null, style]}
    >
      {loading ? (
        <ActivityIndicator color={toneStyle.text} />
      ) : (
        <AppText variant={sizeStyle.variant} style={[sizeStyle.text, { color: toneStyle.text }, textStyle]}>
          {label}
        </AppText>
      )}
    </PressableScale>
  );
}

const baseStyle = {
  borderRadius: RADII.md,
  paddingVertical: 14,
  alignItems: 'center',
  justifyContent: 'center',
};

const disabledStyle = {
  opacity: 0.6,
};
