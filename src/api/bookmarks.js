import api from './client';

export async function getBookmarkIds() {
  const { data } = await api.get('/api/bookmarks/ids');
  return Array.isArray(data?.ids) ? data.ids : [];
}

// The saved questions and how many a student may save (`limit` is 0 if the server did not say).
export async function getBookmarks() {
  const { data } = await api.get('/api/bookmarks');
  return { questions: Array.isArray(data?.questions) ? data.questions : [], limit: Number(data?.limit) || 0 };
}

// `context` says where the question was saved from: { topicId, subtopicId, lessonName }.
export async function addBookmark(questionId, context = {}) {
  await api.put(`/api/bookmarks/${questionId}`, context);
}

export async function removeBookmark(questionId) {
  await api.delete(`/api/bookmarks/${questionId}`);
}
