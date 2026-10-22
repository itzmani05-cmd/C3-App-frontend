import React from 'react';
import { TextInput } from 'react-native';
import { COLORS, RADII } from '../../theme';

export default function NumericalAnswerInput({ value, onChange, style }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="Enter your answer"
      placeholderTextColor={COLORS.slate500}
      keyboardType="numeric"
      style={[inputStyle, style]}
    />
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: COLORS.slate200,
  borderRadius: RADII.md,
  padding: 12,
  marginTop: 10,
  fontSize: 15,
  color: COLORS.slate900,
  backgroundColor: COLORS.white,
};
