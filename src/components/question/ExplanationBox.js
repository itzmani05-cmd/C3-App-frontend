import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import BilingualText from '../ui/BilingualText';
import QuestionImage from './QuestionImage';
import { COLORS, RADII } from '../../theme';

export default function ExplanationBox({ text, image, accent = COLORS.brand600, textColor = COLORS.slate700 }) {
  return (
    <View style={boxStyle}>
      <AppText variant="bold" style={{ color: accent, fontSize: 12 }}>
        Explanation
      </AppText>
      {text ? <BilingualText style={{ marginTop: 6, color: textColor, lineHeight: 21 }}>{text}</BilingualText> : null}
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
};
