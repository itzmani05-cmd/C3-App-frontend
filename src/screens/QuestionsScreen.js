import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuestionImage from '../components/QuestionImage';
import BilingualText from '../components/BilingualText';
import AppText from '../components/AppText';
import { API_BASE_URL } from '../config/api';
import { getCorrectOptionIndex, getOptionText, normalizeQuestionData } from '../utils/questionFormat';

const QUIZ_DURATION_SECONDS = 1350;

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 2,
};

function MultipleChoiceOptions({ q, selectedIndexes, onToggle }) {
  return (
    <>
      {Array.isArray(q.options) &&
        q.options.map((opt, idx) => {
          const isSelected = selectedIndexes.includes(idx);
          const optionLabel = String.fromCharCode(65 + idx);

          return (
            <TouchableOpacity
              key={idx}
              onPress={() => onToggle(q._id, idx)}
              activeOpacity={0.75}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                marginBottom: 10,
                borderColor: isSelected ? "#93C5FD" : "#E5E7EB",
                backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: isSelected ? "#2563EB" : "#D1D5DB",
                  backgroundColor: isSelected ? "#2563EB" : "#FFFFFF",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                {isSelected && (
                  <AppText variant="bold" style={{ color: "#FFFFFF", fontSize: 13 }}>
                    ✓
                  </AppText>
                )}
              </View>

              <AppText variant="semiBold" style={{ width: 20, color: "#374151", fontSize: 14 }}>
                {optionLabel}.
              </AppText>

              <BilingualText variant="medium" style={{ flex: 1, fontSize: 14, color: "#374151" }}>
                {getOptionText(opt)}
              </BilingualText>
            </TouchableOpacity>
          );
        })}
      <AppText style={{ fontSize: 12, color: "#6B7280", marginTop: 2, marginBottom: 4 }}>
        Select all that apply.
      </AppText>
    </>
  );
}

function NumericalAnswerInput({ value, onChange }) {
  return (
    <View style={{ marginTop: 4 }}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Enter your answer"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
          padding: 12,
          fontSize: 15,
          color: "#0F172A",
          backgroundColor: "#FFFFFF",
        }}
      />
    </View>
  );
}

