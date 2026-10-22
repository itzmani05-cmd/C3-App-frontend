import React from 'react';
import { View } from 'react-native';
import { Flame } from '../../icons';
import AppText from '../ui/AppText';
import IconTile from '../ui/IconTile';
import { tw } from '../../theme';

export default function StreakInfoCard() {
  return (
    <View style={tw`mx-4 mt-6 flex-row items-start rounded-xl border border-amber-100 bg-amber-50 p-3.5`}>
      <IconTile icon={Flame} tone="warning" size={34} iconSize={17} style={{ backgroundColor: '#FDE68A55' }} />
      <View style={tw`flex-1 ml-3`}>
        <AppText variant="bold" style={tw`text-[13px] text-amber-800`}>
          How streaks work
        </AppText>
        <AppText style={tw`mt-1 text-xs leading-[18px] text-amber-800`}>
          Complete the Daily Challenge to grow your streak by 1. Miss a day and it resets to zero, so check in daily to keep it alive.
        </AppText>
      </View>
    </View>
  );
}
