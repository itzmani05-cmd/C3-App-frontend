import React from 'react';
import { View } from 'react-native';
import { CircleCheck, Flame, Target } from '../../icons';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import IconTile from '../ui/IconTile';
import { COLORS, tw } from '../../theme';

function Stat({ icon, tone, value, label }) {
  return (
    <View style={tw`flex-1 items-center`}>
      <IconTile icon={icon} tone={tone} size={34} iconSize={17} />
      <AppText variant="extraBold" style={[tw`mt-2 text-xl`, { color: COLORS.slate900, letterSpacing: -0.4 }]}>
        {value}
      </AppText>
      <AppText type="caption" style={tw`mt-0.5 text-slate-500`}>
        {label}
      </AppText>
    </View>
  );
}

// Three headline numbers from the daily-challenge summary, under the profile card.
export default function ProfileStats({ summary }) {
  if (!summary) return null;

  return (
    <Card elevation="sm" style={tw`mt-3 flex-row py-4`}>
      <Stat icon={Flame} tone="warning" value={summary.currentStreak || 0} label="Day streak" />
      <View style={tw`w-px bg-slate-200`} />
      <Stat icon={Target} tone="success" value={`${Math.round(summary.accuracy || 0)}%`} label="Accuracy" />
      <View style={tw`w-px bg-slate-200`} />
      <Stat icon={CircleCheck} tone="brand" value={summary.challengesCompleted || 0} label="Challenges" />
    </Card>
  );
}
