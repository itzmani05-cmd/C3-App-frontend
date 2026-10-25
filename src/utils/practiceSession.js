import { evaluateAnswer, getCorrectOptionIndex } from './questionFormat.js';

// Helpers for the Practice screen, which loads a lesson's questions a page at a time and remembers where the student is.

export const PRACTICE_PAGE_SIZE = 25;

// The first question of the page that holds question `index`.
export function pageStartFor(index, pageSize = PRACTICE_PAGE_SIZE) {
  return Math.floor(Math.max(0, index) / pageSize) * pageSize;
}

// Questions loaded so far, by their place in the lesson. A page replaces whatever was there before.
export function mergePage(items, page) {
  const next = { ...items };
  (page?.questions || []).forEach((question, i) => {
    next[(page.offset || 0) + i] = question;
  });
  return next;
}

// A question counts as practised once the student has chosen or typed an answer, or looked at the answer.
export function hasPracticed(state) {
  if (!state) return false;
  const selected = Array.isArray(state.selected) ? state.selected : [];
  return Boolean(state.showAnswer) || selected.length > 0 || String(state.numerical ?? '').trim() !== '';
}

// What a lesson row says about its questions: "30 questions", or "12 of 30 practised" once the student has started.
export function questionCountLabel(lesson) {
  const total = Number(lesson?.questionCount) || 0;
  if (total === 0) return null;
  const practiced = Math.min(Number(lesson?.practicedCount) || 0, total);
  if (practiced === 0) return `${total} ${total === 1 ? 'question' : 'questions'}`;
  return practiced >= total ? `All ${total} practised` : `${practiced} of ${total} practised`;
}

// A practice card's state in the shape the quiz scoring expects.
function toAnswer(question, state) {
  if (question.answerType === 'multiple') return { selectedOptionIndexes: state.selected };
  if (question.answerType === 'numerical') return { selectedNumericalAnswer: state.numerical };
  return { selectedOptionIndex: state.selected[0] };
}

// Whether the question carries an answer to check against. Without one, Submit would call every attempt wrong.
export function canCheckAnswer(question) {
  if (question.answerType === 'multiple') return (question.correctOptionIndexes || []).length > 0;
  if (question.answerType === 'numerical') return String(question.numericalAnswer ?? '').trim() !== '';
  return getCorrectOptionIndex(question) >= 0;
}

// What Submit tells the student: whether they answered, and whether the answer is right.
export function checkPracticeAnswer(question, state) {
  return evaluateAnswer(question, toAnswer(question, state), getCorrectOptionIndex(question));
}
