import React from 'react';
import Pill from '../ui/Pill';
import { COLORS } from '../../theme';

const TONES = {
  Done: { backgroundColor: COLORS.green100, color: COLORS.green600 },
  Locked: { backgroundColor: COLORS.gray100, color: COLORS.slate500 },
  Close: { backgroundColor: COLORS.blue50, color: COLORS.blue600 },
};

export function lessonStatus(item) {
  if (item?.isCleared) return 'Done';
  return item?.isUnlocked ? 'Open' : 'Locked';
}

// Unlocked-but-not-cleared lessons show no pill.
export default function StatusPill({ status }) {
  if (status === 'Open') return null;
  return <Pill label={status} {...TONES[status]} style={{ paddingVertical: 5 }} />;
}
