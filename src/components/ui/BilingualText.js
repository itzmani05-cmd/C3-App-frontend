import React from 'react';
import { Platform, Text } from 'react-native';
import { FONT_FAMILY } from '../../theme';
import { hasMath } from '../../utils/mathTokens';
import MathText from './MathText';

const TAMIL_REGEX = /[஀-௿]/;

const TAMIL_FONT_FAMILY = Platform.select({
  ios: 'System',
  android: 'sans-serif',
});

const TAMIL_LINE_HEIGHT = Platform.select({ ios: 24, android: 26 });

function splitBilingualText(text) {
  const segments = [];
  let currentSegment = '';
  let currentIsTamil = null;

  for (const char of text) {
    const isTamilChar = TAMIL_REGEX.test(char);
    if (currentIsTamil === null || currentIsTamil === isTamilChar) {
      currentSegment += char;
      currentIsTamil = isTamilChar;
    } else {
      segments.push({ text: currentSegment, isTamil: currentIsTamil });
      currentSegment = char;
      currentIsTamil = isTamilChar;
    }
  }

  if (currentSegment) segments.push({ text: currentSegment, isTamil: currentIsTamil });
  return segments;
}

function toText(children) {
  if (Array.isArray(children)) return children.map((child) => (child == null ? '' : String(child))).join('');
  return children == null ? '' : String(children);
}

export default function BilingualText({ variant = 'regular', style, children, ...props }) {
  const textString = toText(children);
  const latinFont = FONT_FAMILY[variant] || FONT_FAMILY.regular;

  // Text with a LaTeX formula is typeset instead of shown as raw $…$.
  if (hasMath(textString)) return <MathText text={textString} variant={variant} style={style} />;

  if (!textString || !TAMIL_REGEX.test(textString)) {
    return (
      <Text {...props} style={[{ fontFamily: latinFont }, style]}>
        {textString}
      </Text>
    );
  }

  const segments = splitBilingualText(textString);

  if (segments.length === 1) {
    return (
      <Text {...props} style={[{ fontFamily: TAMIL_FONT_FAMILY }, style]}>
        {textString}
      </Text>
    );
  }

  return (
    <Text {...props} style={style}>
      {segments.map((segment, index) => (
        <Text
          key={index}
          style={
            segment.isTamil
              ? { fontFamily: TAMIL_FONT_FAMILY, lineHeight: TAMIL_LINE_HEIGHT }
              : { fontFamily: latinFont }
          }
        >
          {segment.text}
        </Text>
      ))}
    </Text>
  );
}
