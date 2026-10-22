import React from 'react';
import { View } from 'react-native';
import { GraduationCap } from '../../icons';
import AppText from '../ui/AppText';
import IconTile from '../ui/IconTile';
import { tw } from '../../theme';

export default function NoExamAssigned() {
  return (
    <View style={tw`flex-1 items-center justify-center bg-app px-8`}>
      <IconTile icon={GraduationCap} tone="neutral" size={56} iconSize={26} />
      <AppText variant="extraBold" style={tw`mt-4 mb-2 text-xl text-slate-900 text-center`}>
        No exam assigned yet
      </AppText>
      <AppText style={tw`text-sm leading-5 text-slate-500 text-center`}>
        Your account isn't registered for an exam yet. Please contact your institute admin to get one assigned.
      </AppText>
    </View>
  );
}
