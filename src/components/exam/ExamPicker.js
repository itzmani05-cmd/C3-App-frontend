import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { ChevronRight, GraduationCap } from '../../icons';
import AppText from '../ui/AppText';
import IconTile from '../ui/IconTile';
import { COLORS, SHADOWS, tw } from '../../theme';

function ExamOption({ exam, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Choose ${exam.name}`}
      style={[tw`mb-3 flex-row items-center rounded-xl border border-slate-200 bg-white p-3.5`, SHADOWS.sm]}
    >
      <IconTile icon={GraduationCap} tone="brand" size={44} iconSize={22} />
      <AppText variant="bold" style={tw`flex-1 mx-3.5 text-base text-slate-900`}>
        {exam.name}
      </AppText>
      <ChevronRight size={18} color={COLORS.slate400} />
    </TouchableOpacity>
  );
}

export default function ExamPicker({ exams, onSelect }) {
  return (
    <View style={tw`flex-1 bg-app px-4`}>
      <AppText variant="extraBold" style={tw`mt-16 mb-1 text-2xl text-slate-900`}>
        Choose your exam
      </AppText>
      <AppText style={tw`mb-6 text-sm leading-5 text-slate-500`}>You're enrolled in more than one exam. Pick one to continue.</AppText>

      <FlatList
        data={exams}
        keyExtractor={(item) => String(item._id)}
        renderItem={({ item }) => <ExamOption exam={item} onPress={() => onSelect(item._id)} />}
      />
    </View>
  );
}
