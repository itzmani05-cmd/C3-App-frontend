import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_STATE, evaluate, formatNumber, press, prettyExpression } from '../src/utils/calculator.js';

const near = (actual, expected, tolerance = 1e-9) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} is not close to ${expected}`);
const run = (keys, state = INITIAL_STATE) => keys.reduce(press, state);
const typed = (text) => text.split('');

test('multiplication and division come before addition and subtraction', () => {
  assert.equal(evaluate('2+3*4'), 14);
  assert.equal(evaluate('10-6/2'), 7);
  assert.equal(evaluate('2*3+4*5'), 26);
});

test('brackets, including ones left open, and implicit multiplication', () => {
  assert.equal(evaluate('73*(2+3)'), 365);
  assert.equal(evaluate('(2+3'), 5);
  assert.equal(evaluate('2(3+4)'), 14);
  assert.equal(evaluate('(2)(3)'), 6);
  near(evaluate('2π'), 2 * Math.PI);
  assert.equal(evaluate('2sin(30)'), 1);
});

test('powers go right to left and a leading minus comes after them', () => {
  assert.equal(evaluate('2^3^2'), 512);
  assert.equal(evaluate('-2^2'), -4);
  assert.equal(evaluate('(-2)^2'), 4);
  near(evaluate('18^-0.509'), 0.22964991811628313);
  assert.equal(evaluate('2^-1'), 0.5);
});

test('factorial, percent, mod, roots and logs', () => {
  assert.equal(evaluate('5!'), 120);
  assert.equal(evaluate('0!'), 1);
  assert.ok(Number.isNaN(evaluate('2.5!')));
  assert.equal(evaluate('50%'), 0.5);
  assert.equal(evaluate('10 mod 3'), 1);
  near(evaluate('3 rt 27'), 3);
  near(evaluate('2 rt 16'), 4);
  near(evaluate('3 rt (-8)'), -2);
  near(evaluate('2 logb 8'), 3);
  near(evaluate('10 logb 1000'), 3);
  assert.equal(evaluate('log(1000)'), 3);
  assert.equal(evaluate('log2(8)'), 3);
  assert.equal(evaluate('sqrt(16)'), 4);
  assert.equal(evaluate('cbrt(27)'), 3);
  assert.equal(evaluate('abs(-4)'), 4);
  near(evaluate('exp(1)'), Math.E);
  assert.equal(evaluate('1.5E3'), 1500);
});

test('trigonometry follows the angle mode and rounding noise shows as zero', () => {
  near(evaluate('sin(30)', 'deg'), 0.5);
  assert.equal(evaluate('sin(180)', 'deg'), 0);
  assert.equal(evaluate('cos(90)', 'deg'), 0);
  assert.ok(Number.isNaN(evaluate('tan(90)', 'deg')));
  near(evaluate('asin(0.5)', 'deg'), 30);
  near(evaluate('cos(π)', 'rad'), -1);
  near(evaluate('atan(1)', 'rad'), Math.PI / 4);
  near(evaluate('sinh(1)'), Math.sinh(1));
  near(evaluate('asinh(sinh(2))'), 2);
  near(evaluate('cosh(0)'), 1);
  near(evaluate('atanh(0.5)'), Math.atanh(0.5));
});

test('invalid expressions give NaN, and dividing by zero gives Infinity', () => {
  assert.ok(Number.isNaN(evaluate('')));
  assert.ok(Number.isNaN(evaluate('5+')));
  assert.ok(Number.isNaN(evaluate('()')));
  assert.ok(Number.isNaN(evaluate('2)')));
  assert.ok(Number.isNaN(evaluate('sqrt(-1)')));
  assert.ok(Number.isNaN(evaluate('sin')));
  assert.equal(evaluate('1/0'), Infinity);
});

test('numbers are shown without floating point noise', () => {
  assert.equal(formatNumber(0.1 + 0.2), '0.3');
  assert.equal(formatNumber(365), '365');
  assert.equal(formatNumber(-0), '0');
  assert.equal(formatNumber(1e-7), '1e-7');
  assert.equal(formatNumber(1e21), '1e+21');
  assert.equal(formatNumber(NaN), 'Error');
  assert.equal(formatNumber(-Infinity), '-Infinity');
  assert.equal(formatNumber(Math.PI), '3.14159265358979');
});

test('the expression is shown the way a student reads it', () => {
  assert.equal(prettyExpression('asin(0.5)+atanh(0.2)+sqrt(4)+cbrt(8)'), 'sin⁻¹(0.5)+tanh⁻¹(0.2)+√(4)+∛(8)');
  assert.equal(prettyExpression('3 rt 27'), '3 ʸ√ 27');
  assert.equal(prettyExpression('2 logb 8'), '2 logᵧ 8');
});

test('typing an expression and pressing = shows it on top and the answer below', () => {
  const state = run([...typed('73*(2+3)'), 'eq']);
  assert.equal(state.expression, '73*(2+3)');
  assert.equal(state.result, '365');
});

test('the bottom line follows the number being typed', () => {
  assert.equal(run(typed('12')).result, '12');
  assert.equal(run(typed('12+')).result, '12');
  assert.equal(run(typed('12+3')).result, '3');
  assert.equal(run(typed('12+3*')).result, '15');
});

test('digits: one point per number and no leading zeros', () => {
  assert.equal(run(['1', '.', '.', '5']).expression, '1.5');
  assert.equal(run(['.', '5']).expression, '0.5');
  assert.equal(run(['0', '0', '7']).expression, '7');
  assert.equal(run(typed('1.5+2.')).expression, '1.5+2.');
});

test('operators replace each other, and a minus after an operator is a sign', () => {
  assert.equal(run([...typed('5+*3'), 'eq']).result, '15');
  assert.equal(run([...typed('5*-3'), 'eq']).result, '-15');
  assert.equal(run(['*', '5']).expression, '5', 'an operator with nothing before it is ignored');
  assert.equal(run(['-', '5', 'eq']).result, '-5');
});

test('a function applies to the number before it, or opens a bracket when there is none', () => {
  const applied = run([...typed('30'), 'sin', 'eq']);
  assert.equal(applied.expression, 'sin(30)');
  assert.equal(applied.result, '0.5');

  const opened = run(['sin', ...typed('30'), 'eq']);
  assert.equal(opened.expression, 'sin(30');
  assert.equal(opened.result, '0.5');

  assert.equal(run([...typed('2*3'), 'sqrt']).expression, '2*sqrt(3)');
  assert.equal(run([...typed('30'), 'sin', 'cos']).expression, 'cos(sin(30))');
  assert.equal(run([...typed('5*-3'), 'abs', 'eq']).result, '15', 'the sign stays inside the function');
});

test('x squared, x cubed, factorial, percent, 1/x and 10^x', () => {
  assert.equal(run([...typed('5'), 'sq', 'eq']).result, '25');
  assert.equal(run([...typed('3'), 'cube', 'eq']).result, '27');
  assert.equal(run([...typed('5'), 'fact', 'eq']).result, '120');
  assert.equal(run([...typed('50'), 'pct', 'eq']).result, '0.5');
  assert.equal(run([...typed('4'), 'inv', 'eq']).result, '0.25');
  assert.equal(run([...typed('2'), 'tenx', 'eq']).result, '100');
  assert.equal(run(['sq']).expression, '', 'nothing to square');
});

test('two-number keys: y √x, logy x, mod and the power key', () => {
  assert.equal(run([...typed('3'), 'rt', ...typed('27'), 'eq']).result, '3');
  assert.equal(run([...typed('2'), 'logb', ...typed('8'), 'eq']).result, '3');
  assert.equal(run([...typed('10'), 'mod', ...typed('3'), 'eq']).result, '1');
  assert.equal(run([...typed('2'), '^', ...typed('10'), 'eq']).result, '1024');
});

test('Exp enters a power of ten', () => {
  assert.equal(run([...typed('1.5'), 'E', '3', 'eq']).result, '1500');
  assert.equal(run([...typed('1.5'), 'E', '-', '3', 'eq']).result, '0.0015');
  assert.equal(run(['E']).expression, '', 'Exp needs a number first');
});

test('+/- flips the sign of the last number', () => {
  assert.equal(run(['5', 'neg']).expression, '(-5)');
  assert.equal(run(['5', 'neg', 'neg']).expression, '5');
  assert.equal(run([...typed('2*5'), 'neg', 'eq']).result, '-10');
  assert.equal(run(['neg', '5', 'eq']).result, '-5');
});

test('brackets: closing only when one is open', () => {
  assert.equal(run([')']).expression, '');
  assert.equal(run([...typed('(2+3'), ')', ')']).expression, '(2+3)');
  assert.equal(run(['(', ')']).expression, '(');
});

test('backspace removes a whole function or operator word at once', () => {
  assert.equal(run(['sin', 'back']).expression, '');
  assert.equal(run(['asinh', 'back']).expression, '');
  assert.equal(run([...typed('3'), 'rt', 'back']).expression, '3');
  assert.equal(run(typed('123')).expression, '123');
  assert.equal(run([...typed('123'), 'back']).expression, '12');
  assert.equal(run([...typed('12+'), 'back']).result, '12');
});

test('after =, an operator carries on from the answer and a number starts afresh', () => {
  assert.equal(run([...typed('2+3'), 'eq', '*', '4', 'eq']).result, '20');
  assert.equal(run([...typed('2+3'), 'eq', '7']).expression, '7');
  assert.equal(run([...typed('3-8'), 'eq', 'sq', 'eq']).result, '25', 'a negative answer keeps its sign inside the square');
  assert.equal(run([...typed('0.5+0.25'), 'eq', 'sqrt', 'eq']).result, '0.866025403784439');
  assert.equal(run([...typed('2+3'), 'eq', 'eq']).result, '5');
});

test('an error clears itself on the next key', () => {
  const failed = run(['(', 'eq']);
  assert.equal(failed.result, 'Error');
  assert.equal(run(['5'], failed).expression, '5');
  const infinite = run([...typed('1/0'), 'eq']);
  assert.equal(infinite.result, 'Infinity');
  assert.equal(run(['+'], infinite).expression, '');
});

test('clear empties the display but keeps the memory and angle mode', () => {
  const state = run([...typed('5'), 'MS', 'rad', ...typed('9'), 'clear']);
  assert.equal(state.expression, '');
  assert.equal(state.result, '0');
  assert.equal(state.memory, 5);
  assert.equal(state.angleMode, 'rad');
});

test('memory keys store, add, subtract, recall and clear', () => {
  assert.equal(run([...typed('5'), 'MS']).memory, 5);
  assert.equal(run([...typed('5'), 'MS', ...typed('3'), 'M+']).memory, 8);
  assert.equal(run([...typed('5'), 'MS', 'clear', ...typed('2'), 'M-']).memory, 3);
  assert.equal(run([...typed('5'), 'MS', 'MC']).memory, 0);
  assert.equal(run([...typed('5'), 'MS', 'clear', 'MR', '+', '1', 'eq']).result, '6');
  assert.equal(run([...typed('5'), 'MS', ...typed('12'), 'MR']).expression, '5', 'MR replaces a half-typed number');
  assert.equal(run([...typed('2+3'), 'eq', 'MS']).memory, 5, 'memory takes the last answer');
});

test('the angle mode changes what trig keys give', () => {
  assert.equal(run([...typed('90'), 'sin', 'eq']).result, '1');
  assert.equal(run(['rad', ...typed('0'), 'cos', 'eq']).result, '1');
  assert.equal(run(['rad', 'pi', 'cos', 'eq']).result, '-1');
});
