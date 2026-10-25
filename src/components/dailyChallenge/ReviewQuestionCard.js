import React from 'react';
import { View } from 'react-native';
import { Check } from '../../icons';
import AppText from '../ui/AppText';
import BilingualText from '../ui/BilingualText';
import FormattedQuestionText from '../quiz/FormattedQuestionText';
import Card from '../ui/Card';
import QuestionImage from '../question/QuestionImage';
import AnswerStatusPill from '../question/AnswerStatusPill';
import ReportQuestionButton from '../question/ReportQuestionButton';
import ExplanationBox from '../question/ExplanationBox';
import { optionLetter } from '../question/ChoiceOption';
import { evaluateAnswer } from '../../utils/questionFormat';
import { COLORS, tw } from '../../theme';

function isCorrectOption(question, optionIndex) {
  if (question.answerType === 'multiple') return (question.correctOptionIndexes || []).includes(optionIndex);
  return optionIndex === question.correctOptionIndex;
}

function isSelectedOption(question, optionIndex) {
  if (question.answerType === 'multiple') return (question.selectedOptionIndexes || []).includes(optionIndex);
  return question.selectedOptionIndex === optionIndex;
}

function ReviewOption({ index, text, correct, selected }) {
  const wrong = selected && !correct;
  return (
    <View
      style={[
        tw`mt-2.5 flex-row items-start rounded-lg border p-3`,
        correct
          ? { borderColor: COLORS.green300, backgroundColor: COLORS.green50 }
          : wrong
            ? { borderColor: COLORS.red300, backgroundColor: COLORS.red50 }
            : { borderColor: COLORS.slate200, backgroundColor: COLORS.white },
      ]}
    >
      <View style={tw`flex-1`}>
        <BilingualText variant="medium" style={tw`text-slate-700`}>
          {optionLetter(index)}. {text}
        </BilingualText>
        {correct || wrong ? (
          <AppText variant="bold" style={[tw`mt-1 text-xs`, { color: correct ? COLORS.green600 : COLORS.red600 }]}>
            {correct ? (selected ? 'Your answer · Correct' : 'Correct answer') : 'Your answer'}
          </AppText>
        ) : null}
      </View>
      {correct ? <Check size={18} color={COLORS.green600} /> : null}
    </View>
  );
}

function NumericalAnswer({ value }) {
  return (
    <View style={tw`mt-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3`}>
      <AppText variant="medium" style={tw`text-xs text-slate-500`}>
        Correct answer
      </AppText>
      <AppText variant="bold" style={[tw`mt-1 text-base`, { color: COLORS.success600 }]}>
        {value}
      </AppText>
    </View>
  );
}

export default function ReviewQuestionCard({ question, index, dateLabel }) {
  const { answered, correct } = evaluateAnswer(question, question);

  return (
    <Card elevation="sm" style={tw`mb-4`}>
      <View style={tw`flex-row justify-between items-start`}>
        <View style={tw`flex-1 mr-3`}>
          <AppText variant="bold" style={tw`text-[15px] text-slate-900`}>
            Question {index + 1}
          </AppText>
          {dateLabel ? (
            <AppText variant="medium" style={tw`mt-0.5 text-xs text-slate-500`}>
              {dateLabel}
            </AppText>
          ) : null}
        </View>
        <View style={tw`items-end`}>
          <AnswerStatusPill answered={answered} correct={correct} />
          <ReportQuestionButton
            questionId={question.questionId}
            number={index + 1}
            source="review"
            context={dateLabel ? `Daily Challenge ${dateLabel}` : 'Daily Challenge'}
            style={tw`mt-2`}
          />
        </View>
      </View>

      <View style={tw`mt-2`}>
        <FormattedQuestionText text={question.questionText} fontSize={14} lineHeight={21} color={COLORS.slate700} />
      </View>
      <QuestionImage uri={question.questionImage} height={160} />

      {question.answerType === 'numerical' ? (
        <NumericalAnswer value={question.numericalAnswer} />
      ) : (
        (question.options || []).map((option, optionIndex) => (
          <ReviewOption
            key={optionIndex}
            index={optionIndex}
            text={option}
            correct={isCorrectOption(question, optionIndex)}
            selected={isSelectedOption(question, optionIndex)}
          />
        ))
      )}

      <ExplanationBox text={question.explanation || 'No explanation provided.'} image={question.explanationImage} />
    </Card>
  );
}
