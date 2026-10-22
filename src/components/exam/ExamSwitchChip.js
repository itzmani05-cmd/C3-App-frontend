import React from 'react';
import { TouchableOpacity } from 'react-native';
import { GraduationCap } from '../../icons';
import AppText from '../ui/AppText';
import { COLORS, tw } from '../../theme';

export default function ExamSwitchChip({ exams, selectedExamId, onPress }) {
  if (exams.length <= 1) return null;

  const examName = exams.find((exam) => exam._id === selectedExamId)?.name || 'Exam';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
      accessibilityRole="button"
      accessibilityLabel={`Switch exam, current exam ${examName}`}
      style={tw`mt-3 mx-4 self-start flex-row items-center rounded-lg border border-brand-100 bg-brand-50 px-3 py-1.5`}
    >
      <GraduationCap size={14} color={COLORS.brand700} />
      <AppText variant="semiBold" style={tw`ml-1.5 text-xs text-brand-700`}>
        {examName} · Switch
      </AppText>
    </TouchableOpacity>
  );
}
