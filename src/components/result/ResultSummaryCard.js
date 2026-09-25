import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import Pill from '../ui/Pill';
import { formatPercent } from '../../utils/format';
import { COLORS, SHADOWS } from '../../theme';

const TONES = {
  passed: { label: 'Passed', color: COLORS.blue700, backgroundColor: COLORS.blue100, card: { backgroundColor: COLORS.blue50, borderColor: COLORS.blue200 } },
  failed: { label: 'Failed', color: COLORS.red700, backgroundColor: COLORS.red100, card: { backgroundColor: COLORS.red50, borderColor: COLORS.red200 } },
};

export default function ResultSummaryCard({ pathLabel, quizLabel, passed, percentage }) {
  const tone = passed ? TONES.passed : TONES.failed;

  return (
    <View style={[cardStyle, tone.card]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <AppText variant="medium" style={{ color: COLORS.gray500, fontSize: 12 }}>
            {pathLabel}
          </AppText>
          <AppText variant="extraBold" style={{ marginTop: 6, color: COLORS.black, fontSize: 22 }}>
            {quizLabel}
          </AppText>
        </View>
        <Pill
          label={tone.label}
          color={tone.color}
          backgroundColor={tone.backgroundColor}
          style={{ paddingHorizontal: 12, paddingVertical: 7 }}
          textStyle={{ fontSize: 12 }}
        />
      </View>

      <AppText variant="extraBold" style={{ marginTop: 18, color: COLORS.black, fontSize: 34 }}>
        {formatPercent(percentage)}
      </AppText>
    </View>
  );
}

const cardStyle = {
  borderRadius: 20,
  padding: 18,
  borderWidth: 1,
  ...SHADOWS.card,
};
