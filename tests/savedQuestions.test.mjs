import test from 'node:test';
import assert from 'node:assert/strict';
import { filterSaved, isNearSavedLimit, savedCountLabel } from '../src/utils/savedQuestions.js';

const questions = [
  { _id: '1', questionText: 'A car speeds up from rest. Find its acceleration.', lessonName: 'Kinematics', options: ['2 m/s²', { text: '4 m/s²' }] },
  { _id: '2', question: 'Which lens corrects short sight?', lessonName: 'Optics', options: ['Concave', 'Convex'] },
  { _id: '3', questionText: 'State Newton’s second law.', options: [] },
];

const ids = (list) => list.map((question) => question._id);

test('an empty search keeps every question', () => {
  assert.equal(filterSaved(questions, ''), questions);
  assert.equal(filterSaved(questions, '   '), questions);
});

test('search looks in the question, its options and the lesson name, ignoring case', () => {
  assert.deepEqual(ids(filterSaved(questions, 'ACCELERATION')), ['1']);
  assert.deepEqual(ids(filterSaved(questions, 'concave')), ['2']);
  assert.deepEqual(ids(filterSaved(questions, 'optics')), ['2']);
  assert.deepEqual(ids(filterSaved(questions, '4 m/s')), ['1'], 'text inside an option object is searched too');
  assert.deepEqual(ids(filterSaved(questions, 'newton')), ['3'], 'a question with no lesson name still matches');
});

test('every word must match, in any order', () => {
  assert.deepEqual(ids(filterSaved(questions, 'kinematics car')), ['1']);
  assert.deepEqual(ids(filterSaved(questions, 'car lens')), []);
  assert.deepEqual(ids(filterSaved(questions, 'nothing like this')), []);
});

test('the saved count shows the limit when the server sends one', () => {
  assert.equal(savedCountLabel(42, 300), '42 of 300 saved to revise');
  assert.equal(savedCountLabel(300, 300), '300 of 300 saved. Remove one to save another.');
  assert.equal(savedCountLabel(7, undefined), '7 saved to revise');
  assert.equal(savedCountLabel(0, 300), '0 of 300 saved to revise');
});

test('the count is flagged once the list is nearly full', () => {
  assert.equal(isNearSavedLimit(269, 300), false);
  assert.equal(isNearSavedLimit(270, 300), true);
  assert.equal(isNearSavedLimit(300, 300), true);
  assert.equal(isNearSavedLimit(50, 0), false, 'no limit, nothing to be near');
});
