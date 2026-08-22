import axios from 'axios';
import { API_BASE_URL } from '../config/api';

function sortBySequence(left, right) {
  const leftSequence = Number.isFinite(Number(left?.order))
    ? Number(left.order)
    : 0;
  const rightSequence = Number.isFinite(Number(right?.order))
    ? Number(right.order)
    : 0;

  if (leftSequence !== rightSequence) {
    return leftSequence - rightSequence;
  }

  return String(left?.name || '').localeCompare(String(right?.name || ''), undefined, {
    sensitivity: 'base',
  });
}

function toIdString(value) {
  return value == null ? null : String(value);
}

function getLessonKey({ topicId, subtopicId }) {
  if (subtopicId) {
    return `subtopic:${toIdString(subtopicId)}`;
  }

  if (topicId) {
    return `topic:${toIdString(topicId)}`;
  }

  return null;
}

function buildProgressMap(progressDocs = []) {
  return new Map(
    progressDocs
      .map((item) => [getLessonKey(item), item])
      .filter(([key]) => Boolean(key))
  );
}

function groupById(items, keyName) {
  return items.reduce((acc, item) => {
    const key = toIdString(item?.[keyName]);
    if (!key) {
      return acc;
    }

    if (!acc.has(key)) {
      acc.set(key, []);
    }

    acc.get(key).push(item);
    return acc;
  }, new Map());
}

function buildContentTree(units = [], topics = [], subtopics = []) {
  const sortedUnits = [...units].sort(sortBySequence);
  const topicsByUnitId = groupById([...topics].sort(sortBySequence), 'unitId');
  const subtopicsByTopicId = groupById([...subtopics].sort(sortBySequence), 'topicId');

  const structuredUnits = [];
  const lessons = [];

  sortedUnits.forEach((unit) => {
    const unitId = toIdString(unit._id);
    const unitTopics = topicsByUnitId.get(unitId) || [];

    const structuredTopics = unitTopics.map((topic) => {
      const topicId = toIdString(topic._id);
      const topicSubtopics = subtopicsByTopicId.get(topicId) || [];

      const structuredSubtopics = topicSubtopics.map((subtopic) => {
        const lesson = {
          key: getLessonKey({ subtopicId: subtopic._id }),
          type: 'subtopic',
          unitId,
          unitName: unit.name || 'Unit',
          topicId,
          topicName: topic.name || 'Topic',
          subtopicId: toIdString(subtopic._id),
          subtopicName: subtopic.name || 'Subtopic',
          order: subtopic.order,
        };

        lessons.push(lesson);

        return {
          ...subtopic,
          key: lesson.key,
          unitId,
          topicId,
        };
      });

      if (structuredSubtopics.length === 0) {
        lessons.push({
          key: getLessonKey({ topicId: topic._id }),
          type: 'topic',
          unitId,
          unitName: unit.name || 'Unit',
          topicId,
          topicName: topic.name || 'Topic',
          subtopicId: null,
          subtopicName: null,
          order: topic.order,
        });
      }

      return {
        ...topic,
        unitId,
        key: getLessonKey({ topicId: topic._id }),
        isDirectLesson: structuredSubtopics.length === 0,
        subtopics: structuredSubtopics,
      };
    });

    structuredUnits.push({
      ...unit,
      unitId,
      topics: structuredTopics,
    });
  });

  return {
    units: structuredUnits,
    lessons,
  };
}

