import React from 'react';
import AppText from './AppText';
import Card from './Card';
import Illustration from './Illustration';
import { COLORS, tw } from '../../theme';

// With a `title` it is a card with an illustration ('empty' or 'search'); without one it is a single muted line.
export default function EmptyState({ title, message, illustration = 'empty', error = false, style }) {
  if (title) {
    return (
      <Card elevation="sm" style={[tw`items-center px-6 py-7`, style]}>
        <Illustration kind={illustration} size={132} />
        <AppText type="heading" style={tw`mt-2 text-slate-900 text-center`}>
          {title}
        </AppText>
        {message ? (
          <AppText type="small" style={tw`mt-1.5 text-slate-500 text-center`}>
            {message}
          </AppText>
        ) : null}
      </Card>
    );
  }

  return (
    <AppText style={[tw`mt-10 text-center text-sm`, { color: error ? COLORS.red600 : COLORS.slate500 }, style]}>{message}</AppText>
  );
}
