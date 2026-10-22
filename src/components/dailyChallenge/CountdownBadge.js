import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Clock } from '../../icons';
import AppText from '../ui/AppText';
import { formatCountdown } from '../../utils/format';
import { COLORS } from '../../theme';

// "5h 20m left" that keeps counting: every 30 seconds normally, every second in the final hour. Only this small badge
// re-renders, not the card around it. `dark` is for navy backgrounds.
export default function CountdownBadge({ expiresAt, dark = false, style }) {
  const [, tick] = useState(0);

  useEffect(() => {
    const msLeft = new Date(expiresAt).getTime() - Date.now();
    if (!Number.isFinite(msLeft) || msLeft <= 0) return undefined;
    const id = setInterval(() => tick((n) => n + 1), msLeft < 60 * 60 * 1000 ? 1000 : 30000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const label = formatCountdown(expiresAt);
  const expired = label === 'Expired';
  const colors = dark
    ? { color: '#FCA5A5', backgroundColor: 'rgba(239,68,68,0.16)' }
    : { color: expired ? COLORS.slate500 : COLORS.red700, backgroundColor: expired ? COLORS.slate100 : COLORS.red50 };

  return (
    <View
      accessibilityLabel={label}
      style={[{ flexDirection: 'row', alignItems: 'center', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: colors.backgroundColor }, style]}
    >
      <Clock size={12} color={colors.color} />
      <AppText variant="semiBold" style={{ marginLeft: 4, fontSize: 11, color: colors.color }}>
        {label}
      </AppText>
    </View>
  );
}
