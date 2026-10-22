import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { COLORS } from '../../theme';

// Small flat illustrations for empty and error states, drawn in the brand palette.
const KINDS = {
  // a stack of cards with lines of text
  empty: (
    <>
      <Rect x="28" y="22" width="64" height="52" rx="8" fill={COLORS.brand100} transform="rotate(-8 60 48)" />
      <Rect x="26" y="20" width="68" height="54" rx="8" fill={COLORS.white} stroke={COLORS.slate200} strokeWidth="1.5" />
      <Rect x="36" y="32" width="26" height="6" rx="3" fill={COLORS.brand600} />
      <Rect x="36" y="46" width="48" height="5" rx="2.5" fill={COLORS.slate200} />
      <Rect x="36" y="57" width="36" height="5" rx="2.5" fill={COLORS.slate200} />
      <Circle cx="94" cy="24" r="7" fill={COLORS.amber100} />
      <Circle cx="22" cy="70" r="4" fill={COLORS.brand100} />
    </>
  ),
  // a magnifier with nothing under it
  search: (
    <>
      <Circle cx="54" cy="44" r="22" fill={COLORS.brand50} stroke={COLORS.brand600} strokeWidth="4" />
      <Line x1="71" y1="61" x2="90" y2="80" stroke={COLORS.brand600} strokeWidth="6" strokeLinecap="round" />
      <Path d="M44 44h20M54 34v20" stroke={COLORS.brand100} strokeWidth="3" strokeLinecap="round" transform="rotate(45 54 44)" />
      <Circle cx="96" cy="26" r="5" fill={COLORS.amber100} />
      <Circle cx="24" cy="74" r="4" fill={COLORS.brand100} />
    </>
  ),
  // a cloud with a slash through it
  offline: (
    <>
      <Path
        d="M34 72h50a17 17 0 0 0 2-33.9A23 23 0 0 0 42 36a19 19 0 0 0-8 36z"
        fill={COLORS.slate100}
        stroke={COLORS.slate300}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <Line x1="38" y1="24" x2="86" y2="82" stroke={COLORS.red600} strokeWidth="5" strokeLinecap="round" />
      <Circle cx="96" cy="24" r="5" fill={COLORS.red100} />
      <Circle cx="22" cy="68" r="4" fill={COLORS.slate200} />
    </>
  ),
};

export default function Illustration({ kind = 'empty', size = 120 }) {
  return (
    <Svg width={size} height={size * 0.8} viewBox="0 0 120 96" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {KINDS[kind] || KINDS.empty}
    </Svg>
  );
}
