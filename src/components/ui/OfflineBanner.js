import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import { tw } from '../../theme';

// Shown above content that came from the saved copy because the latest refresh failed.
export default function OfflineBanner({ visible, style }) {
  if (!visible) return null;
  return (
    <View style={[tw`mx-4 mb-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100`, style]}>
      <AppText variant="medium" style={tw`text-xs text-amber-800`}>
        You're offline. Showing your last saved content.
      </AppText>
    </View>
  );
}
