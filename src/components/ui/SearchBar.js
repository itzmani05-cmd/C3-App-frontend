import React from 'react';
import { View } from 'react-native';
import { Search } from 'lucide-react-native';
import AppTextInput from './AppTextInput';
import { COLORS, RADII } from '../../theme';

export default function SearchBar({ value, onChangeText, placeholder = 'Search...' }) {
  return (
    <View style={wrapperStyle}>
      <View style={fieldStyle}>
        <Search size={16} color={COLORS.gray400} />
        <AppTextInput
          placeholder={placeholder}
          style={inputStyle}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

const wrapperStyle = {
  height: 48,
  marginTop: 16,
  flexDirection: 'row',
  paddingHorizontal: 16,
  alignItems: 'center',
};

const fieldStyle = {
  flex: 1,
  backgroundColor: COLORS.white,
  height: 48,
  flexDirection: 'row',
  borderRadius: RADII.md,
  alignItems: 'center',
  paddingHorizontal: 12,
  borderColor: COLORS.gray200,
  borderWidth: 1,
  marginRight: 10,
  shadowColor: COLORS.slate900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.04,
  shadowRadius: 6,
  elevation: 1,
};

const inputStyle = {
  flex: 1,
  color: COLORS.black,
  fontSize: 14,
  marginLeft: 10,
};
