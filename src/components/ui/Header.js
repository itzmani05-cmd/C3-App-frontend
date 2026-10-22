import React from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Bell, LayoutGrid, LogOut } from '../../icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from './AppText';
import { COLORS } from '../../theme';

function IconButton({ onPress, disabled, style, label, children }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[iconButtonStyle, style]}
    >
      {children}
    </TouchableOpacity>
  );
}

function RightAction({ label, color, onPress }) {
  const isLogout = label === 'Logout';
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        rightActionStyle,
        {
          backgroundColor: isLogout ? COLORS.red50 : COLORS.brand50,
          borderColor: isLogout ? COLORS.red100 : COLORS.brand100,
        },
      ]}
    >
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
        <AppText variant="bold" style={{ fontSize: 12, color }}>
          {label}
        </AppText>
        {isLogout ? <LogOut size={14} color={color} /> : null}
      </View>
    </TouchableOpacity>
  );
}

export default function Header({
  title,
  showBack,
  onBackPress,
  rightLabel,
  onRightPress,
  rightLabelColor = COLORS.red600,
  onBellPress,
  onMenuPress,
  unreadCount = 0,
  titleOpacity,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[containerStyle, { height: insets.top + 56, paddingTop: insets.top }]}>
      {showBack ? (
        <IconButton onPress={onBackPress} disabled={!onBackPress} style={backButtonStyle} label="Go back">
          <ArrowLeft size={18} color={COLORS.slate900} />
        </IconButton>
      ) : null}

      <Animated.View style={titleOpacity ? { opacity: titleOpacity } : null}>
        <AppText variant="extraBold" style={titleStyle} numberOfLines={1}>
          {title}
        </AppText>
      </Animated.View>

      {onBellPress || onMenuPress || rightLabel ? (
        <View style={rightGroupStyle}>
          {onMenuPress ? (
            <IconButton onPress={onMenuPress} label="Open features menu" style={{ marginRight: onBellPress || rightLabel ? 10 : 0 }}>
              <LayoutGrid size={17} color={COLORS.brand700} />
            </IconButton>
          ) : null}
          {onBellPress ? (
            <IconButton onPress={onBellPress} label="Notifications" style={{ marginRight: rightLabel ? 10 : 0 }}>
              <Bell size={17} color={COLORS.gray700} />
              {unreadCount > 0 ? <View style={unreadDotStyle} /> : null}
            </IconButton>
          ) : null}
          {rightLabel ? <RightAction label={rightLabel} color={rightLabelColor} onPress={onRightPress} /> : null}
        </View>
      ) : null}
    </View>
  );
}

const containerStyle = {
  paddingHorizontal: 16,
  backgroundColor: COLORS.white,
  justifyContent: 'center',
  flexDirection: 'row',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: COLORS.slate200,
  zIndex: 10,
};

const titleStyle = {
  fontSize: 17,
  color: COLORS.slate900,
  textAlign: 'center',
  letterSpacing: -0.2,
};

const iconButtonStyle = {
  width: 36,
  height: 36,
  borderRadius: 8,
  backgroundColor: COLORS.white,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  justifyContent: 'center',
  alignItems: 'center',
};

const backButtonStyle = {
  position: 'absolute',
  left: 12,
  bottom: 10,
};

const rightGroupStyle = {
  position: 'absolute',
  right: 16,
  bottom: 12,
  flexDirection: 'row',
  alignItems: 'center',
};

const unreadDotStyle = {
  position: 'absolute',
  top: 4,
  right: 5,
  width: 9,
  height: 9,
  borderRadius: 5,
  backgroundColor: COLORS.red600,
  borderWidth: 1.5,
  borderColor: COLORS.white,
};

const rightActionStyle = {
  minHeight: 32,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 12,
  borderRadius: 8,
  borderWidth: 1,
};
