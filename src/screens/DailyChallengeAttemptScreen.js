import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { Calculator } from 'lucide-react-native';
import axios from 'axios';
import AppText from '../components/AppText';
import BilingualText from '../components/BilingualText';
import Header from '../components/Header';
import QuestionImage from '../components/QuestionImage';
import ScientificCalculator from '../components/ScientificCalculator';
import { API_BASE_URL } from '../config/api';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';

function MultipleChoiceOptions({ q, selectedIndexes, onToggle }) {
  return (
    <>
      {(q.options || []).map((option, optionIndex) => {
        const isSelected = selectedIndexes.includes(optionIndex);
        return (
          <TouchableOpacity
            key={optionIndex}
            onPress={() => onToggle(q.questionId, optionIndex)}
            activeOpacity={0.75}
            style={[optionRowStyle, isSelected ? optionSelectedStyle : null]}
          >
            <View
              style={[
                checkboxStyle,
                isSelected ? { backgroundColor: COLORS.brand600, borderColor: COLORS.brand600 } : null,
              ]}
            >
              {isSelected ? (
                <AppText variant="bold" style={{ color: COLORS.white, fontSize: 13 }}>
                  ✓
                </AppText>
              ) : null}
            </View>
            <BilingualText variant="medium" style={{ flex: 1, fontSize: 14, color: COLORS.slate700 }}>
              {option}
            </BilingualText>
            <QuestionImage uri={q.optionImages?.[optionIndex]} height={100} />
          </TouchableOpacity>
        );
      })}
      <AppText style={{ fontSize: 12, color: COLORS.slate500, marginTop: 6 }}>
        Select all that apply.
      </AppText>
    </>
  );
}

function NumericalAnswerInput({ value, onChange }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="Enter your answer"
      placeholderTextColor={COLORS.slate400}
      keyboardType="numeric"
      style={{
        borderWidth: 1,
        borderColor: COLORS.slate200,
        borderRadius: RADII.xl,
        padding: 12,
        marginTop: 10,
        fontSize: 15,
        color: COLORS.slate900,
        backgroundColor: COLORS.white,
      }}
    />
  );
}

