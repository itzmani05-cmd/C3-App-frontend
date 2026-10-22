import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Search, X } from '../../icons';
import AppTextInput from './AppTextInput';
import { COLORS } from '../../theme';

export default function SearchBar({ value, onChangeText, placeholder = 'Search...' }) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={wrapperStyle}>
      <View style={[fieldStyle, { borderColor: focused ? COLORS.brand600 : COLORS.slate200, borderWidth: focused ? 1.5 : 1 }]}>
        <Search size={17} color={focused ? COLORS.brand600 : COLORS.slate400} />
        <AppTextInput
          placeholder={placeholder}
          placeholderTextColor={COLORS.slate500}
          style={inputStyle}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel={placeholder}
        />
        {value ? (
          <TouchableOpacity onPress={() => onChangeText('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityLabel="Clear search">
            <X size={16} color={COLORS.slate400} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const wrapperStyle = {
  marginTop: 16,
  paddingHorizontal: 16,
};

const fieldStyle = {
  backgroundColor: COLORS.white,
  height: 46,
  flexDirection: 'row',
  borderRadius: 10,
  alignItems: 'center',
  paddingHorizontal: 12,
};

const inputStyle = {
  flex: 1,
  color: COLORS.slate900,
  fontSize: 14,
  marginLeft: 10,
  paddingVertical: 0,
};
