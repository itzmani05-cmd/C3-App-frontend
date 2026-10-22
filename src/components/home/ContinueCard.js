import React from 'react';
import { View } from 'react-native';
import { ArrowRight, Play } from '../../icons';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import IconTile from '../ui/IconTile';
import ProgressBar from '../ui/ProgressBar';
import { COLORS, tw } from '../../theme';

const LABELS = {
  resume: 'Continue where you left off',
  next: 'Up next',
  start: 'Start learning',
};

// A shortcut straight back into the lesson the student was working on, or the next one to take.
export default function ContinueCard({ pick, onPress }) {
  const { kind, lesson } = pick;
  const score = Math.round(lesson.bestScore || 0);

  return (
    <Card onPress={onPress} elevation="sm" accessibilityLabel={`${LABELS[kind]}: ${lesson.name}`}>
      <View style={tw`flex-row items-center`}>
        <IconTile icon={Play} tone="brand" />
        <View style={tw`flex-1 mx-3`}>
          <AppText type="caption" style={[tw`text-brand-700`, { letterSpacing: 0.8 }]}>
            {LABELS[kind].toUpperCase()}
          </AppText>
          <AppText type="heading" style={tw`mt-0.5 text-slate-900`} numberOfLines={2}>
            {lesson.name}
          </AppText>
          <AppText type="small" style={tw`mt-0.5 text-slate-500`} numberOfLines={1}>
            {[lesson.unitName, lesson.subtopicId ? lesson.topicName : null].filter(Boolean).join(' · ')}
          </AppText>
        </View>
        <ArrowRight size={18} color={COLORS.brand600} />
      </View>

      {score > 0 ? (
        <View style={tw`mt-3`}>
          <View style={tw`flex-row justify-between mb-1.5`}>
            <AppText type="caption" style={tw`text-slate-500`}>
              Best score
            </AppText>
            <AppText type="caption" variant="bold" style={{ color: score >= 80 ? COLORS.green600 : COLORS.slate600 }}>
              {score}%
            </AppText>
          </View>
          <ProgressBar value={score} color={score >= 80 ? COLORS.green600 : COLORS.brand600} height={5} />
        </View>
      ) : null}
    </Card>
  );
}