export default function QuestionsScreen({ route, navigation }) {
  const { topicId, subtopicId, topicName, subtopicName, unitName } = route.params || {};

  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const answersRef = useRef([]);
  const questionsRef = useRef([]);
  const timeoutHandledRef = useRef(false);

  const quizLabel = subtopicName || topicName || 'Quiz';

  const answerMap = answers.reduce((acc, item) => {
    acc[item.questionId] = item.selectedOptionIndex;
    return acc;
  }, {});

  const multiAnswerMap = answers.reduce((acc, item) => {
    acc[item.questionId] = item.selectedOptionIndexes || [];
    return acc;
  }, {});

  const numericalAnswerMap = answers.reduce((acc, item) => {
    acc[item.questionId] = item.selectedNumericalAnswer || '';
    return acc;
  }, {});

  const attemptsMap = answers.reduce((acc, item) => {
    acc[item.questionId] = item.attempts || 0;
    return acc;
  }, {});

  const revealedAnswersMap = answers.reduce((acc, item) => {
    acc[item.questionId] = item.revealedAfterAttempts || false;
    return acc;
  }, {});

  useEffect(() => {
    const loadSession = async () => {
      const saved = await AsyncStorage.getItem('quiz_session');
      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          parsed.topicId === topicId &&
          parsed.subtopicId === subtopicId
        ) {
          setSessionId(parsed.sessionId);
        }
      }
    };
    loadSession();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);

      try {
        const userId = global.userId || global.user?.userId;

        const baseUrl = subtopicId
          ? `${API_BASE_URL}/api/quiz/subtopic/${subtopicId}`
          : `${API_BASE_URL}/api/quiz/topic/${topicId}`;

        const url = sessionId ? `${baseUrl}?sessionId=${sessionId}` : baseUrl;

        const res = await axios.get(url, {
          headers: userId ? { userid: userId } : {},
        });
        console.log("API RESPONSE:", res.data);

        const sid = res.data.sessionId||sessionId;

        if (sid) {
          setSessionId(sid);

          await AsyncStorage.setItem(
            'quiz_session',
            JSON.stringify({ sessionId: sid, topicId, subtopicId })
          );

          const existingStart = await AsyncStorage.getItem(`quiz_${sid}_start`);
          if (!existingStart) {
            await AsyncStorage.setItem(`quiz_${sid}_start`, Date.now().toString());
          }
        }

        const rawQuestions = Array.isArray(res.data?.questions)
          ? res.data.questions
          : [];

        const qList = rawQuestions.map(q => normalizeQuestionData(q));
        setQuestions(qList);
        questionsRef.current = qList;

        const savedAnswers = await AsyncStorage.getItem(`quiz_${sid}_answers`);
        if (savedAnswers) {
          const parsed = JSON.parse(savedAnswers);
          setAnswers(parsed);
          answersRef.current = parsed;
        }
        const startTime = await AsyncStorage.getItem(`quiz_${sid}_start`);
        if (startTime) {
          const elapsed = Math.floor((Date.now() - Number(startTime)) / 1000);
          const remaining = QUIZ_DURATION_SECONDS - elapsed;
          setTimeLeft(Math.max(remaining, 0));
        }

      } catch (err) {
        console.log(err);
        Alert.alert('Error', 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topicId, subtopicId]);

  useEffect(() => {
    if (loading || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, questions.length]);

  useEffect(() => {
    if (
      loading ||
      submitting ||
      timeLeft !== 0 ||
      timeoutHandledRef.current
    ) return;

    timeoutHandledRef.current = true;

    submitQuiz(answersRef.current, true);
  }, [timeLeft]);

  const handleSelect = (questionId, optionIndex) => {
    setAnswers(prev => {
      let updated;
      
      // Find the question to get correct answer
      const question = questions.find(q => q._id === questionId);
      const correctIndex = question ? getCorrectOptionIndex(question) : -1;
      
      if (prev.some(a => a.questionId === questionId)) {
        // Update existing answer and increment attempts
        updated = prev.map(a => {
          if (a.questionId === questionId) {
            const newAttempts = (a.attempts || 0) + 1;
            // If this is the 3rd attempt, auto-select correct answer
            if (newAttempts === 3) {
              return { 
                ...a, 
                selectedOptionIndex: correctIndex, 
                attempts: newAttempts,
                revealedAfterAttempts: true
              };
            }
            return { ...a, selectedOptionIndex: optionIndex, attempts: newAttempts };
          }
          return a;
        });
      } else {
        // New answer
        updated = [...prev, { questionId, selectedOptionIndex: optionIndex, attempts: 1 }];
      }

      answersRef.current = updated;

      if (sessionId) {
        AsyncStorage.setItem(
          `quiz_${sessionId}_answers`,
          JSON.stringify(updated)
        );
      }
      return updated;
    });
  };

  const handleToggleMultiOption = (questionId, optionIndex) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      const currentSelected = existing?.selectedOptionIndexes || [];
      const nextSelected = currentSelected.includes(optionIndex)
        ? currentSelected.filter(i => i !== optionIndex)
        : [...currentSelected, optionIndex];

      const updated = existing
        ? prev.map(a => (a.questionId === questionId ? { ...a, selectedOptionIndexes: nextSelected } : a))
        : [...prev, { questionId, selectedOptionIndexes: nextSelected }];

      answersRef.current = updated;

      if (sessionId) {
        AsyncStorage.setItem(
          `quiz_${sessionId}_answers`,
          JSON.stringify(updated)
        );
      }
      return updated;
    });
  };

  const handleNumericalChange = (questionId, text) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      const updated = existing
        ? prev.map(a => (a.questionId === questionId ? { ...a, selectedNumericalAnswer: text } : a))
        : [...prev, { questionId, selectedNumericalAnswer: text }];

      answersRef.current = updated;

      if (sessionId) {
        AsyncStorage.setItem(
          `quiz_${sessionId}_answers`,
          JSON.stringify(updated)
        );
      }
      return updated;
    });
  };

  const submitQuiz = async (finalAnswers, isTimedOut = false) => {
    setSubmitting(true);

    try {
      const userId = global.userId || global.user?.userId;

      const res = await axios.post(
        `${API_BASE_URL}/api/quiz/submit`,
        {
          sessionId,
          answers: finalAnswers,
          isTimedOut,
          topicId,
          subtopicId,
        },
        { headers: { userid: userId } }
      );

      await AsyncStorage.multiRemove([
        'quiz_session',
        `quiz_${sessionId}_answers`,
        `quiz_${sessionId}_start`,
      ]);

      // Filter out attempt tracking fields before sending to ResultScreen
      const cleanAnswers = finalAnswers.map(a => ({
        questionId: a.questionId,
        selectedOptionIndex: a.selectedOptionIndex,
        selectedOptionIndexes: a.selectedOptionIndexes,
        selectedNumericalAnswer: a.selectedNumericalAnswer,
      }));

      navigation.replace('ResultScreen', {
        result: res.data,
        questions,
        answers: cleanAnswers,
        topicId,
        subtopicId,
        topicName,
        subtopicName,
        unitName,
      });

    } catch (err) {
      console.log("SUBMIT ERROR:", err.response?.data || err.message);
      
      const isCorrupted = err.response?.status === 400 && 
                         err.response?.data?.message?.toLowerCase().includes("corrupted");
      
      if (isCorrupted) {
        Alert.alert(
          'Session Expired', 
          'Your quiz session was out of date. We have cleared it. Please try again.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        await AsyncStorage.multiRemove([
          'quiz_session',
          `quiz_${sessionId}_answers`,
          `quiz_${sessionId}_start`,
        ]);
      } else {
        Alert.alert('Error', err.response?.data?.message || 'Submit failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    const pendingCount = pendingQuestions.length;

    if (pendingCount > 0) {
      Alert.alert(
        "Incomplete Quiz",
        `You have ${pendingCount} unanswered question(s).\n\nDo you want to submit anyway?`,
        [
          {
            text: "Go Back",
            style: "cancel",
          },
          {
            text: "Submit Anyway",
            onPress: () => submitQuiz(answersRef.current),
          },
        ]
      );
      return;
    }

    submitQuiz(answersRef.current);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }
  const pendingQuestions = questions.filter(q => {
    if (q.answerType === 'multiple') {
      return (multiAnswerMap[q._id] || []).length === 0;
    }
    if (q.answerType === 'numerical') {
      return !numericalAnswerMap[q._id];
    }
    return answerMap[q._id] === undefined;
  });

  const formatQuestionLines = (text) => {
    if (!text) return [];

    let formatted = text
      // Assertion / Reason
      .replace(/Assertion\s*\(A\):/gi, "\nAssertion (A):")
      .replace(/Reason\s*\(R\):/gi, "\nReason (R):")

      // Match the following
      .replace(/List I/gi, "\nList I")
      .replace(/List II/gi, "\nList II")

      // Numbered points
      .replace(/(\d+\.)/g, "\n$1")

      // A. B. C. D.
      .replace(/([A-D]\.)/g, "\n$1");

    return formatted.split("\n").filter(line => line.trim() !== "");
  };

return (
  <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
    <View
      style={{
        padding: 16,
        paddingTop: 40,
        backgroundColor: "#FFFFFF",
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        zIndex: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AppText
          variant="extraBold"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            flex: 1,
            fontSize: 17,
            color: "#0F172A",
            marginRight: 10,
          }}
        >
          {quizLabel}
        </AppText>
        <View
          style={{
            backgroundColor: "#FEE2E2",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: "#FECACA",
          }}
        >
          <AppText
            variant="bold"
            style={{
              fontSize: 13,
              color: "#B91C1C",
            }}
          >
            ⏱ {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </AppText>
        </View>
      </View>

      <View
        style={{
          marginTop: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#F8FAFC",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <AppText variant="semiBold" style={{ color: "#16A34A", fontSize: 13 }}>
          Answered: {questions.length - pendingQuestions.length}
        </AppText>

        <AppText variant="semiBold" style={{ color: "#DC2626", fontSize: 13 }}>
          Pending: {pendingQuestions.length}
        </AppText>
      </View>
    </View>

    <ScrollView style={{ padding: 16 }}>
      {Array.isArray(questions) && questions.length > 0 ? (
        questions.map((q, i) => (
          <View
            key={q._id}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 18,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              ...cardShadow,
            }}
          >
            <View style={{ marginBottom: 12 }}>
              <AppText
                variant="bold"
                style={{
                  fontSize: 16,
                  marginBottom: 8,
                  color: "#0F172A",
                }}
              >
                Question No {i + 1}.
              </AppText>

              {formatQuestionLines(q.questionText || q.question).map((line, index) => {
                const lower = line.toLowerCase();

                const isAssertion = lower.includes("assertion");
                const isReason = lower.includes("reason");
                const isList = lower.includes("list i") || lower.includes("list ii");

                return (
                  <BilingualText
                    key={index}
                    variant={isAssertion || isReason || isList ? "bold" : "medium"}
                    style={{
                      fontSize: 15,
                      marginBottom: 6,
                      color: isAssertion
                        ? "#2563EB"   //Assertion
                        : isReason
                        ? "#D97706"   //Reason
                        : isList
                        ? "#7C3AED"   //Lists
                        : "#374151",
                    }}
                  >
                    {line}
                  </BilingualText>
                );
              })}
            </View>

            {q.questionImage && (
              <QuestionImage source={q.questionImage} />
            )}

            {q.answerType === 'multiple' ? (
              <MultipleChoiceOptions
                q={q}
                selectedIndexes={multiAnswerMap[q._id] || []}
                onToggle={handleToggleMultiOption}
              />
            ) : q.answerType === 'numerical' ? (
              <NumericalAnswerInput
                value={numericalAnswerMap[q._id] || ''}
                onChange={(text) => handleNumericalChange(q._id, text)}
              />
            ) : (
              <>
                {Array.isArray(q.options) &&
                  q.options.map((opt, idx) => {
                    const isSelected = answerMap[q._id] === idx;
                    const attempts = attemptsMap[q._id] || 0;
                    const isRevealed = revealedAnswersMap[q._id];
                    const correctIndex = getCorrectOptionIndex(q);
                    const isCorrectOption = idx === correctIndex;
                    const isDisabled = attempts >= 3;

                    const optionLabel = String.fromCharCode(65 + idx);

                    // Determine colors based on state
                    let borderColor = "#E5E7EB";
                    let backgroundColor = "#FFFFFF";
                    let opacity = 1;

                    if (isDisabled && isCorrectOption) {
                      // Show correct answer in green when revealed
                      borderColor = "#86EFAC";
                      backgroundColor = "#F0FDF4";
                    } else if (isSelected) {
                      borderColor = "#93C5FD";
                      backgroundColor = "#EFF6FF";
                    } else if (isDisabled && isRevealed) {
                      // Disable other options after reveal
                      opacity = 0.5;
                    }

                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => !isDisabled && handleSelect(q._id, idx)}
                        disabled={isDisabled}
                        activeOpacity={0.75}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 12,
                          borderRadius: 12,
                          borderWidth: 1,
                          marginBottom: 10,
                          borderColor: borderColor,
                          backgroundColor: backgroundColor,
                          opacity: opacity,
                        }}
                      >
                        <View
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: isDisabled && isCorrectOption ? "#16A34A" : isSelected ? "#2563EB" : "#D1D5DB",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                          }}
                        >
                          <AppText variant="bold" style={{ color: "#FFFFFF", fontSize: 13 }}>
                            {optionLabel}
                          </AppText>
                        </View>

                        {/* Option Text */}
                        <BilingualText variant="medium" style={{ flex: 1, fontSize: 14, color: "#374151" }}>
                          {getOptionText(opt)}
                        </BilingualText>
                      </TouchableOpacity>
                    );
                  })}

                  {/* Show attempt counter and message */}
                  {(() => {
                    const attempts = attemptsMap[q._id] || 0;
                    const isRevealed = revealedAnswersMap[q._id];
                    if (attempts > 0) {
                      return (
                        <View style={{
                          marginTop: 10,
                          padding: 10,
                          borderRadius: 10,
                          backgroundColor: attempts >= 3 ? "#F0FDF4" : attempts === 2 ? "#FEF2F2" : "#F8FAFC",
                          borderWidth: 1,
                          borderColor: attempts >= 3 ? "#86EFAC" : attempts === 2 ? "#FECACA" : "#E5E7EB",
                        }}>
                          <AppText variant="semiBold" style={{
                            fontSize: 12,
                            color: attempts >= 3 ? "#16A34A" : attempts === 2 ? "#DC2626" : "#6B7280",
                          }}>
                            Attempts: {attempts}/3
                          </AppText>
                          {isRevealed && (
                            <AppText variant="semiBold" style={{
                              fontSize: 12,
                              color: "#16A34A",
                              marginTop: 4,
                            }}>
                              ✓ Correct answer revealed
                            </AppText>
                          )}
                        </View>
                      );
                    }
                    return null;
                  })()}
              </>
            )}
          </View>
        ))
      ) : (
        <AppText
          style={{
            textAlign: "center",
            marginTop: 50,
            fontSize: 16,
            color: "#6B7280",
          }}
        >
          No questions available
        </AppText>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleNext}
        disabled={submitting}
        activeOpacity={0.85}
        style={{
          backgroundColor: submitting ? "#9CA3AF" : "#2563EB",
          padding: 16,
          borderRadius: 14,
          alignItems: "center",
          marginVertical: 20,
          shadowColor: "#2563EB",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: submitting ? 0 : 0.25,
          shadowRadius: 8,
          elevation: submitting ? 0 : 4,
        }}
      >
        <AppText
          variant="bold"
          style={{
            color: "#FFFFFF",
            fontSize: 16,
          }}
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </AppText>
      </TouchableOpacity>

    </ScrollView>
  </View>
);
}
