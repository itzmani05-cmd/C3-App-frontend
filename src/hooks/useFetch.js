import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function useFetch(fetcher, deps = [], { enabled = true, refetchOnFocus = false, initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [loadedKey, setLoadedKey] = useState(null);
  const fetcherRef = useRef(fetcher);
  const loadedKeyRef = useRef(null);
  fetcherRef.current = fetcher;

  const key = JSON.stringify(deps);

  const run = useCallback(
    async (mode = 'load') => {
      if (!enabled) return;
      if (mode === 'refresh') setRefreshing(true);
      else if (mode === 'load') setLoading(true);

      try {
        setData(await fetcherRef.current());
        setError(null);
      } catch (err) {
        console.log('Request failed:', err?.message || err);
        setError(err);
      } finally {
        loadedKeyRef.current = key;
        setLoadedKey(key);
        setLoading(false);
        setRefreshing(false);
      }
    },
    [enabled, key]
  );

  useEffect(() => {
    if (!refetchOnFocus) run();
  }, [run, refetchOnFocus]);

  useFocusEffect(
    useCallback(() => {
      if (refetchOnFocus) run(loadedKeyRef.current === key ? 'silent' : 'load');
    }, [run, refetchOnFocus, key])
  );

  const refresh = useCallback(() => run('refresh'), [run]);

  return {
    data,
    setData,
    loading: loading || (enabled && loadedKey !== key),
    refreshing,
    error,
    refresh,
    reload: run,
  };
}
