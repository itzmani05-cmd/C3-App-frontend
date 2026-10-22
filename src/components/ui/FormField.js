import React, { forwardRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Eye, EyeOff } from '../../icons';
import { COLORS, FONT_FAMILY, tw } from '../../theme';

/**
 * Text input with an optional label, leading icon, password toggle and inline error. `style` styles the wrapper, so
 * callers can set margins; everything else goes to the TextInput. The ref points at the TextInput.
 */
const FormField = forwardRef(function FormField(
  { label, error, icon: Icon, secure = false, style, onFocus, onBlur, ...inputProps },
  ref
) {
  const [hidden, setHidden] = useState(secure);
  const [focused, setFocused] = useState(false);

  const borderColor = error ? COLORS.danger500 : focused ? COLORS.brand600 : COLORS.slate300;

  return (
    <View style={[tw`mb-3`, style]}>
      {label ? (
        <Text style={[tw`mb-1.5 text-sm text-slate-700`, { fontFamily: FONT_FAMILY.medium }]}>{label}</Text>
      ) : null}

      <View style={[containerStyle, { borderColor, borderWidth: focused ? 1.5 : 1 }]}>
        {Icon ? <Icon size={18} color={focused ? COLORS.brand600 : COLORS.slate400} /> : null}
        <TextInput
          ref={ref}
          placeholderTextColor={COLORS.slate500}
          style={inputStyle}
          secureTextEntry={hidden}
          accessibilityLabel={label || inputProps.placeholder}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />
        {secure ? (
          <TouchableOpacity
            onPress={() => setHidden((value) => !value)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            {hidden ? <Eye size={18} color={COLORS.slate400} /> : <EyeOff size={18} color={COLORS.slate400} />}
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? <Text style={[tw`mt-1 text-xs text-red-600`, { fontFamily: FONT_FAMILY.medium }]}>{error}</Text> : null}
    </View>
  );
});

export default FormField;

const containerStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 8,
  height: 48,
  paddingHorizontal: 14,
  backgroundColor: COLORS.white,
};

const inputStyle = {
  flex: 1,
  paddingHorizontal: 10,
  paddingVertical: 0,
  fontSize: 15,
  color: COLORS.slate900,
  fontFamily: FONT_FAMILY.regular,
};
