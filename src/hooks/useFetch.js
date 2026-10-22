import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { readCache, writeCache } from '../utils/offlineCache';

/**
 * `cacheKey` turns on stale-while-revalidate: the last saved result shows immediately while a fresh one loads, and
 * stays on screen (with `stale` set) if the refresh fails, e.g. offline.
 */
export default function useFetch(
  fetcher,
  deps = [],
  { enabled = true, refetchOnFocus = false, initialData = null, cacheKey = null } = {}
) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [stale, setStale] = useState(false);
  const hasDataRef = useRef(false);
  const [loadedKey, setLoadedKey] = useState(null);
  const fetcherRef = useRef(fetcher);
  const loadedKeyRef = useRef(null);
  fetcherRef.current = fetcher;

  const key = JSON.stringify(deps);

  const run = useCallback(
    async (mode = 'load') => {
      if (!enabled) return;

      let showedCache = false;
      if (mode === 'load') {
        hasDataRef.current = false;
        const cached = cacheKey ? await readCache(cacheKey) : null;
        if (cached != null) {
          setData(cached);
          setLoadedKey(key);
          hasDataRef.current = true;
          showedCache = true;
        }
      }

      if (mode === 'refresh') setRefreshing(true);
      else if (mode === 'load' && !showedCache) setLoading(true);

      try {
        const fresh = await fetcherRef.current();
        setData(fresh);
        setError(null);
        setStale(false);
        hasDataRef.current = true;
        if (cacheKey) writeCache(cacheKey, fresh);
      } catch (err) {
        console.log('Request failed:', err?.message || err);
        if (cacheKey && hasDataRef.current) setStale(true);
        else setError(err);
      } finally {
        loadedKeyRef.current = key;
        setLoadedKey(key);
        setLoading(false);
        setRefreshing(false);
      }
    },
    [enabled, key, cacheKey]
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
    stale,
    refresh,
    reload: run,
  };
}
