import React from 'react';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import { getGreeting } from '../../utils/format';
import { COLORS, RADII } from '../../theme';

export default function GreetingCard({ name }) {
  return (
    <Card elevation="card" style={cardStyle}>
      <AppText variant="medium" style={{ color: COLORS.gray500, fontSize: 13 }}>
        {getGreeting()}
      </AppText>
      <AppText variant="extraBold" style={{ marginTop: 4, color: COLORS.slate900, fontSize: 24 }}>
        {name || 'Learner'}
      </AppText>
    </Card>
  );
}

const cardStyle = {
  marginTop: 16,
  marginHorizontal: 16,
  borderRadius: RADII.lg + 2,
  padding: 18,
  borderColor: COLORS.gray200,
};
