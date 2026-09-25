import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import { COLORS, RADII } from '../../theme';

function accuracyColor(accuracy) {
  if (accuracy >= 80) return COLORS.success500;
  return accuracy >= 50 ? COLORS.warning500 : COLORS.danger500;
}

function TopicBar({ topic }) {
  const accuracy = Math.round(topic.accuracy || 0);

  return (
    <View style={{ marginTop: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={{ fontSize: 13, color: COLORS.slate700 }}>{topic.topicName}</AppText>
        <AppText variant="bold" style={{ fontSize: 13, color: COLORS.slate900 }}>
          {accuracy}%
        </AppText>
      </View>
      <View style={trackStyle}>
        <View style={[fillStyle, { width: `${Math.min(100, accuracy)}%`, backgroundColor: accuracyColor(accuracy) }]} />
      </View>
    </View>
  );
}

export default function TopicPerformanceCard({ topics, weakArea }) {
  return (
    <Card style={{ marginTop: 20 }}>
      <AppText variant="bold" style={{ fontSize: 15, color: COLORS.slate900 }}>
        Your Performance
      </AppText>

      {topics.length === 0 ? (
        <AppText style={{ marginTop: 10, color: COLORS.slate500 }}>
          Complete a few Daily Challenges to see your topic-wise performance.
        </AppText>
      ) : (
        topics.map((topic) => <TopicBar key={topic.topicId} topic={topic} />)
      )}

      {weakArea ? (
        <View style={weakAreaStyle}>
          <AppText variant="bold" style={{ fontSize: 13, color: COLORS.danger600 }}>
            ⚠ Weak Area: {weakArea.topicName}
          </AppText>
        </View>
      ) : null}
    </Card>
  );
}

const trackStyle = {
  marginTop: 6,
  height: 8,
  borderRadius: RADII.pill,
  backgroundColor: COLORS.slate100,
  overflow: 'hidden',
};

const fillStyle = {
  height: 8,
  borderRadius: RADII.pill,
};

const weakAreaStyle = {
  marginTop: 16,
  padding: 12,
  borderRadius: RADII.xl,
  backgroundColor: COLORS.dangerSoft,
};
