import React from 'react';
import { Text, Platform, StyleSheet } from 'react-native';

/**
 * BilingualText - Renders bilingual English/Tamil text with appropriate fonts
 * 
 * Detects if text contains Tamil Unicode characters and applies appropriate font.
 * Tamil Unicode range: U+0B80 to U+0BFF
 * 
 * Props:
 * - variant: typography variant (regular, medium, semiBold, bold, extraBold)
 * - style: additional styles
 * - children: text content
 * - ...props: other Text props
 */

// Tamil character detection regex
const TAMIL_REGEX = /[\u0B80-\u0BFF]/;

// Font family mapping
const FONT_FAMILY = {
  regular: 'ManropeRegular',
  medium: 'ManropeMedium',
  semiBold: 'ManropeSemiBold',
  bold: 'ManropeBold',
  extraBold: 'ManropeExtraBold',
};

// Tamil font fallback - using system fonts that support Tamil
// On iOS: "Trebuchet MS", "Helvetica", "Apple Color Emoji"
// On Android: "sans-serif", "serif", "monospace" (system fonts have Tamil support)
const TAMIL_FONT_FAMILY = Platform.select({
  ios: 'System', // iOS system font has Tamil support
  android: 'sans-serif', // Android system font has Tamil support
});

/**
 * Split text into segments with language info
 * Returns array of { text, isTamil }
 */
function splitBilingualText(text) {
  if (!text || typeof text !== 'string') {
    return [{ text: String(text || ''), isTamil: false }];
  }

  const segments = [];
  let currentSegment = '';
  let currentIsTamil = null;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isTamilChar = TAMIL_REGEX.test(char);

    if (currentIsTamil === null) {
      currentIsTamil = isTamilChar;
      currentSegment = char;
    } else if (currentIsTamil === isTamilChar) {
      currentSegment += char;
    } else {
      // Language switch detected
      segments.push({ text: currentSegment, isTamil: currentIsTamil });
      currentSegment = char;
      currentIsTamil = isTamilChar;
    }
  }

  // Push final segment
  if (currentSegment) {
    segments.push({ text: currentSegment, isTamil: currentIsTamil });
  }

  return segments;
}

/**
 * Get appropriate font family for text segment
 */
function getFontFamily(isTamil, variant = 'regular') {
  if (isTamil) {
    return TAMIL_FONT_FAMILY;
  }
  return FONT_FAMILY[variant] || FONT_FAMILY.regular;
}

export default function BilingualText({
  variant = 'regular',
  style,
  children,
  ...props
}) {
  // JSX with multiple {}-expressions/literals as children (e.g. `{letter}. {option}`) passes
  // `children` as an array — String() on an array joins with commas ("A,. ,Watt"), so flatten
  // it explicitly instead of relying on String() to do the right thing.
  const textString = Array.isArray(children)
    ? children.map((child) => (child == null ? '' : String(child))).join('')
    : children == null
      ? ''
      : String(children);

  // If no text content, return empty
  if (!textString) {
    return <Text {...props} style={[{ fontFamily: FONT_FAMILY[variant] }, style]} />;
  }

  // Check if text contains Tamil characters
  const hasTamil = TAMIL_REGEX.test(textString);

  // If no Tamil, render normally with Manrope font
  if (!hasTamil) {
    return (
      <Text
        {...props}
        style={[{ fontFamily: FONT_FAMILY[variant] || FONT_FAMILY.regular }, style]}
      >
        {textString}
      </Text>
    );
  }

  // If has Tamil, split and render segments with appropriate fonts
  const segments = splitBilingualText(textString);

  // If only one segment and it's Tamil, render with system font
  if (segments.length === 1 && segments[0].isTamil) {
    return (
      <Text
        {...props}
        style={[{ fontFamily: TAMIL_FONT_FAMILY }, style]}
      >
        {textString}
      </Text>
    );
  }

  // Mixed content - render segments with appropriate fonts
  return (
    <Text {...props} style={style}>
      {segments.map((segment, index) => (
        <Text
          key={index}
          style={{
            fontFamily: getFontFamily(segment.isTamil, variant),
            // Ensure Tamil text renders properly
            ...(segment.isTamil && {
              lineHeight: Platform.select({ ios: 24, android: 26 }),
            }),
          }}
        >
          {segment.text}
        </Text>
      ))}
    </Text>
  );
}
