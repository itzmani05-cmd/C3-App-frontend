import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyExams } from '../api/user';

const STORAGE_KEY = 'selected_exam_id';

function pickInitialExam(exams, storedExamId) {
  if (exams.length <= 1) return exams[0]?._id || null;
  return exams.some((exam) => exam._id === storedExamId) ? storedExamId : null;
}

export default function useSelectedExam() {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getMyExams(), AsyncStorage.getItem(STORAGE_KEY)])
      .then(([fetchedExams, storedExamId]) => {
        if (!isMounted) return;
        setExams(fetchedExams);
        setSelectedExamId(pickInitialExam(fetchedExams, storedExamId));
      })
      .catch((err) => {
        console.log('Fetch exams error:', err);
        if (isMounted) {
          setExams([]);
          setSelectedExamId(null);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectExam = useCallback(async (examId) => {
    setSelectedExamId(examId);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, examId);
    } catch (err) {
      console.log('Save selected exam error:', err);
    }
  }, []);

  const clearSelectedExam = useCallback(async () => {
    setSelectedExamId(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.log('Clear selected exam error:', err);
    }
  }, []);

  const needsSelection = exams.length > 1 && !selectedExamId;
  const noExamsAssigned = !loading && exams.length === 0;

  return { loading, exams, selectedExamId, needsSelection, noExamsAssigned, selectExam, clearSelectedExam };
}
