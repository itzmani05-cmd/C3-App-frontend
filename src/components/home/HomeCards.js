import React from 'react';
import { View } from 'react-native';
import { Award, CircleCheck, CircleX, ListChecks, Target } from '../../icons';
import AppText from '../ui/AppText';
import AppButton from '../ui/AppButton';
import Card from '../ui/Card';
import IconTile from '../ui/IconTile';
import PressableScale from '../ui/PressableScale';
import ProgressBar from '../ui/ProgressBar';
import StatCard from '../ui/StatCard';
import LeaderboardRow from '../dailyChallenge/LeaderboardRow';
import { formatDate } from '../../utils/format';
import { COLORS, tw } from '../../theme';

const PASS_MARK = 80;

// Lifetime numbers from the dashboard: lessons cleared and mastered, average score, quizzes taken.
export function StatsGrid({ stats }) {
  if (!stats) return null;
  const items = [
    { label: 'Lessons cleared', value: stats.lessonsCleared || 0, icon: CircleCheck, tone: 'success', accent: COLORS.slate900 },
    { label: 'Lessons mastered', value: stats.lessonsMastered || 0, icon: Award, tone: 'warning', accent: COLORS.slate900 },
    { label: 'Average score', value: `${Math.round(stats.averageScore || 0)}%`, icon: Target, tone: 'brand', accent: COLORS.slate900 },
    { label: 'Quizzes taken', value: stats.totalAttempts || 0, icon: ListChecks, tone: 'accent', accent: COLORS.slate900 },
  ];

  return (
    <View style={tw`flex-row flex-wrap -mx-1`}>
      {items.map((item) => (
        <View key={item.label} style={tw`w-1/2 p-1`}>
          <StatCard {...item} />
        </View>
      ))}
    </View>
  );
}

// Up to three units, the ones in progress first, each with a progress bar.
export function UnitsProgressCard({ units, onOpenUnit }) {
  const shown = (units || [])
    .filter((unit) => unit.total > 0)
    .sort((a, b) => Number(a.percent >= 100) - Number(b.percent >= 100) || b.percent - a.percent)
    .slice(0, 3);
  if (shown.length === 0) return null;

  return (
    <Card elevation="sm" style={tw`p-0 overflow-hidden`}>
      {shown.map((unit, index) => {
        const done = unit.percent >= 100;
        return (
          <PressableScale
            key={unit._id}
            onPress={() => onOpenUnit(unit)}
            scaleTo={0.99}
            accessibilityRole="button"
            accessibilityLabel={`${unit.name}, ${unit.cleared} of ${unit.total} lessons completed`}
            style={[tw`px-4 py-3.5`, index > 0 ? tw`border-t border-slate-100` : null]}
          >
            <View style={tw`flex-row items-center justify-between`}>
              <AppText type="heading" style={tw`flex-1 mr-3 text-slate-900`} numberOfLines={1}>
                {unit.name}
              </AppText>
              <AppText variant="bold" style={{ fontSize: 13, color: done ? COLORS.green600 : COLORS.brand700 }}>
                {unit.percent}%
              </AppText>
            </View>
            <AppText type="small" style={tw`mt-0.5 mb-2 text-slate-500`}>
              {done ? 'Completed' : `${unit.cleared} of ${unit.total} lessons`}
            </AppText>
            <ProgressBar value={unit.percent} color={done ? COLORS.green600 : COLORS.brand600} height={5} />
          </PressableScale>
        );
      })}
    </Card>
  );
}

// The last few quizzes: what, how it went, when.
export function RecentActivityCard({ items }) {
  const rows = (items || []).slice(0, 4);
  if (rows.length === 0) return null;

  return (
    <Card elevation="sm" style={tw`p-0 overflow-hidden`}>
      {rows.map((item, index) => {
        const percent = Math.round(item.percentage || 0);
        const passed = item.isPassed || percent >= PASS_MARK;
        return (
          <View key={item.id} style={[tw`flex-row items-center px-4 py-3`, index > 0 ? tw`border-t border-slate-100` : null]}>
            <IconTile icon={passed ? CircleCheck : CircleX} tone={passed ? 'success' : 'danger'} size={36} iconSize={18} />
            <View style={tw`flex-1 mx-3`}>
              <AppText type="heading" style={tw`text-slate-900`} numberOfLines={1}>
                {item.title || 'Quiz'}
              </AppText>
              <AppText type="small" style={tw`mt-0.5 text-slate-500`} numberOfLines={1}>
                {[item.subtitle, formatDate(item.submittedAt)].filter(Boolean).join(' · ')}
              </AppText>
            </View>
            <View style={tw`items-end`}>
              <AppText variant="extraBold" style={{ fontSize: 15, color: passed ? COLORS.green600 : COLORS.red600 }}>
                {percent}%
              </AppText>
              <AppText type="caption" style={tw`text-slate-500`}>
                {item.score}/{item.totalQuestions}
              </AppText>
            </View>
          </View>
        );
      })}
    </Card>
  );
}

// The topic the student does worst on in the daily challenges, with a shortcut to practise it. Only shown when it is
// actually weak.
export function FocusAreaCard({ weakArea, onPractice }) {
  if (!weakArea || !(weakArea.accuracy < PASS_MARK)) return null;
  const accuracy = Math.round(weakArea.accuracy || 0);

  return (
    <Card elevation="sm">
      <View style={tw`flex-row items-center`}>
        <IconTile icon={Target} tone="danger" />
        <View style={tw`flex-1 mx-3`}>
          <AppText type="caption" style={[tw`text-red-600`, { letterSpacing: 0.8 }]}>
            FOCUS AREA
          </AppText>
          <AppText type="heading" style={tw`mt-0.5 text-slate-900`} numberOfLines={2}>
            {weakArea.topicName}
          </AppText>
          <AppText type="small" style={tw`mt-0.5 text-slate-500`}>
            {weakArea.correct} of {weakArea.total} correct in daily challenges
          </AppText>
        </View>
        <AppText variant="extraBold" style={{ fontSize: 18, color: COLORS.red600 }}>
          {accuracy}%
        </AppText>
      </View>
      <ProgressBar value={accuracy} color={COLORS.red600} height={5} style={tw`mt-3`} />
      <AppButton label="Practise this topic" tone="secondary" onPress={onPractice} style={tw`mt-4`} />
    </Card>
  );
}

// Top three on the leaderboard, plus the student's own row when they are further down.
export function LeaderboardPreview({ data }) {
  const entries = (data?.leaderboard || []).slice(0, 3);
  if (entries.length === 0) return null;
  const me = data?.me;
  const meInTop = entries.some((entry) => entry.isMe);

  return (
    <Card elevation="sm" style={tw`p-2`}>
      {entries.map((entry) => (
        <LeaderboardRow key={String(entry.userId)} entry={entry} />
      ))}
      {me && !meInTop ? (
        <View style={tw`mt-1 border-t border-slate-100 pt-1`}>
          <LeaderboardRow entry={me} />
        </View>
      ) : null}
    </Card>
  );
}
