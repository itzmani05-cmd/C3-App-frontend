import test from 'node:test';
import assert from 'node:assert/strict';
import { hasPracticed, mergePage, pageStartFor, questionCountLabel } from '../src/utils/practiceSession.js';

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
