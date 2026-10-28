/* Scientific Calculator BD - UI. All user-visible Bengali lives in I18N
 * below and is stored in this file as \uXXXX escapes (see build note in
 * README) so the push transport stays pure ASCII. */
(function () {
  'use strict';

  var I18N = {
    en: {
      title: 'Scientific Calculator BD',
      subtitle: 'Offline calculator \u2014 no internet needed',
      placeholder: 'Type or tap an expression',
      hint: 'Press Enter to calculate. Ans reuses the last result.',
      histTitle: 'History',
      clearHist: 'Clear history',
      emptyHist: 'No calculations yet.',
      copy: 'Copy',
      copied: 'Copied!',
      use: 'Use',
      langBtn: '\u09ac\u09be\u0982\u09b2\u09be',
      footer: 'Fully offline \u2014 no network requests. Expressions are evaluated by a hand-written parser (no eval). Note: -x^2 means -(x^2).',
      err: {
        DIV_ZERO: 'Cannot divide by zero.',
        DOMAIN: 'Number out of range for this function.',
        SYNTAX: 'Check the expression and try again.',
        PAREN: 'A bracket is not closed.',
        FACTORIAL: 'Factorial needs a whole number from 0 to 170.',
        UNKNOWN: 'Unknown word in the expression.',
        EMPTY: 'Type an expression first.'
      }
    },
    bn: {
      title: '\u09ac\u09c8\u099c\u09cd\u099e\u09be\u09a8\u09bf\u0995 \u0995\u09cd\u09af\u09be\u09b2\u0995\u09c1\u09b2\u09c7\u099f\u09b0',
      subtitle: '\u0985\u09ab\u09b2\u09be\u0987\u09a8 \u0995\u09cd\u09af\u09be\u09b2\u0995\u09c1\u09b2\u09c7\u099f\u09b0 \u2014 \u0987\u09a8\u09cd\u099f\u09be\u09b0\u09a8\u09c7\u099f \u09b2\u09be\u0997\u09c7 \u09a8\u09be',
      placeholder: '\u09b0\u09be\u09b6\u09bf \u09b2\u09bf\u0996\u09c1\u09a8 \u09ac\u09be \u09ac\u09cb\u09a4\u09be\u09ae \u099a\u09be\u09aa\u09c1\u09a8',
      hint: '\u09b9\u09bf\u09b8\u09be\u09ac \u0995\u09b0\u09a4\u09c7 Enter \u099a\u09be\u09aa\u09c1\u09a8\u0964 Ans \u0986\u0997\u09c7\u09b0 \u09ab\u09b2\u09be\u09ab\u09b2 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c7\u0964',
      histTitle: '\u0987\u09a4\u09bf\u09b9\u09be\u09b8',
      clearHist: '\u0987\u09a4\u09bf\u09b9\u09be\u09b8 \u09ae\u09c1\u099b\u09c1\u09a8',
      emptyHist: '\u098f\u0996\u09a8\u09cb \u0995\u09cb\u09a8\u09cb \u09b9\u09bf\u09b8\u09be\u09ac \u09a8\u09c7\u0987\u0964',
      copy: '\u0995\u09aa\u09bf \u0995\u09b0\u09c1\u09a8',
      copied: '\u0995\u09aa\u09bf \u09b9\u09af\u09bc\u09c7\u099b\u09c7!',
      use: '\u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c1\u09a8',
      langBtn: 'English',
      footer: '\u09b8\u09ae\u09cd\u09aa\u09c2\u09b0\u09cd\u09a3 \u0985\u09ab\u09b2\u09be\u0987\u09a8 \u2014 \u0995\u09cb\u09a8\u09cb \u09a8\u09c7\u099f\u0993\u09af\u09bc\u09be\u09b0\u09cd\u0995 \u0985\u09a8\u09c1\u09b0\u09cb\u09a7 \u09a8\u09c7\u0987\u0964 \u09b0\u09be\u09b6\u09bf \u09ae\u09c2\u09b2\u09cd\u09af\u09be\u09af\u09bc\u09a8 \u0995\u09b0\u09c7 \u09b9\u09be\u09a4\u09c7 \u09b2\u09c7\u0996\u09be \u09aa\u09be\u09b0\u09cd\u09b8\u09be\u09b0 (eval \u09a8\u09af\u09bc)\u0964 \u09ae\u09a8\u09c7 \u09b0\u09be\u0996\u09ac\u09c7\u09a8: -x^2 \u09ae\u09be\u09a8\u09c7 -(x^2)\u0964',
      err: {
        DIV_ZERO: '\u09b6\u09c2\u09a8\u09cd\u09af \u09a6\u09bf\u09af\u09bc\u09c7 \u09ad\u09be\u0997 \u0995\u09b0\u09be \u09af\u09be\u09af\u09bc \u09a8\u09be\u0964',
        DOMAIN: '\u098f\u0987 \u09ab\u09be\u0982\u09b6\u09a8\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u09b8\u0982\u0996\u09cd\u09af\u09be\u099f\u09bf \u09b8\u09c0\u09ae\u09be\u09b0 \u09ac\u09be\u0987\u09b0\u09c7\u0964',
        SYNTAX: '\u09b0\u09be\u09b6\u09bf\u099f\u09bf \u09a6\u09c7\u0996\u09c7 \u0986\u09ac\u09be\u09b0 \u099a\u09c7\u09b7\u09cd\u099f\u09be \u0995\u09b0\u09c1\u09a8\u0964',
        PAREN: '\u098f\u0995\u099f\u09bf \u09ac\u09a8\u09cd\u09a7\u09a8\u09c0 \u09ac\u09a8\u09cd\u09a7 \u0995\u09b0\u09be \u09b9\u09af\u09bc\u09a8\u09bf\u0964',
        FACTORIAL: '\u09ab\u09cd\u09af\u09be\u0995\u09cd\u099f\u09cb\u09b0\u09bf\u09af\u09bc\u09be\u09b2\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u09e6 \u09a5\u09c7\u0995\u09c7 \u09e7\u09ed\u09e6 \u098f\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7 \u09aa\u09c2\u09b0\u09cd\u09a3\u09b8\u0982\u0996\u09cd\u09af\u09be \u09b2\u09be\u0997\u09ac\u09c7\u0964',
        UNKNOWN: '\u09b0\u09be\u09b6\u09bf\u09a4\u09c7 \u0985\u099a\u09c7\u09a8\u09be \u09b6\u09ac\u09cd\u09a6 \u0986\u099b\u09c7\u0964',
        EMPTY: '\u0986\u0997\u09c7 \u098f\u0995\u099f\u09bf \u09b0\u09be\u09b6\u09bf \u09b2\u09bf\u0996\u09c1\u09a8\u0964'
      }
    }
  };

  var BN_DIGITS = '\u09e6\u09e7\u09e8\u09e9\u09ea\u09eb\u09ec\u09ed\u09ee\u09ef';
  function localize(str, lang) {
    if (lang !== 'bn') return str;
    return String(str).replace(/[0-9]/g, function (d) { return BN_DIGITS[+d]; });
  }

  var LS_LANG = 'scicalc-bd-lang';
  var LS_ANGLE = 'scicalc-bd-angle';
  var LS_HIST = 'scicalc-bd-history-v1';

  var lang = localStorage.getItem(LS_LANG) || 'en';
  if (lang !== 'en' && lang !== 'bn') lang = 'en';
  var angle = localStorage.getItem(LS_ANGLE) || 'DEG';
  if (angle !== 'DEG' && angle !== 'RAD') angle = 'DEG';
  var ans = 0;
  var hasAns = false;
  var history = [];
  try { history = JSON.parse(localStorage.getItem(LS_HIST) || '[]'); } catch (e) { history = []; }
  if (!Array.isArray(history)) history = [];

  var exprEl = document.getElementById('expr');
  var resultEl = document.getElementById('result');
  var errorEl = document.getElementById('error');
  var histList = document.getElementById('histList');

  function t(key) { return I18N[lang][key]; }

  function applyLang() {
    document.documentElement.lang = (lang === 'bn') ? 'bn' : 'en';
    document.getElementById('title').textContent = t('title');
    document.getElementById('subtitle').textContent = t('subtitle');
    exprEl.placeholder = t('placeholder');
    document.getElementById('hint').textContent = t('hint');
    document.getElementById('histTitle').textContent = t('histTitle');
    document.getElementById('clearHistBtn').textContent = t('clearHist');
    document.getElementById('emptyHist').textContent = t('emptyHist');
    document.getElementById('copyBtn').textContent = t('copy');
    document.getElementById('langBtn').textContent = t('langBtn');
    document.getElementById('footerNote').textContent = t('footer');
    document.getElementById('angleBtn').textContent = angle;
    renderHistory();
    livePreview();
  }

  function evaluateCurrent() {
    var src = exprEl.value.trim();
    return window.SciCalc.evaluate(src, { angle: angle, ans: hasAns ? ans : 0 });
  }

  function showError(code) {
    var msg = (I18N[lang].err[code] || I18N[lang].err.SYNTAX);
    errorEl.textContent = msg;
    errorEl.hidden = false;
    resultEl.textContent = '';
  }

  function livePreview() {
    var src = exprEl.value.trim();
    if (!src) { resultEl.textContent = ''; errorEl.hidden = true; return; }
    try {
      var v = evaluateCurrent();
      resultEl.textContent = '= ' + localize(window.SciCalc.formatResult(v), lang);
      errorEl.hidden = true;
    } catch (e) {
      // Live preview stays quiet on incomplete input; "=" shows the error.
      resultEl.textContent = '';
      errorEl.hidden = true;
    }
  }

  function commit() {
    try {
      var v = evaluateCurrent();
      var formatted = window.SciCalc.formatResult(v);
      ans = v;
      hasAns = true;
      resultEl.textContent = '= ' + localize(formatted, lang);
      errorEl.hidden = true;
      history.unshift({ expr: exprEl.value.trim(), res: formatted });
      history = history.slice(0, 30);
      localStorage.setItem(LS_HIST, JSON.stringify(history));
      renderHistory();
    } catch (e) {
      showError(e.code || 'SYNTAX');
    }
  }

  function renderHistory() {
    histList.innerHTML = '';
    document.getElementById('emptyHist').hidden = history.length > 0;
    history.forEach(function (h) {
      var li = document.createElement('li');
      var span = document.createElement('span');
      span.className = 'hexpr';
      span.textContent = h.expr + ' = ';
      var res = document.createElement('span');
      res.className = 'hres';
      res.textContent = localize(h.res, lang);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'use';
      btn.textContent = t('use');
      btn.addEventListener('click', function () {
        exprEl.value = h.expr;
        exprEl.focus();
        livePreview();
      });
      var left = document.createElement('span');
      left.appendChild(span);
      left.appendChild(res);
      li.appendChild(left);
      li.appendChild(btn);
      histList.appendChild(li);
    });
  }

  document.getElementById('keys').addEventListener('click', function (ev) {
    var btn = ev.target.closest('button');
    if (!btn) return;
    var act = btn.getAttribute('data-act');
    if (act === 'clear') { exprEl.value = ''; livePreview(); exprEl.focus(); return; }
    if (act === 'back') { exprEl.value = exprEl.value.slice(0, -1); livePreview(); exprEl.focus(); return; }
    if (act === 'equals') { commit(); exprEl.focus(); return; }
    var ins = btn.getAttribute('data-ins');
    if (ins) {
      var start = exprEl.selectionStart === null ? exprEl.value.length : exprEl.selectionStart;
      var end = exprEl.selectionEnd === null ? exprEl.value.length : exprEl.selectionEnd;
      exprEl.value = exprEl.value.slice(0, start) + ins + exprEl.value.slice(end);
      var pos = start + ins.length;
      exprEl.setSelectionRange(pos, pos);
      livePreview();
      exprEl.focus();
    }
  });

  exprEl.addEventListener('input', livePreview);
  exprEl.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') { ev.preventDefault(); commit(); }
    if (ev.key === 'Escape') { exprEl.value = ''; livePreview(); }
  });

  document.getElementById('langBtn').addEventListener('click', function () {
    lang = (lang === 'en') ? 'bn' : 'en';
    localStorage.setItem(LS_LANG, lang);
    applyLang();
  });

  document.getElementById('angleBtn').addEventListener('click', function () {
    angle = (angle === 'DEG') ? 'RAD' : 'DEG';
    localStorage.setItem(LS_ANGLE, angle);
    document.getElementById('angleBtn').textContent = angle;
    livePreview();
  });

  document.getElementById('clearHistBtn').addEventListener('click', function () {
    history = [];
    localStorage.setItem(LS_HIST, JSON.stringify(history));
    renderHistory();
  });

  document.getElementById('copyBtn').addEventListener('click', function () {
    var text = resultEl.textContent.replace(/^= /, '');
    if (!text) return;
    var done = function () {
      var btn = document.getElementById('copyBtn');
      var old = btn.textContent;
      btn.textContent = t('copied');
      setTimeout(function () { btn.textContent = old; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      done();
    }
  });

  applyLang();
})();
