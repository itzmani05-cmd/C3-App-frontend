import React from 'react';
import { Text } from 'react-native';
import { FONT_FAMILY } from '../theme/typography';

export default function AppText({
  variant = 'regular',
  style,
  children,
  ...props
}) {
  const fontFamily = FONT_FAMILY[variant] || FONT_FAMILY.regular;

  return (
    <Text {...props} style={[{ fontFamily }, style]}>
      {children}
    </Text>
  );
}
