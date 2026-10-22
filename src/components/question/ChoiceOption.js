import React from 'react';
import { View } from 'react-native';
import PressableScale from '../ui/PressableScale';
import { haptics } from '../../utils/haptics';
import { Check } from '../../icons';
import AppText from '../ui/AppText';
import BilingualText from '../ui/BilingualText';
import QuestionImage from './QuestionImage';
import { COLORS } from '../../theme';

// Both palettes share one look now (rounded rows, a lettered badge, brand-blue selection, green for correct);
// they differ only in the spacing the old screens expect.
const PALETTES = {
  brand: { row: { marginTop: 10 } },
  blue: { row: { marginBottom: 10 } },
};

export const optionLetter = (index) => String.fromCharCode(65 + index);

function stateColors({ selected, correct }) {
  if (correct) return { border: COLORS.green300, background: COLORS.green50, badge: COLORS.green600, badgeText: COLORS.white, text: COLORS.slate900 };
  if (selected) return { border: COLORS.brand600, background: COLORS.brand50, badge: COLORS.brand600, badgeText: COLORS.white, text: COLORS.slate900 };
  return { border: COLORS.slate200, background: COLORS.white, badge: COLORS.slate100, badgeText: COLORS.slate600, text: COLORS.slate700 };
}

function Badge({ multiple, index, active, colors }) {
  if (multiple) {
    return (
      <View
        style={[
          checkboxStyle,
          { borderColor: active ? colors.badge : COLORS.slate300, backgroundColor: active ? colors.badge : COLORS.white },
        ]}
      >
        {active ? <Check size={14} color={COLORS.white} strokeWidth={3} /> : null}
      </View>
    );
  }

  return (
    <View style={[circleStyle, { backgroundColor: colors.badge }]}>
      <AppText variant="bold" style={{ color: colors.badgeText, fontSize: 13 }}>
        {optionLetter(index)}
      </AppText>
    </View>
  );
}

export default function ChoiceOption({
  index,
  text,
  image,
  multiple = false,
  selected = false,
  correct = false,
  dimmed = false,
  showLetter = false,
  palette = 'brand',
  disabled = false,
  onPress,
}) {
  const colors = stateColors({ selected, correct });
  const active = selected || correct;

  return (
    <PressableScale
      onPress={() => {
        haptics.tap();
        onPress?.();
      }}
      disabled={disabled}
      scaleTo={0.985}
      accessibilityRole={multiple ? 'checkbox' : 'radio'}
      accessibilityLabel={`Option ${optionLetter(index)}. ${text}`}
      accessibilityState={{ selected: active, disabled }}
      style={[
        rowStyle,
        PALETTES[palette]?.row,
        { borderColor: colors.border, backgroundColor: colors.background, borderWidth: active ? 1.5 : 1 },
        dimmed ? { opacity: 0.5 } : null,
      ]}
    >
      <Badge multiple={multiple} index={index} active={active} colors={colors} />
      {multiple && showLetter ? (
        <AppText variant="semiBold" style={{ width: 20, color: colors.text, fontSize: 14 }}>
          {optionLetter(index)}.
        </AppText>
      ) : null}
      <BilingualText variant="medium" style={{ flex: 1, fontSize: 14, lineHeight: 20, color: colors.text }}>
        {text}
      </BilingualText>
      {image ? <QuestionImage uri={image} height={100} /> : null}
    </PressableScale>
  );
}

export function MultiSelectHint({ style }) {
  return <AppText style={[{ fontSize: 12, color: COLORS.slate500, marginTop: 6 }, style]}>Select all that apply.</AppText>;
}

const rowStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 12,
  borderRadius: 10,
};

const circleStyle = {
  width: 28,
  height: 28,
  borderRadius: 14,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
};

const checkboxStyle = {
  width: 24,
  height: 24,
  borderRadius: 6,
  borderWidth: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
};
