import React from 'react';
import { View } from 'react-native';
import { ChevronRight, CircleCheck, Layers } from '../../icons';
import AppText from '../ui/AppText';
import IconTile from '../ui/IconTile';
import PressableScale from '../ui/PressableScale';
import ProgressBar from '../ui/ProgressBar';
import { unitProgress } from '../../utils/lessonProgress';
import { COLORS, SHADOWS, tw } from '../../theme';

export default function UnitCard({ unit, onPress }) {
  const { total, cleared, percent } = unitProgress(unit);
  const done = !!unit?.isCleared || (total > 0 && cleared === total);
  const accent = done ? COLORS.green600 : COLORS.brand600;

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      accessibilityRole="button"
      accessibilityLabel={`${unit.name}${total ? `, ${cleared} of ${total} lessons completed` : ''}`}
      style={[tw`mb-3 rounded-xl border border-slate-200 bg-white p-3.5`, SHADOWS.sm]}
    >
      <View style={tw`flex-row items-center`}>
        <IconTile icon={done ? CircleCheck : Layers} tone={done ? 'success' : 'brand'} size={44} iconSize={22} />

        <View style={tw`flex-1 mx-3.5`}>
          <AppText type="heading" style={tw`text-slate-900`} numberOfLines={2}>
            {unit.name}
          </AppText>
          <AppText type="small" style={tw`mt-0.5 text-slate-500`}>
            {total > 0 ? (done ? 'Completed' : `${cleared} of ${total} lessons`) : 'Open topics for this unit'}
          </AppText>
        </View>

        {total > 0 ? (
          <AppText variant="bold" style={[tw`mr-2 text-[13px]`, { color: accent }]}>
            {percent}%
          </AppText>
        ) : null}
        <ChevronRight size={18} color={COLORS.slate400} />
      </View>

      {total > 0 ? <ProgressBar value={percent} color={accent} height={5} style={tw`mt-3`} /> : null}
    </PressableScale>
  );
}
