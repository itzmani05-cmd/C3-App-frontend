import React from 'react';
import AppText from './AppText';
import Card from './Card';
import { COLORS } from '../../theme';

export default function EmptyState({ title, message, error = false, style }) {
  if (title) {
    return (
      <Card elevation="md" style={[{ alignItems: 'center', padding: 18 }, style]}>
        <AppText variant="bold" style={{ fontSize: 16, color: COLORS.slate900 }}>
          {title}
        </AppText>
        {message ? (
          <AppText style={{ marginTop: 8, color: COLORS.slate500, textAlign: 'center' }}>{message}</AppText>
        ) : null}
      </Card>
    );
  }

  return (
    <AppText style={[{ marginTop: 40, textAlign: 'center', color: error ? COLORS.danger600 : COLORS.slate500 }, style]}>
      {message}
    </AppText>
  );
}
