import React, { useState } from 'react';
import { Modal, Pressable, View, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import AppText from './AppText';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';

function factorial(n) {
  if (n < 0 || !Number.isFinite(n) || Math.floor(n) !== n) return NaN;
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function fmt(n) {
  if (!Number.isFinite(n)) return n === Infinity ? 'Infinity' : Number.isNaN(n) ? 'Error' : '-Infinity';
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();
  let s = n.toPrecision(15);
  if (s.indexOf('e') === -1 && s.indexOf('.') !== -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

const BINARY_SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷', mod: 'mod', '^': 'xʸ' };

export default function ScientificCalculator({ visible, onClose }) {
  // `current` is the operand actively being edited; `expression` is everything typed
  // before it. `result` only ever changes when a calculation actually completes, so it
  // never gets overwritten by keystrokes that are still building the next expression.
  const [current, setCurrent] = useState('0');
  const [expression, setExpression] = useState('');
  const [typingCurrent, setTypingCurrent] = useState(false);
  const [result, setResult] = useState('0');
  const [memory, setMemory] = useState(0);
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [angleMode, setAngleMode] = useState('deg');
  const [pendingOp, setPendingOp] = useState(null);
  const [pendingVal, setPendingVal] = useState(null);

  const toRad = (x) => (angleMode === 'deg' ? (x * Math.PI) / 180 : x);
  const fromRad = (x) => (angleMode === 'deg' ? (x * 180) / Math.PI : x);

  const topLine = justEvaluated ? expression : expression ? (typingCurrent ? `${expression} ${current}` : expression) : current;

  const clearAll = () => {
    setCurrent('0');
    setExpression('');
    setTypingCurrent(false);
    setResult('0');
    setPendingOp(null);
    setPendingVal(null);
    setJustEvaluated(false);
  };

  const backspace = () => {
    if (justEvaluated) return;
    setCurrent((c) => (c.length > 1 ? c.slice(0, -1) : '0'));
  };

  const appendDigit = (d) => {
    let base = current;
    let expr = expression;
    if (justEvaluated) {
      base = '0';
      expr = '';
      setExpression('');
      setJustEvaluated(false);
    }
    if (d === '.') {
      if (base.includes('.')) return;
      base = base === '0' ? '0.' : base + '.';
    } else {
      base = base === '0' ? d : base + d;
    }
    setCurrent(base);
    if (expr !== expression) setExpression(expr);
    setTypingCurrent(true);
  };

  const applyConst = (value) => {
    if (justEvaluated) {
      setExpression('');
      setJustEvaluated(false);
    }
    setCurrent(fmt(value));
    setTypingCurrent(true);
  };

  const performOp = (op, a, b) => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return a / b;
      case 'mod':
        return a % b;
      case '^':
        return Math.pow(a, b);
      default:
        return b;
    }
  };

  const compute = () => {
    if (pendingOp === null || pendingVal === null) return;
    const b = parseFloat(current);
    const out = performOp(pendingOp, pendingVal, b);
    setExpression((expr) => `${expr} ${current} =`);
    setResult(fmt(out));
    setCurrent(fmt(out));
    setTypingCurrent(false);
    setPendingOp(null);
    setPendingVal(null);
    setJustEvaluated(true);
  };

  const startBinary = (op) => {
    const val = parseFloat(current);
    if (Number.isNaN(val)) return;
    let base = val;
    if (pendingOp && !justEvaluated) {
      base = performOp(pendingOp, pendingVal, val);
      setResult(fmt(base));
    }
    setPendingVal(base);
    setPendingOp(op);
    setExpression(`${fmt(base)} ${BINARY_SYMBOLS[op] || op}`);
    setJustEvaluated(false);
    setCurrent('0');
    setTypingCurrent(false);
  };

  const applyUnary = (fn) => {
    const val = parseFloat(current);
    if (Number.isNaN(val)) return;
    let out;
    let label = '';
    switch (fn) {
      case 'sin':
        out = Math.sin(toRad(val));
        label = `sin(${current})`;
        break;
      case 'cos':
        out = Math.cos(toRad(val));
        label = `cos(${current})`;
        break;
      case 'tan':
        out = Math.tan(toRad(val));
        label = `tan(${current})`;
        break;
      case 'asin':
        out = fromRad(Math.asin(val));
        label = `sin⁻¹(${current})`;
        break;
      case 'acos':
        out = fromRad(Math.acos(val));
        label = `cos⁻¹(${current})`;
        break;
      case 'atan':
        out = fromRad(Math.atan(val));
        label = `tan⁻¹(${current})`;
        break;
      case 'ln':
        out = Math.log(val);
        label = `ln(${current})`;
        break;
      case 'log10':
        out = Math.log10(val);
        label = `log(${current})`;
        break;
      case 'exp':
        out = Math.exp(val);
        label = `e^(${current})`;
        break;
      case 'sqrt':
        out = Math.sqrt(val);
        label = `√(${current})`;
        break;
      case 'cbrt':
        out = Math.cbrt(val);
        label = `∛(${current})`;
        break;
      case 'square':
        out = val * val;
        label = `(${current})²`;
        break;
      case 'cube':
        out = val * val * val;
        label = `(${current})³`;
        break;
      case 'inv':
        out = 1 / val;
        label = `1/(${current})`;
        break;
      case 'abs':
        out = Math.abs(val);
        label = `|${current}|`;
        break;
      case 'fact':
        out = factorial(val);
        label = `(${current})!`;
        break;
      case 'negate':
        setCurrent(fmt(-val));
        return;
      default:
        return;
    }
    setExpression(label + ' =');
    setResult(fmt(out));
    setCurrent(fmt(out));
    setTypingCurrent(false);
    setJustEvaluated(true);
  };

  const memAction = (a) => {
    const val = parseFloat(current);
    switch (a) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setExpression('MR =');
        setResult(fmt(memory));
        setCurrent(fmt(memory));
        setTypingCurrent(false);
        setJustEvaluated(true);
        break;
      case 'MS':
        setMemory(val);
        break;
      case 'M+':
        setMemory((m) => m + val);
        break;
      case 'M-':
        setMemory((m) => m - val);
        break;
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.35)', alignItems: 'flex-end', paddingTop: 100, paddingRight: 16 }}
        onPress={onClose}
      >
        <Pressable
          onPress={() => {}}
          style={{
            width: 300,
            maxWidth: '92%',
            borderRadius: RADII.xxl,
            overflow: 'hidden',
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.slate200,
            ...SHADOWS.lg,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 14,
              paddingVertical: 10,
              backgroundColor: COLORS.slate50,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.slate100,
            }}
          >
            <AppText variant="bold" style={{ fontSize: 11, letterSpacing: 0.4, color: COLORS.slate500 }}>
              CALCULATOR
            </AppText>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ flexDirection: 'row', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.slate200 }}>
                {['deg', 'rad'].map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => setAngleMode(mode)}
                    activeOpacity={0.7}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 5,
                      backgroundColor: angleMode === mode ? COLORS.brand600 : COLORS.white,
                    }}
                  >
                    <AppText variant="bold" style={{ fontSize: 10, color: angleMode === mode ? COLORS.white : COLORS.slate500 }}>
                      {mode.toUpperCase()}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={{ padding: 4 }}>
                <X size={16} color={COLORS.slate400} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ backgroundColor: COLORS.slate900, paddingHorizontal: 14, paddingVertical: 12, gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <AppText numberOfLines={1} style={{ flex: 1, textAlign: 'right', fontSize: 11, color: COLORS.slate400 }}>
                {topLine || ' '}
              </AppText>
              {memory !== 0 ? (
                <View style={{ borderWidth: 1, borderColor: COLORS.slate600, borderRadius: 4, paddingHorizontal: 4, marginLeft: 6 }}>
                  <AppText variant="bold" style={{ fontSize: 10, color: COLORS.brand500 }}>M</AppText>
                </View>
              ) : null}
            </View>
            <AppText numberOfLines={1} variant="extraBold" style={{ textAlign: 'right', fontSize: 26, color: COLORS.white }}>
              {result}
            </AppText>
          </View>

          <View style={{ padding: 10, gap: 6 }}>
            <CalcRow>
              {memKey('MC', () => memAction('MC'))}
              {memKey('MR', () => memAction('MR'))}
              {memKey('MS', () => memAction('MS'))}
              {memKey('M+', () => memAction('M+'))}
              {memKey('M-', () => memAction('M-'))}
            </CalcRow>

            <CalcRow>
              {fnKey('sin', () => applyUnary('sin'))}
              {fnKey('cos', () => applyUnary('cos'))}
              {fnKey('tan', () => applyUnary('tan'))}
              {fnKey('x²', () => applyUnary('square'))}
              {fnKey('√', () => applyUnary('sqrt'))}
            </CalcRow>
            <CalcRow>
              {fnKey('sin⁻¹', () => applyUnary('asin'))}
              {fnKey('cos⁻¹', () => applyUnary('acos'))}
              {fnKey('tan⁻¹', () => applyUnary('atan'))}
              {fnKey('x³', () => applyUnary('cube'))}
              {fnKey('xʸ', () => startBinary('^'))}
            </CalcRow>
            <CalcRow>
              {fnKey('ln', () => applyUnary('ln'))}
              {fnKey('log', () => applyUnary('log10'))}
              {fnKey('n!', () => applyUnary('fact'))}
              {fnKey('eˣ', () => applyUnary('exp'))}
              {fnKey('1/x', () => applyUnary('inv'))}
            </CalcRow>
            <CalcRow>
              {fnKey('π', () => applyConst(Math.PI))}
              {fnKey('e', () => applyConst(Math.E))}
              {fnKey('mod', () => startBinary('mod'))}
              {fnKey('∛', () => applyUnary('cbrt'))}
              {fnKey('|x|', () => applyUnary('abs'))}
            </CalcRow>

            <CalcRow>
              {numKey('7', () => appendDigit('7'))}
              {numKey('8', () => appendDigit('8'))}
              {numKey('9', () => appendDigit('9'))}
              {opKey('÷', () => startBinary('/'))}
              {opKey('C', clearAll)}
            </CalcRow>
            <CalcRow>
              {numKey('4', () => appendDigit('4'))}
              {numKey('5', () => appendDigit('5'))}
              {numKey('6', () => appendDigit('6'))}
              {opKey('×', () => startBinary('*'))}
              {opKey('←', backspace)}
            </CalcRow>
            <CalcRow>
              {numKey('1', () => appendDigit('1'))}
              {numKey('2', () => appendDigit('2'))}
              {numKey('3', () => appendDigit('3'))}
              {opKey('−', () => startBinary('-'))}
              {fnKey('+/-', () => applyUnary('negate'))}
            </CalcRow>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {numKey('0', () => appendDigit('0'))}
              {numKey('.', () => appendDigit('.'))}
              {opKey('+', () => startBinary('+'))}
              <TouchableOpacity
                onPress={compute}
                activeOpacity={0.85}
                style={{
                  flexBasis: '38%',
                  flexGrow: 1,
                  borderRadius: RADII.xl,
                  backgroundColor: COLORS.brand600,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                }}
              >
                <AppText variant="bold" style={{ color: COLORS.white, fontSize: 15 }}>=</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function CalcRow({ children }) {
  return <View style={{ flexDirection: 'row', gap: 6 }}>{children}</View>;
}

