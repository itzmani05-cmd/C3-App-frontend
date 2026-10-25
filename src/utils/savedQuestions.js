import { getOptionText } from './questionFormat.js';

// Helpers for the Saved questions screen.

// Searching only helps once the list is long enough to scroll through.
export const SEARCH_MIN_QUESTIONS = 5;

const normalise = (text) => String(text ?? '').toLowerCase().replace(/\s+/g, ' ').trim();

function searchableText(question) {
  return normalise(
    [question.questionText || question.question, question.lessonName, ...(question.options || []).map(getOptionText)].join(' ')
  );
}

// Every word typed has to appear somewhere in the question, its options or its lesson name, in any order.
export function filterSaved(questions, query) {
  const words = normalise(query).split(' ').filter(Boolean);
  if (words.length === 0) return questions;
  return questions.filter((question) => {
    const text = searchableText(question);
    return words.every((word) => text.includes(word));
  });
}

export function isNearSavedLimit(count, limit) {
  return limit > 0 && count >= Math.ceil(limit * 0.9);
}

// "42 of 300 saved to revise". The limit is left out if the server did not send one.
export function savedCountLabel(count, limit) {
  if (!limit) return `${count} saved to revise`;
  if (count >= limit) return `${count} of ${limit} saved. Remove one to save another.`;
  return `${count} of ${limit} saved to revise`;
}
