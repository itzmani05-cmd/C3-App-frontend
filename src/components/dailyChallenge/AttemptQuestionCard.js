import React from 'react';
import AppText from '../ui/AppText';
import FormattedQuestionText from '../quiz/FormattedQuestionText';
import Card from '../ui/Card';
import QuestionImage from '../question/QuestionImage';
import ChoiceOption, { MultiSelectHint } from '../question/ChoiceOption';
import NumericalAnswerInput from '../question/NumericalAnswerInput';
import { COLORS } from '../../theme';

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
    <Card elevation="md" style={{ marginBottom: 16 }}>
      <AppText variant="bold" style={{ fontSize: 15, marginBottom: 8, color: COLORS.slate900 }}>
        Question {index + 1} of {total}
      </AppText>
      <FormattedQuestionText text={question.questionText} color={COLORS.slate700} />
      <QuestionImage uri={question.questionImage} height={180} />
      <Answers question={question} {...handlers} />
    </Card>
  );
}
