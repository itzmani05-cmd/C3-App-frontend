import React from 'react';
import { TextInput } from 'react-native';
import { FONT_FAMILY } from '../theme/typography';

export default function AppTextInput({
  variant = 'regular',
  style,
  placeholderTextColor = '#6B7280',
  ...props
}) {
  const fontFamily = FONT_FAMILY[variant] || FONT_FAMILY.regular;

  return (
    <TextInput
      {...props}
      placeholderTextColor={placeholderTextColor}
      style={[{ fontFamily }, style]}
    />
  );
}
