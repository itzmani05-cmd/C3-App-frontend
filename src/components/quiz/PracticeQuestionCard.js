import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import AppButton from '../ui/AppButton';
import BilingualText from '../ui/BilingualText';
import Card from '../ui/Card';
import QuestionImage from '../question/QuestionImage';
import ChoiceOption, { MultiSelectHint } from '../question/ChoiceOption';
import ExplanationBox from '../question/ExplanationBox';
import NumericalAnswerInput from '../question/NumericalAnswerInput';
import FormattedQuestionText from './FormattedQuestionText';
import { getCorrectOptionIndex, getOptionText } from '../../utils/questionFormat';
import { COLORS, tw } from '../../theme';

function correctIndexesOf(question) {
  if (question.answerType === 'multiple') return question.correctOptionIndexes || [];
  return [getCorrectOptionIndex(question)];
}

export const EMPTY_PRACTICE_STATE = { selected: [], numerical: '', showAnswer: false };

// Controlled: the screen owns `state` so a question keeps its selection and revealed answer while you move around.
export default function PracticeQuestionCard({ question, index, state = EMPTY_PRACTICE_STATE, onChange }) {
  const { selected, numerical, showAnswer } = state;

  const multiple = question.answerType === 'multiple';
  const numericalType = question.answerType === 'numerical';
  const correctIndexes = correctIndexesOf(question);
  const hasExplanation = question.explanation || question.explanationImage;

  const pick = (optionIndex) => {
    if (!multiple) return onChange({ selected: [optionIndex] });
    onChange({ selected: selected.includes(optionIndex) ? selected.filter((i) => i !== optionIndex) : [...selected, optionIndex] });
  };

  return (
    <Card elevation="sm" style={tw`mb-2`}>
      <View style={tw`mb-3`}>
        <AppText variant="bold" style={[tw`mb-2.5 text-xs text-brand-700`, { letterSpacing: 0.8 }]}>
          QUESTION {index + 1}
        </AppText>
        <FormattedQuestionText text={question.questionText || question.question} />
      </View>

      {question.questionImage ? <QuestionImage uri={question.questionImage} /> : null}

      {numericalType ? (
        <NumericalAnswerInput value={numerical} onChange={(text) => onChange({ numerical: text })} style={tw`mt-1 border-gray-200`} />
      ) : (
        <>
          {(question.options || []).map((option, optionIndex) => (
            <ChoiceOption
              key={optionIndex}
              index={optionIndex}
              text={getOptionText(option)}
              image={question.optionImages?.[optionIndex]}
              palette="blue"
              multiple={multiple}
              showLetter={multiple}
              selected={selected.includes(optionIndex)}
              correct={showAnswer && correctIndexes.includes(optionIndex)}
              onPress={() => pick(optionIndex)}
            />
          ))}
          {multiple ? <MultiSelectHint style={tw`text-gray-500 mt-0.5 mb-1`} /> : null}
        </>
      )}

      {showAnswer ? (
        <>
          {numericalType ? (
            <View style={tw`mt-2.5 p-3.5 rounded-xl bg-slate-50 border border-gray-200`}>
              <AppText variant="medium" style={tw`text-gray-500 text-xs`}>
                Correct answer
              </AppText>
              <BilingualText variant="bold" style={tw`mt-1 text-base text-blue-700`}>
                {question.numericalAnswer}
              </BilingualText>
            </View>
          ) : null}
          {hasExplanation ? (
            <ExplanationBox text={question.explanation} image={question.explanationImage} accent={COLORS.brand600} textColor={COLORS.gray700} />
          ) : null}
        </>
      ) : null}

      <AppButton
        label={showAnswer ? 'Hide Answer' : 'Show Answer'}
        tone="secondary"
        onPress={() => onChange({ showAnswer: !showAnswer })}
        style={tw`mt-3.5`}
      />
    </Card>
  );
}
