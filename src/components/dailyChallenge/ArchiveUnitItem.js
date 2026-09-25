import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import Pill from '../ui/Pill';
import { COLORS } from '../../theme';

export default function ArchiveUnitItem({ unit, onPress }) {
  const hasQuestions = unit.questionCount > 0;

  return (
    <Card onPress={onPress} style={{ marginTop: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="bold" style={{ flex: 1, marginRight: 12, fontSize: 15, color: COLORS.slate900 }}>
          {unit.name}
        </AppText>
        <Pill label={hasQuestions ? `${unit.questionCount} Questions` : 'None yet'} tone={hasQuestions ? 'brand' : 'neutral'} />
      </View>

      <AppText style={{ marginTop: 6, fontSize: 12, color: COLORS.slate500 }}>
        {hasQuestions ? 'Tap to review past Daily Challenge questions' : "Start Today's Challenge to begin building this up"}
      </AppText>
    </Card>
  );
}
