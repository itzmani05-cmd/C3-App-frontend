import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import BilingualText from '../ui/BilingualText';
import Card from '../ui/Card';
import QuestionImage from '../question/QuestionImage';
import AnswerStatusPill from '../question/AnswerStatusPill';
import ExplanationBox from '../question/ExplanationBox';
import { optionLetter } from '../question/ChoiceOption';
import { evaluateAnswer } from '../../utils/questionFormat';
import { COLORS, RADII } from '../../theme';

function isCorrectOption(question, optionIndex) {
  if (question.answerType === 'multiple') return (question.correctOptionIndexes || []).includes(optionIndex);
  return optionIndex === question.correctOptionIndex;
}

function ReviewOption({ index, text, correct }) {
  return (
    <View
      style={[
        optionStyle,
        correct ? { borderColor: COLORS.success500, backgroundColor: COLORS.successSoft } : null,
      ]}
    >
      <BilingualText variant="medium" style={{ color: COLORS.slate700 }}>
        {optionLetter(index)}. {text}
      </BilingualText>
      {correct ? (
        <AppText variant="bold" style={{ marginTop: 4, fontSize: 12, color: COLORS.slate900 }}>
          Correct Answer ✅
        </AppText>
      ) : null}
    </View>
  );
}

function NumericalAnswer({ value }) {
  return (
    <View style={[optionStyle, { backgroundColor: COLORS.slate50 }]}>
      <AppText variant="medium" style={{ fontSize: 12, color: COLORS.slate500 }}>
        Correct answer
      </AppText>
      <AppText variant="bold" style={{ marginTop: 4, fontSize: 16, color: COLORS.success600 }}>
        {value}
      </AppText>
    </View>
  );
}

export default function ReviewQuestionCard({ question, index, dateLabel }) {
  const { answered, correct } = evaluateAnswer(question, question);

  return (
    <Card elevation="md" style={{ marginBottom: 16 }}>
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
        <AnswerStatusPill answered={answered} correct={correct} />
      </View>

      <BilingualText variant="medium" style={{ marginTop: 8, fontSize: 14, color: COLORS.slate700, lineHeight: 21 }}>
        {question.questionText}
      </BilingualText>
      <QuestionImage uri={question.questionImage} height={160} />

      {question.answerType === 'numerical' ? (
        <NumericalAnswer value={question.numericalAnswer} />
      ) : (
        (question.options || []).map((option, optionIndex) => (
          <ReviewOption key={optionIndex} index={optionIndex} text={option} correct={isCorrectOption(question, optionIndex)} />
        ))
      )}

      <ExplanationBox text={question.explanation || 'No explanation provided.'} image={question.explanationImage} />
    </Card>
  );
}

const optionStyle = {
  marginTop: 10,
  padding: 12,
  borderRadius: RADII.xl,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  backgroundColor: COLORS.white,
};
