import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from '../../icons';
import AppText from '../ui/AppText';
import { haptics } from '../../utils/haptics';
import { INITIAL_STATE, press, prettyExpression } from '../../utils/calculator';

// A scientific calculator laid out like the GATE virtual calculator: a blue title bar, two white display lines (what was
// typed, and the number or answer), scientific keys on the left and the number pad on the right. On a phone the two
// halves are stacked instead of side by side, so every key stays big enough to tap.

const WIDE_BREAKPOINT = 600;
const GAP = 4;

const PALETTE = {
  title: '#4285F4',
  helpButton: 'rgba(255,255,255,0.28)',
  body: '#D9D9D9',
  bodyEdge: '#9B9B9B',
  displayBorder: '#BDBDBD',
  text: '#222222',
  radio: '#1E88E5',
};

const KEY_TONES = {
  plain: { background: '#F4F4F4', border: '#C9C9C9', edge: '#A8A8A8', text: '#2B2B2B' },
  quiet: { background: '#EDEDED', border: '#D0D0D0', edge: '#BDBDBD', text: '#6B6B6B' },
  red: { background: '#E74C3C', border: '#D9453A', edge: '#B93A2E', text: '#FFFFFF' },
  green: { background: '#2ECC71', border: '#2BBF69', edge: '#239B56', text: '#FFFFFF' },
};

// [key, label, spoken name]. Labels use ^{...} for a raised character and _{...} for a lowered one.
const MEMORY_KEYS = [
  ['MC', 'MC', 'Memory clear'],
  ['MR', 'MR', 'Memory recall'],
  ['MS', 'MS', 'Memory store'],
  ['M+', 'M+', 'Memory add'],
  ['M-', 'M-', 'Memory subtract'],
];

const SCIENTIFIC_ROWS = [
  [
    ['sinh', 'sinh', 'Hyperbolic sine'],
    ['cosh', 'cosh', 'Hyperbolic cosine'],
    ['tanh', 'tanh', 'Hyperbolic tangent'],
    ['E', 'Exp', 'Exp, times ten to the power'],
    ['(', '(', 'Open bracket'],
    [')', ')', 'Close bracket'],
  ],
  [
    ['asinh', 'sinh^{-1}', 'Inverse hyperbolic sine'],
    ['acosh', 'cosh^{-1}', 'Inverse hyperbolic cosine'],
    ['atanh', 'tanh^{-1}', 'Inverse hyperbolic tangent'],
    ['log2', 'log_{2}x', 'Log base 2'],
    ['ln', 'ln', 'Natural log'],
    ['log', 'log', 'Log base 10'],
  ],
  [
    ['pi', 'π', 'Pi'],
    ['e', 'e', 'Euler number'],
    ['fact', 'n!', 'Factorial'],
    ['logb', 'log_{y}x', 'Log base y of x'],
    ['ex', 'e^{x}', 'e to the power x'],
    ['tenx', '10^{x}', 'Ten to the power x'],
  ],
  [
    ['sin', 'sin', 'Sine'],
    ['cos', 'cos', 'Cosine'],
    ['tan', 'tan', 'Tangent'],
    ['^', 'x^{y}', 'x to the power y'],
    ['cube', 'x^{3}', 'x cubed'],
    ['sq', 'x^{2}', 'x squared'],
  ],
  [
    ['asin', 'sin^{-1}', 'Inverse sine'],
    ['acos', 'cos^{-1}', 'Inverse cosine'],
    ['atan', 'tan^{-1}', 'Inverse tangent'],
    ['rt', '^{y}√x', 'y-th root of x'],
    ['cbrt', '^{3}√', 'Cube root'],
    ['abs', '|x|', 'Absolute value'],
  ],
];

const HELP_LINES = [
  'Type an expression with the keys, then press = to see the answer. Brackets and the order of operations work as usual.',
  'Keys such as sin, ln, √ and x² apply to the number or bracket just before them. With nothing before them, they open a bracket.',
  'ʸ√x and logᵧx take two numbers: type y, press the key, then type x. For example 3 ʸ√x 27 = 3 and 2 logᵧx 8 = 3.',
  'Exp enters a power of ten: 1.5 Exp 3 = 1500.',
  'MS stores the number on screen, MR puts it back, M+ and M- add to or subtract from it, and MC clears it.',
];

