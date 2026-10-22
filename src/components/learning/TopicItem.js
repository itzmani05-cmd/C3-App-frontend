import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Award, BookOpen, Lock } from '../../icons';
import AppText from '../ui/AppText';
import IconTile from '../ui/IconTile';
import PressableScale from '../ui/PressableScale';
import StatusPill, { lessonStatus } from './StatusPill';
import { topicProgress } from '../../utils/lessonProgress';
import { questionCountLabel } from '../../utils/practiceSession';
import { COLORS, SHADOWS, tw } from '../../theme';

const PASS_MARK = 80;

function PracticeButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
      accessibilityRole="button"
      accessibilityLabel="Practice questions"
      style={tw`py-1 px-2.5 mr-2 rounded-md border border-brand-100 bg-brand-50`}
    >
      <AppText variant="bold" style={tw`text-brand-700 text-xs`}>
        Practice
      </AppText>
    </TouchableOpacity>
  );
}

// "85%" once a lesson has been attempted, with a medal when it is mastered.
function BestScore({ lesson }) {
  const score = Math.round(lesson?.bestScore || 0);
  if (!score) return null;
  const passed = score >= PASS_MARK;

  return (
    <View style={tw`flex-row items-center mr-2`} accessibilityLabel={`Best score ${score} percent`}>
      {lesson?.isMastered ? <Award size={13} color={COLORS.amber600} /> : null}
      <AppText variant="bold" style={[tw`ml-0.5 text-xs`, { color: passed ? COLORS.green600 : COLORS.slate500 }]}>
        {score}%
      </AppText>
    </View>
  );
}

function SubtopicRow({ subtopic, onPress, onPractice }) {
  const unlocked = !!subtopic?.isUnlocked;
  const countLabel = questionCountLabel(subtopic);

  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      style={[tw`mt-2 ml-5 flex-row items-center rounded-lg border border-slate-200 bg-white p-3`, { opacity: unlocked ? 1 : 0.55 }]}
    >
      <View style={tw`w-1.5 h-1.5 rounded-full mr-3 bg-brand-500`} />
      <View style={tw`flex-1 mr-2.5`}>
        <AppText variant="medium" style={tw`text-[13px] text-slate-900`}>
          {subtopic.name}
        </AppText>
        {countLabel ? (
          <AppText type="caption" style={tw`mt-0.5 text-slate-500`}>
            {countLabel}
          </AppText>
        ) : null}
      </View>
      <BestScore lesson={subtopic} />
      <PracticeButton onPress={onPractice} />
      <StatusPill status={lessonStatus(subtopic)} />
    </PressableScale>
  );
}

export default function TopicItem({ topic, expanded, onPress, onSubtopicPress, onPractice }) {
  const status = !topic?.isDirectLesson && expanded ? 'Close' : lessonStatus(topic);
  const unlocked = !!topic?.isUnlocked;
  const { total, cleared } = topicProgress(topic);

  return (
    <View style={tw`mb-3`}>
      <PressableScale
        onPress={onPress}
        scaleTo={0.985}
        accessibilityRole="button"
        style={[
          tw`flex-row items-center rounded-xl border p-3.5`,
          SHADOWS.sm,
          {
            backgroundColor: expanded ? COLORS.brand50 : COLORS.white,
            borderColor: expanded ? COLORS.brand100 : COLORS.slate200,
            opacity: unlocked ? 1 : 0.6,
          },
        ]}
      >
        <IconTile icon={unlocked ? BookOpen : Lock} tone={unlocked ? 'brand' : 'neutral'} size={40} iconSize={19} />
        <View style={tw`flex-1 mx-3`}>
          <AppText type="heading" style={tw`text-slate-900`} numberOfLines={2}>
            {topic.name}
          </AppText>
          <AppText variant="medium" type="small" style={tw`mt-0.5 text-slate-500`}>
            {topic?.isDirectLesson
              ? questionCountLabel(topic) || 'Direct quiz'
              : [`${cleared} of ${total} lessons done`, questionCountLabel(topic)].filter(Boolean).join(' · ')}
          </AppText>
        </View>
        {topic?.isDirectLesson ? <BestScore lesson={topic} /> : null}
        {topic?.isDirectLesson ? <PracticeButton onPress={() => onPractice(topic)} /> : null}
        <StatusPill status={status} />
      </PressableScale>

      {expanded
        ? (topic.subtopics || []).map((subtopic) => (
            <SubtopicRow
              key={subtopic._id}
              subtopic={subtopic}
              onPress={() => onSubtopicPress(topic, subtopic)}
              onPractice={() => onPractice(topic, subtopic)}
            />
          ))
        : null}
    </View>
  );
}