function numKey(label, onPress) {
  return (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexBasis: '18%',
        flexGrow: 1,
        borderRadius: RADII.xl,
        backgroundColor: COLORS.slate100,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
      }}
    >
      <AppText variant="bold" style={{ fontSize: 14, color: COLORS.slate800 }}>{label}</AppText>
    </TouchableOpacity>
  );
}

function opKey(label, onPress) {
  return (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexBasis: '18%',
        flexGrow: 1,
        borderRadius: RADII.xl,
        backgroundColor: COLORS.brand50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
      }}
    >
      <AppText variant="bold" style={{ fontSize: 14, color: COLORS.brand700 }}>{label}</AppText>
    </TouchableOpacity>
  );
}

function fnKey(label, onPress) {
  return (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexBasis: '18%',
        flexGrow: 1,
        borderRadius: RADII.xl,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.slate200,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
      }}
    >
      <AppText variant="bold" style={{ fontSize: 10.5, color: COLORS.slate600 }}>{label}</AppText>
    </TouchableOpacity>
  );
}

function memKey(label, onPress) {
  return (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexBasis: '18%',
        flexGrow: 1,
        borderRadius: RADII.xl,
        backgroundColor: COLORS.slate800,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 7,
      }}
    >
      <AppText variant="bold" style={{ fontSize: 9.5, color: COLORS.slate200, letterSpacing: 0.3 }}>{label}</AppText>
    </TouchableOpacity>
  );
}
