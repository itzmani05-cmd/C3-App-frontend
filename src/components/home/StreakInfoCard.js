import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import { COLORS, RADII } from '../../theme';

export default function StreakInfoCard() {
  return (
    <View style={cardStyle}>
      <AppText variant="bold" style={{ color: COLORS.amber800, fontSize: 13 }}>
        🔥 How streaks work
      </AppText>
      <AppText style={{ marginTop: 4, color: COLORS.amber800, fontSize: 12, lineHeight: 18 }}>
        Complete the Daily Challenge to grow your streak by 1. Miss a day and it resets to zero — so check in daily to
        keep it alive!
      </AppText>
    </View>
  );
}

const cardStyle = {
  marginTop: 12,
  marginHorizontal: 16,
  backgroundColor: COLORS.amber50,
  borderRadius: RADII.lg,
  padding: 14,
  borderWidth: 1,
  borderColor: COLORS.amber100,
};
