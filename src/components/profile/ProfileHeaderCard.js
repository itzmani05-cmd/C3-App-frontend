import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import { formatJoinDate } from '../../utils/format';
import { tw } from '../../theme';

// Navy profile card with an initial avatar, matching the Home hero.
export default function ProfileHeaderCard({ user }) {
  const initial = (user?.name || 'L').charAt(0).toUpperCase();

  return (
    <View style={tw`rounded-2xl bg-ink-900 p-5 overflow-hidden`}>
      <View style={tw`absolute -right-14 -top-14 w-48 h-48 rounded-full bg-brand-600 opacity-30`} />
      <View style={tw`absolute -left-10 -bottom-16 w-36 h-36 rounded-full bg-brand-500 opacity-10`} />

      <View style={tw`flex-row items-center`}>
        <View style={tw`w-16 h-16 rounded-2xl bg-brand-600 items-center justify-center border-2 border-white/20`}>
          <AppText variant="extraBold" style={tw`text-[28px] text-white`}>
            {initial}
          </AppText>
        </View>

        <View style={tw`flex-1 ml-4`}>
          <AppText variant="extraBold" style={tw`text-xl text-white`} numberOfLines={1}>
            {user?.name || 'Learner'}
          </AppText>
          <AppText style={tw`mt-0.5 text-[13px] text-slate-300`} numberOfLines={1}>
            {user?.email || 'No email available'}
          </AppText>
        </View>
      </View>

      <View style={tw`mt-4 flex-row items-center`}>
        <View style={tw`rounded-md bg-white/10 px-2.5 py-1`}>
          <AppText variant="bold" style={tw`text-[11px] text-slate-200`}>
            {(user?.role || 'student').toUpperCase()}
          </AppText>
        </View>
        {user?.createdAt ? (
          <AppText style={tw`ml-3 text-xs text-slate-400`}>{formatJoinDate(user.createdAt)}</AppText>
        ) : null}
      </View>
    </View>
  );
}
