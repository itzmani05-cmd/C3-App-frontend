import React from 'react';
import { Text, TextInput } from 'react-native';

export const FONT_FAMILY = {
  regular: 'ManropeRegular',
  medium: 'ManropeMedium',
  semiBold: 'ManropeSemiBold',
  bold: 'ManropeBold',
  extraBold: 'ManropeExtraBold',
};

export const DEFAULT_TEXT_STYLE = {
  fontFamily: FONT_FAMILY.regular,
};

export const DEFAULT_INPUT_STYLE = {
  fontFamily: FONT_FAMILY.regular,
};

export const TAB_BAR_LABEL_STYLE = {
  fontFamily: FONT_FAMILY.semiBold,
  fontSize: 11,
};

let typographyApplied = false;

export function applyGlobalTypographyDefaults() {
  if (typographyApplied) {
    return;
  }

  typographyApplied = true;

  if (Text.render) {
    const oldTextRender = Text.render;
    Text.render = function (...args) {
      const origin = oldTextRender.call(this, ...args);
      return React.cloneElement(origin, {
        style: [DEFAULT_TEXT_STYLE, origin.props.style],
      });
    };
  }

  if (TextInput.render) {
    const oldTextInputRender = TextInput.render;
    TextInput.render = function (...args) {
      const origin = oldTextInputRender.call(this, ...args);
      return React.cloneElement(origin, {
        style: [DEFAULT_INPUT_STYLE, origin.props.style],
      });
    };
  }

  TextInput.defaultProps = TextInput.defaultProps || {};
  if (!TextInput.defaultProps.placeholderTextColor) {
    TextInput.defaultProps.placeholderTextColor = '#6B7280';
  }
}
