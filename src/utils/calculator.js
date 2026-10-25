// The logic of the scientific calculator, kept free of React so it can be tested on its own.
//
// The student builds an expression by pressing keys (`press`), and `=` evaluates it with the usual order of operations,
// brackets and implicit multiplication ("2(3+4)", "2π"). Keys like sin or √ apply to the number or bracket just before
// them, or open a bracket when there is nothing before them. Missing closing brackets are closed automatically.

const FUNCTIONS = ['asinh', 'acosh', 'atanh', 'sinh', 'cosh', 'tanh', 'asin', 'acos', 'atan', 'sin', 'cos', 'tan', 'log2', 'log', 'ln', 'exp', 'sqrt', 'cbrt', 'abs'];
const WORD_OPERATORS = ['logb', 'mod', 'rt'];
// Longest first, so "asin" is not read as "a" + "sin" and "exp" is not read as the constant "e".
const NAMES = [...FUNCTIONS, ...WORD_OPERATORS, 'e'].sort((a, b) => b.length - a.length);

const NUMBER_AT_START = /^(?:\d+\.?\d*|\.\d+)(?:E[+-]?\d+)?/;
const NUMBER_AT_END = /(?:\d+\.?\d*|\.\d+)(?:E[+-]?\d+)?$/;
const TRAILING_OPERATORS = /(?:[+\-*/^]| (?:mod|rt|logb) )+$/;
const PENDING_EXPONENT = /E[+-]?$/;

const DIGITS = '0123456789';
const MAX_FACTORIAL = 170;

// --- evaluating -------------------------------------------------------------------------------------------------------

function tokenize(source) {
  const tokens = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (ch === ' ') {
      i += 1;
      continue;
    }
    const number = NUMBER_AT_START.exec(source.slice(i));
    if (number) {
      tokens.push({ type: 'num', value: parseFloat(number[0].replace('E', 'e')) });
      i += number[0].length;
    } else if (ch === 'π') {
      tokens.push({ type: 'num', value: Math.PI });
      i += 1;
    } else if ('+-*/^!%()'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i += 1;
    } else {
      const name = NAMES.find((candidate) => source.startsWith(candidate, i));
      if (!name) throw new Error(`Unexpected "${ch}"`);
      if (name === 'e') tokens.push({ type: 'num', value: Math.E });
      else tokens.push({ type: WORD_OPERATORS.includes(name) ? 'op' : 'fn', value: name });
      i += name.length;
    }
  }
  return tokens;
}

