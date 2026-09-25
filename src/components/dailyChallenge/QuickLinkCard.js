import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import { COLORS } from '../../theme';

export default function QuickLinkCard({ icon, label, onPress }) {
  return (
    <Card onPress={onPress} style={cardStyle}>
      <View style={iconBadgeStyle}>
        <AppText style={{ fontSize: 18 }}>{icon}</AppText>
      </View>
      <AppText variant="semiBold" style={{ marginTop: 8, fontSize: 12, color: COLORS.slate700, textAlign: 'center' }}>
        {label}
      </AppText>
    </Card>
  );
}

const cardStyle = {
  flex: 1,
  marginHorizontal: 4,
  paddingVertical: 16,
  paddingHorizontal: 6,
  alignItems: 'center',
};

const iconBadgeStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: COLORS.brand50,
  alignItems: 'center',
  justifyContent: 'center',
};
