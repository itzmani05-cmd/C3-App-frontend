import test from 'node:test';
import assert from 'node:assert/strict';
import { canCheckAnswer, checkPracticeAnswer, hasPracticed, mergePage, pageStartFor, questionCountLabel } from '../src/utils/practiceSession.js';

test('pageStartFor gives the first question of the page that holds an index', () => {
  assert.equal(pageStartFor(0), 0);
  assert.equal(pageStartFor(24), 0);
  assert.equal(pageStartFor(25), 25);
  assert.equal(pageStartFor(61), 50);
  assert.equal(pageStartFor(-4), 0);
});

test('mergePage places questions by their position and keeps the ones already loaded', () => {
  const first = mergePage({}, { offset: 7, questions: [{ _id: 'a' }, { _id: 'b' }] });
  assert.deepEqual(Object.keys(first), ['7', '8']);
  const second = mergePage(first, { offset: 0, questions: [{ _id: 'z' }] });
  assert.equal(second[0]._id, 'z');
  assert.equal(second[8]._id, 'b');
  assert.deepEqual(mergePage(first, null), first);
});

test('hasPracticed is true once an answer was chosen, typed or revealed', () => {
  assert.equal(hasPracticed(undefined), false);
  assert.equal(hasPracticed({ selected: [], numerical: '', showAnswer: false }), false);
  assert.equal(hasPracticed({ selected: [2], numerical: '', showAnswer: false }), true);
  assert.equal(hasPracticed({ selected: [], numerical: ' 12.5 ', showAnswer: false }), true);
  assert.equal(hasPracticed({ selected: [], numerical: '   ', showAnswer: false }), false);
  assert.equal(hasPracticed({ selected: [], numerical: '', showAnswer: true }), true);
});

test('questionCountLabel shows the size of a lesson and the student progress through it', () => {
  assert.equal(questionCountLabel({}), null);
  assert.equal(questionCountLabel({ questionCount: 0 }), null);
  assert.equal(questionCountLabel({ questionCount: 1 }), '1 question');
  assert.equal(questionCountLabel({ questionCount: 30 }), '30 questions');
  assert.equal(questionCountLabel({ questionCount: 30, practicedCount: 12 }), '12 of 30 practised');
  assert.equal(questionCountLabel({ questionCount: 30, practicedCount: 30 }), 'All 30 practised');
  assert.equal(questionCountLabel({ questionCount: 5, practicedCount: 9 }), 'All 5 practised');
});

const single = { answerType: 'single', options: ['a', 'b', 'c'], correctAnswer: 1 };
const multiple = { answerType: 'multiple', options: ['a', 'b', 'c'], correctOptionIndexes: [0, 2] };
const numerical = { answerType: 'numerical', numericalAnswer: '12.5' };

test('checkPracticeAnswer marks a single choice right or wrong, and not answered when nothing is chosen', () => {
  assert.deepEqual(checkPracticeAnswer(single, { selected: [1] }), { answered: true, correct: true });
  assert.deepEqual(checkPracticeAnswer(single, { selected: [2] }), { answered: true, correct: false });
  assert.deepEqual(checkPracticeAnswer(single, { selected: [] }), { answered: false, correct: false });
});

test('checkPracticeAnswer needs every right option and no others for a multiple choice', () => {
  assert.equal(checkPracticeAnswer(multiple, { selected: [2, 0] }).correct, true);
  assert.equal(checkPracticeAnswer(multiple, { selected: [0] }).correct, false);
  assert.equal(checkPracticeAnswer(multiple, { selected: [0, 1, 2] }).correct, false);
  assert.equal(checkPracticeAnswer(multiple, { selected: [] }).answered, false);
});

test('checkPracticeAnswer compares numbers by value and ignores spaces', () => {
  assert.equal(checkPracticeAnswer(numerical, { numerical: ' 12.50 ' }).correct, true);
  assert.equal(checkPracticeAnswer(numerical, { numerical: '12' }).correct, false);
  assert.deepEqual(checkPracticeAnswer(numerical, { numerical: '  ' }), { answered: false, correct: false });
});

test('canCheckAnswer is false for a question that has no answer to check against', () => {
  assert.equal(canCheckAnswer(single), true);
  assert.equal(canCheckAnswer(multiple), true);
  assert.equal(canCheckAnswer(numerical), true);
  assert.equal(canCheckAnswer({ answerType: 'single', options: ['a', 'b'] }), false);
  assert.equal(canCheckAnswer({ answerType: 'multiple', options: ['a'], correctOptionIndexes: [] }), false);
  assert.equal(canCheckAnswer({ answerType: 'numerical', numericalAnswer: '' }), false);
});
