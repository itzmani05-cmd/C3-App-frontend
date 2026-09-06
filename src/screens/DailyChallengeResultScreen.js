import React from 'react';
import { View } from 'react-native';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import Header from '../components/Header';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';
import { getMotivationalMessage } from '../utils/motivationalMessage';

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
  } = data;

  const improvement =
    typeof previousScore === 'number' ? score - previousScore : null;
  const percentage = totalQuestions ? (score / totalQuestions) * 100 : 0;
  const motivationalMessage = getMotivationalMessage(percentage);

  const goHome = () => {
    navigation.navigate('MainApp');
  };

  const goToChallenge = () => {
    navigation.replace('DailyChallengeScreen', { challengeId });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
      <Header title="C3 Daily Challenge" showBack onBackPress={goHome} />

      <View style={{ padding: 16 }}>
        <View style={cardStyle}>
          <AppText variant="medium" style={{ color: COLORS.slate500, fontSize: 13 }}>
            Attempt {attemptNumber} of {maxAttempts}
          </AppText>
          <AppText variant="extraBold" style={{ marginTop: 6, fontSize: 34, color: COLORS.brand600 }}>
            {score}/{totalQuestions}
          </AppText>

          <AppText variant="semiBold" style={{ marginTop: 10, fontSize: 14, color: COLORS.slate700, textAlign: 'center' }}>
            {motivationalMessage}
          </AppText>

          {currentStreak > 0 ? (
            <View style={streakPillStyle}>
              <AppText variant="bold" style={{ fontSize: 13, color: COLORS.warningText }}>
                🔥 {currentStreak} Day Streak
              </AppText>
            </View>
          ) : null}

          {typeof previousScore === 'number' ? (
            <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
              <AppText style={{ color: COLORS.slate500 }}>Previous Score: {previousScore}/{totalQuestions}</AppText>
              <AppText style={{ color: COLORS.slate500 }}>Current Score: {score}/{totalQuestions}</AppText>
            </View>
          ) : null}

          {improvement !== null ? (
            <AppText
              variant="bold"
              style={{ marginTop: 8, color: improvement >= 0 ? COLORS.success600 : COLORS.danger600 }}
            >
              Improvement: {improvement >= 0 ? '+' : ''}{improvement}
            </AppText>
          ) : null}

          <View style={noteBoxStyle}>
            <AppText style={{ color: COLORS.slate600, lineHeight: 20 }}>
              {attemptsRemaining > 0
                ? `You have ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining. Correct answers and explanations will be available after your final attempt or when this challenge expires.`
                : 'Correct answers and explanations will be available when this challenge expires.'}
            </AppText>
          </View>

          {attemptsRemaining > 0 ? (
            <AppButton
              label="Try Again"
              onPress={goToChallenge}
              style={{ marginTop: 20, backgroundColor: COLORS.brand600, borderRadius: RADII.xl }}
            />
          ) : (
            <AppButton
              label="Back to Challenge"
              onPress={goToChallenge}
              style={{ marginTop: 20, backgroundColor: COLORS.brand600, borderRadius: RADII.xl }}
            />
          )}
          <AppButton
            label="Go to Home"
            tone="secondary"
            onPress={goHome}
            style={{ marginTop: 12, borderRadius: RADII.xl }}
          />
        </View>
      </View>
    </View>
  );
}

const cardStyle = {
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxxl,
  padding: 20,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  ...SHADOWS.lg,
};

const streakPillStyle = {
  marginTop: 12,
  backgroundColor: COLORS.warningSoft,
  borderRadius: RADII.pill,
  paddingHorizontal: 14,
  paddingVertical: 6,
};

const noteBoxStyle = {
  marginTop: 18,
  padding: 14,
  borderRadius: RADII.xl,
  backgroundColor: COLORS.slate50,
  borderWidth: 1,
  borderColor: COLORS.slate200,
};
