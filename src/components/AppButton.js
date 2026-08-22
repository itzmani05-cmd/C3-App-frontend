import React from 'react';
import { TouchableOpacity } from 'react-native';
import AppText from './AppText';

const BUTTON_TONE = {
  primary: {
    containerStyle: {
      backgroundColor: '#2563EB',
      borderWidth: 0,
      borderColor: 'transparent',
    },
    textColor: '#FFFFFF',
  },
  secondary: {
    containerStyle: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#D1D5DB',
    },
    textColor: '#111827',
  },
};

export default function AppButton({
  label,
  onPress,
  tone = 'primary',
  style,
  textStyle,
  disabled = false,
}) {
  const toneStyle = BUTTON_TONE[tone] || BUTTON_TONE.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        buttonStyle,
        toneStyle.containerStyle,
        disabled ? disabledStyle : null,
        style,
      ]}
    >
      <AppText
        variant="bold"
        style={[
          buttonTextStyle,
          { color: toneStyle.textColor },
          textStyle,
        ]}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

const buttonStyle = {
  borderRadius: 12,
  paddingVertical: 14,
  alignItems: 'center',
};

const disabledStyle = {
  opacity: 0.6,
};

const buttonTextStyle = {
  fontSize: 15,
};
