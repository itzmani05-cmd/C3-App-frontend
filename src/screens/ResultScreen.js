import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import BilingualText from '../components/BilingualText';
import Header from '../components/Header';
import QuestionImage from '../components/QuestionImage';
import { fetchNextLesson } from '../utils/learningPathApi';
import {
  getCorrectOptionIndex,
  getOptionText,
  normalizeQuestionData,
} from '../utils/questionFormat';

const PASS_PERCENTAGE = 80;

function formatPercent(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return '0%';
  }

  return `${numericValue % 1 === 0 ? numericValue.toFixed(0) : numericValue.toFixed(1)}%`;
}

function getResultTone(passed) {
  return passed
    ? {
        label: 'Passed',
        textColor: '#1D4ED8',
        backgroundColor: '#DBEAFE',
        cardStyle: summaryCardPassedStyle,
      }
    : {
        label: 'Failed',
        textColor: '#B91C1C',
        backgroundColor: '#FEE2E2',
        cardStyle: summaryCardFailedStyle,
      };
}

function getQuestionBadge(selectedIndex, correctIndex) {
  if (selectedIndex === undefined) {
    return {
      label: 'Skipped',
      textColor: '#6B7280',
      backgroundColor: '#F3F4F6',
    };
  }

  if (selectedIndex === correctIndex) {
    return {
      label: 'Correct',
      textColor: '#2563EB',
      backgroundColor: '#DBEAFE',
    };
  }

  return {
    label: 'Incorrect',
    textColor: '#DC2626',
    backgroundColor: '#FEE2E2',
  };
}

function getOptionTone(optionIndex, selectedIndex, correctIndex) {
  const isSelected = selectedIndex === optionIndex;
  const isCorrect = correctIndex === optionIndex;

  if (isCorrect) {
    return {
      borderColor: '#93C5FD',
      backgroundColor: '#EFF6FF',
      textColor: '#1D4ED8',
      hintText: isSelected ? 'Your answer' : 'Correct answer',
      hintColor: '#2563EB',
    };
  }

  if (isSelected) {
    return {
      borderColor: '#FCA5A5',
      backgroundColor: '#FEF2F2',
      textColor: '#B91C1C',
      hintText: 'Your answer',
      hintColor: '#DC2626',
    };
  }

  return {
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    textColor: '#374151',
    hintText: '',
    hintColor: '#6B7280',
  };
}

function StatusBadge({ label, textColor, backgroundColor }) {
  return (
    <View style={[badgeContainerStyle, { backgroundColor }]}>
      <AppText variant="bold" style={[badgeTextStyle, { color: textColor }]}>
        {label}
      </AppText>
    </View>
  );
}

function StatCard({ label, value, accentColor }) {
  return (
    <View style={statCardStyle}>
      <AppText variant="medium" style={statLabelStyle}>
        {label}
      </AppText>
      <AppText variant="extraBold" style={[statValueStyle, { color: accentColor }]}>
        {value}
      </AppText>
    </View>
  );
}

function ActionButton({ label, onPress, tone = 'primary', disabled = false }) {
  return (
    <AppButton
      label={label}
      onPress={onPress}
      tone={tone}
      disabled={disabled}
      style={tone === 'secondary' ? secondaryActionButtonStyle : null}
    />
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <View style={sectionHeaderStyle}>
      <AppText variant="bold" style={sectionTitleStyle}>
        {title}
      </AppText>
      <AppText style={sectionSubtitleStyle}>
        {subtitle}
      </AppText>
    </View>
  );
}

