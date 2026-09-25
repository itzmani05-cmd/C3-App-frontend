import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import { COLORS } from '../../theme';

export default function NoExamAssigned() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.appBackground, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
      <AppText variant="extraBold" style={{ fontSize: 20, color: COLORS.slate900, marginBottom: 8, textAlign: 'center' }}>
        No exam assigned yet
      </AppText>
      <AppText style={{ fontSize: 14, color: COLORS.gray500, textAlign: 'center' }}>
        Your account isn't registered for an exam yet. Please contact your institute admin to get one assigned.
      </AppText>
    </View>
  );
}
