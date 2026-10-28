/* Scientific Calculator BD - pure expression engine.
 * Recursive-descent parser (no eval). Precedence, highest to lowest:
 *   postfix !  >  ^ (right-assoc)  >  implicit *  >  * / %  >  + -
 * Unary minus binds looser than ^ so -2^2 = -(2^2) = -4 (school
 * convention) while 2^-2 still works. DEG/RAD affects trig only.
 * UMD: works in the browser (window.SciCalc) and under node tests.
 */
(function (root) {
  'use strict';

  function CalcError(code) {
    var e = new Error(code);
    e.code = code;
    return e;
  }

  var FUNCS = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt', 'abs'];

  function tokenize(src) {
    var tokens = [];
    var i = 0;
    while (i < src.length) {
      var ch = src[i];
      if (ch === ' ' || ch === '\t') { i++; continue; }
      if ((ch >= '0' && ch <= '9') || ch === '.') {
        var j = i;
        var dots = 0;
        while (j < src.length && ((src[j] >= '0' && src[j] <= '9') || src[j] === '.')) {
          if (src[j] === '.') dots++;
          j++;
        }
        if (dots > 1) throw CalcError('SYNTAX');
        var num = src.slice(i, j);
        if (num === '.') throw CalcError('SYNTAX');
        tokens.push({ t: 'num', v: parseFloat(num) });
        i = j;
        continue;
      }
      if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
        var k = i;
        while (k < src.length && ((src[k] >= 'a' && src[k] <= 'z') || (src[k] >= 'A' && src[k] <= 'Z'))) k++;
        var word = src.slice(i, k).toLowerCase();
        if (word === 'pi' || word === 'e' || word === 'ans') {
          tokens.push({ t: 'const', v: word });
        } else if (FUNCS.indexOf(word) !== -1) {
          tokens.push({ t: 'func', v: word });
        } else {
          throw CalcError('UNKNOWN');
        }
        i = k;
        continue;
      }
      if ('+-*/%^!()'.indexOf(ch) !== -1) {
        tokens.push({ t: 'op', v: ch });
        i++;
        continue;
      }
      throw CalcError('SYNTAX');
    }
    return tokens;
  }

  function Parser(tokens, opts) {
    this.toks = tokens;
    this.pos = 0;
    this.angle = opts.angle || 'DEG';
    this.ans = (typeof opts.ans === 'number' && isFinite(opts.ans)) ? opts.ans : 0;
  }
  Parser.prototype.peek = function () { return this.toks[this.pos]; };
  Parser.prototype.next = function () { return this.toks[this.pos++]; };
  Parser.prototype.expectOp = function (op) {
    var tk = this.next();
    if (!tk || tk.t !== 'op' || tk.v !== op) throw CalcError('PAREN');
  };

  Parser.prototype.parse = function () {
    if (this.toks.length === 0) throw CalcError('EMPTY');
    var v = this.parseExpr();
    if (this.pos < this.toks.length) throw CalcError('SYNTAX');
    return v;
  };

  Parser.prototype.parseExpr = function () {
    var v = this.parseTerm();
    for (;;) {
      var tk = this.peek();
      if (tk && tk.t === 'op' && (tk.v === '+' || tk.v === '-')) {
        this.next();
        var rhs = this.parseTerm();
        v = (tk.v === '+') ? v + rhs : v - rhs;
      } else return v;
    }
  };

  Parser.prototype.parseTerm = function () {
    var v = this.parseFactor();
    for (;;) {
      var tk = this.peek();
      if (tk && tk.t === 'op' && (tk.v === '*' || tk.v === '/' || tk.v === '%')) {
        this.next();
        var rhs = this.parseFactor();
        if (tk.v === '*') v = v * rhs;
        else if (tk.v === '/') {
          if (rhs === 0) throw CalcError('DIV_ZERO');
          v = v / rhs;
        } else {
          if (rhs === 0) throw CalcError('DIV_ZERO');
          v = v % rhs;
        }
      } else if (tk && (tk.t === 'num' || tk.t === 'const' || tk.t === 'func' ||
          (tk.t === 'op' && tk.v === '('))) {
        // Implicit multiplication: 2pi, 2(3+4), (2)(3), 2sin(30)
        v = v * this.parseFactor();
      } else return v;
    }
  };

  // Unary minus wraps the whole power so -2^2 = -(2^2) = -4, while
  // 2^-2 still parses as 2^(-2) via the recursive exponent call.
  Parser.prototype.parseFactor = function () {
    var tk = this.peek();
    if (tk && tk.t === 'op' && tk.v === '-') {
      this.next();
      return -this.parseFactor();
    }
    if (tk && tk.t === 'op' && tk.v === '+') {
      this.next();
      return this.parseFactor();
    }
    var base = this.parsePostfix();
    tk = this.peek();
    if (tk && tk.t === 'op' && tk.v === '^') {
      this.next();
      var exp = this.parseFactor(); // right-associative: 2^3^2 = 512
      base = Math.pow(base, exp);
      if (isNaN(base)) throw CalcError('DOMAIN');
    }
    return base;
  };

  Parser.prototype.parsePostfix = function () {
    var v = this.parsePrimary();
    for (;;) {
      var tk = this.peek();
      if (tk && tk.t === 'op' && tk.v === '!') {
        this.next();
        v = factorial(v);
      } else return v;
    }
  };

  function factorial(n) {
    if (n < 0 || Math.floor(n) !== n) throw CalcError('FACTORIAL');
    if (n > 170) throw CalcError('DOMAIN');
    var r = 1;
    for (var i = 2; i <= n; i++) r *= i;
    return r;
  }

  Parser.prototype.parsePrimary = function () {
    var tk = this.next();
    if (!tk) throw CalcError('SYNTAX');
    if (tk.t === 'num') return tk.v;
    if (tk.t === 'const') {
      if (tk.v === 'pi') return Math.PI;
      if (tk.v === 'e') return Math.E;
      return this.ans;
    }
    if (tk.t === 'func') {
      this.expectOp('(');
      var arg = this.parseExpr();
      this.expectOp(')');
      return applyFunc(tk.v, arg, this.angle);
    }
    if (tk.t === 'op' && tk.v === '(') {
      var v = this.parseExpr();
      this.expectOp(')');
      return v;
    }
    throw CalcError('SYNTAX');
  };

  function toRad(x, angle) { return angle === 'DEG' ? x * Math.PI / 180 : x; }
  function fromRad(x, angle) { return angle === 'DEG' ? x * 180 / Math.PI : x; }

  function applyFunc(name, x, angle) {
    switch (name) {
      case 'sin': return Math.sin(toRad(x, angle));
      case 'cos': return Math.cos(toRad(x, angle));
      case 'tan': {
        var c = Math.cos(toRad(x, angle));
        if (Math.abs(c) < 1e-15) throw CalcError('DOMAIN');
        return Math.tan(toRad(x, angle));
      }
      case 'asin':
        if (x < -1 || x > 1) throw CalcError('DOMAIN');
        return fromRad(Math.asin(x), angle);
      case 'acos':
        if (x < -1 || x > 1) throw CalcError('DOMAIN');
        return fromRad(Math.acos(x), angle);
      case 'atan': return fromRad(Math.atan(x), angle);
      case 'log':
        if (x <= 0) throw CalcError('DOMAIN');
        return Math.log10(x);
      case 'ln':
        if (x <= 0) throw CalcError('DOMAIN');
        return Math.log(x);
      case 'sqrt':
        if (x < 0) throw CalcError('DOMAIN');
        return Math.sqrt(x);
      case 'abs': return Math.abs(x);
      default: throw CalcError('UNKNOWN');
    }
  }

  // Display formatting: 12 significant digits, kills float noise
  // (0.1+0.2 -> 0.3), -0 -> 0, sci notation outside a sane range.
  function formatResult(v) {
    if (!isFinite(v)) throw CalcError('DOMAIN');
    if (v === 0) return '0';
    var rounded = parseFloat(v.toPrecision(12));
    if (rounded === 0) return '0';
    if (Math.abs(rounded) >= 1e12 || Math.abs(rounded) < 1e-9) {
      return rounded.toExponential(6).replace(/\.?0+e/, 'e');
    }
    return String(rounded);
  }

  function evaluate(src, opts) {
    if (typeof src !== 'string' || src.trim() === '') throw CalcError('EMPTY');
    var tokens = tokenize(src);
    var p = new Parser(tokens, opts || {});
    return p.parse();
  }

  var api = {
    evaluate: evaluate,
    formatResult: formatResult,
    tokenize: tokenize,
    FUNCS: FUNCS
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.SciCalc = api;
})(typeof window !== 'undefined' ? window : globalThis);
