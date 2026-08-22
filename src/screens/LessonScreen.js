import React from 'react'
import { View } from 'react-native';
import AppText from '../components/AppText';

export default function LessonScreen () {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <AppText variant="bold" style={{ fontSize: 18, color: '#0F172A' }}>
            Lesson coming soon
        </AppText>
        <AppText style={{ marginTop: 8, fontSize: 13, color: '#6B7280', textAlign: 'center' }}>
            This lesson view is still being built.
        </AppText>
    </View>
  )
}
