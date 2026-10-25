import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import QuestionImage from '../question/QuestionImage';
import ReportQuestionButton from '../question/ReportQuestionButton';
import ChoiceOption, { MultiSelectHint } from '../question/ChoiceOption';
import NumericalAnswerInput from '../question/NumericalAnswerInput';
import FormattedQuestionText from './FormattedQuestionText';
import AttemptStatus from './AttemptStatus';
import { getOptionText } from '../../utils/questionFormat';
import { COLORS, tw } from '../../theme';

const MAX_ATTEMPTS = 3;

function SingleChoice({ question, answer, onSelect }) {
  const attempts = answer?.attempts || 0;
  const locked = attempts >= MAX_ATTEMPTS;
  const revealed = !!answer?.revealedAfterAttempts;
  // Once the server reveals the answer, the revealed option is stored as the selection.
  const correctIndex = revealed ? answer.selectedOptionIndex : -1;

  return (
    <>
      {(question.options || []).map((option, index) => {
        const isCorrect = locked && index === correctIndex;
        const isSelected = answer?.selectedOptionIndex === index;
        return (
          <ChoiceOption
            key={index}
            index={index}
            text={getOptionText(option)}
            palette="blue"
            selected={isSelected}
            correct={isCorrect}
            dimmed={locked && revealed && !isCorrect && !isSelected}
            disabled={locked}
            onPress={() => onSelect(question._id, index)}
          />
        );
      })}
      <AttemptStatus attempts={attempts} revealed={revealed} />
    </>
  );
}

function MultipleChoice({ question, answer, onToggle }) {
  const selected = answer?.selectedOptionIndexes || [];
  return (
    <>
      {(question.options || []).map((option, index) => (
        <ChoiceOption
          key={index}
          index={index}
          text={getOptionText(option)}
          palette="blue"
          multiple
          showLetter
          selected={selected.includes(index)}
          onPress={() => onToggle(question._id, index)}
        />
      ))}
      <MultiSelectHint style={{ color: COLORS.gray500, marginTop: 2, marginBottom: 4 }} />
    </>
  );
}

export default function QuizQuestionCard({ question, index, answer, onSelect, onToggle, onNumericalChange, reportContext }) {
  return (
    <Card elevation="sm" style={tw`mb-4`}>
      <View style={tw`mb-3`}>
        <View style={tw`flex-row items-center justify-between mb-2.5`}>
          <AppText variant="bold" style={[tw`text-xs text-brand-700`, { letterSpacing: 0.8 }]}>
            QUESTION {index + 1}
          </AppText>
          <ReportQuestionButton questionId={question._id} number={index + 1} source="quiz" context={reportContext} />
        </View>
        <FormattedQuestionText text={question.questionText || question.question} />
      </View>

      {question.questionImage ? <QuestionImage uri={question.questionImage} /> : null}

      {question.answerType === 'multiple' ? (
        <MultipleChoice question={question} answer={answer} onToggle={onToggle} />
      ) : question.answerType === 'numerical' ? (
        <NumericalAnswerInput
          value={answer?.selectedNumericalAnswer || ''}
          onChange={(text) => onNumericalChange(question._id, text)}
          style={{ marginTop: 4, borderColor: COLORS.slate200 }}
        />
      ) : (
        <SingleChoice question={question} answer={answer} onSelect={onSelect} />
      )}
    </Card>
  );
}

