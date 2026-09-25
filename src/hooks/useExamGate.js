import React from 'react';
import useSelectedExam from './useSelectedExam';
import ExamPicker from '../components/exam/ExamPicker';
import NoExamAssigned from '../components/exam/NoExamAssigned';
import ExamSwitchChip from '../components/exam/ExamSwitchChip';

export default function useExamGate() {
  const exam = useSelectedExam();
  const { loading, exams, selectedExamId, needsSelection, noExamsAssigned, selectExam, clearSelectedExam } = exam;

  let gate = null;
  if (!loading && needsSelection) gate = <ExamPicker exams={exams} onSelect={selectExam} />;
  else if (!loading && noExamsAssigned) gate = <NoExamAssigned />;

  const switchChip = <ExamSwitchChip exams={exams} selectedExamId={selectedExamId} onPress={clearSelectedExam} />;

  return { ...exam, ready: !loading && !needsSelection && !noExamsAssigned, gate, switchChip };
}
