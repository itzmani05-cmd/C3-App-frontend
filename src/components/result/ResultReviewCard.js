import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import BilingualText from '../ui/BilingualText';
import FormattedQuestionText from '../quiz/FormattedQuestionText';
import Card from '../ui/Card';
import QuestionImage from '../question/QuestionImage';
import AnswerStatusPill from '../question/AnswerStatusPill';
import ExplanationBox from '../question/ExplanationBox';
import { optionLetter } from '../question/ChoiceOption';
import { evaluateAnswer, getCorrectOptionIndex, getOptionText } from '../../utils/questionFormat';
import { COLORS } from '../../theme';

const OPTION_TONES = {
  correct: { borderColor: COLORS.blue300, backgroundColor: COLORS.blue50, textColor: COLORS.blue700, hintColor: COLORS.blue600 },
  wrong: { borderColor: COLORS.red300, backgroundColor: COLORS.red50, textColor: COLORS.red700, hintColor: COLORS.red600 },
  plain: { borderColor: COLORS.gray200, backgroundColor: COLORS.white, textColor: COLORS.gray700, hintColor: COLORS.gray500 },
};

function optionTone(isSelected, isCorrect) {
  if (isCorrect) return { ...OPTION_TONES.correct, hint: isSelected ? 'Your answer' : 'Correct answer' };
  if (isSelected) return { ...OPTION_TONES.wrong, hint: 'Your answer' };
  return { ...OPTION_TONES.plain, hint: '' };
}

function ReviewOptionRow({ option, index, image, isSelected, isCorrect }) {
  const tone = optionTone(isSelected, isCorrect);

  return (
    <View style={[optionRowStyle, { borderColor: tone.borderColor, backgroundColor: tone.backgroundColor }]}>
      <BilingualText variant="medium" style={{ flex: 1, lineHeight: 21, color: tone.textColor }}>
        {optionLetter(index)}. {getOptionText(option)}
      </BilingualText>
      <QuestionImage uri={image} height={150} style={{ marginTop: 10 }} />
      {tone.hint ? (
        <AppText variant="bold" style={{ marginTop: 6, fontSize: 12, color: tone.hintColor }}>
          {tone.hint}
        </AppText>
      ) : null}
    </View>
  );
}

function NumericalAnswerReview({ selected, correctAnswer, isCorrect }) {
  return (
    <View style={numericalBoxStyle}>
      <AppText variant="medium" style={{ color: COLORS.gray500, fontSize: 12 }}>
        Your answer
      </AppText>
      <AppText variant="bold" style={{ marginTop: 4, fontSize: 16, color: isCorrect ? COLORS.blue700 : COLORS.red700 }}>
        {selected || 'Not answered'}
      </AppText>
      {!isCorrect ? (
        <>
          <AppText variant="medium" style={{ color: COLORS.gray500, fontSize: 12, marginTop: 10 }}>
            Correct answer
          </AppText>
          <AppText variant="bold" style={{ marginTop: 4, fontSize: 16, color: COLORS.blue700 }}>
            {correctAnswer}
          </AppText>
        </>
      ) : null}
    </View>
  );
}

function Answers({ question, answer, correct }) {
  if (question.answerType === 'numerical') {
    return (
      <NumericalAnswerReview
        selected={String(answer?.selectedNumericalAnswer ?? '').trim()}
        correctAnswer={question.numericalAnswer || ''}
        isCorrect={correct}
      />
    );
  }

  const multiple = question.answerType === 'multiple';
  const selectedIndexes = multiple ? answer?.selectedOptionIndexes || [] : [answer?.selectedOptionIndex];
  const correctIndexes = multiple ? question.correctOptionIndexes || [] : [getCorrectOptionIndex(question)];

  return (question.options || []).map((option, index) => (
    <ReviewOptionRow
      key={index}
      option={option}
      index={index}
      image={question.optionImages?.[index]}
      isSelected={selectedIndexes.includes(index)}
      isCorrect={correctIndexes.includes(index)}
    />
  ));
}

export default function ResultReviewCard({ question, index, answer }) {
  const { answered, correct } = evaluateAnswer(question, answer, getCorrectOptionIndex(question));
  const hasExplanation = question.explanation || question.explanationImage;

  return (
    <Card elevation="card" style={cardStyle}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <FormattedQuestionText text={question.questionText || question.question} prefix={`Q${index + 1}.`} variant="bold" fontSize={16} lineHeight={24} color={COLORS.black} />
        </View>
        <AnswerStatusPill answered={answered} correct={correct} palette="blue" />
      </View>

      <QuestionImage uri={question.questionImage} height={200} style={{ marginBottom: 14 }} />
      <Answers question={question} answer={answer} correct={correct} />

      {hasExplanation ? (
        <ExplanationBox text={question.explanation} image={question.explanationImage} accent={COLORS.blue600} textColor={COLORS.gray700} />
      ) : null}
    </Card>
  );
}

const cardStyle = {
  marginTop: 14,
  borderRadius: 18,
  borderColor: COLORS.gray200,
};

const optionRowStyle = {
  borderWidth: 1,
  borderRadius: 12,
  padding: 12,
  marginTop: 10,
};

const numericalBoxStyle = {
  marginTop: 10,
  padding: 14,
  borderRadius: 12,
  backgroundColor: COLORS.slate50,
  borderWidth: 1,
  borderColor: COLORS.gray200,
};
