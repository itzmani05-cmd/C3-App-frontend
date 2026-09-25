import AsyncStorage from '@react-native-async-storage/async-storage';

const LEGACY_CURRENT_KEY = 'quiz_session';
const answersKey = (sessionId) => `quiz_${sessionId}_answers`;
const startKey = (sessionId) => `quiz_${sessionId}_start`;

export async function getElapsedSeconds(sessionId) {
  let start = await AsyncStorage.getItem(startKey(sessionId));
  if (!start) {
    start = Date.now().toString();
    await AsyncStorage.setItem(startKey(sessionId), start);
  }
  return Math.floor((Date.now() - Number(start)) / 1000);
}

export async function loadAnswers(sessionId) {
  try {
    const raw = await AsyncStorage.getItem(answersKey(sessionId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAnswers(sessionId, answers) {
  if (!sessionId) return;
  AsyncStorage.setItem(answersKey(sessionId), JSON.stringify(answers)).catch(() => {});
}

export async function clearQuizSession(sessionId) {
  await AsyncStorage.multiRemove([LEGACY_CURRENT_KEY, answersKey(sessionId), startKey(sessionId)]);
}
