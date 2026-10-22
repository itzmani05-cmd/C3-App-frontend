import React from 'react';
import { View } from 'react-native';
import { Flame } from '../../icons';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import { COLORS, tw } from '../../theme';

function dayLetter(dateKey) {
  try {
    return new Date(`${dateKey}T00:00:00Z`).toLocaleDateString('en-IN', { weekday: 'narrow', timeZone: 'UTC' });
  } catch {
    return String(dateKey || '').slice(-2);
  }
}

// The last seven days of the daily-challenge streak: a flame on days the challenge was completed.
export default function WeekStrip({ history }) {
  const days = (Array.isArray(history) ? history : []).slice(-7);
  if (days.length === 0) return null;
  const doneCount = days.filter((day) => day.completed).length;

  return (
    <Card elevation="sm" style={tw`py-3.5`}>
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <AppText type="heading" style={tw`text-slate-900`}>
          This week
        </AppText>
        <AppText type="small" style={tw`text-slate-500`}>
          {doneCount} of {days.length} days
        </AppText>
      </View>

      <View style={tw`flex-row justify-between`}>
        {days.map((day, index) => {
          const isToday = index === days.length - 1;
          return (
            <View key={day.dateKey || index} style={tw`items-center flex-1`} accessibilityLabel={`${dayLetter(day.dateKey)}: ${day.completed ? 'completed' : 'not completed'}`}>
              <View
                style={[
                  tw`w-9 h-9 rounded-full items-center justify-center`,
                  day.completed
                    ? { backgroundColor: COLORS.amber50, borderWidth: 1, borderColor: COLORS.amber100 }
                    : { backgroundColor: COLORS.slate100, borderWidth: isToday ? 1.5 : 0, borderColor: COLORS.brand600 },
                ]}
              >
                {day.completed ? <Flame size={17} color={COLORS.amber600} /> : null}
              </View>
              <AppText type="caption" style={[tw`mt-1.5`, { color: isToday ? COLORS.brand700 : COLORS.slate500 }]}>
                {dayLetter(day.dateKey)}
              </AppText>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
