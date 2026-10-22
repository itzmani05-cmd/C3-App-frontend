import React from 'react';
import { View } from 'react-native';
import { Lightbulb } from '../../icons';
import AppText from '../ui/AppText';
import BilingualText from '../ui/BilingualText';
import QuestionImage from './QuestionImage';
import { COLORS, RADII } from '../../theme';

export default function ExplanationBox({ text, image, accent = COLORS.brand600, textColor = COLORS.slate700 }) {
  return (
    <View style={boxStyle}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Lightbulb size={14} color={accent} />
        <AppText variant="bold" style={{ marginLeft: 6, color: accent, fontSize: 12 }}>
          Explanation
        </AppText>
      </View>
      {text ? <BilingualText style={{ marginTop: 8, color: textColor, lineHeight: 21, fontSize: 14 }}>{text}</BilingualText> : null}
      <QuestionImage uri={image} height={150} style={{ marginTop: 10 }} />
    </View>
  );
}

const boxStyle = {
  marginTop: 14,
  padding: 14,
  borderRadius: RADII.md,
  backgroundColor: COLORS.slate50,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  borderLeftWidth: 3,
  borderLeftColor: COLORS.brand600,
};
