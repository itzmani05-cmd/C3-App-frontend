import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CircleCheck, Clock } from '../../icons';
import AppText from '../ui/AppText';
import ProgressBar from '../ui/ProgressBar';
import { formatClock } from '../../utils/format';
import { COLORS, tw } from '../../theme';

const LOW_TIME_SECONDS = 120;

const secondsUntil = (deadline) => (deadline ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) : 0);

// The countdown lives here so only this header re-renders each second, not the question and its formulas. It works
// from a fixed deadline, so it stays correct if the app was in the background.
function useCountdown(deadline, onExpire) {
  const [timeLeft, setTimeLeft] = useState(() => secondsUntil(deadline));
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!deadline) return undefined;
    let id = null;
    const tick = () => {
      const left = secondsUntil(deadline);
      setTimeLeft(left);
      if (left === 0) {
        clearInterval(id);
        onExpireRef.current?.();
      }
    };
    tick();
    id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return timeLeft;
}

export default function QuizHeader({ title, deadline, onExpire, answeredCount, pendingCount, onBack }) {
  const insets = useSafeAreaInsets();
  const timeLeft = useCountdown(deadline, onExpire);
  const total = answeredCount + pendingCount;
  const low = timeLeft <= LOW_TIME_SECONDS;
  const timerColors = low
    ? { color: COLORS.red700, backgroundColor: COLORS.red50, borderColor: COLORS.red200 }
    : { color: COLORS.slate700, backgroundColor: COLORS.slate50, borderColor: COLORS.slate200 };

  return (
    <View style={[tw`bg-white border-b border-slate-200 px-4 pb-3`, { paddingTop: insets.top + 12 }]}>
      <View style={tw`flex-row items-center justify-between`}>
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityRole="button"
            accessibilityLabel="Leave quiz"
            style={tw`w-9 h-9 mr-3 rounded-lg border border-slate-200 bg-white items-center justify-center`}
          >
            <ArrowLeft size={18} color={COLORS.slate900} />
          </TouchableOpacity>
        ) : null}
        <AppText variant="extraBold" numberOfLines={1} style={tw`flex-1 mr-3 text-[17px] text-slate-900`}>
          {title}
        </AppText>
        <View
          style={[tw`flex-row items-center rounded-lg border px-2.5 py-1.5`, { backgroundColor: timerColors.backgroundColor, borderColor: timerColors.borderColor }]}
          accessibilityLabel={`Time left ${formatClock(timeLeft)}`}
        >
          <Clock size={14} color={timerColors.color} />
          <AppText variant="bold" style={[tw`ml-1.5 text-[13px]`, { color: timerColors.color }]}>
            {formatClock(timeLeft)}
          </AppText>
        </View>
      </View>

      <ProgressBar value={total ? (answeredCount / total) * 100 : 0} height={5} style={tw`mt-3`} />
      <View style={tw`mt-2 flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <CircleCheck size={13} color={COLORS.green600} />
          <AppText variant="semiBold" style={tw`ml-1 text-xs text-slate-600`}>
            {answeredCount} answered
          </AppText>
        </View>
        <AppText variant="semiBold" style={tw`text-xs text-slate-500`}>
          {pendingCount} remaining
        </AppText>
      </View>
    </View>
  );
}
