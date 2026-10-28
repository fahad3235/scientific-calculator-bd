# Scientific Calculator BD

An offline, bilingual (English / Bangla) scientific calculator that runs
entirely in the browser. No accounts, no network requests, no `eval()` --
expressions are evaluated by a small hand-written recursive-descent parser.

Live site: https://fahad3235.github.io/scientific-calculator-bd/

## Features

- **Full scientific keypad** -- digits, `+ - x / % ^`, brackets, `!`
  (factorial), constants `pi` and `e`, and `Ans` (last result).
- **Functions** -- sin, cos, tan, asin, acos, atan, log (base 10), ln,
  sqrt, abs.
- **DEG / RAD toggle** for trigonometry, persisted in localStorage.
- **Safe parser, no eval** -- implicit multiplication (`2pi`, `2(3+4)`),
  right-associative powers (`2^3^2 = 512`), and the school convention
  `-x^2 = -(x^2)` while `2^-2` still works.
- **Live preview** as you type, plus clear error messages (divide by
  zero, unclosed bracket, domain and factorial errors) instead of `NaN`.
- **History** -- the last 30 calculations, persisted in localStorage;
  click "Use" to reload any expression, one click to clear.
- **Bilingual UI** -- English / Bangla toggle (persisted), with Bengali
  digits in Bangla mode.
- **Keyboard support** -- type expressions directly, Enter to calculate,
  Escape to clear.
- **Mobile friendly** -- verified at 390 px width with no horizontal
  overflow. Copy-result button included.

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no dependencies, no
framework. The expression engine (`js/logic.js`) is dependency-free and
shared between the browser app and the node test suite.

## Run locally

```sh
# Any static server works, or just open the file:
python3 -m http.server 8000
# then visit http://localhost:8000/
```

No prerequisites beyond a modern browser. Node.js (v18+) is needed only
to run the tests.

## Tests

```sh
node tests/unit.test.mjs   # 58 parser/formatting checks
node tests/smoke.js        # 16 headless-Chrome checks (raw CDP)
```

See `TEST_RESULTS.md` for the hand-verified values.

## Limitations

- Trigonometric inverse functions return values in the selected angle
  mode (DEG/RAD), matching the input mode.
- Results are rounded to 12 significant digits for display; very large
  or very small results use scientific notation.
- Factorial is limited to whole numbers from 0 to 170 (beyond that the
  result overflows a double).
- This is a personal offline tool, not a certified scientific instrument;
  double-check results before relying on them for exams or engineering.

## Status

MVP complete. Offline static site, deployed via GitHub Pages.
