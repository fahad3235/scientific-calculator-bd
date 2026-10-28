import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { evaluate, formatResult } = require('../js/logic.js');

let pass = 0, fail = 0;
function close(a, b, tol) { return Math.abs(a - b) <= (tol || 1e-9); }
function eq(expr, expected, opts) {
  try {
    const got = evaluate(expr, opts || {});
    if (close(got, expected, 1e-9)) { pass++; }
    else { fail++; console.log('FAIL', expr, 'got', got, 'want', expected); }
  } catch (e) { fail++; console.log('FAIL', expr, 'threw', e.code || e.message); }
}
function err(expr, code, opts) {
  try {
    const got = evaluate(expr, opts || {});
    fail++; console.log('FAIL', expr, 'expected error', code, 'got', got);
  } catch (e) {
    if (e.code === code) pass++;
    else { fail++; console.log('FAIL', expr, 'error', e.code, 'want', code); }
  }
}
function feq(v, s) {
  const got = formatResult(v);
  if (got === s) pass++; else { fail++; console.log('FAIL format', v, 'got', got, 'want', s); }
}

// Arithmetic + precedence (hand-verified)
eq('2+3*4', 14);
eq('(2+3)*4', 20);
eq('10-4-3', 3);
eq('2^3^2', 512);          // right-assoc: 2^(3^2) = 2^9
eq('(2^3)^2', 64);
eq('-2^2', -4);            // school convention
eq('2^-2', 0.25);
eq('--5', 5);
eq('10%3', 1);
eq('2(3+4)', 14);          // implicit multiplication
eq('2pi', 2 * Math.PI);
eq('(2)(3)', 6);
eq('2sin(30)', 1, { angle: 'DEG' });
eq('0.1+0.2', 0.30000000000000004); // raw float; formatting fixes display
// Functions
eq('sin(90)', 1, { angle: 'DEG' });
eq('sin(30)', 0.5, { angle: 'DEG' });
eq('cos(0)', 1, { angle: 'DEG' });
eq('tan(45)', 1, { angle: 'DEG' });
eq('sin(pi/2)', 1, { angle: 'RAD' });
eq('asin(1)', 90, { angle: 'DEG' });
eq('acos(0)', 90, { angle: 'DEG' });
eq('atan(1)', 45, { angle: 'DEG' });
eq('log(100)', 2);
eq('log(1000)', 3);
eq('ln(e)', 1);
eq('sqrt(144)', 12);
eq('sqrt(2)^2', 2);
eq('abs(0-7)', 7);
eq('5!', 120);
eq('0!', 1);
eq('3!+2', 8);
eq('e', Math.E);
eq('pi', Math.PI);
eq('ans+1', 42, { ans: 41 });
eq('ans*2', 10, { ans: 5 });
// Errors
err('1/0', 'DIV_ZERO');
err('10%0', 'DIV_ZERO');
err('sqrt(-1)', 'DOMAIN');
err('log(0)', 'DOMAIN');
err('log(-5)', 'DOMAIN');
err('asin(2)', 'DOMAIN');
err('tan(90)', 'DOMAIN', { angle: 'DEG' });
err('5.5!', 'FACTORIAL');
err('(-1)!', 'FACTORIAL');
err('2+', 'SYNTAX');
err('(2+3', 'PAREN');
err('2+3)', 'SYNTAX');
err('', 'EMPTY');
err('   ', 'EMPTY');
err('foo(2)', 'UNKNOWN');
err('2..3', 'SYNTAX');
err('2^^3', 'SYNTAX');
// Formatting
feq(0.30000000000000004, '0.3');
feq(-0, '0');
feq(120, '120');
feq(2 * Math.PI, '6.28318530718');
feq(1 / 3, '0.333333333333');
feq(1000000, '1000000');

console.log(`unit: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