// A label with raised and lowered characters, drawn from separate pieces so it looks the same in every font.
function KeyLabel({ text, color, size }) {
  const parts = text.split(/(\^\{[^}]*\}|_\{[^}]*\})/).filter(Boolean);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {parts.map((part, index) => {
        const raised = part.startsWith('^{');
        const lowered = part.startsWith('_{');
        return (
          <AppText
            key={index}
            variant="medium"
            style={{
              color,
              fontSize: raised || lowered ? size * 0.68 : size,
              top: raised ? -size * 0.3 : lowered ? size * 0.28 : 0,
              includeFontPadding: false,
            }}
          >
            {raised || lowered ? part.slice(2, -1) : part}
          </AppText>
        );
      })}
    </View>
  );
}

function CalcKey({ label, name, onPress, tone = 'plain', flex = 1, height, size }) {
  const colors = KEY_TONES[tone];
  return (
    <TouchableOpacity
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel={name || label}
      style={{
        flex,
        height,
        minWidth: 0,
        borderRadius: 4,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderBottomWidth: 3,
        borderBottomColor: colors.edge,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <KeyLabel text={label} color={colors.text} size={size} />
    </TouchableOpacity>
  );
}

function Row({ children }) {
  return <View style={{ flexDirection: 'row', gap: GAP }}>{children}</View>;
}

function Display({ text, size, height, flag }) {
  return (
    <View
      style={{
        height,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: PALETTE.displayBorder,
        backgroundColor: '#FFFFFF',
      }}
    >
      {flag ? (
        <AppText variant="bold" style={{ fontSize: 11, color: PALETTE.radio }}>
          {flag}
        </AppText>
      ) : null}
      <AppText numberOfLines={1} ellipsizeMode="head" adjustsFontSizeToFit style={{ flex: 1, textAlign: 'right', fontSize: size, color: PALETTE.text }}>
        {text || ' '}
      </AppText>
    </View>
  );
}

function AngleModeSwitch({ mode, onChange }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }} accessibilityRole="radiogroup">
      {[
        ['deg', 'Deg'],
        ['rad', 'Rad'],
      ].map(([value, label]) => (
        <TouchableOpacity
          key={value}
          onPress={() => onChange(value)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          accessibilityRole="radio"
          accessibilityLabel={label === 'Deg' ? 'Degrees' : 'Radians'}
          accessibilityState={{ selected: mode === value }}
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}
        >
          <View style={{ width: 17, height: 17, borderRadius: 9, borderWidth: 2, borderColor: mode === value ? PALETTE.radio : '#8A8A8A', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
            {mode === value ? <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: PALETTE.radio }} /> : null}
          </View>
          <AppText style={{ marginLeft: 4, fontSize: 13, color: PALETTE.text }}>{label}</AppText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TitleBar({ collapsed, helpOpen, onToggleHelp, onToggleCollapsed, onClose }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: PALETTE.title, paddingLeft: 14, paddingRight: 10, height: 50 }}>
      <AppText numberOfLines={1} style={{ flex: 1, fontSize: 17, color: '#FFFFFF' }}>
        Scientific Calculator
      </AppText>
      <TouchableOpacity
        onPress={onToggleHelp}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={helpOpen ? 'Hide help' : 'Show help'}
        style={{ backgroundColor: PALETTE.helpButton, borderRadius: 3, paddingHorizontal: 12, paddingVertical: 6, marginRight: 10 }}
      >
        <AppText variant="bold" style={{ fontSize: 13, color: '#FFFFFF' }}>
          Help
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onToggleCollapsed}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        accessibilityRole="button"
        accessibilityLabel={collapsed ? 'Expand calculator' : 'Minimise calculator'}
        style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}
      >
        <View style={{ width: 16, height: 3, backgroundColor: '#FFFFFF', marginTop: collapsed ? 0 : 8 }} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
        accessibilityRole="button"
        accessibilityLabel="Close calculator"
        style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}
      >
        <X size={22} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

function HelpCard() {
  return (
    <View style={{ backgroundColor: '#FFFFFF', borderRadius: 3, borderWidth: 1, borderColor: PALETTE.displayBorder, padding: 10, marginBottom: 8, gap: 6 }}>
      {HELP_LINES.map((line) => (
        <AppText key={line} style={{ fontSize: 12.5, lineHeight: 18, color: PALETTE.text }}>
          {line}
        </AppText>
      ))}
    </View>
  );
}