function SummaryCard({
  pathLabel,
  quizLabel,
  passed,
  percentage,
  attemptedCount,
  totalQuestions,
  score,
}) {
  const resultTone = getResultTone(passed);

  return (
    <View style={[summaryCardStyle, resultTone.cardStyle]}>
      <View style={summaryTopRowStyle}>
        <View style={summaryTextWrapStyle}>
          <AppText variant="medium" style={summaryPathStyle}>
            {pathLabel}
          </AppText>
          <AppText variant="extraBold" style={summaryTitleStyle}>
            {quizLabel}
          </AppText>
        </View>
        <StatusBadge
          label={resultTone.label}
          textColor={resultTone.textColor}
          backgroundColor={resultTone.backgroundColor}
        />
      </View>

      <AppText variant="extraBold" style={summaryPercentageStyle}>
        {formatPercent(percentage)}
      </AppText>
      
    </View>
  );
}

function ReviewOptionRow({ option, optionIndex, selectedIndex, correctIndex, optionImage }) {
  const optionTone = getOptionTone(optionIndex, selectedIndex, correctIndex);

  return (
    <View
      style={[
        optionRowStyle,
        {
          borderColor: optionTone.borderColor,
          backgroundColor: optionTone.backgroundColor,
        },
      ]}
    >
      <BilingualText variant="medium" style={[optionTextStyle, { color: optionTone.textColor }]}>
        {String.fromCharCode(65 + optionIndex)}. {getOptionText(option)}
      </BilingualText>
      <QuestionImage uri={optionImage} height={150} style={{ marginTop: 10 }} />
      {optionTone.hintText ? (
        <AppText variant="bold" style={[optionHintStyle, { color: optionTone.hintColor }]}>
          {optionTone.hintText}
        </AppText>
      ) : null}
    </View>
  );
}

function QuestionReviewCard({ question, index, answer }) {
  const selectedIndex = answer?.selectedOptionIndex;
  const correctIndex = getCorrectOptionIndex(question);
  const badge = getQuestionBadge(selectedIndex, correctIndex);
  const questionKey = question?._id || index;

  return (
    <View style={questionCardStyle}>
      <View style={questionHeaderStyle}>
        <BilingualText variant="bold" style={questionTitleStyle}>
          Q{index + 1}. {question?.questionText || question?.question}
        </BilingualText>
        <StatusBadge
          label={badge.label}
          textColor={badge.textColor}
          backgroundColor={badge.backgroundColor}
        />
      </View>

      <QuestionImage uri={question?.questionImage} height={200} style={{ marginBottom: 14 }} />

      {(question?.options || []).map((option, optionIndex) => (
        <ReviewOptionRow
          key={`${questionKey}-${optionIndex}`}
          option={option}
          optionIndex={optionIndex}
          selectedIndex={selectedIndex}
          correctIndex={correctIndex}
          optionImage={question?.optionImages?.[optionIndex]}
        />
      ))}

      {question?.explanation || question?.explanationImage ? (
        <View style={explanationBoxStyle}>
          <AppText variant="bold" style={explanationLabelStyle}>
            Explanation
          </AppText>
          {question?.explanation ? (
            <BilingualText style={explanationTextStyle}>
              {question.explanation}
            </BilingualText>
          ) : null}
          <QuestionImage uri={question?.explanationImage} height={150} style={{ marginTop: 10 }} />
        </View>
      ) : null}
    </View>
  );
}

function LockedReviewCard() {
  return (
    <View style={lockedCardStyle}>
      <AppText variant="bold" style={lockedCardTitleStyle}>
        Detailed review is locked
      </AppText>
      <AppText style={lockedCardMessageStyle}>
        Pass this quiz to unlock the full answer review and explanations. Current pass mark: 80%.
      </AppText>
    </View>
  );
}

