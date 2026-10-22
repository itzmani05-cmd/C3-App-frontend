import React from 'react';
import { View } from 'react-native';
import { CalendarDays, ChevronRight } from '../../icons';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import IconTile from '../ui/IconTile';
import Pill from '../ui/Pill';
import { formatDate } from '../../utils/format';
import { COLORS, tw } from '../../theme';

export default function ChallengeHistoryItem({ item, onOpen }) {
  const canOpen = item.revealed && item.latestAttemptId;
  const attempted = item.attemptsSubmitted > 0;
  const score = typeof item.bestScore === 'number' ? `${item.bestScore}/${item.questionCount}` : '-';

  return (
    <Card onPress={() => canOpen && onOpen(item)} elevation="sm" style={tw`mb-3`}>
      <View style={tw`flex-row items-start`}>
        <IconTile icon={CalendarDays} tone={attempted ? 'brand' : 'neutral'} size={38} iconSize={18} />
        <View style={tw`flex-1 mx-3`}>
          <AppText variant="bold" style={tw`text-[15px] text-slate-900`}>
            {item.title || `Challenge on ${formatDate(item.publishedAt)}`}
          </AppText>
          <AppText style={tw`mt-0.5 text-xs text-slate-500`}>
            {formatDate(item.publishedAt)} · {item.questionCount} questions
          </AppText>
        </View>
        <Pill label={attempted ? 'Attempted' : 'Missed'} tone={attempted ? 'success' : 'neutral'} />
      </View>

      <View style={tw`mt-3 flex-row border-t border-slate-100 pt-3`}>
        <View style={tw`flex-1`}>
          <AppText style={tw`text-[11px] text-slate-500`}>Best score</AppText>
          <AppText variant="bold" style={tw`mt-0.5 text-sm text-slate-900`}>
            {score}
          </AppText>
        </View>
        <View style={tw`flex-1`}>
          <AppText style={tw`text-[11px] text-slate-500`}>Attempts</AppText>
          <AppText variant="bold" style={tw`mt-0.5 text-sm text-slate-900`}>
            {item.attemptsSubmitted}/3
          </AppText>
        </View>
        {canOpen ? (
          <View style={tw`flex-row items-center`}>
            <AppText variant="bold" style={tw`text-xs text-brand-600`}>
              Review
            </AppText>
            <ChevronRight size={14} color={COLORS.brand600} />
          </View>
        ) : null}
      </View>
    </Card>
  );
}