export default function DailyChallengeAttemptScreen({ route, navigation }) {
  const { challengeId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showCalculator, setShowCalculator] = useState(false);
  const answersRef = useRef({});

  useEffect(() => {
    const start = async () => {
      const userId = global.userId || global.user?.userId;
      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/daily-challenge/${challengeId}/start`,
          {},
          { headers: { userid: userId } }
        );
        setAttemptId(res.data.attemptId);
        setQuestions(Array.isArray(res.data.questions) ? res.data.questions : []);
      } catch (err) {
        console.log('Start daily challenge error:', err);
        const message = err.response?.data?.message || 'Could not start the challenge.';
        Alert.alert('Unable to start', message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } finally {
        setLoading(false);
      }
    };

    start();
  }, [challengeId]);

  const handleSelect = (questionId, optionIndex) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: { selectedOptionIndex: optionIndex } };
      answersRef.current = updated;
      return updated;
    });
  };

  const handleToggleMultiOption = (questionId, optionIndex) => {
    setAnswers((prev) => {
      const current = prev[questionId]?.selectedOptionIndexes || [];
      const next = current.includes(optionIndex)
        ? current.filter((i) => i !== optionIndex)
        : [...current, optionIndex];
      const updated = { ...prev, [questionId]: { selectedOptionIndexes: next } };
      answersRef.current = updated;
      return updated;
    });
  };

  const handleNumericalChange = (questionId, text) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: { selectedNumericalAnswer: text } };
      answersRef.current = updated;
      return updated;
    });
  };

  const submitAttempt = async () => {
    setSubmitting(true);
    const userId = global.userId || global.user?.userId;

    const responses = Object.keys(answersRef.current).map((questionId) => {
      const answer = answersRef.current[questionId] || {};
      return {
        questionId,
        selectedOptionIndex: answer.selectedOptionIndex,
        selectedOptionIndexes: answer.selectedOptionIndexes,
        selectedNumericalAnswer: answer.selectedNumericalAnswer,
      };
    });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/daily-challenge/${challengeId}/attempts/${attemptId}/submit`,
        { responses },
        { headers: { userid: userId } }
      );

      if (res.data.revealed) {
        navigation.replace('DailyChallengeReviewScreen', {
          challengeId,
          data: res.data,
        });
      } else {
        navigation.replace('DailyChallengeResultScreen', {
          challengeId,
          data: res.data,
        });
      }
    } catch (err) {
      console.log('Submit daily challenge error:', err);
      const status = err.response?.status;
      const message = err.response?.data?.message || 'Submit failed. Please try again.';

      if (status === 410) {
        Alert.alert('Challenge expired', message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } else if (status === 403) {
        Alert.alert('No attempts remaining', message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } else {
        Alert.alert('Error', message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitPress = () => {
    const answeredCount = Object.keys(answersRef.current).length;
    const pending = questions.length - answeredCount;

    if (pending > 0) {
      Alert.alert(
        'Incomplete Challenge',
        `You have ${pending} unanswered question(s). Submit anyway?`,
        [
          { text: 'Go Back', style: 'cancel' },
          { text: 'Submit Anyway', onPress: submitAttempt },
        ]
      );
      return;
    }

    submitAttempt();
  };

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

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
      <Header title="C3 Daily Challenge" showBack onBackPress={() => navigation.goBack()} />

      <TouchableOpacity
        onPress={() => setShowCalculator(true)}
        activeOpacity={0.85}
        style={{
          position: 'absolute',
          top: 112,
          right: 16,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: COLORS.brand600,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          ...SHADOWS.md,
        }}
      >
        <Calculator size={20} color={COLORS.white} />
      </TouchableOpacity>

      <ScientificCalculator visible={showCalculator} onClose={() => setShowCalculator(false)} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {questions.map((q, index) => (
          <View key={q.questionId} style={questionCardStyle}>
            <AppText variant="bold" style={{ fontSize: 15, marginBottom: 8, color: COLORS.slate900 }}>
              Question {index + 1} of {questions.length}
            </AppText>
            <BilingualText variant="medium" style={{ fontSize: 15, color: COLORS.slate700, lineHeight: 22 }}>
              {q.questionText}
            </BilingualText>

            <QuestionImage uri={q.questionImage} height={180} />

            {q.answerType === 'multiple' ? (
              <MultipleChoiceOptions
                q={q}
                selectedIndexes={answers[q.questionId]?.selectedOptionIndexes || []}
                onToggle={handleToggleMultiOption}
              />
            ) : q.answerType === 'numerical' ? (
              <NumericalAnswerInput
                value={answers[q.questionId]?.selectedNumericalAnswer || ''}
                onChange={(text) => handleNumericalChange(q.questionId, text)}
              />
            ) : (
              (q.options || []).map((option, optionIndex) => {
                const isSelected = answers[q.questionId]?.selectedOptionIndex === optionIndex;
                return (
                  <TouchableOpacity
                    key={optionIndex}
                    onPress={() => handleSelect(q.questionId, optionIndex)}
                    activeOpacity={0.75}
                    style={[optionRowStyle, isSelected ? optionSelectedStyle : null]}
                  >
                    <View style={[badgeCircleStyle, isSelected ? { backgroundColor: COLORS.brand600 } : null]}>
                      <AppText variant="bold" style={{ color: isSelected ? COLORS.white : COLORS.slate700, fontSize: 13 }}>
                        {String.fromCharCode(65 + optionIndex)}
                      </AppText>
                    </View>
                    <BilingualText variant="medium" style={{ flex: 1, fontSize: 14, color: COLORS.slate700 }}>
                      {option}
                    </BilingualText>
                    <QuestionImage uri={q.optionImages?.[optionIndex]} height={100} />
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        ))}

        <TouchableOpacity
          onPress={handleSubmitPress}
          disabled={submitting}
          activeOpacity={0.85}
          style={{
            backgroundColor: submitting ? COLORS.slate400 : COLORS.brand600,
            padding: 16,
            borderRadius: RADII.xl,
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          <AppText variant="bold" style={{ color: COLORS.white, fontSize: 16 }}>
            {submitting ? 'Submitting...' : 'Submit Challenge'}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const questionCardStyle = {
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxl,
  padding: 16,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  ...SHADOWS.md,
};

const optionRowStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
  borderRadius: RADII.xl,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  backgroundColor: COLORS.white,
  marginTop: 10,
};

const optionSelectedStyle = {
  borderColor: COLORS.brand500,
  backgroundColor: COLORS.brand50,
};

const badgeCircleStyle = {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: COLORS.slate300,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
};

const checkboxStyle = {
  width: 24,
  height: 24,
  borderRadius: 6,
  borderWidth: 2,
  borderColor: COLORS.slate300,
  backgroundColor: COLORS.white,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
};
