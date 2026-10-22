import React from 'react';
import { View } from 'react-native';
import { Zap } from '../../icons';
import AppText from '../ui/AppText';
import AppButton from '../ui/AppButton';
import Card from '../ui/Card';
import IconTile from '../ui/IconTile';
import LoadingView from '../ui/LoadingView';
import CountdownBadge from './CountdownBadge';
import { COLORS, tw } from '../../theme';

function describe(challenge) {
  const { revealed, attemptsSubmitted, questionCount, maxAttempts } = challenge;
  if (revealed) return { status: 'Challenge completed', action: 'Review Answers' };
  if (attemptsSubmitted > 0) return { status: `Attempts used: ${attemptsSubmitted} of ${maxAttempts}`, action: 'Continue Challenge' };
  return { status: `${questionCount} questions · ${maxAttempts} attempts`, action: 'Start Challenge' };
}

// Today's challenge as shown on Home. `challenge` and `loading` come from the screen so Home loads it once.
export default function DailyChallengeCard({ challenge, loading, onOpen }) {
  if (loading && !challenge) {
    return (
      <Card elevation="sm" style={{ minHeight: 110 }}>
        <LoadingView size="small" color={COLORS.brand600} />
      </Card>
    );
  }

  if (!challenge) {
    return (
      <Card elevation="sm" style={tw`flex-row items-center`}>
        <IconTile icon={Zap} tone="neutral" />
        <View style={tw`flex-1 ml-3`}>
          <AppText variant="bold" style={tw`text-[15px] text-slate-900`}>
            No challenge today
          </AppText>
          <AppText style={tw`mt-0.5 text-[13px] text-slate-500`}>A new one will be published soon.</AppText>
        </View>
      </Card>
    );
  }

  const { status, action } = describe(challenge);

  return (
    <Card elevation="sm" onPress={onOpen}>
      <View style={tw`flex-row items-center`}>
        <IconTile icon={Zap} tone="brand" />
        <View style={tw`flex-1 ml-3`}>
          <AppText variant="bold" style={tw`text-[15px] text-slate-900`}>
            Daily Challenge
          </AppText>
          <AppText variant="medium" style={tw`mt-0.5 text-[13px] text-slate-500`}>
            {status}
          </AppText>
        </View>
        {!challenge.revealed ? <CountdownBadge expiresAt={challenge.expiresAt} /> : null}
      </View>

      {typeof challenge.bestScore === 'number' ? (
        <AppText variant="semiBold" style={tw`mt-3 text-[13px] text-brand-700`}>
          Best score: {challenge.bestScore}/{challenge.questionCount}
        </AppText>
      ) : null}

      <AppButton label={action} onPress={onOpen} style={tw`mt-4`} />
    </Card>
  );
}
