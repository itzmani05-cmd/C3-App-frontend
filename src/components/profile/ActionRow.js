import React from 'react';
import { View } from 'react-native';
import PressableScale from '../ui/PressableScale';
import { ChevronRight } from '../../icons';
import AppText from '../ui/AppText';
import IconTile from '../ui/IconTile';
import { COLORS, SHADOWS, tw } from '../../theme';

export default function ActionRow({ icon, label, helper, onPress, danger = false }) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[tw`mb-2.5 flex-row items-center rounded-xl border border-slate-200 bg-white p-3`, SHADOWS.sm]}
    >
      <IconTile icon={icon} tone={danger ? 'danger' : 'brand'} size={40} iconSize={19} />

      <View style={tw`flex-1 ml-3`}>
        <AppText variant="bold" style={[tw`text-[15px]`, { color: danger ? COLORS.red600 : COLORS.slate900 }]}>
          {label}
        </AppText>
        <AppText style={tw`mt-0.5 text-xs text-slate-500`}>{helper}</AppText>
      </View>

      <ChevronRight size={18} color={COLORS.slate400} />
    </PressableScale>
  );
}
