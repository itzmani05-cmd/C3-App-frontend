import React from 'react';
import { Switch, View } from 'react-native';
import AppText from '../ui/AppText';
import IconTile from '../ui/IconTile';
import { COLORS, SHADOWS, tw } from '../../theme';

// Same look as ActionRow, with a switch on the right.
export default function ToggleRow({ icon, label, helper, value, onValueChange, disabled = false }) {
  return (
    <View style={[tw`mb-2.5 flex-row items-center rounded-xl border border-slate-200 bg-white p-3`, SHADOWS.sm, disabled ? { opacity: 0.6 } : null]}>
      <IconTile icon={icon} tone="brand" size={40} iconSize={19} />
      <View style={tw`flex-1 ml-3 mr-2`}>
        <AppText type="heading" style={tw`text-slate-900`}>
          {label}
        </AppText>
        <AppText type="small" style={tw`mt-0.5 text-slate-500`}>
          {helper}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: COLORS.slate300, true: COLORS.brand600 }}
        thumbColor={COLORS.white}
        accessibilityLabel={label}
      />
    </View>
  );
}
