import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const STORAGE_KEY = 'selected_exam_id';

export default function useSelectedExam() {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const userId = global.userId || global.user?.userId;

      try {
        const [examsRes, storedExamId] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/user/exams`, {
            headers: userId ? { userid: userId } : {},
          }),
          AsyncStorage.getItem(STORAGE_KEY),
        ]);

        if (!isMounted) return;

        const fetchedExams = Array.isArray(examsRes.data?.exams) ? examsRes.data.exams : [];
        setExams(fetchedExams);

        if (fetchedExams.length <= 1) {
          setSelectedExamId(fetchedExams[0]?._id || null);
        } else if (storedExamId && fetchedExams.some((exam) => exam._id === storedExamId)) {
          setSelectedExamId(storedExamId);
        } else {
          setSelectedExamId(null);
        }
      } catch (err) {
        console.log('Fetch exams error:', err);
        if (isMounted) {
          setExams([]);
          setSelectedExamId(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

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
