import React from 'react';
import Pill from '../ui/Pill';
import { COLORS } from '../../theme';

const TONES = {
  Done: { backgroundColor: COLORS.green100, color: COLORS.green600 },
  Open: { backgroundColor: COLORS.blue50, color: COLORS.blue600 },
  Locked: { backgroundColor: COLORS.gray100, color: COLORS.slate500 },
  Close: { backgroundColor: COLORS.blue50, color: COLORS.blue600 },
};

export function lessonStatus(item) {
  if (item?.isCleared) return 'Done';
  return item?.isUnlocked ? 'Open' : 'Locked';
}

export default function StatusPill({ status }) {
  return <Pill label={status} {...(TONES[status] || TONES.Open)} style={{ paddingVertical: 5 }} />;
}
