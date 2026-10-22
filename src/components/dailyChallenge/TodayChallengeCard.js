import React from 'react';
import { View } from 'react-native';
import { Zap } from '../../icons';
import AppText from '../ui/AppText';
import AppButton from '../ui/AppButton';
import IconTile from '../ui/IconTile';
import Pill from '../ui/Pill';
import InfoBlock from './InfoBlock';
import CountdownBadge from './CountdownBadge';
import { formatDateTime } from '../../utils/format';
import { tw } from '../../theme';

const STATUS_PILLS = {
  Completed: { color: '#6EE7B7', backgroundColor: 'rgba(16,185,129,0.18)' },
  'In Progress': { color: '#FCD34D', backgroundColor: 'rgba(245,158,11,0.18)' },
  'Not Started': { color: '#CBD5E1', backgroundColor: 'rgba(255,255,255,0.1)' },
};

function getStatus(challenge) {
  if (challenge.revealed) return 'Completed';
  return challenge.attemptsSubmitted > 0 ? 'In Progress' : 'Not Started';
}

function ChallengeAction({ challenge, onStart, onReview }) {
  if (challenge.revealed) return <AppButton label="Review Answers" onPress={onReview} style={tw`mt-5`} />;
  if (challenge.attemptsRemaining > 0) {
    return <AppButton label={challenge.attemptsSubmitted > 0 ? 'Try Again' : 'Start Challenge'} onPress={onStart} style={tw`mt-5`} />;
  }
  return (
    <AppText style={tw`mt-5 text-center text-[13px] leading-5 text-slate-400`}>
      No attempts remaining. Answers will be revealed when this challenge expires.
    </AppText>
  );
}

// The main challenge card: navy, like the website's hero surfaces.
export default function TodayChallengeCard({ challenge, onStart, onReview }) {
  const bestScore = typeof challenge.bestScore === 'number' ? `${challenge.bestScore} / ${challenge.questionCount}` : 'Not yet';
  const status = getStatus(challenge);

  return (
    <View style={tw`rounded-2xl bg-ink-900 p-5 overflow-hidden`}>
      <View style={tw`absolute -right-14 -top-14 w-48 h-48 rounded-full bg-brand-600 opacity-30`} />

      <View style={tw`flex-row items-center justify-between`}>
        <IconTile icon={Zap} tone="dark" />
        <Pill label={status} variant="semiBold" {...STATUS_PILLS[status]} style={tw`px-2.5 py-1`} />
      </View>

      <AppText variant="extraBold" style={tw`mt-4 text-[22px] text-white`}>
        {challenge.title || "Today's Challenge"}
      </AppText>
      <AppText style={tw`mt-1 text-sm text-slate-300`}>{challenge.questionCount} questions</AppText>
      {!challenge.revealed ? <CountdownBadge dark expiresAt={challenge.expiresAt} style={tw`mt-3 self-start`} /> : null}

      <View style={tw`flex-row mt-5 gap-2.5`}>
        <InfoBlock dark label="Available until" value={formatDateTime(challenge.expiresAt)} />
        <InfoBlock dark label="Attempts" value={`${challenge.attemptsSubmitted} / ${challenge.maxAttempts}`} />
      </View>
      <View style={tw`flex-row mt-2.5 gap-2.5`}>
        <InfoBlock dark label="Best score" value={bestScore} />
        <InfoBlock dark label="Status" value={status} />
      </View>

      <ChallengeAction challenge={challenge} onStart={onStart} onReview={onReview} />
    </View>
  );
}
