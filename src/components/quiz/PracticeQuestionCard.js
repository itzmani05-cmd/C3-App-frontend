import React from 'react';
import { View } from 'react-native';
import { Check, X } from '../../icons';
import AppText from '../ui/AppText';
import AppButton from '../ui/AppButton';
import BilingualText from '../ui/BilingualText';
import Card from '../ui/Card';
import QuestionImage from '../question/QuestionImage';
import BookmarkButton from '../question/BookmarkButton';
import CalculatorToggle from '../question/CalculatorToggle';
import ReportQuestionButton from '../question/ReportQuestionButton';
import ChoiceOption, { MultiSelectHint } from '../question/ChoiceOption';
import ExplanationBox from '../question/ExplanationBox';
import NumericalAnswerInput from '../question/NumericalAnswerInput';
import FormattedQuestionText from './FormattedQuestionText';
import { getCorrectOptionIndex, getOptionText } from '../../utils/questionFormat';
import { canCheckAnswer, checkPracticeAnswer } from '../../utils/practiceSession';
import { COLORS, tw } from '../../theme';

function correctIndexesOf(question) {
  if (question.answerType === 'multiple') return question.correctOptionIndexes || [];
  return [getCorrectOptionIndex(question)];
}

export const EMPTY_PRACTICE_STATE = { selected: [], numerical: '', showAnswer: false, submitted: false };

// The line under the answers once Submit is pressed.
function ResultMessage({ correct }) {
  const color = correct ? COLORS.green600 : COLORS.red600;
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        tw`mt-1 mb-1 flex-row items-center rounded-xl border px-3.5 py-2.5`,
        { borderColor: correct ? COLORS.green300 : COLORS.red300, backgroundColor: correct ? COLORS.green50 : COLORS.red50 },
      ]}
    >
      {correct ? <Check size={16} color={color} strokeWidth={3} /> : <X size={16} color={color} strokeWidth={3} />}
      <AppText variant="bold" style={[tw`ml-2 flex-1 text-[13px]`, { color }]}>
        {correct ? 'Correct!' : 'Not quite. Change your answer and submit again, or tap Show Answer.'}
      </AppText>
    </View>
  );
}

// Controlled: the screen owns `state` so a question keeps its selection and revealed answer while you move around.
export default function PracticeQuestionCard({ question, index, state = EMPTY_PRACTICE_STATE, onChange, reportContext, bookmarked = false, onToggleBookmark, onOpenCalculator }) {
  const { selected, numerical, showAnswer, submitted } = state;

  const multiple = question.answerType === 'multiple';
  const numericalType = question.answerType === 'numerical';
  const correctIndexes = correctIndexesOf(question);
  const hasExplanation = question.explanation || question.explanationImage;

  // Submit checks the answer the student has chosen against the right one. Changing the answer afterwards clears the
  // result, so the colours always belong to the answer on screen.
  const checkable = canCheckAnswer(question);
  const { answered, correct } = checkPracticeAnswer(question, state);
  const result = submitted && answered ? { correct } : null;

  const pick = (optionIndex) => {
    if (!multiple) return onChange({ selected: [optionIndex], submitted: false });
    onChange({
      selected: selected.includes(optionIndex) ? selected.filter((i) => i !== optionIndex) : [...selected, optionIndex],
      submitted: false,
    });
  };

  return (
    <Card elevation="sm" style={tw`mb-2`}>
      <View style={tw`mb-3`}>
        <View style={tw`flex-row items-center justify-between mb-2.5`}>
          <AppText variant="bold" style={[tw`text-xs text-brand-700`, { letterSpacing: 0.8 }]}>
            QUESTION {index + 1}
          </AppText>
          <View style={tw`flex-row items-center`}>
            {onOpenCalculator ? <CalculatorToggle onPress={onOpenCalculator} style={tw`mr-4`} /> : null}
            {onToggleBookmark ? <BookmarkButton bookmarked={bookmarked} onPress={onToggleBookmark} style={tw`mr-4`} /> : null}
            <ReportQuestionButton questionId={question._id} number={index + 1} source="practice" context={reportContext} />
          </View>
        </View>
        <FormattedQuestionText text={question.questionText || question.question} />
      </View>

      {question.questionImage ? <QuestionImage uri={question.questionImage} /> : null}

      {numericalType ? (
        <NumericalAnswerInput
          value={numerical}
          onChange={(text) => onChange({ numerical: text, submitted: false })}
          style={[
            tw`mt-1 border-gray-200`,
            result ? { borderColor: result.correct ? COLORS.green300 : COLORS.red300, backgroundColor: result.correct ? COLORS.green50 : COLORS.red50 } : null,
          ]}
        />
      ) : (
        <>
          {(question.options || []).map((option, optionIndex) => {
            const chosen = selected.includes(optionIndex);
            const revealed = showAnswer && correctIndexes.includes(optionIndex);
            return (
              <ChoiceOption
                key={optionIndex}
                index={optionIndex}
                text={getOptionText(option)}
                image={question.optionImages?.[optionIndex]}
                palette="blue"
                multiple={multiple}
                showLetter={multiple}
                selected={chosen}
                correct={revealed || (!!result?.correct && chosen)}
                incorrect={!!result && !result.correct && chosen && !revealed}
                onPress={() => pick(optionIndex)}
              />
            );
          })}
          {multiple ? <MultiSelectHint style={tw`text-gray-500 mt-0.5 mb-1`} /> : null}
        </>
      )}

      {result ? <ResultMessage correct={result.correct} /> : null}

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

      {checkable ? (
        <AppButton
          label={submitted && answered ? 'Submitted' : 'Submit'}
          disabled={!answered || submitted}
          onPress={() => onChange({ submitted: true })}
          style={tw`mt-3.5`}
        />
      ) : null}
      <AppButton
        label={showAnswer ? 'Hide Answer' : 'Show Answer'}
        tone="secondary"
        onPress={() => onChange({ showAnswer: !showAnswer })}
        style={tw`mt-2.5`}
      />
    </Card>
  );
}
