import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { addBookmark, getBookmarkIds, removeBookmark } from '../api/bookmarks';

/**
 * The questions the student has bookmarked, for showing a filled bookmark and toggling it. A toggle shows at once and is
 * undone, with a message, if the server could not save it. Loading the ids is quiet: if it fails the bookmarks simply
 * show as not saved.
 */
export default function useBookmarks() {
  const [ids, setIds] = useState(() => new Set());

  useEffect(() => {
    let active = true;
    getBookmarkIds()
      .then((saved) => active && setIds(new Set(saved)))
      .catch((err) => console.log('Bookmarks load failed:', err?.message || err));
    return () => {
      active = false;
    };
  }, []);

  const isBookmarked = useCallback((questionId) => ids.has(String(questionId)), [ids]);

  const toggle = useCallback(
    async (questionId, context) => {
      const id = String(questionId);
      const saving = !ids.has(id);
      const set = (value) =>
        setIds((prev) => {
          const next = new Set(prev);
          if (value) next.add(id);
          else next.delete(id);
          return next;
        });

      set(saving);
      try {
        if (saving) await addBookmark(id, context);
        else await removeBookmark(id);
      } catch (err) {
        set(!saving);
        Alert.alert(
          saving ? 'Could not save this question' : 'Could not remove this question',
          err.response?.data?.message || (err.response ? 'Please try again.' : "Can't reach the server. Check your connection and try again.")
        );
      }
    },
    [ids]
  );

  return { isBookmarked, toggle };
}
