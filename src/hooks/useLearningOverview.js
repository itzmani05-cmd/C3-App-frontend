import AsyncStorage from '@react-native-async-storage/async-storage';
import useFetch from './useFetch';
import { getLearningPath } from '../api/content';
import { getMyExams } from '../api/user';
import { flattenLessons, pickContinueLesson, unitProgress } from '../utils/lessonProgress';

const SELECTED_EXAM_KEY = 'selected_exam_id';

// The exam whose lessons Home should use: the only one, or the one the student picked on the Learn tab.
async function resolveExamId() {
  const exams = await getMyExams();
  if (exams.length === 1) return exams[0]._id;
  const stored = await AsyncStorage.getItem(SELECTED_EXAM_KEY);
  return exams.some((exam) => exam._id === stored) ? stored : null;
}

/**
 * One learning-path request for Home: the lesson to continue with, and a progress summary for each unit
 * ({ _id, name, total, cleared, percent }). Null when the student has several exams and has not chosen one yet.
 */
export default function useLearningOverview() {
  return useFetch(
    async () => {
      const examId = await resolveExamId();
      if (!examId) return null; // the Learn tab asks which exam first
      const { units } = await getLearningPath(examId);
      return {
        pick: pickContinueLesson(flattenLessons(units)),
        units: units.map((unit) => ({ _id: unit._id, name: unit.name, ...unitProgress(unit) })),
      };
    },
    [],
    { refetchOnFocus: true, cacheKey: 'learning-overview' }
  );
}
