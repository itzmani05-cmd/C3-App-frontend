import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import AppText from './AppText';

export default function ExamPicker({ exams, onSelect }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC', padding: 16 }}>
      <AppText variant="extraBold" style={{ fontSize: 20, color: '#0F172A', marginTop: 24, marginBottom: 4 }}>
        Choose your exam
      </AppText>
      <AppText style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>
        You're enrolled in more than one exam. Pick one to continue.
      </AppText>

      <FlatList
        data={exams}
        keyExtractor={(item) => String(item._id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelect(item._id)}
            activeOpacity={0.75}
            style={{
              padding: 18,
              marginBottom: 12,
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <AppText variant="bold" style={{ fontSize: 16, color: '#0F172A' }}>
              {item.name}
            </AppText>
            <AppText variant="bold" style={{ fontSize: 16, color: '#2563EB' }}>
              →
            </AppText>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
