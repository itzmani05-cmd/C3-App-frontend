import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import AppText from '../ui/AppText';
import { COLORS, RADII } from '../../theme';

export default function ActionRow({ icon: Icon, label, helper, onPress, danger = false }) {
  return (
    <TouchableOpacity onPress={onPress} style={rowStyle}>
      <View style={[iconWrapStyle, { backgroundColor: danger ? COLORS.red100 : COLORS.gray100 }]}>
        <Icon size={20} color={danger ? COLORS.red600 : COLORS.blue600} />
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <AppText variant="bold" style={{ color: COLORS.black, fontSize: 15 }}>
          {label}
        </AppText>
        <AppText style={{ marginTop: 4, color: COLORS.gray500, fontSize: 12 }}>{helper}</AppText>
      </View>

      <ChevronRight size={20} color={COLORS.blue600} />
    </TouchableOpacity>
  );
}

const rowStyle = {
  marginTop: 12,
  backgroundColor: COLORS.white,
  borderRadius: RADII.lg,
  padding: 14,
  borderWidth: 1,
  borderColor: COLORS.gray200,
  flexDirection: 'row',
  alignItems: 'center',
};

const iconWrapStyle = {
  width: 42,
  height: 42,
  borderRadius: RADII.md,
  justifyContent: 'center',
  alignItems: 'center',
};
