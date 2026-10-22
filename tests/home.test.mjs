import test from 'node:test';
import assert from 'node:assert/strict';
import { flattenLessons, pickContinueLesson, topicProgress, unitProgress } from '../src/utils/lessonProgress.js';
import { formatCountdown } from '../src/utils/format.js';

const lesson = (name, extra = {}) => ({ name, isUnlocked: true, isCleared: false, bestScore: 0, lastAttempted: null, ...extra });

test('a topic with lessons counts its lessons; a direct-quiz topic counts as one lesson', () => {
  const unit = {
    topics: [
      { _id: 't1', name: 'Beams', isDirectLesson: false, subtopics: [lesson('a', { isCleared: true }), lesson('b'), lesson('c', { isCleared: true })] },
      { _id: 't2', name: 'Columns', isDirectLesson: true, subtopics: [], isCleared: false },
    ],
  };
  assert.deepEqual(unitProgress(unit), { total: 4, cleared: 2, percent: 50 });
  assert.deepEqual(topicProgress(unit.topics[0]), { total: 3, cleared: 2, percent: 67 });
  assert.deepEqual(topicProgress(unit.topics[1]), { total: 1, cleared: 0, percent: 0 });
});

test('a unit from the plain content list (no topics) has no progress to show', () => {
  assert.deepEqual(unitProgress({ name: 'Unit' }), { total: 0, cleared: 0, percent: 0 });
});

test('flattenLessons keeps order and tells topic lessons from subtopic lessons', () => {
  const units = [
    {
      name: 'Unit 1',
      topics: [
        { _id: 't1', name: 'Beams', isDirectLesson: false, subtopics: [{ _id: 's1', name: 'Bending', isUnlocked: true }] },
        { _id: 't2', name: 'Columns', isDirectLesson: true, subtopics: [], isUnlocked: false },
      ],
    },
  ];
  const lessons = flattenLessons(units);
  assert.equal(lessons.length, 2);
  assert.equal(lessons[0].subtopicId, 's1');
  assert.equal(lessons[0].topicName, 'Beams');
  assert.equal(lessons[1].subtopicId, null);
  assert.equal(lessons[1].isUnlocked, false);
});

test('Home resumes the most recently attempted lesson while it is still open', () => {
  const lessons = [
    lesson('old', { lastAttempted: '2026-01-01T10:00:00Z' }),
    lesson('latest', { lastAttempted: '2026-03-01T10:00:00Z' }),
    lesson('fresh'),
  ];
  const pick = pickContinueLesson(lessons);
  assert.equal(pick.kind, 'resume');
  assert.equal(pick.lesson.name, 'latest');
});

test('once the last lesson is cleared, Home suggests the next open one', () => {
  const lessons = [
    lesson('done', { isCleared: true, lastAttempted: '2026-03-01T10:00:00Z' }),
    lesson('locked', { isUnlocked: false }),
    lesson('next'),
  ];
  const pick = pickContinueLesson(lessons);
  assert.equal(pick.kind, 'next');
  assert.equal(pick.lesson.name, 'next');
});

test('a brand-new student is told to start; a student with nothing left gets no suggestion', () => {
  assert.equal(pickContinueLesson([lesson('first'), lesson('second', { isUnlocked: false })]).kind, 'start');
  assert.equal(pickContinueLesson([lesson('a', { isCleared: true, lastAttempted: '2026-03-01T10:00:00Z' })]), null);
  assert.equal(pickContinueLesson([]), null);
});

test('the countdown shows days, hours, minutes and then seconds', () => {
  const at = (ms) => new Date(Date.now() + ms).toISOString();
  assert.match(formatCountdown(at(2 * 86400000 + 3 * 3600000 + 5000)), /^2d 3h left$/);
  assert.match(formatCountdown(at(5 * 3600000 + 20 * 60000 + 5000)), /^5h 20m left$/);
  assert.match(formatCountdown(at(42 * 60000 + 18000 + 500)), /^42m 1[78]s left$/);
  assert.equal(formatCountdown(at(-1000)), 'Expired');
  assert.equal(formatCountdown('not a date'), 'Expired');
});
