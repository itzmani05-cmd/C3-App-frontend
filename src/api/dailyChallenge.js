import api from './client';

const BASE = '/api/daily-challenge';
const examParams = (examId) => (examId ? { examId } : {});
const asArray = (value) => (Array.isArray(value) ? value : []);

export async function getTodayChallenge(examId) {
  const { data } = await api.get(`${BASE}/today`, { params: examParams(examId) });
  return data?.challenge || null;
}

export async function getChallengeHistory() {
  const { data } = await api.get(`${BASE}/history`);
  return asArray(data?.challenges);
}

export async function getLeaderboard() {
  const { data } = await api.get(`${BASE}/leaderboard`);
  return { leaderboard: asArray(data?.leaderboard), me: data?.me || null };
}

export async function getProgressSummary() {
  const { data } = await api.get(`${BASE}/progress-summary`);
  return data;
}

export async function getProgressOverview() {
  const [summary, topicRes, streakRes] = await Promise.all([
    getProgressSummary(),
    api.get(`${BASE}/topic-performance`),
    api.get(`${BASE}/streak-history`),
  ]);
  return {
    summary,
    topics: topicRes.data?.topics || [],
    weakArea: topicRes.data?.weakArea || null,
    streakHistory: asArray(streakRes.data?.history),
  };
}

export async function startAttempt(challengeId) {
  const { data } = await api.post(`${BASE}/${challengeId}/start`, {});
  return { attemptId: data.attemptId, questions: asArray(data.questions) };
}

export async function submitAttempt(challengeId, attemptId, responses) {
  const { data } = await api.post(`${BASE}/${challengeId}/attempts/${attemptId}/submit`, { responses });
  return data;
}

export async function getAttempt(challengeId, attemptId) {
  const { data } = await api.get(`${BASE}/${challengeId}/attempts/${attemptId}`);
  return data;
}
