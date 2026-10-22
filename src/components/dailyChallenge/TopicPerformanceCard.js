import React from 'react';
import { View } from 'react-native';
import { TriangleAlert } from '../../icons';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { COLORS, tw } from '../../theme';

function accuracyColor(accuracy) {
  if (accuracy >= 80) return COLORS.success500;
  return accuracy >= 50 ? COLORS.warning500 : COLORS.danger500;
}

function TopicBar({ topic }) {
  const accuracy = Math.round(topic.accuracy || 0);

  return (
    <View style={tw`mt-4`}>
      <View style={tw`flex-row justify-between`}>
        <AppText variant="medium" style={tw`flex-1 mr-3 text-[13px] text-slate-700`} numberOfLines={1}>
          {topic.topicName}
        </AppText>
        <AppText variant="bold" style={tw`text-[13px] text-slate-900`}>
          {accuracy}%
        </AppText>
      </View>
      <ProgressBar value={accuracy} color={accuracyColor(accuracy)} height={7} style={tw`mt-1.5`} />
    </View>
  );
}

export default function TopicPerformanceCard({ topics, weakArea }) {
  return (
    <Card elevation="sm" style={tw`mt-5`}>
      <AppText variant="extraBold" style={tw`text-base text-slate-900`}>
        Your performance
      </AppText>

      {topics.length === 0 ? (
        <AppText style={tw`mt-3 text-[13px] leading-5 text-slate-500`}>Complete a few Daily Challenges to see your topic-wise performance.</AppText>
      ) : (
        topics.map((topic) => <TopicBar key={topic.topicId} topic={topic} />)
      )}

      {weakArea ? (
        <View style={tw`mt-5 flex-row items-center rounded-xl border border-red-100 bg-red-50 p-3`}>
          <TriangleAlert size={16} color={COLORS.red600} />
          <AppText variant="semiBold" style={tw`ml-2 flex-1 text-[13px] text-red-700`}>
            Weak area: {weakArea.topicName}
          </AppText>
        </View>
      ) : null}
    </Card>
  );
}
