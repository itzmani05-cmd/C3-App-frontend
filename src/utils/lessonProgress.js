// Counting completed lessons from the learning-path data (units -> topics -> lessons). A topic without lessons is itself
// a lesson ("direct quiz"). Units that came from the plain content list have no topics and give a total of 0.

function topicLessons(topic) {
  const subtopics = Array.isArray(topic?.subtopics) ? topic.subtopics : [];
  return topic?.isDirectLesson || subtopics.length === 0 ? [topic] : subtopics;
}

function summarise(lessons) {
  const total = lessons.length;
  const cleared = lessons.filter((lesson) => lesson?.isCleared).length;
  return { total, cleared, percent: total ? Math.round((cleared / total) * 100) : 0 };
}

export function unitProgress(unit) {
  const topics = Array.isArray(unit?.topics) ? unit.topics : [];
  return summarise(topics.flatMap(topicLessons));
}

export function topicProgress(topic) {
  return summarise(topicLessons(topic));
}

// The learning path as a flat list of lessons, in order, from the structured units.
export function flattenLessons(units) {
  return (Array.isArray(units) ? units : []).flatMap((unit) =>
    (unit.topics || []).flatMap((topic) =>
      topicLessons(topic).map((lesson) => ({
        unitName: unit.name,
        topicId: topic._id,
        topicName: topic.name,
        subtopicId: lesson === topic ? null : lesson._id,
        subtopicName: lesson === topic ? null : lesson.name,
        name: lesson.name,
        isUnlocked: !!lesson.isUnlocked,
        isCleared: !!lesson.isCleared,
        isMastered: !!lesson.isMastered,
        bestScore: lesson.bestScore || 0,
        lastAttempted: lesson.lastAttempted || null,
      }))
    )
  );
}

/**
 * Chooses what Home suggests: pick up the lesson attempted most recently if it is still open ('resume'), otherwise the
 * first unlocked lesson not yet cleared ('next', or 'start' for a brand-new student). Null when there is nothing to do.
 */
export function pickContinueLesson(lessons) {
  const last = lessons
    .filter((lesson) => lesson.lastAttempted)
    .sort((a, b) => new Date(b.lastAttempted) - new Date(a.lastAttempted))[0];

  if (last && !last.isCleared && last.isUnlocked) return { kind: 'resume', lesson: last };

  const next = lessons.find((lesson) => lesson.isUnlocked && !lesson.isCleared);
  if (next) return { kind: last ? 'next' : 'start', lesson: next };

  return null;
}
