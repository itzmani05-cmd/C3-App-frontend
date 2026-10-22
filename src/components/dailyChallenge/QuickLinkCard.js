import React from 'react';
import { View } from 'react-native';
import { ChevronRight } from '../../icons';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import IconTile from '../ui/IconTile';
import { COLORS, tw } from '../../theme';

// A tappable tile with an icon, label and short helper line. `icon` is a lucide component.
export default function QuickLinkCard({ icon, tone = 'brand', label, helper, onPress }) {
  return (
    <Card onPress={onPress} elevation="sm" style={tw`p-3.5`}>
      <View style={tw`flex-row items-center justify-between`}>
        <IconTile icon={icon} tone={tone} size={36} iconSize={18} />
        <ChevronRight size={16} color={COLORS.slate400} />
      </View>
      <AppText variant="bold" style={tw`mt-3 text-sm text-slate-900`}>
        {label}
      </AppText>
      {helper ? <AppText style={tw`mt-0.5 text-xs text-slate-500`}>{helper}</AppText> : null}
    </Card>
  );
}
