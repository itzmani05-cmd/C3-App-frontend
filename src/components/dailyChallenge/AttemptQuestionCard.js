import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import FormattedQuestionText from '../quiz/FormattedQuestionText';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import QuestionImage from '../question/QuestionImage';
import ReportQuestionButton from '../question/ReportQuestionButton';
import ChoiceOption, { MultiSelectHint } from '../question/ChoiceOption';
import NumericalAnswerInput from '../question/NumericalAnswerInput';
import { COLORS, tw } from '../../theme';

function Answers({ question, answer, onSelect, onToggle, onNumericalChange }) {
  const id = question.questionId;

  if (question.answerType === 'numerical') {
    return <NumericalAnswerInput value={answer?.selectedNumericalAnswer || ''} onChange={(text) => onNumericalChange(id, text)} />;
  }

  const multiple = question.answerType === 'multiple';
  const selectedIndexes = answer?.selectedOptionIndexes || [];

  return (
    <>
      {(question.options || []).map((option, index) => (
        <ChoiceOption
          key={index}
          index={index}
          text={option}
          image={question.optionImages?.[index]}
          multiple={multiple}
          selected={multiple ? selectedIndexes.includes(index) : answer?.selectedOptionIndex === index}
          onPress={() => (multiple ? onToggle(id, index) : onSelect(id, index))}
        />
      ))}
      {multiple ? <MultiSelectHint /> : null}
    </>
  );
}

export default function AttemptQuestionCard({ question, index, total, ...handlers }) {
  return (
    <Card elevation="sm" style={tw`mb-4`}>
      <View style={tw`flex-row items-center justify-between`}>
        <AppText variant="bold" style={tw`text-[13px] text-brand-700`}>
          Question {index + 1} of {total}
        </AppText>
        <ReportQuestionButton questionId={question.questionId} number={index + 1} source="daily" context="Daily Challenge" />
      </View>
      <ProgressBar value={((index + 1) / total) * 100} height={4} color={COLORS.brand600} style={tw`mt-2 mb-3`} />
      <FormattedQuestionText text={question.questionText} color={COLORS.slate700} />
      <QuestionImage uri={question.questionImage} height={180} />
      <Answers question={question} {...handlers} />
    </Card>
  );
}
