import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import AppText from '../ui/AppText';
import { COLORS } from '../../theme';

function ExamOption({ exam, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={optionStyle}>
      <AppText variant="bold" style={{ fontSize: 16, color: COLORS.slate900 }}>
        {exam.name}
      </AppText>
      <AppText variant="bold" style={{ fontSize: 16, color: COLORS.blue600 }}>
        →
      </AppText>
    </TouchableOpacity>
  );
}

export default function ExamPicker({ exams, onSelect }) {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.appBackground, padding: 16 }}>
      <AppText variant="extraBold" style={{ fontSize: 20, color: COLORS.slate900, marginTop: 24, marginBottom: 4 }}>
        Choose your exam
      </AppText>
      <AppText style={{ fontSize: 14, color: COLORS.gray500, marginBottom: 20 }}>
        You're enrolled in more than one exam. Pick one to continue.
      </AppText>

      <FlatList
        data={exams}
        keyExtractor={(item) => String(item._id)}
        renderItem={({ item }) => <ExamOption exam={item} onPress={() => onSelect(item._id)} />}
      />
    </View>
  );
}

const optionStyle = {
  padding: 18,
  marginBottom: 12,
  backgroundColor: COLORS.white,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: COLORS.gray200,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};
