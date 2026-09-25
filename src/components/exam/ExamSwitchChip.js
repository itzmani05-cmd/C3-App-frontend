import React from 'react';
import { TouchableOpacity } from 'react-native';
import AppText from '../ui/AppText';
import { COLORS, RADII } from '../../theme';

export default function ExamSwitchChip({ exams, selectedExamId, onPress }) {
  if (exams.length <= 1) return null;

  const examName = exams.find((exam) => exam._id === selectedExamId)?.name || 'Exam';

  return (
    <TouchableOpacity onPress={onPress} style={chipStyle}>
      <AppText variant="semiBold" style={{ fontSize: 12, color: COLORS.brand600 }}>
        {examName} · Switch
      </AppText>
    </TouchableOpacity>
  );
}

const chipStyle = {
  marginTop: 10,
  marginHorizontal: 16,
  alignSelf: 'flex-start',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: RADII.pill,
  backgroundColor: COLORS.brand50,
};
