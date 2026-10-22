import React from 'react';
import { View } from 'react-native';
import { TrendingDown, TrendingUp } from '../icons';
import AppText from '../components/ui/AppText';
import AppButton from '../components/ui/AppButton';
import Card from '../components/ui/Card';
import Screen from '../components/ui/Screen';
import ScoreHero from '../components/dailyChallenge/ScoreHero';
import { plural } from '../utils/format';
import { COLORS, tw } from '../theme';

function ScoreComparison({ previousScore, score, total }) {
  if (typeof previousScore !== 'number') return null;
  const improvement = score - previousScore;
  const Icon = improvement >= 0 ? TrendingUp : TrendingDown;
  const color = improvement >= 0 ? COLORS.success600 : COLORS.red600;

  return (
    <View style={tw`mt-5 flex-row items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5`}>
      <View>
        <AppText style={tw`text-xs text-slate-500`}>Previous</AppText>
        <AppText variant="bold" style={tw`mt-0.5 text-[15px] text-slate-900`}>
          {previousScore}/{total}
        </AppText>
      </View>
      <View style={tw`flex-row items-center`}>
        <Icon size={16} color={color} />
        <AppText variant="bold" style={[tw`ml-1.5 text-sm`, { color }]}>
          {improvement >= 0 ? '+' : ''}
          {improvement}
        </AppText>
      </View>
      <View style={tw`items-end`}>
        <AppText style={tw`text-xs text-slate-500`}>Current</AppText>
        <AppText variant="bold" style={tw`mt-0.5 text-[15px] text-slate-900`}>
          {score}/{total}
        </AppText>
      </View>
    </View>
  );
}

export default function DailyChallengeResultScreen({ route, navigation }) {
  const { data = {}, challengeId } = route.params || {};
  const {
    score = 0,
    totalQuestions = 0,
    attemptNumber = 0,
    maxAttempts = 3,
    attemptsRemaining = 0,
    previousScore,
    currentStreak = 0,
    overallStreak = 0,
  } = data;

  const goHome = () => navigation.navigate('MainApp');
  const goToChallenge = () => navigation.replace('DailyChallengeScreen', { challengeId });

  const note =
    attemptsRemaining > 0
      ? `You have ${plural(attemptsRemaining, 'attempt')} remaining. Correct answers and explanations will be available after your final attempt or when this challenge expires.`
      : 'Correct answers and explanations will be available when this challenge expires.';

  return (
    <Screen title="Challenge Result" onBack={goHome}>
      <Card elevation="md" style={tw`p-5`}>
        <ScoreHero
          caption={`Attempt ${attemptNumber} of ${maxAttempts}`}
          score={score}
          total={totalQuestions}
          currentStreak={currentStreak}
          overallStreak={overallStreak}
        />
        <ScoreComparison previousScore={previousScore} score={score} total={totalQuestions} />

        <View style={tw`mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3.5`}>
          <AppText style={tw`text-[13px] leading-5 text-slate-600`}>{note}</AppText>
        </View>

        <AppButton label={attemptsRemaining > 0 ? 'Try Again' : 'Back to Challenge'} onPress={goToChallenge} style={tw`mt-5`} />
        <AppButton label="Go to Home" tone="secondary" onPress={goHome} style={tw`mt-3`} />
      </Card>
    </Screen>
  );
}
