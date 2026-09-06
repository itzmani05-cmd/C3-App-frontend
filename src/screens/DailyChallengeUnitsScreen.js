import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import Header from '../components/Header';
import AppText from '../components/AppText';
import { API_BASE_URL } from '../config/api';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';
import useSelectedExam from '../hooks/useSelectedExam';
import ExamPicker from '../components/ExamPicker';
import NoExamAssigned from '../components/NoExamAssigned';

export default function DailyChallengeUnitsScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState(null);
  const { loading: examLoading, exams, selectedExamId, needsSelection, noExamsAssigned, selectExam, clearSelectedExam } = useSelectedExam();

  const fetchUnits = useCallback(async (isRefreshing = false) => {
    const userId = global.userId || global.user?.userId;
    if (!userId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (isRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await axios.get(`${API_BASE_URL}/api/daily-challenge/units`, {
        headers: { userid: userId },
        params: selectedExamId ? { examId: selectedExamId } : {},
      });
      setUnits(Array.isArray(res.data?.units) ? res.data.units : []);
      setError(null);
    } catch (err) {
      console.log('Fetch daily challenge units error:', err);
      setError('Could not load units.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedExamId]);

  useFocusEffect(
    useCallback(() => {
      if (examLoading || needsSelection || noExamsAssigned) return;
      fetchUnits();
    }, [fetchUnits, examLoading, needsSelection, noExamsAssigned])
  );

  if (!examLoading && needsSelection) {
    return <ExamPicker exams={exams} onSelect={selectExam} />;
  }

  if (!examLoading && noExamsAssigned) {
    return <NoExamAssigned />;
  }

  const openUnit = (unit) => {
    if (unit.hasTopics) {
      navigation.navigate('DailyChallengeTopicsScreen', { unitId: unit._id, unitName: unit.name });
    } else {
      navigation.navigate('DailyChallengeUnitHistoryScreen', { unitId: unit._id, unitName: unit.name });
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
        <Header title="Daily Challenge Archive" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.brand600} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
      <Header title="Daily Challenge Archive" />
      {exams.length > 1 ? (
        <TouchableOpacity
          onPress={clearSelectedExam}
          style={{
            marginTop: 10,
            marginHorizontal: 16,
            alignSelf: 'flex-start',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: COLORS.brand50,
          }}
        >
          <AppText variant="semiBold" style={{ fontSize: 12, color: COLORS.brand600 }}>
            {exams.find((e) => e._id === selectedExamId)?.name || 'Exam'} · Switch
          </AppText>
        </TouchableOpacity>
      ) : null}

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchUnits(true)} />}
      >
        {error ? (
          <AppText style={{ color: COLORS.danger600, textAlign: 'center', marginTop: 40 }}>{error}</AppText>
        ) : units.length === 0 ? (
          <AppText style={{ marginTop: 40, color: COLORS.slate500, textAlign: 'center' }}>
            No units available right now.
          </AppText>
        ) : (
          units.map((unit) => (
            <TouchableOpacity
              key={unit._id}
              activeOpacity={0.8}
              onPress={() => openUnit(unit)}
              style={cardStyle}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <AppText variant="bold" style={{ flex: 1, marginRight: 12, fontSize: 15, color: COLORS.slate900 }}>
                  {unit.name}
                </AppText>
                <View
                  style={{
                    borderRadius: RADII.pill,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    backgroundColor: unit.questionCount > 0 ? COLORS.brand50 : COLORS.slate100,
                  }}
                >
                  <AppText
                    variant="bold"
                    style={{ fontSize: 11, color: unit.questionCount > 0 ? COLORS.brand600 : COLORS.slate500 }}
                  >
                    {unit.questionCount > 0 ? `${unit.questionCount} Questions` : 'None yet'}
                  </AppText>
                </View>
              </View>

              <AppText style={{ marginTop: 6, fontSize: 12, color: COLORS.slate500 }}>
                {unit.questionCount > 0
                  ? 'Tap to review past Daily Challenge questions'
                  : "Start Today's Challenge to begin building this up"}
              </AppText>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const cardStyle = {
  marginTop: 12,
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxl,
  padding: 16,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  ...SHADOWS.sm,
};
