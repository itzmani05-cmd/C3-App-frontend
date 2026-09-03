import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import axios from 'axios';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import BilingualText from '../components/BilingualText';
import Header from '../components/Header';
import QuestionImage from '../components/QuestionImage';
import { API_BASE_URL } from '../config/api';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';

function getOptionTone(optionIndex, selectedIndex, correctIndex) {
  const isCorrect = optionIndex === correctIndex;
  const isSelected = optionIndex === selectedIndex;

  if (isCorrect) {
    return {
      borderColor: COLORS.success500,
      backgroundColor: COLORS.successSoft,
      label: isSelected ? 'Your Answer ✅' : 'Correct Answer ✅',
    };
  }
  if (isSelected) {
    return { borderColor: COLORS.danger500, backgroundColor: COLORS.dangerSoft, label: 'Your Answer ❌' };
  }
  return { borderColor: COLORS.slate200, backgroundColor: COLORS.white, label: null };
}

function QuestionReview({ question, index }) {
  const correctIndex = question.correctOptionIndex;
  const selectedIndex = question.selectedOptionIndex;
  const isCorrect = selectedIndex !== null && selectedIndex === correctIndex;

  return (
    <View style={cardStyle}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <AppText variant="bold" style={{ flex: 1, marginRight: 12, fontSize: 15, color: COLORS.slate900 }}>
          Question {index + 1}
        </AppText>
        <View
          style={{
            borderRadius: RADII.pill,
            paddingHorizontal: 10,
            paddingVertical: 4,
            backgroundColor: isCorrect ? COLORS.successSoft : selectedIndex === null ? COLORS.slate100 : COLORS.dangerSoft,
          }}
        >
          <AppText
            variant="bold"
            style={{ fontSize: 11, color: isCorrect ? COLORS.success600 : selectedIndex === null ? COLORS.slate500 : COLORS.danger600 }}
          >
            {selectedIndex === null ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
          </AppText>
        </View>
      </View>

      <BilingualText variant="medium" style={{ marginTop: 8, fontSize: 14, color: COLORS.slate700, lineHeight: 21 }}>
        {question.questionText}
      </BilingualText>
      <QuestionImage uri={question.questionImage} height={160} />

      {(question.options || []).map((option, optionIndex) => {
        const tone = getOptionTone(optionIndex, selectedIndex, correctIndex);
        return (
          <View
            key={optionIndex}
            style={{
              marginTop: 10,
              padding: 12,
              borderRadius: RADII.xl,
              borderWidth: 1,
              borderColor: tone.borderColor,
              backgroundColor: tone.backgroundColor,
            }}
          >
            <BilingualText variant="medium" style={{ color: COLORS.slate700 }}>
              {String.fromCharCode(65 + optionIndex)}. {option}
            </BilingualText>
            {tone.label ? (
              <AppText variant="bold" style={{ marginTop: 4, fontSize: 12, color: COLORS.slate900 }}>
                {tone.label}
              </AppText>
            ) : null}
          </View>
        );
      })}

      <View style={explanationBoxStyle}>
        <AppText variant="bold" style={{ color: COLORS.brand600, fontSize: 12 }}>
          Explanation
        </AppText>
        <BilingualText style={{ marginTop: 6, color: COLORS.slate700, lineHeight: 21 }}>
          {question.explanation || 'No explanation provided.'}
        </BilingualText>
        <QuestionImage uri={question.explanationImage} height={150} />
      </View>
    </View>
  );
}

export default function DailyChallengeReviewScreen({ route, navigation }) {
  const { challengeId, attemptId, data: initialData } = route.params || {};
  const [loading, setLoading] = useState(!initialData);
  const [data, setData] = useState(initialData || null);
  const [currentStreak, setCurrentStreak] = useState(null);

  useEffect(() => {
    if (initialData) return;

    const fetchAttempt = async () => {
      const userId = global.userId || global.user?.userId;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/daily-challenge/${challengeId}/attempts/${attemptId}`,
          { headers: { userid: userId } }
        );
        setData(res.data);
      } catch (err) {
        console.log('Fetch daily challenge review error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [challengeId, attemptId, initialData]);

  useEffect(() => {
    const fetchStreak = async () => {
      const userId = global.userId || global.user?.userId;
      if (!userId) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/daily-challenge/progress-summary`, {
          headers: { userid: userId },
        });
        setCurrentStreak(res.data?.currentStreak ?? null);
      } catch (err) {
        console.log('Fetch streak error:', err);
      }
    };
    fetchStreak();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
        <Header title="C3 Daily Challenge" showBack onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.brand600} />
        </View>
      </View>
    );
  }

  const questions = Array.isArray(data?.questions) ? data.questions : [];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
      <Header title="C3 Daily Challenge" showBack onBackPress={() => navigation.navigate('MainApp')} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View style={[cardStyle, { alignItems: 'center' }]}>
          <AppText variant="bold" style={{ fontSize: 16, color: COLORS.slate900 }}>
            🎉 Final Score
          </AppText>
          <AppText variant="extraBold" style={{ marginTop: 6, fontSize: 34, color: COLORS.brand600 }}>
            {data?.score ?? data?.bestScore ?? 0}/{data?.totalQuestions ?? questions.length}
          </AppText>
          {typeof currentStreak === 'number' && currentStreak > 0 ? (
            <View style={streakPillStyle}>
              <AppText variant="bold" style={{ fontSize: 13, color: COLORS.warningText }}>
                🔥 {currentStreak} Day Streak
              </AppText>
            </View>
          ) : null}
        </View>

        {questions.map((q, index) => (
          <QuestionReview key={q.questionId || index} question={q} index={index} />
        ))}

        <AppButton
          label="Back to Home"
          onPress={() => navigation.navigate('MainApp')}
          style={{ marginTop: 8, backgroundColor: COLORS.brand600, borderRadius: RADII.xl }}
        />
      </ScrollView>
    </View>
  );
}

const cardStyle = {
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxl,
  padding: 16,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  ...SHADOWS.md,
};

const explanationBoxStyle = {
  marginTop: 14,
  padding: 14,
  borderRadius: RADII.xl,
  backgroundColor: COLORS.slate50,
  borderWidth: 1,
  borderColor: COLORS.slate200,
};

const streakPillStyle = {
  marginTop: 12,
  backgroundColor: COLORS.warningSoft,
  borderRadius: RADII.pill,
  paddingHorizontal: 14,
  paddingVertical: 6,
};
