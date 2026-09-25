import React from 'react';
import { View } from 'react-native';
import AppText from '../components/ui/AppText';
import AppButton from '../components/ui/AppButton';
import Card from '../components/ui/Card';
import Screen from '../components/ui/Screen';
import ScoreHero from '../components/dailyChallenge/ScoreHero';
import { plural } from '../utils/format';
import { COLORS, RADII } from '../theme';

function ScoreComparison({ previousScore, score, total }) {
  if (typeof previousScore !== 'number') return null;
  const improvement = score - previousScore;

  return (
    <>
      <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={{ color: COLORS.slate500 }}>
          Previous Score: {previousScore}/{total}
        </AppText>
        <AppText style={{ color: COLORS.slate500 }}>
          Current Score: {score}/{total}
        </AppText>
      </View>
      <AppText variant="bold" style={{ marginTop: 8, color: improvement >= 0 ? COLORS.success600 : COLORS.danger600 }}>
        Improvement: {improvement >= 0 ? '+' : ''}
        {improvement}
      </AppText>
    </>
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
    <Screen title="C3 Daily Challenge" onBack={goHome} scroll={false}>
      <View style={{ padding: 16 }}>
        <Card elevation="lg" style={{ borderRadius: RADII.xxxl, padding: 20 }}>
          <ScoreHero
            caption={`Attempt ${attemptNumber} of ${maxAttempts}`}
            score={score}
            total={totalQuestions}
            currentStreak={currentStreak}
            overallStreak={overallStreak}
          />
          <ScoreComparison previousScore={previousScore} score={score} total={totalQuestions} />

          <View style={noteStyle}>
            <AppText style={{ color: COLORS.slate600, lineHeight: 20 }}>{note}</AppText>
          </View>

          <AppButton
            label={attemptsRemaining > 0 ? 'Try Again' : 'Back to Challenge'}
            tone="brand"
            onPress={goToChallenge}
            style={{ marginTop: 20 }}
          />
          <AppButton label="Go to Home" tone="secondary" onPress={goHome} style={{ marginTop: 12, borderRadius: RADII.xl }} />
        </Card>
      </View>
    </Screen>
  );
}

const noteStyle = {
  marginTop: 18,
  padding: 14,
  borderRadius: RADII.xl,
  backgroundColor: COLORS.slate50,
  borderWidth: 1,
  borderColor: COLORS.slate200,
};
