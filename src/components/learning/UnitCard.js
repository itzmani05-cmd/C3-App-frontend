import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from '../ui/AppText';
import { COLORS } from '../../theme';

export default function UnitCard({ unit, onPress }) {
  const color = unit?.isCleared ? COLORS.green600 : COLORS.blue600;

  return (
    <TouchableOpacity onPress={onPress} style={cardStyle}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <AppText variant="bold" style={{ color: COLORS.black, fontSize: 16 }}>
          {unit.name}
        </AppText>
        <AppText style={{ marginTop: 4, color: COLORS.gray500, fontSize: 12 }}>Open topics for this unit</AppText>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <AppText variant="extraBold" style={{ color, fontSize: 16 }}>
          {unit?.isCleared ? '✓' : '→'}
        </AppText>
        <AppText variant="semiBold" style={{ marginTop: 4, color, fontSize: 12 }}>
          {unit?.isCleared ? 'Done' : 'Open'}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}

const cardStyle = {
  marginTop: 12,
  padding: 18,
  backgroundColor: COLORS.white,
  borderRadius: 18,
  borderColor: COLORS.gray200,
  borderWidth: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};
