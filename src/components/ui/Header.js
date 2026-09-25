import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ArrowLeft, Bell, LogOut } from 'lucide-react-native';
import AppText from './AppText';
import { COLORS } from '../../theme';

function IconButton({ onPress, disabled, style, children }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.7} style={[iconButtonStyle, style]}>
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
  unreadCount = 0,
}) {
  return (
    <View style={containerStyle}>
      {showBack ? (
        <IconButton onPress={onBackPress} disabled={!onBackPress} style={backButtonStyle}>
          <ArrowLeft size={18} color={COLORS.slate900} />
        </IconButton>
      ) : null}

      <AppText variant="extraBold" style={titleStyle} numberOfLines={1}>
        {title}
      </AppText>

      {onBellPress || rightLabel ? (
        <View style={rightGroupStyle}>
          {onBellPress ? (
            <IconButton onPress={onBellPress} style={{ marginRight: rightLabel ? 10 : 0 }}>
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
  height: 100,
  paddingTop: 50,
  paddingBottom: 18,
  paddingHorizontal: 16,
  backgroundColor: COLORS.white,
  justifyContent: 'center',
  flexDirection: 'row',
  alignItems: 'center',
  shadowColor: COLORS.slate900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
  zIndex: 10,
};

const titleStyle = {
  fontSize: 17,
  color: COLORS.slate900,
  textAlign: 'center',
  letterSpacing: 0.2,
};

const iconButtonStyle = {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: COLORS.gray100,
  justifyContent: 'center',
  alignItems: 'center',
};

const backButtonStyle = {
  position: 'absolute',
  left: 12,
  bottom: 14,
};

const rightGroupStyle = {
  position: 'absolute',
  right: 16,
  bottom: 14,
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
  borderRadius: 999,
  borderWidth: 1,
};
