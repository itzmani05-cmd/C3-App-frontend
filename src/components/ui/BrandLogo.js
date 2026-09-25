import React from 'react';
import { Image, View } from 'react-native';
import AppText from './AppText';
import { COLORS } from '../../theme';

const LOGO = require('../../../assets/C3AppLogo.png');

export default function BrandLogo({ tagline = 'Empowering Civil Engineers.', style }) {
  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      <Image source={LOGO} style={{ width: 244, height: 160, resizeMode: 'contain' }} />
      <AppText style={{ color: COLORS.gray500, fontSize: 12, marginTop: 2 }}>{tagline}</AppText>
    </View>
  );
}
