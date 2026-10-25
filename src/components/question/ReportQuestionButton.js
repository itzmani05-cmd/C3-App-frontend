import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Flag } from '../../icons';
import AppText from '../ui/AppText';
import FeedbackSheet from '../home/FeedbackSheet';
import { COLORS, tw } from '../../theme';

/**
 * A small "Report" button for a question. It opens the feedback form already labelled with the question's number, so a
 * student who spots a mistake only has to say what is wrong. `number` is the one the student sees (1-based).
 */
export default function ReportQuestionButton({ questionId, number, source, context, style }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel={`Report a problem with question ${number}`}
        style={[tw`flex-row items-center`, style]}
      >
        <Flag size={14} color={COLORS.slate500} />
        <AppText variant="semiBold" style={tw`ml-1 text-xs text-slate-500`}>
          Report
        </AppText>
      </TouchableOpacity>
      <FeedbackSheet visible={visible} onClose={() => setVisible(false)} question={{ id: questionId, number, source, context }} />
    </>
  );
}
