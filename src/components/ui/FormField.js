import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS, FONT_FAMILY } from '../../theme';

export default function FormField({ icon: Icon, secure = false, style, ...inputProps }) {
  const [hidden, setHidden] = useState(secure);

  return (
    <View style={[containerStyle, style]}>
      {Icon ? <Icon size={20} color={COLORS.gray500} /> : null}
      <TextInput placeholderTextColor={COLORS.gray400} style={inputStyle} secureTextEntry={hidden} {...inputProps} />
      {secure ? (
        <TouchableOpacity onPress={() => setHidden((value) => !value)}>
          {hidden ? <Eye size={20} color={COLORS.gray500} /> : <EyeOff size={20} color={COLORS.gray500} />}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const containerStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: COLORS.gray300,
  borderRadius: 6,
  height: 50,
  paddingHorizontal: 16,
  marginBottom: 10,
  backgroundColor: COLORS.white,
};

const inputStyle = {
  flex: 1,
  padding: 12,
  color: COLORS.black,
  fontFamily: FONT_FAMILY.regular,
};
