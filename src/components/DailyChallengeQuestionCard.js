import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import BilingualText from './BilingualText';
import QuestionImage from './QuestionImage';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';
import { isNumericalAnswerCorrect } from '../utils/questionFormat';

function getOptionTone(optionIndex, correctIndex) {
  const isCorrect = optionIndex === correctIndex;

  if (isCorrect) {
    return { borderColor: COLORS.success500, backgroundColor: COLORS.successSoft, label: 'Correct Answer ✅' };
  }
  return { borderColor: COLORS.slate200, backgroundColor: COLORS.white, label: null };
}

function getMultiOptionTone(optionIndex, correctIndexes) {
  const isCorrect = correctIndexes.includes(optionIndex);

  if (isCorrect) {
    return { borderColor: COLORS.success500, backgroundColor: COLORS.successSoft, label: 'Correct Answer ✅' };
  }
  return { borderColor: COLORS.slate200, backgroundColor: COLORS.white, label: null };
}

export default function DailyChallengeQuestionCard({ question, index, dateLabel }) {
  const answerType = question.answerType || 'single';

  let isAnswered = false;
  let isCorrect = false;

  if (answerType === 'multiple') {
    const selectedIndexes = question.selectedOptionIndexes || [];
    const correctIndexes = question.correctOptionIndexes || [];
    isAnswered = selectedIndexes.length > 0;
    isCorrect =
      isAnswered &&
      selectedIndexes.length === correctIndexes.length &&
      selectedIndexes.every((idx) => correctIndexes.includes(idx));
  } else if (answerType === 'numerical') {
    const selectedAnswer = question.selectedNumericalAnswer || '';
    isAnswered = selectedAnswer.trim() !== '';
    isCorrect = isAnswered && isNumericalAnswerCorrect(selectedAnswer, question.numericalAnswer);
  } else {
    const correctIndex = question.correctOptionIndex;
    const selectedIndex = question.selectedOptionIndex;
    isAnswered = selectedIndex !== null && selectedIndex !== undefined;
    isCorrect = isAnswered && selectedIndex === correctIndex;
  }

  return (
    <View style={cardStyle}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <AppText variant="bold" style={{ fontSize: 15, color: COLORS.slate900 }}>
            Question {index + 1}
          </AppText>
          {dateLabel ? (
            <AppText variant="medium" style={{ marginTop: 2, fontSize: 12, color: COLORS.slate500 }}>
              {dateLabel}
            </AppText>
          ) : null}
        </View>
        <View
          style={{
            borderRadius: RADII.pill,
            paddingHorizontal: 10,
            paddingVertical: 4,
            backgroundColor: !isAnswered ? COLORS.slate100 : isCorrect ? COLORS.successSoft : COLORS.dangerSoft,
          }}
        >
          <AppText
            variant="bold"
            style={{ fontSize: 11, color: !isAnswered ? COLORS.slate500 : isCorrect ? COLORS.success600 : COLORS.danger600 }}
          >
            {!isAnswered ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
          </AppText>
        </View>
      </View>

      <BilingualText variant="medium" style={{ marginTop: 8, fontSize: 14, color: COLORS.slate700, lineHeight: 21 }}>
        {question.questionText}
      </BilingualText>
      <QuestionImage uri={question.questionImage} height={160} />

      {answerType === 'numerical' ? (
        <View style={numericalReviewBoxStyle}>
          <AppText variant="medium" style={{ fontSize: 12, color: COLORS.slate500 }}>
            Correct answer
          </AppText>
          <AppText variant="bold" style={{ marginTop: 4, fontSize: 16, color: COLORS.success600 }}>
            {question.numericalAnswer}
          </AppText>
        </View>
      ) : (
        (question.options || []).map((option, optionIndex) => {
          const tone =
            answerType === 'multiple'
              ? getMultiOptionTone(optionIndex, question.correctOptionIndexes || [])
              : getOptionTone(optionIndex, question.correctOptionIndex);
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
        })
      )}

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

const cardStyle = {
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxl,
  padding: 16,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  ...SHADOWS.md,
};

const numericalReviewBoxStyle = {
  marginTop: 10,
  padding: 12,
  borderRadius: RADII.xl,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  backgroundColor: COLORS.slate50,
};

const explanationBoxStyle = {
  marginTop: 14,
  padding: 14,
  borderRadius: RADII.xl,
  backgroundColor: COLORS.slate50,
  borderWidth: 1,
  borderColor: COLORS.slate200,
};