export default function ResultScreen({ route, navigation }) {
  const {
    answers = [],
    questions = [],
    result = {},
    topicId,
    subtopicId,
    topicName,
    subtopicName,
    unitName,
  } = route.params || {};
  const [nextLesson, setNextLesson] = useState(null);
  const [loadingNextLesson, setLoadingNextLesson] = useState(false);
  const normalizedQuestions = Array.isArray(questions)
    ? questions.map((question) => normalizeQuestionData(question))
    : [];

  const score = Number(result?.score) || 0;
  const percentage = Number(result?.percentage) || 0;
  const attemptedCount = answers.length;
  const passed =
    typeof result?.passed === 'boolean' ? result.passed : percentage >= PASS_PERCENTAGE;
  const quizLabel = subtopicName || topicName || 'Quiz';
  const pathLabel = unitName ? `${unitName} > ${topicName || quizLabel}` : quizLabel;
  const answersByQuestionId = answers.reduce((acc, item) => {
    acc[item.questionId] = item;
    return acc;
  }, {});

  useEffect(() => {
    let isMounted = true;

    const fetchNextLesson = async () => {
      if (!passed || !topicId) {
        setNextLesson(null);
        setLoadingNextLesson(false);
        return;
      }

      setLoadingNextLesson(true);

      try {
        const userId = global.userId || global.user?.userId;
        const nextLessonData = await fetchNextLesson({
          topicId,
          subtopicId,
          headers: userId ? { userid: userId } : {},
        });

        if (isMounted) {
          setNextLesson(nextLessonData);
        }
      } catch (err) {
        console.log('Next lesson fetch error:', err);
        if (isMounted) {
          setNextLesson(null);
        }
      } finally {
        if (isMounted) {
          setLoadingNextLesson(false);
        }
      }
    };

    fetchNextLesson();

    return () => {
      isMounted = false;
    };
  }, [passed, topicId, subtopicId]);

  const openQuiz = () => {
    navigation.replace('QuestionsScreen', {
      topicId,
      subtopicId,
      topicName,
      subtopicName,
      unitName,
    });
  };

  const openNextLesson = () => {
    if (!nextLesson) {
      navigation.goBack();
      return;
    }

    navigation.replace('QuestionsScreen', {
      topicId: nextLesson.topicId,
      subtopicId: nextLesson.subtopicId || undefined,
      subtopicName: nextLesson.subtopicName || undefined,
      topicName: nextLesson.topicName || topicName,
      unitName: nextLesson.unitName || unitName,
    });
  };

  const primaryAction = !passed
    ? {
        label: 'Retry Quiz',
        onPress: openQuiz,
      }
    : loadingNextLesson
      ? {
          label: 'Loading Next Lesson...',
          onPress: () => {},
          disabled: true,
        }
      : nextLesson
        ? {
            label: 'Next Lesson',
            onPress: openNextLesson,
          }
        : {
            label: 'Go Back',
            onPress: () => navigation.goBack(),
          };

  const secondaryAction = passed
    ? nextLesson
      ? {
          label: 'Go Back',
          onPress: () => navigation.goBack(),
        }
      : {
          label: 'Retry Quiz',
          onPress: openQuiz,
        }
    : {
        label: 'Go Back',
        onPress: () => navigation.goBack(),
      };

  return (
    <View style={screenStyle}>
      <Header title="Quiz Result" showBack={true} onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={scrollStyle}
        contentContainerStyle={scrollContentStyle}
        showsVerticalScrollIndicator={false}
      >
        <SummaryCard
          pathLabel={pathLabel}
          quizLabel={quizLabel}
          passed={passed}
          percentage={percentage}
          attemptedCount={attemptedCount}
          totalQuestions={normalizedQuestions.length}
          score={score}
        />

        <View style={statsGridStyle}>
          <StatCard
            label="Score"
            value={`${score}/${normalizedQuestions.length}`}
            accentColor="#2563EB"
          />
          <StatCard label="Attempted" value={`${attemptedCount}`} accentColor="#111827" />
        </View>

        {passed ? (
          <View style={sectionWrapStyle}>
            <SectionHeader
              title="Answer Review"
            />

            {normalizedQuestions.map((question, index) => (
              <QuestionReviewCard
                key={question?._id || index}
                question={question}
                index={index}
                answer={answersByQuestionId[question?._id]}
              />
            ))}
          </View>
        ) : (
          <LockedReviewCard />
        )}

        <View style={actionWrapStyle}>
          <ActionButton
            label={primaryAction.label}
            onPress={primaryAction.onPress}
            disabled={primaryAction.disabled}
          />
          <ActionButton
            label={secondaryAction.label}
            tone="secondary"
            onPress={secondaryAction.onPress}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const screenStyle = {
  flex: 1,
  backgroundColor: '#F8FAFC',
};

const scrollStyle = {
  flex: 1,
};

const scrollContentStyle = {
  padding: 16,
  paddingBottom: 32,
};

const badgeContainerStyle = {
  borderRadius: 999,
  paddingHorizontal: 12,
  paddingVertical: 7,
};

const badgeTextStyle = {
  fontSize: 12,
};

const summaryCardStyle = {
  borderRadius: 20,
  padding: 18,
  borderWidth: 1,
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 2,
};

const summaryCardPassedStyle = {
  backgroundColor: '#EFF6FF',
  borderColor: '#BFDBFE',
};

const summaryCardFailedStyle = {
  backgroundColor: '#FEF2F2',
  borderColor: '#FECACA',
};

const summaryTopRowStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const summaryTextWrapStyle = {
  flex: 1,
  marginRight: 12,
};

const summaryPathStyle = {
  color: '#6B7280',
  fontSize: 12,
};

const summaryTitleStyle = {
  marginTop: 6,
  color: '#000000',
  fontSize: 22,
};

const summaryPercentageStyle = {
  marginTop: 18,
  color: '#000000',
  fontSize: 34,
};

const summaryMessageStyle = {
  marginTop: 8,
  color: '#4B5563',
  lineHeight: 22,
};

const statsGridStyle = {
  marginTop: 16,
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
};

const statCardStyle = {
  width: '48%',
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 14,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
};

const statLabelStyle = {
  color: '#6B7280',
  fontSize: 12,
};

const statValueStyle = {
  marginTop: 8,
  fontSize: 22,
};

const sectionWrapStyle = {
  marginTop: 8,
};

const sectionHeaderStyle = {
  marginBottom: 2,
};

const sectionTitleStyle = {
  color: '#000000',
  fontSize: 18,
};

const sectionSubtitleStyle = {
  marginTop: 6,
  color: '#6B7280',
  lineHeight: 20,
};

const questionCardStyle = {
  marginTop: 14,
  backgroundColor: '#FFFFFF',
  borderRadius: 18,
  padding: 16,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 2,
};

const questionHeaderStyle = {
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: 14,
};

const questionTitleStyle = {
  flex: 1,
  marginRight: 12,
  color: '#000000',
  fontSize: 16,
  lineHeight: 24,
};

const optionRowStyle = {
  borderWidth: 1,
  borderRadius: 12,
  padding: 12,
  marginTop: 10,
};

const optionTextStyle = {
  flex: 1,
  lineHeight: 21,
};

const optionHintStyle = {
  marginTop: 6,
  fontSize: 12,
};

const explanationBoxStyle = {
  marginTop: 14,
  padding: 14,
  borderRadius: 12,
  backgroundColor: '#F8FAFC',
  borderWidth: 1,
  borderColor: '#E5E7EB',
};

const explanationLabelStyle = {
  color: '#2563EB',
  fontSize: 12,
};

const explanationTextStyle = {
  marginTop: 6,
  color: '#374151',
  lineHeight: 21,
};

const lockedCardStyle = {
  marginTop: 8,
  backgroundColor: '#FFFFFF',
  borderRadius: 18,
  padding: 18,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 2,
};

const lockedCardTitleStyle = {
  color: '#000000',
  fontSize: 17,
};

const lockedCardMessageStyle = {
  marginTop: 8,
  color: '#6B7280',
  lineHeight: 21,
};

const actionWrapStyle = {
  marginTop: 70,
};

const secondaryActionButtonStyle = {
  marginTop: 12,
};
