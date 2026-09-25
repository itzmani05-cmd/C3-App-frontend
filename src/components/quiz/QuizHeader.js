import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import Pill from '../ui/Pill';
import { formatClock } from '../../utils/format';
import { COLORS } from '../../theme';

export default function QuizHeader({ title, timeLeft, answeredCount, pendingCount }) {
  return (
    <View style={containerStyle}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppText variant="extraBold" numberOfLines={1} style={{ flex: 1, fontSize: 17, color: COLORS.slate900, marginRight: 10 }}>
          {title}
        </AppText>
        <Pill
          label={`⏱ ${formatClock(timeLeft)}`}
          color={COLORS.red700}
          backgroundColor={COLORS.red100}
          style={{ paddingVertical: 5, borderWidth: 1, borderColor: COLORS.red200 }}
          textStyle={{ fontSize: 13 }}
        />
      </View>

      <View style={countsStyle}>
        <AppText variant="semiBold" style={{ color: COLORS.green600, fontSize: 13 }}>
          Answered: {answeredCount}
        </AppText>
        <AppText variant="semiBold" style={{ color: COLORS.red600, fontSize: 13 }}>
          Pending: {pendingCount}
        </AppText>
      </View>
    </View>
  );
}

const containerStyle = {
  padding: 16,
  paddingTop: 40,
  backgroundColor: COLORS.white,
  shadowColor: COLORS.slate900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 3,
  zIndex: 10,
};

const countsStyle = {
  marginTop: 12,
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: COLORS.slate50,
  padding: 10,
  borderRadius: 10,
};