function factorial(n) {
  if (n < 0 || !Number.isFinite(n) || Math.floor(n) !== n) return NaN;
  if (n > MAX_FACTORIAL) return Infinity;
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

// Trig answers carry rounding noise: sin 180° comes out as 1.2e-16 and sin 30° as 0.49999999999999994. Tiny values become 0
// and the rest are rounded to the 15 digits a double can be trusted with.
const tidy = (value) => (Math.abs(value) < 1e-14 ? 0 : Number(value.toPrecision(15)));

function applyFunction(name, x, angleMode) {
  const toRadians = (value) => (angleMode === 'deg' ? (value * Math.PI) / 180 : value);
  const fromRadians = (value) => (angleMode === 'deg' ? (value * 180) / Math.PI : value);

  switch (name) {
    case 'sin':
      return tidy(Math.sin(toRadians(x)));
    case 'cos':
      return tidy(Math.cos(toRadians(x)));
    case 'tan':
      // tan is undefined at 90°, 270°, ... where floating point would give a huge number instead.
      return angleMode === 'deg' && Math.abs(x % 180) === 90 ? NaN : tidy(Math.tan(toRadians(x)));
    case 'asin':
      return fromRadians(Math.asin(x));
    case 'acos':
      return fromRadians(Math.acos(x));
    case 'atan':
      return fromRadians(Math.atan(x));
    case 'sinh':
      return Math.sinh(x);
    case 'cosh':
      return Math.cosh(x);
    case 'tanh':
      return Math.tanh(x);
    case 'asinh':
      return Math.asinh(x);
    case 'acosh':
      return Math.acosh(x);
    case 'atanh':
      return Math.atanh(x);
    case 'ln':
      return Math.log(x);
    case 'log':
      return Math.log10(x);
    case 'log2':
      return Math.log2(x);
    case 'exp':
      return Math.exp(x);
    case 'sqrt':
      return Math.sqrt(x);
    case 'cbrt':
      return Math.cbrt(x);
    case 'abs':
      return Math.abs(x);
    default:
      return NaN;
  }
}

function applyPower(operator, left, right) {
  if (operator === '^') return Math.pow(left, right);
  if (operator === 'logb') return Math.log(right) / Math.log(left);
  // "left rt right" is the left-th root of right.
  if (left === 0) return NaN;
  if (right < 0 && Number.isInteger(left) && left % 2 !== 0) return -Math.pow(-right, 1 / left);
  return Math.pow(right, 1 / left);
}

// Order of operations, lowest to highest: + -, then * / mod and implicit multiplication, then a leading minus, then
// ^ and the root / log keys (right to left), then ! and %.
function parse(tokens, angleMode) {
  let position = 0;
  const peek = () => tokens[position];
  const atOperator = (value) => peek()?.type === 'op' && peek().value === value;
  const startsOperand = (token) => token && (token.type === 'num' || token.type === 'fn' || (token.type === 'op' && token.value === '('));

  function expression() {
    let value = term();
    while (atOperator('+') || atOperator('-')) {
      const operator = tokens[position++].value;
      const right = term();
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  }

  function term() {
    let value = unary();
    for (;;) {
      if (atOperator('*') || atOperator('/') || atOperator('mod')) {
        const operator = tokens[position++].value;
        const right = unary();
        if (operator === '*') value *= right;
        else if (operator === '/') value /= right;
        else value %= right;
      } else if (startsOperand(peek())) {
        value *= unary();
      } else {
        return value;
      }
    }
  }

  function unary() {
    if (atOperator('-')) {
      position += 1;
      return -unary();
    }
    if (atOperator('+')) {
      position += 1;
      return unary();
    }
    return power();
  }

  function power() {
    const base = postfix();
    if (atOperator('^') || atOperator('rt') || atOperator('logb')) {
      const operator = tokens[position++].value;
      return applyPower(operator, base, powerOperand());
    }
    return base;
  }

  // The right side of ^ may carry its own sign: 2^-3.
  function powerOperand() {
    if (atOperator('-')) {
      position += 1;
      return -powerOperand();
    }
    if (atOperator('+')) {
      position += 1;
      return powerOperand();
    }
    return power();
  }

  function postfix() {
    let value = primary();
    for (;;) {
      if (atOperator('!')) {
        position += 1;
        value = factorial(value);
      } else if (atOperator('%')) {
        position += 1;
        value /= 100;
      } else {
        return value;
      }
    }
  }

  function primary() {
    const token = tokens[position++];
    if (!token) throw new Error('Unexpected end');
    if (token.type === 'num') return token.value;
    if (token.type === 'fn') {
      if (!atOperator('(')) throw new Error('A function needs a bracket');
      position += 1;
      const argument = expression();
      if (atOperator(')')) position += 1;
      return applyFunction(token.value, argument, angleMode);
    }
    if (token.type === 'op' && token.value === '(') {
      const value = expression();
      if (atOperator(')')) position += 1;
      return value;
    }
    throw new Error(`Unexpected "${token.value}"`);
  }

  const value = expression();
  if (position !== tokens.length) throw new Error('Unexpected token');
  return value;
}

// The value of an expression, or NaN when it is not a valid one.
export function evaluate(source, angleMode = 'deg') {
  try {
    const tokens = tokenize(String(source));
    return tokens.length === 0 ? NaN : parse(tokens, angleMode);
  } catch {
    return NaN;
  }
}

// --- showing numbers --------------------------------------------------------------------------------------------------

export function formatNumber(value) {
  if (Number.isNaN(value)) return 'Error';
  if (!Number.isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';
  if (Number.isInteger(value) && Math.abs(value) < 1e15) return String(value === 0 ? 0 : value);

  const [mantissa, exponent] = value.toPrecision(15).split('e');
  const trimmed = mantissa.includes('.') ? mantissa.replace(/0+$/, '').replace(/\.$/, '') : mantissa;
  return exponent ? `${trimmed}e${exponent}` : trimmed;
}

// A number as it is written into an expression: negatives in brackets so that (-5)^2 stays 25, and the exponent as E so
// it is not mistaken for the constant e.
function toExpressionNumber(value) {
  const text = formatNumber(value).replace('e', 'E');
  return value < 0 ? `(${text})` : text;
}

const INVERSE_TRIG = /\ba(sin|cos|tan)(h?)\(/g;

// The expression as the student reads it: sin⁻¹( instead of asin(, √( instead of sqrt(.
export function prettyExpression(expression) {
  return expression
    .replace(INVERSE_TRIG, '$1$2⁻¹(')
    .replace(/sqrt\(/g, '√(')
    .replace(/cbrt\(/g, '∛(')
    .replace(/exp\(/g, 'e^(')
    .replace(/ rt /g, ' ʸ√ ')
    .replace(/ logb /g, ' logᵧ ');
}

// --- editing the expression -------------------------------------------------------------------------------------------

const trailingNumber = (expression) => NUMBER_AT_END.exec(expression)?.[0] || '';
const stripTrailingOperators = (expression) => expression.replace(PENDING_EXPONENT, '').replace(TRAILING_OPERATORS, '');
const endsWithOperator = (expression) => /[+\-*/^]$|(?: mod | rt | logb )$/.test(expression);

// Where the number, constant or bracket at the end of the expression starts (with its function name or leading minus),
// or -1 when the expression does not end with something a function can be applied to.
function lastOperandStart(expression) {
  let end = expression.length;
  while (end > 0 && '!%'.includes(expression[end - 1])) end -= 1;
  if (end === 0) return -1;

  let start;
  const last = expression[end - 1];
  if (last === ')') {
    let depth = 0;
    start = -1;
    for (let i = end - 1; i >= 0; i -= 1) {
      if (expression[i] === ')') depth += 1;
      else if (expression[i] === '(') {
        depth -= 1;
        if (depth === 0) {
          start = i;
          break;
        }
      }
    }
    if (start === -1) return -1;
    const name = NAMES.find((candidate) => FUNCTIONS.includes(candidate) && expression.slice(0, start).endsWith(candidate));
    if (name) start -= name.length;
  } else if (last === 'π' || last === 'e') {
    start = end - 1;
  } else {
    const number = NUMBER_AT_END.exec(expression.slice(0, end));
    if (!number) return -1;
    start = end - number[0].length;
  }

  const before = expression[start - 1];
  const beforeThat = expression[start - 2];
  if (before === '-' && (start === 1 || (beforeThat !== undefined && '+-*/^( '.includes(beforeThat)))) start -= 1;
  return start;
}

function appendDigit(expression, digit) {
  const number = trailingNumber(expression);
  if (digit === '.') {
    if (!number) return `${expression}0.`;
    return number.includes('.') || number.includes('E') ? expression : `${expression}.`;
  }
  return number === '0' ? expression.slice(0, -1) + digit : expression + digit;
}

function appendOperator(expression, operator) {
  if (expression === '') return operator === '-' ? '-' : expression;
  // After Exp a sign belongs to the exponent: 1.5E-3.
  if (/E$/.test(expression) && (operator === '+' || operator === '-')) return expression + operator;

  const base = expression.replace(PENDING_EXPONENT, '');
  if (base.endsWith('(')) return operator === '-' ? `${base}-` : base;
  if (endsWithOperator(base)) {
    // A minus after another operator is a sign: 5*-3.
    if (operator === '-' && !/[+-]$/.test(base)) return `${base}-`;
    const stripped = stripTrailingOperators(base);
    return stripped === '' ? '' : stripped + operator;
  }
  return base + operator;
}

function appendWordOperator(expression, word) {
  const base = expression.replace(PENDING_EXPONENT, '');
  if (base === '' || base.endsWith('(')) return expression;
  const stripped = endsWithOperator(base) ? stripTrailingOperators(base) : base;
  return stripped === '' ? '' : `${stripped} ${word} `;
}

function closeBracket(expression) {
  const opened = (expression.match(/\(/g) || []).length;
  const closed = (expression.match(/\)/g) || []).length;
  if (opened <= closed || expression.endsWith('(') || endsWithOperator(expression) || PENDING_EXPONENT.test(expression)) return expression;
  return `${expression})`;
}

function appendExponent(expression) {
  const number = trailingNumber(expression);
  return number && !number.includes('E') ? `${expression}E` : expression;
}

// Applies a key such as sin or 1/x to the last number or bracket. With nothing to apply it to, it just opens a bracket.
function wrapLast(expression, opening) {
  if (PENDING_EXPONENT.test(expression)) return expression;
  const start = lastOperandStart(expression);
  if (start === -1) return expression + opening;
  return `${expression.slice(0, start)}${opening}${expression.slice(start)})`;
}

function appendPostfix(expression, suffix) {
  return lastOperandStart(expression) === -1 ? expression : expression + suffix;
}

function toggleSign(expression) {
  const negated = /\(-((?:\d+\.?\d*|\.\d+)(?:E[+-]?\d+)?)\)$/.exec(expression);
  if (negated) return expression.slice(0, negated.index) + negated[1];

  const start = PENDING_EXPONENT.test(expression) ? -1 : lastOperandStart(expression);
  if (start === -1) return expression === '' || endsWithOperator(expression) || expression.endsWith('(') ? `${expression}-` : expression;
  return `${expression.slice(0, start)}(-${expression.slice(start)})`;
}

const FUNCTION_KEYS = {
  sin: 'sin',
  cos: 'cos',
  tan: 'tan',
  asin: 'asin',
  acos: 'acos',
  atan: 'atan',
  sinh: 'sinh',
  cosh: 'cosh',
  tanh: 'tanh',
  asinh: 'asinh',
  acosh: 'acosh',
  atanh: 'atanh',
  ln: 'ln',
  log: 'log',
  log2: 'log2',
  ex: 'exp',
  sqrt: 'sqrt',
  cbrt: 'cbrt',
  abs: 'abs',
};

function backspace(expression) {
  const token = /(?:a?(?:sin|cos|tan)h?|log2|log|ln|exp|sqrt|cbrt|abs)\($|1\/\($|10\^\($| (?:mod|rt|logb) $/.exec(expression);
  return token ? expression.slice(0, token.index) : expression.slice(0, -1);
}

function edit(expression, key) {
  if (key.length === 1 && DIGITS.includes(key)) return appendDigit(expression, key);
  if (key === '.') return appendDigit(expression, '.');
  if (key.length === 1 && '+-*/^'.includes(key)) return appendOperator(expression, key);
  if (FUNCTION_KEYS[key]) return wrapLast(expression, `${FUNCTION_KEYS[key]}(`);

  switch (key) {
    case '(':
      return PENDING_EXPONENT.test(expression) ? expression : `${expression}(`;
    case ')':
      return closeBracket(expression);
    case 'E':
      return appendExponent(expression);
    case 'pi':
      return `${expression.replace(PENDING_EXPONENT, '')}π`;
    case 'e':
      return `${expression.replace(PENDING_EXPONENT, '')}e`;
    case 'mod':
    case 'rt':
    case 'logb':
      return appendWordOperator(expression, key);
    case 'sq':
      return appendPostfix(expression, '^2');
    case 'cube':
      return appendPostfix(expression, '^3');
    case 'fact':
      return appendPostfix(expression, '!');
    case 'pct':
      return appendPostfix(expression, '%');
    case 'inv':
      return wrapLast(expression, '1/(');
    case 'tenx':
      return wrapLast(expression, '10^(');
    case 'neg':
      return toggleSign(expression);
    case 'back':
      return backspace(expression);
    default:
      return expression;
  }
}

// --- the calculator's state -------------------------------------------------------------------------------------------

// `expression` is the top line, `result` the bottom one. `justEvaluated` is true after = until the next key. `last` is
// the value of the last evaluation, and `memory` the stored number.
export const INITIAL_STATE = { expression: '', result: '0', justEvaluated: false, last: 0, memory: 0, angleMode: 'deg' };

// The bottom line while typing: the number being entered, or what the expression comes to so far.
function refresh(state) {
  if (state.expression === '') return { ...state, result: '0' };
  const entry = trailingNumber(state.expression);
  if (entry) return { ...state, result: entry };
  const value = evaluate(stripTrailingOperators(state.expression), state.angleMode);
  return Number.isFinite(value) ? { ...state, result: formatNumber(value) } : state;
}

function equals(state) {
  if (state.expression === '' || state.justEvaluated) return state;
  const value = evaluate(stripTrailingOperators(state.expression), state.angleMode);
  return { ...state, result: formatNumber(value), last: Number.isFinite(value) ? value : 0, justEvaluated: true };
}

// The number the memory keys work with: the last answer, or what is on the display now.
function currentValue(state) {
  if (state.justEvaluated) return state.last;
  const value = evaluate(stripTrailingOperators(state.expression), state.angleMode);
  if (Number.isFinite(value)) return value;
  const shown = parseFloat(state.result);
  return Number.isFinite(shown) ? shown : 0;
}

// After =, typing a number starts a new calculation, while an operator or function carries on from the answer.
const STARTS_NEW = new Set([...DIGITS, '.', '(', 'pi', 'e']);

function restart(state, key) {
  const failed = state.result === 'Error' || state.result.endsWith('Infinity');
  if (key === 'back') return { ...state, justEvaluated: false };
  if (failed || STARTS_NEW.has(key)) return { ...state, expression: '', justEvaluated: false };
  return { ...state, expression: toExpressionNumber(state.last), justEvaluated: false };
}

// Storing to memory settles the display on that number, so the next digit starts a new one.
function storeInMemory(state, change) {
  const value = currentValue(state);
  return { ...state, memory: change(state.memory, value), last: value, result: formatNumber(value), justEvaluated: true };
}

function pressMemory(state, key) {
  if (key === 'MC') return { ...state, memory: 0 };
  if (key === 'MS') return storeInMemory(state, (memory, value) => value);
  if (key === 'M+') return storeInMemory(state, (memory, value) => memory + value);
  if (key === 'M-') return storeInMemory(state, (memory, value) => memory - value);

  // MR puts the stored number where the student is typing, replacing a half-typed number.
  const base = state.justEvaluated ? { ...state, expression: '', justEvaluated: false } : state;
  const number = trailingNumber(base.expression);
  const expression = base.expression.slice(0, base.expression.length - number.length) + toExpressionNumber(state.memory);
  return refresh({ ...base, expression });
}

export function press(state, key) {
  if (key === 'deg' || key === 'rad') return { ...state, angleMode: key };
  if (key === 'clear') return { ...state, expression: '', result: '0', justEvaluated: false, last: 0 };
  if (key === 'eq') return equals(state);
  if (key.startsWith('M')) return pressMemory(state, key);

  const base = state.justEvaluated ? restart(state, key) : state;
  const expression = edit(base.expression, key);
  return refresh({ ...base, expression });
}