function applyProgressToTree(contentTree, progressDocs = []) {
  const progressMap = buildProgressMap(progressDocs);
  const lessonStateMap = new Map();
  const lessons = [];

  contentTree.lessons.forEach((lesson, index) => {
    const progressDoc = progressMap.get(lesson.key);
    const previousLesson = index > 0 ? lessons[index - 1] : null;

    const isFirstInUnit = !previousLesson || previousLesson.unitId !== lesson.unitId;

    const isCleared = Boolean(progressDoc?.isCleared);
    const isSequentiallyUnlocked =
      isFirstInUnit ||
      Boolean(previousLesson?.isCleared && previousLesson?.isSequentiallyUnlocked);

    const isUnlocked = isSequentiallyUnlocked || isCleared;

    const lessonState = {
      ...lesson,
      isSequentiallyUnlocked,
      isUnlocked,
      isCleared,
      isMastered: Boolean(progressDoc?.isMastered),
      bestScore: progressDoc?.bestScore || 0,
      lastAttempted: progressDoc?.lastAttempted || null,
    };

    lessons.push(lessonState);
    lessonStateMap.set(lesson.key, lessonState);
  });

  const units = contentTree.units.map((unit) => {
    const topics = unit.topics.map((topic) => {
      if (topic.subtopics.length > 0) {
        const normalizedSubtopics = topic.subtopics.map((subtopic) => {
          const lessonState = lessonStateMap.get(subtopic.key) || {};

          return {
            ...subtopic,
            isUnlocked: Boolean(lessonState.isUnlocked),
            isCleared: Boolean(lessonState.isCleared),
            isMastered: Boolean(lessonState.isMastered),
            bestScore: lessonState.bestScore || 0,
            lastAttempted: lessonState.lastAttempted || null,
          };
        });

        const firstLesson = normalizedSubtopics[0];

        return {
          ...topic,
          subtopics: normalizedSubtopics,
          isUnlocked: Boolean(
            firstLesson?.isUnlocked || normalizedSubtopics.some((item) => item.isCleared)
          ),
          isCleared:
            normalizedSubtopics.length > 0 &&
            normalizedSubtopics.every((item) => item.isCleared),
        };
      }

      const lessonState = lessonStateMap.get(topic.key) || {};

      return {
        ...topic,
        subtopics: [],
        isUnlocked: Boolean(lessonState.isUnlocked),
        isCleared: Boolean(lessonState.isCleared),
        isMastered: Boolean(lessonState.isMastered),
        bestScore: lessonState.bestScore || 0,
        lastAttempted: lessonState.lastAttempted || null,
      };
    });

    const unitLessons = lessons.filter((lesson) => lesson.unitId === unit.unitId);
    const firstUnitLesson = unitLessons[0];

    return {
      ...unit,
      topics,
      isUnlocked: Boolean(firstUnitLesson?.isUnlocked || unitLessons.some((item) => item.isCleared)),
      isCleared: unitLessons.length > 0 && unitLessons.every((item) => item.isCleared),
    };
  });

  return {
    units,
    lessons,
  };
}

async function fetchLegacyLearningPath(headers = {}) {
  const userId = headers?.userid;
  const unitsRes = await axios.get(`${API_BASE_URL}/api/content/units`);
  const units = Array.isArray(unitsRes.data) ? unitsRes.data : [];

  const topicsNested = await Promise.all(
    units.map(async (unit) => {
      const topicRes = await axios.get(`${API_BASE_URL}/api/content/topics/${unit._id}`);
      const topicItems = Array.isArray(topicRes.data) ? topicRes.data : [];

      const subtopicsNested = await Promise.all(
        topicItems.map(async (topic) => {
          const subtopicRes = await axios.get(`${API_BASE_URL}/api/content/subtopics/${topic._id}`);
          return Array.isArray(subtopicRes.data) ? subtopicRes.data : [];
        })
      );

      return {
        topics: topicItems,
        subtopics: subtopicsNested.flat(),
      };
    })
  );

  const topics = topicsNested.flatMap((item) => item.topics);
  const subtopics = topicsNested.flatMap((item) => item.subtopics);
  const progressDocs = userId
    ? await axios
        .get(`${API_BASE_URL}/api/progress/${userId}`)
        .then((res) => (Array.isArray(res.data) ? res.data : []))
        .catch(() => [])
    : [];

  return applyProgressToTree(buildContentTree(units, topics, subtopics), progressDocs);
}

export async function fetchLearningPath(headers = {}) {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/content/path`, { headers });
    if (res.data?.units && res.data?.lessons) {
      return res.data;
    }
  } catch (err) {
    if (err?.response?.status !== 404) {
      throw err;
    }
  }

  return fetchLegacyLearningPath(headers);
}

export async function fetchNextLesson({ topicId, subtopicId, headers = {} } = {}) {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/content/next-lesson`, {
      params: {
        topicId,
        subtopicId,
      },
      headers,
    });

    return res.data || null;
  } catch (err) {
    if (err?.response?.status !== 404) {
      throw err;
    }
  }

  const learningPath = await fetchLearningPath(headers);
  const currentKey = getLessonKey({ topicId, subtopicId });
  const currentIndex = Array.isArray(learningPath?.lessons)
    ? learningPath.lessons.findIndex((lesson) => lesson.key === currentKey)
    : -1;

  if (currentIndex === -1 || currentIndex + 1 >= learningPath.lessons.length) {
    return null;
  }

  return learningPath.lessons[currentIndex + 1];
}
