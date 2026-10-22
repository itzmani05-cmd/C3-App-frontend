import React, { useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import Screen from '../components/ui/Screen';
import SearchBar from '../components/ui/SearchBar';
import SectionTitle from '../components/ui/SectionTitle';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import OfflineBanner from '../components/ui/OfflineBanner';
import { ListSkeleton } from '../components/ui/Skeletons';
import UnitCard from '../components/learning/UnitCard';
import FadeIn, { staggerDelay } from '../components/ui/FadeIn';
import useExamGate from '../hooks/useExamGate';
import useFeaturesMenu from '../hooks/useFeaturesMenu';
import useFetch from '../hooks/useFetch';
import { getLearningUnits } from '../api/content';
import { COLORS, contentColumn, tw } from '../theme';

export default function ExploreScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const exam = useExamGate();
  const menu = useFeaturesMenu(navigation);
  const { data: units, loading, error, stale, reload } = useFetch(() => getLearningUnits(exam.selectedExamId), [exam.selectedExamId], {
    enabled: exam.ready,
    refetchOnFocus: true,
    initialData: [],
    cacheKey: `units:${exam.selectedExamId || 'all'}`,
  });

  const visibleUnits = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query ? units.filter((unit) => (unit.name || '').toLowerCase().includes(query)) : units;
  }, [units, searchQuery]);

  if (exam.gate) return exam.gate;

  return (
    <Screen title="Learn" headerProps={{ onMenuPress: menu.open }} background={COLORS.appBackground} scroll={false} top={exam.switchChip}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search units..." />

      <OfflineBanner visible={stale} style={tw`mt-3`} />

      {exam.loading || loading ? (
        <ListSkeleton count={6} style={tw`px-4 pt-5`} />
      ) : error && units.length === 0 ? (
        <ErrorState onRetry={() => reload()} />
      ) : (
        <FlatList
          data={visibleUnits}
          keyExtractor={(item) => String(item._id)}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          windowSize={7}
          removeClippedSubviews
          contentContainerStyle={[tw`px-4 pt-5 pb-8`, contentColumn]}
          ListHeaderComponent={<SectionTitle>{searchQuery.trim() ? 'Results' : 'Units'}</SectionTitle>}
          ListEmptyComponent={
            <EmptyState
              illustration={searchQuery.trim() ? 'search' : 'empty'}
              title={searchQuery.trim() ? 'No matching units' : 'No units yet'}
              message={searchQuery.trim() ? 'Try a different search.' : 'Units for your exam will appear here.'}
              style={tw`mt-6`}
            />
          }
          renderItem={({ item, index }) => (
            <FadeIn delay={staggerDelay(index)}>
              <UnitCard unit={item} onPress={() => navigation.navigate('TopicsScreen', { unitId: item._id, unitName: item.name })} />
            </FadeIn>
          )}
        />
      )}
      {menu.sheet}
    </Screen>
  );
}
