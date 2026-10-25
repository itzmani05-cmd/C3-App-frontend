import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Bookmark } from '../../icons';
import AppText from '../ui/AppText';
import { COLORS, tw } from '../../theme';

// Marks a question the student has a doubt about or could not solve yet, so they can come back to it from Saved questions.
export default function BookmarkButton({ bookmarked, onPress, style }) {
  const color = bookmarked ? COLORS.brand600 : COLORS.slate500;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={bookmarked ? 'Remove from saved questions' : 'Save this question to revise later'}
      accessibilityState={{ selected: bookmarked }}
      style={[tw`flex-row items-center`, style]}
    >
      <Bookmark size={15} color={color} fill={bookmarked ? color : 'transparent'} />
      <AppText variant="semiBold" style={[tw`ml-1 text-xs`, { color }]}>
        {bookmarked ? 'Saved' : 'Save'}
      </AppText>
    </TouchableOpacity>
  );
}
