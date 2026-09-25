import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from '../ui/AppText';
import StatusPill, { lessonStatus } from './StatusPill';
import { COLORS, SHADOWS } from '../../theme';

function SubtopicRow({ subtopic, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[subtopicStyle, { opacity: subtopic?.isUnlocked ? 1 : 0.55 }]}>
      <AppText variant="medium" style={{ color: COLORS.slate900, fontSize: 13, flex: 1, marginRight: 10 }}>
        {subtopic.name}
      </AppText>
      <StatusPill status={lessonStatus(subtopic)} />
    </TouchableOpacity>
  );
}

export default function TopicItem({ topic, expanded, onPress, onSubtopicPress }) {
  const status = !topic?.isDirectLesson && expanded ? 'Close' : lessonStatus(topic);

  return (
    <View style={{ marginBottom: 12 }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          topicStyle,
          {
            backgroundColor: expanded ? COLORS.blue50 : COLORS.white,
            borderColor: expanded ? COLORS.blue300 : COLORS.gray200,
            opacity: topic?.isUnlocked ? 1 : 0.55,
          },
        ]}
      >
        <View style={{ flex: 1, marginRight: 10 }}>
          <AppText variant="bold" style={{ color: COLORS.slate900, fontSize: 15 }}>
            {topic.name}
          </AppText>
          <AppText variant="medium" style={{ marginTop: 4, color: COLORS.gray500, fontSize: 12 }}>
            {topic?.isDirectLesson ? 'Direct quiz' : `${topic?.subtopics?.length || 0} lessons`}
          </AppText>
        </View>
        <StatusPill status={status} />
      </TouchableOpacity>

      {expanded
        ? (topic.subtopics || []).map((subtopic) => (
            <SubtopicRow key={subtopic._id} subtopic={subtopic} onPress={() => onSubtopicPress(topic, subtopic)} />
          ))
        : null}
    </View>
  );
}

const topicStyle = {
  padding: 16,
  borderRadius: 16,
  borderWidth: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  ...SHADOWS.card,
};

const subtopicStyle = {
  marginTop: 8,
  marginLeft: 14,
  padding: 14,
  borderRadius: 12,
  backgroundColor: COLORS.white,
  borderWidth: 1,
  borderColor: COLORS.gray200,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};
