import React from 'react';
import Pill from '../ui/Pill';
import { COLORS } from '../../theme';

const PALETTES = {
  brand: {
    skipped: { backgroundColor: COLORS.slate100, color: COLORS.slate500 },
    correct: { backgroundColor: COLORS.successSoft, color: COLORS.success600 },
    incorrect: { backgroundColor: COLORS.dangerSoft, color: COLORS.danger600 },
    style: null,
    text: null,
  },
  blue: {
    skipped: { backgroundColor: COLORS.gray100, color: COLORS.gray500 },
    correct: { backgroundColor: COLORS.successSoft, color: COLORS.success600 },
    incorrect: { backgroundColor: COLORS.red100, color: COLORS.red600 },
    style: { paddingHorizontal: 12, paddingVertical: 7 },
    text: { fontSize: 12 },
  },
};

export default function AnswerStatusPill({ answered, correct, palette = 'brand' }) {
  const colors = PALETTES[palette];
  const state = !answered ? 'skipped' : correct ? 'correct' : 'incorrect';
  const label = { skipped: 'Skipped', correct: 'Correct', incorrect: 'Incorrect' }[state];

  return <Pill label={label} {...colors[state]} style={colors.style} textStyle={colors.text} />;
}
