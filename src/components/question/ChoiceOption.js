import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from '../ui/AppText';
import BilingualText from '../ui/BilingualText';
import QuestionImage from './QuestionImage';
import { COLORS, RADII } from '../../theme';

const PALETTES = {
  brand: {
    row: { borderColor: COLORS.slate200, backgroundColor: COLORS.white, borderRadius: RADII.xl, marginTop: 10 },
    selectedRow: { borderColor: COLORS.brand500, backgroundColor: COLORS.brand50 },
    indicator: COLORS.slate300,
    indicatorSelected: COLORS.brand600,
    letter: COLORS.slate700,
    text: COLORS.slate700,
  },
  blue: {
    row: { borderColor: COLORS.gray200, backgroundColor: COLORS.white, borderRadius: RADII.md, marginBottom: 10 },
    selectedRow: { borderColor: COLORS.blue300, backgroundColor: COLORS.blue50 },
    correctRow: { borderColor: COLORS.green300, backgroundColor: COLORS.green50 },
    indicator: COLORS.gray300,
    indicatorSelected: COLORS.blue600,
    indicatorCorrect: COLORS.green600,
    letter: COLORS.white,
    text: COLORS.gray700,
  },
};

export const optionLetter = (index) => String.fromCharCode(65 + index);

function Indicator({ multiple, index, active, color, letterColor }) {
  if (multiple) {
    return (
      <View style={[checkboxStyle, { borderColor: active ? color : COLORS.slate300, backgroundColor: active ? color : COLORS.white }]}>
        {active ? (
          <AppText variant="bold" style={{ color: COLORS.white, fontSize: 13 }}>
            ✓
          </AppText>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[circleStyle, { backgroundColor: color }]}>
      <AppText variant="bold" style={{ color: active ? COLORS.white : letterColor, fontSize: 13 }}>
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
  const colors = PALETTES[palette];
  const indicatorColor = correct ? colors.indicatorCorrect : selected ? colors.indicatorSelected : colors.indicator;
  const stateRow = correct ? colors.correctRow : selected ? colors.selectedRow : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[rowStyle, colors.row, stateRow, dimmed ? { opacity: 0.5 } : null]}
    >
      <Indicator
        multiple={multiple}
        index={index}
        active={selected || correct}
        color={multiple ? (selected ? colors.indicatorSelected : null) : indicatorColor}
        letterColor={colors.letter}
      />
      {multiple && showLetter ? (
        <AppText variant="semiBold" style={{ width: 20, color: colors.text, fontSize: 14 }}>
          {optionLetter(index)}.
        </AppText>
      ) : null}
      <BilingualText variant="medium" style={{ flex: 1, fontSize: 14, color: colors.text }}>
        {text}
      </BilingualText>
      {image ? <QuestionImage uri={image} height={100} /> : null}
    </TouchableOpacity>
  );
}

export function MultiSelectHint({ style }) {
  return (
    <AppText style={[{ fontSize: 12, color: COLORS.slate500, marginTop: 6 }, style]}>Select all that apply.</AppText>
  );
}

const rowStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
  borderWidth: 1,
};

const circleStyle = {
  width: 28,
  height: 28,
  borderRadius: 14,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
};

const checkboxStyle = {
  width: 24,
  height: 24,
  borderRadius: 6,
  borderWidth: 2,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
};
