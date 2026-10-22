import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../ui/AppText';
import AppButton from '../ui/AppButton';
import PressableScale from '../ui/PressableScale';
import { COLORS, contentColumn, tw } from '../../theme';

function Legend({ swatch, label, count }) {
  return (
    <View style={tw`flex-row items-center mr-4`}>
      <View style={[tw`w-3 h-3 rounded mr-1.5`, swatch]} />
      <AppText type="small" variant="semiBold" style={tw`text-slate-700`}>
        {count} {label}
      </AppText>
    </View>
  );
}

// Bottom sheet shown before a quiz is submitted: every question at a glance (answered, skipped, flagged), tap one to jump
// back to it, or go ahead and submit.
export default function ReviewSheet({ visible, items, currentIndex, onJump, onSubmit, onClose, submitting }) {
  const insets = useSafeAreaInsets();
  const answered = items.filter((item) => item.answered).length;
  const unanswered = items.length - answered;
  const flagged = items.filter((item) => item.flagged).length;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={tw`flex-1 justify-end`}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(13,20,38,0.55)' }]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close review"
        />

        <View style={[tw`bg-white rounded-t-3xl px-5 pt-3`, contentColumn, { paddingBottom: insets.bottom + 16, maxHeight: '88%' }]}>
          <View style={tw`self-center w-10 h-1 rounded-full bg-slate-200 mb-4`} />

          <AppText type="title" style={tw`text-slate-900`}>
            Review before you submit
          </AppText>
          <View style={tw`flex-row flex-wrap mt-3`}>
            <Legend swatch={{ backgroundColor: COLORS.brand600 }} label="answered" count={answered} />
            <Legend swatch={{ backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.slate300 }} label="not answered" count={unanswered} />
            <Legend swatch={{ backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.amber600 }} label="flagged" count={flagged} />
          </View>

          <ScrollView style={tw`mt-4`} contentContainerStyle={tw`flex-row flex-wrap`} showsVerticalScrollIndicator={false}>
            {items.map((item, index) => (
              <PressableScale
                key={item.id}
                scaleTo={0.94}
                onPress={() => onJump(index)}
                accessibilityRole="button"
                accessibilityLabel={`Question ${index + 1}, ${item.answered ? 'answered' : 'not answered'}${item.flagged ? ', flagged' : ''}`}
                style={[
                  tw`w-11 h-11 mr-2 mb-2 rounded-lg items-center justify-center`,
                  item.answered
                    ? { backgroundColor: COLORS.brand600, borderWidth: 1, borderColor: COLORS.brand600 }
                    : { backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.slate300 },
                  item.flagged ? { borderWidth: 2, borderColor: COLORS.amber600 } : null,
                  index === currentIndex ? { borderWidth: 2.5, borderColor: COLORS.ink900 } : null,
                ]}
              >
                <AppText variant="bold" style={{ fontSize: 14, color: item.answered ? COLORS.white : COLORS.slate700 }}>
                  {index + 1}
                </AppText>
              </PressableScale>
            ))}
          </ScrollView>

          {unanswered > 0 ? (
            <View style={tw`mt-2 rounded-lg border border-amber-100 bg-amber-50 p-3`}>
              <AppText type="small" variant="medium" style={tw`text-amber-800`}>
                {unanswered === 1 ? '1 question is' : `${unanswered} questions are`} not answered and will count as incorrect.
              </AppText>
            </View>
          ) : (
            <AppText type="small" style={tw`mt-2 text-slate-500`}>
              Every question is answered.
            </AppText>
          )}

          <AppButton label="Submit quiz" onPress={onSubmit} loading={submitting} size="lg" style={tw`mt-4 rounded-lg`} />
          <AppButton label="Keep working" tone="secondary" onPress={onClose} disabled={submitting} size="lg" style={tw`mt-2.5 rounded-lg`} />
        </View>
      </View>
    </Modal>
  );
}
