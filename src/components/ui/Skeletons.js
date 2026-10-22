import React from 'react';
import { View } from 'react-native';
import Skeleton from './Skeleton';
import { COLORS, tw } from '../../theme';

// Placeholder layouts that mirror the real screens, so content appears in place instead of jumping in.

const cardStyle = tw`rounded-xl border border-slate-200 bg-white p-3.5`;

function RowCard({ lines = 2, circle = false }) {
  return (
    <View style={[cardStyle, tw`flex-row items-center mb-3`]}>
      <Skeleton width={44} height={44} radius={circle ? 22 : 12} />
      <View style={tw`flex-1 mx-3.5`}>
        <Skeleton width="65%" height={14} />
        {lines > 1 ? <Skeleton width="40%" height={10} style={tw`mt-2`} /> : null}
      </View>
      <Skeleton width={16} height={16} radius={8} />
    </View>
  );
}

// Units, topics, notifications, history.
export function ListSkeleton({ count = 6, circle = false, style }) {
  return (
    <View style={style}>
      {Array.from({ length: count }, (_, i) => (
        <RowCard key={i} circle={circle} />
      ))}
    </View>
  );
}

// Rankings: a round rank badge, a name and a score.
export function LeaderboardSkeleton({ count = 8 }) {
  return (
    <View style={[cardStyle, tw`p-2`]}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={tw`flex-row items-center px-2.5 py-3`}>
          <Skeleton width={32} height={32} radius={16} />
          <View style={tw`flex-1 mx-3`}>
            <Skeleton width="50%" height={13} />
            <Skeleton width="30%" height={10} style={tw`mt-2`} />
          </View>
          <Skeleton width={28} height={14} />
        </View>
      ))}
    </View>
  );
}

export function HomeSkeleton() {
  return (
    <View style={tw`px-4 pt-4`}>
      <Skeleton height={150} radius={16} />
      <Skeleton width={70} height={16} style={tw`mt-6 mb-3`} />
      <Skeleton height={140} radius={12} />
      <Skeleton width={110} height={16} style={tw`mt-6 mb-3`} />
      <View style={tw`flex-row flex-wrap -mx-1`}>
        {Array.from({ length: 4 }, (_, i) => (
          <View key={i} style={tw`w-1/2 p-1`}>
            <Skeleton height={92} radius={12} />
          </View>
        ))}
      </View>
    </View>
  );
}

// The navy hero card plus the cards underneath it (today's challenge).
export function ChallengeSkeleton() {
  return (
    <View>
      <Skeleton height={330} radius={16} />
      <Skeleton width={80} height={16} style={tw`mt-6 mb-3`} />
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} height={74} radius={12} style={tw`mb-2`} />
      ))}
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View>
      <Skeleton height={140} radius={16} />
      <Skeleton width={90} height={16} style={tw`mt-6 mb-3`} />
      {Array.from({ length: 2 }, (_, i) => (
        <Skeleton key={i} height={64} radius={12} style={tw`mb-2.5`} />
      ))}
      <Skeleton width={90} height={16} style={tw`mt-4 mb-3`} />
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} height={64} radius={12} style={tw`mb-2.5`} />
      ))}
    </View>
  );
}

export function StatsSkeleton() {
  return (
    <View>
      <Skeleton height={190} radius={12} />
      <View style={tw`flex-row flex-wrap -mx-1 mt-3`}>
        {Array.from({ length: 4 }, (_, i) => (
          <View key={i} style={tw`w-1/2 p-1`}>
            <Skeleton height={104} radius={12} />
          </View>
        ))}
      </View>
      <Skeleton height={170} radius={12} style={tw`mt-4`} />
    </View>
  );
}

// A question card: heading, a few lines of text and four options.
export function QuestionSkeleton({ style }) {
  return (
    <View style={[cardStyle, tw`p-4`, style]}>
      <Skeleton width={110} height={14} />
      <Skeleton height={12} style={tw`mt-4`} />
      <Skeleton width="85%" height={12} style={tw`mt-2`} />
      <Skeleton width="60%" height={12} style={tw`mt-2`} />
      <View style={tw`mt-5`}>
        {Array.from({ length: 4 }, (_, i) => (
          <View key={i} style={[tw`flex-row items-center mb-2.5 rounded-lg border p-3`, { borderColor: COLORS.slate200 }]}>
            <Skeleton width={28} height={28} radius={14} />
            <Skeleton width={`${50 + ((i * 13) % 35)}%`} height={12} style={tw`ml-3`} />
          </View>
        ))}
      </View>
    </View>
  );
}
