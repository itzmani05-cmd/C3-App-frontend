import React from 'react';
import Screen from '../components/ui/Screen';
import EmptyState from '../components/ui/EmptyState';
import ArchiveUnitItem from '../components/dailyChallenge/ArchiveUnitItem';
import useExamGate from '../hooks/useExamGate';
import useFetch from '../hooks/useFetch';
import { getArchiveUnits } from '../api/dailyChallenge';

export default function DailyChallengeUnitsScreen({ navigation }) {
  const exam = useExamGate();
  const { data: units, loading, refreshing, error, refresh } = useFetch(
    () => getArchiveUnits(exam.selectedExamId),
    [exam.selectedExamId],
    { enabled: exam.ready, refetchOnFocus: true, initialData: [] }
  );

  if (exam.gate) return exam.gate;

  const openUnit = (unit) =>
    navigation.navigate(unit.hasTopics ? 'DailyChallengeTopicsScreen' : 'DailyChallengeUnitHistoryScreen', {
      unitId: unit._id,
      unitName: unit.name,
    });

  return (
    <Screen
      title="Daily Challenge Archive"
      loading={exam.loading || loading}
      top={exam.switchChip}
      refreshing={refreshing}
      onRefresh={refresh}
    >
      {error ? (
        <EmptyState message="Could not load units." error />
      ) : units.length === 0 ? (
        <EmptyState message="No units available right now." />
      ) : (
        units.map((unit) => <ArchiveUnitItem key={unit._id} unit={unit} onPress={() => openUnit(unit)} />)
      )}
    </Screen>
  );
}