export default function ScientificCalculator({ visible, onClose }) {
  const [state, setState] = useState(INITIAL_STATE);
  const [collapsed, setCollapsed] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  const wide = width >= WIDE_BREAKPOINT;
  const panelWidth = Math.min(width - 16, wide ? 620 : 420);
  const keyHeight = wide ? 36 : 38;
  const labelSize = wide ? 13 : 14;
  const digitSize = wide ? 17 : 18;
  const topOffset = insets.top + 48;
  const bodyMaxHeight = Math.max(240, height - topOffset - insets.bottom - 50 - 24);

  const send = (key) => () => setState((current) => press(current, key));
  const key = ([id, label, name], options = {}) => (
    <CalcKey key={id} label={label} name={name} onPress={send(id)} height={keyHeight} size={labelSize} {...options} />
  );
  const digit = (value) => key([value, value, undefined], { size: digitSize });

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', paddingTop: topOffset }} onPress={onClose}>
        <Pressable
          onPress={() => {}}
          style={{
            width: panelWidth,
            borderRadius: 6,
            overflow: 'hidden',
            backgroundColor: PALETTE.body,
            borderBottomWidth: 9,
            borderBottomColor: PALETTE.bodyEdge,
          }}
        >
          <TitleBar
            collapsed={collapsed}
            helpOpen={helpOpen}
            onToggleHelp={() => setHelpOpen((open) => !open)}
            onToggleCollapsed={() => setCollapsed((value) => !value)}
            onClose={onClose}
          />

          {collapsed ? null : (
            <ScrollView style={{ maxHeight: bodyMaxHeight }} contentContainerStyle={{ padding: 10 }} bounces={false} showsVerticalScrollIndicator={false}>
              {helpOpen ? <HelpCard /> : null}

              <View style={{ gap: 8 }}>
                <Display text={prettyExpression(state.expression)} size={wide ? 24 : 22} height={44} />
                <Display text={state.result} size={wide ? 26 : 24} height={46} flag={state.memory !== 0 ? 'M' : null} />
              </View>

              <View style={{ flexDirection: wide ? 'row' : 'column', gap: wide ? 10 : 8, marginTop: 10 }}>
                <View style={{ flex: wide ? 6 : undefined, gap: GAP }}>
                  <Row>
                    {key(['mod', 'mod', 'Modulo'])}
                    <View style={{ flex: 5, justifyContent: 'center' }}>
                      <AngleModeSwitch mode={state.angleMode} onChange={(mode) => setState((current) => press(current, mode))} />
                    </View>
                  </Row>
                  {SCIENTIFIC_ROWS.map((row, index) => (
                    <Row key={index}>{row.map((spec) => key(spec))}</Row>
                  ))}
                </View>

                <View style={{ flex: wide ? 5 : undefined, gap: GAP }}>
                  <Row>{MEMORY_KEYS.map((spec) => key(spec, { size: labelSize - 1 }))}</Row>
                  <Row>
                    {key(['back', '←', 'Backspace'], { flex: 2, tone: 'red', size: digitSize + 2 })}
                    {key(['clear', 'C', 'Clear'], { tone: 'red', size: digitSize })}
                    {key(['neg', '+/-', 'Plus or minus'], { tone: 'red' })}
                    {key(['sqrt', '√', 'Square root'], { tone: 'quiet', size: digitSize })}
                  </Row>
                  <Row>
                    {digit('7')}
                    {digit('8')}
                    {digit('9')}
                    {key(['/', '/', 'Divide'], { size: digitSize })}
                    {key(['pct', '%', 'Percent'], { size: digitSize })}
                  </Row>
                  <Row>
                    {digit('4')}
                    {digit('5')}
                    {digit('6')}
                    {key(['*', '*', 'Multiply'], { size: digitSize })}
                    {key(['inv', '1/x', 'One over x'])}
                  </Row>
                  <View style={{ flexDirection: 'row', gap: GAP }}>
                    <View style={{ flex: 4, gap: GAP }}>
                      <Row>
                        {digit('1')}
                        {digit('2')}
                        {digit('3')}
                        {key(['-', '−', 'Minus'], { size: digitSize })}
                      </Row>
                      <Row>
                        {key(['0', '0', undefined], { flex: 2, size: digitSize })}
                        {key(['.', '.', 'Decimal point'], { size: digitSize })}
                        {key(['+', '+', 'Plus'], { size: digitSize })}
                      </Row>
                    </View>
                    <View style={{ flex: 1 }}>{key(['eq', '=', 'Equals'], { tone: 'green', height: undefined, size: digitSize + 4 })}</View>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
