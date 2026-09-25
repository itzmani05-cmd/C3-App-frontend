import React from 'react';
import BilingualText from '../ui/BilingualText';
import { COLORS } from '../../theme';

function splitQuestionLines(text) {
  if (!text) return [];
  return text
    .replace(/Assertion\s*\(A\):/gi, '\nAssertion (A):')
    .replace(/Reason\s*\(R\):/gi, '\nReason (R):')
    .replace(/List I/gi, '\nList I')
    .replace(/List II/gi, '\nList II')
    .replace(/(\d+\.)/g, '\n$1')
    .replace(/([A-D]\.)/g, '\n$1')
    .split('\n')
    .filter((line) => line.trim() !== '');
}

function lineColor(lower) {
  if (lower.includes('assertion')) return COLORS.blue600;
  if (lower.includes('reason')) return COLORS.amber600;
  if (lower.includes('list i') || lower.includes('list ii')) return COLORS.accent600;
  return null;
}

export default function FormattedQuestionText({ text }) {
  return splitQuestionLines(text).map((line, index) => {
    const highlight = lineColor(line.toLowerCase());
    return (
      <BilingualText
        key={index}
        variant={highlight ? 'bold' : 'medium'}
        style={{ fontSize: 15, marginBottom: 6, color: highlight || COLORS.gray700 }}
      >
        {line}
      </BilingualText>
    );
  });
}
