import api from './client';
import { networkFirst } from '../utils/offlineCache';

const asArray = (value) => (Array.isArray(value) ? value : []);

export async function getUnits(examId) {
  const { data } = await api.get('/api/content/units', { params: examId ? { examId } : {} });
  return asArray(data);
}

export async function getTopics(unitId) {
  const { data } = await api.get(`/api/content/topics/${unitId}`);
  return asArray(data);
}

export async function getSubtopics(topicId) {
  const { data } = await api.get(`/api/content/subtopics/${topicId}`);
  return asArray(data);
}

export async function getLearningPath(examId) {
  const { data } = await api.get('/api/content/path', { params: examId ? { examId } : {} });
  return { units: asArray(data?.units), lessons: asArray(data?.lessons) };
}

export async function getNextLesson(topicId, subtopicId) {
  const { data } = await api.get('/api/content/next-lesson', { params: { topicId, subtopicId } });
  return data || null;
}

export async function getQuiz({ topicId, subtopicId, sessionId }) {
  const url = subtopicId ? `/api/quiz/subtopic/${subtopicId}` : `/api/quiz/topic/${topicId}`;
  const { data } = await api.get(url, { params: sessionId ? { sessionId } : undefined });
  return data;
}

// Practice questions are a random sample, so they are not refreshed in the background: the saved set is only used
// when the request fails, which lets a lesson that was opened before be practised offline.
export function getPracticeQuestions({ topicId, subtopicId }) {
  return networkFirst(`practice:${subtopicId || topicId}`, async (options) => {
    const { data } = await api.get('/api/quiz/practice', {
      ...options,
      params: subtopicId ? { subtopicId } : { topicId },
    });
    return asArray(data?.questions);
  });
}

// One page of a lesson's practice questions in a fixed order, with the student's saved place. Without an `offset` the
// page starts where the student left off. Pages are saved so a lesson opened before can be practised offline.
export function getPracticeLesson({ topicId, subtopicId, offset, limit }) {
  const lessonId = subtopicId || topicId;
  return networkFirst(`practice-lesson:${lessonId}:${offset ?? 'resume'}:${limit ?? ''}`, async (options) => {
    const { data } = await api.get('/api/quiz/practice/lesson', {
      ...options,
      params: { ...(subtopicId ? { subtopicId } : { topicId }), ...(offset !== undefined ? { offset } : {}), ...(limit ? { limit } : {}) },
    });
    return { ...data, questions: asArray(data?.questions), practicedIds: asArray(data?.practicedIds) };
  });
}

export async function savePracticeProgress({ topicId, subtopicId, questionIds, position }) {
  const { data } = await api.post('/api/quiz/practice/progress', { topicId, subtopicId, questionIds, position });
  return data;
}

export async function recordTry({ sessionId, questionId }) {
  const { data } = await api.post('/api/quiz/try', { sessionId, questionId });
  return data;
}

export async function submitQuiz(payload) {
  const { data } = await api.post('/api/quiz/submit', payload);
  return data;
}

export async function getLearningUnits(examId) {
  try {
    const { units } = await getLearningPath(examId);
    if (units.length > 0) return units;
  } catch (err) {
    console.log('Learning path fetch error:', err?.message || err);
  }
  const units = await getUnits(examId);
  return units.map((unit) => ({ ...unit, isUnlocked: true, isCleared: false }));
}

async function buildUnitFromContent(unitId, unitName) {
  const topics = await getTopics(unitId);
  const withSubtopics = await Promise.all(
    topics.map(async (topic, index) => {
      const subtopics = await getSubtopics(topic._id);
      return {
        ...topic,
        isUnlocked: index === 0,
        isCleared: false,
        isDirectLesson: subtopics.length === 0,
        subtopics: subtopics.map((subtopic, subIndex) => ({
          ...subtopic,
          isUnlocked: index === 0 && subIndex === 0,
          isCleared: false,
        })),
      };
    })
  );
  return { _id: unitId, name: unitName || 'Unit', topics: withSubtopics };
}

export async function getUnitWithTopics(unitId, unitName) {
  try {
    const { units } = await getLearningPath();
    const unit = units.find((item) => String(item?._id) === String(unitId));
    if (unit) return unit;
  } catch (err) {
    console.log('Learning path fetch error:', err?.message || err);
  }
  return buildUnitFromContent(unitId, unitName);
}
