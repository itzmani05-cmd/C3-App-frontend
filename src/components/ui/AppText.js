import React from 'react';
import { Text } from 'react-native';
import { FONT_FAMILY, TYPE } from '../../theme';

// `type` picks a style from the app's type scale (see theme/typography.js); `variant` sets the weight and wins over the
// type's own.
export default function AppText({ variant, type, style, children, ...props }) {
  const preset = type ? TYPE[type] : null;
  const fontFamily = FONT_FAMILY[variant || preset?.variant || 'regular'] || FONT_FAMILY.regular;
  const { variant: presetVariant, ...metrics } = preset || {};

  return (
    <Text {...props} style={[{ fontFamily }, metrics, style]}>
      {children}
    </Text>
  );
}
