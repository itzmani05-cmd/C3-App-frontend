import React, { useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import AppText from '../components/ui/AppText';
import Screen from '../components/ui/Screen';
import SearchBar from '../components/ui/SearchBar';
import EmptyState from '../components/ui/EmptyState';
import LoadingView from '../components/ui/LoadingView';
import UnitCard from '../components/learning/UnitCard';
import useExamGate from '../hooks/useExamGate';
import useFetch from '../hooks/useFetch';
import { getLearningUnits } from '../api/content';
import { COLORS } from '../theme';

export default function ExploreScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const exam = useExamGate();
  const { data: units, loading } = useFetch(() => getLearningUnits(exam.selectedExamId), [exam.selectedExamId], {
    enabled: exam.ready,
    refetchOnFocus: true,
    initialData: [],
  });

  const visibleUnits = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query ? units.filter((unit) => (unit.name || '').toLowerCase().includes(query)) : units;
  }, [units, searchQuery]);

  if (exam.gate) return exam.gate;

  return (
    <Screen title="Explore Units" background={COLORS.appBackground} scroll={false} top={exam.switchChip}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search units..." />

      <AppText variant="medium" style={{ marginHorizontal: 16, marginBottom: 10, marginTop: 24, fontSize: 18 }}>
        Available Units
      </AppText>

      {exam.loading || loading ? (
        <LoadingView color={COLORS.blue600} />
      ) : (
        <FlatList
          data={visibleUnits}
          keyExtractor={(item) => String(item._id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginHorizontal: 16, paddingBottom: 30 }}
          ListEmptyComponent={<EmptyState message="No units available right now." style={{ marginTop: 62 }} />}
          renderItem={({ item }) => (
            <UnitCard unit={item} onPress={() => navigation.navigate('TopicsScreen', { unitId: item._id, unitName: item.name })} />
          )}
        />
      )}
    </Screen>
  );
}
