import api from './client';

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
