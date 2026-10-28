# Test results -- scientific-calculator-bd

## Unit tests (node): 58/58 passed

`node tests/unit.test.mjs` -- parser and formatting, all hand-verified:

- Precedence: `2+3*4=14`, `(2+3)*4=20`, `10-4-3=3`
- Powers: `2^3^2=512` (right-assoc), `(2^3)^2=64`, `2^-2=0.25`
- School convention: `-2^2=-4` (one repair: the first parser build gave
  `4` because unary minus bound before `^`; fixed by making unary minus
  wrap the whole power in `parseFactor`)
- Implicit multiplication: `2(3+4)=14`, `2pi`, `(2)(3)=6`, `2sin(30)=1`
- Trig: `sin(90)=1`, `sin(30)=0.5`, `tan(45)=1` (DEG); `sin(pi/2)=1`
  (RAD); `asin(1)=90`, `acos(0)=90`, `atan(1)=45` (DEG)
- Logs/roots: `log(100)=2`, `ln(e)=1`, `sqrt(144)=12`, `5!=120`
- Errors: `1/0` and `10%0` -> DIV_ZERO; `sqrt(-1)`, `log(0)`,
  `asin(2)`, `tan(90)` DEG -> DOMAIN; `5.5!` -> FACTORIAL;
  `(2+3` -> PAREN; `2+`, `2+3)`, `foo(2)` -> SYNTAX/UNKNOWN
- Formatting: `0.1+0.2` displays as `0.3`; `-0` displays as `0`;
  `2*pi` displays as `6.28318530718`; `1/3` as `0.333333333333`

## Headless-Chrome smoke (raw CDP): 16/16 passed, 0 console errors

`node tests/smoke.js` -- `/opt/meta-chromium/chrome`, `file://` load:

- Title, 35 keypad buttons, default DEG angle
- Live preview `2+3*4 = 14`; commit stores 1 history row
- `sin(90)` DEG `= 1`; `ans+1 = 2` (Ans reuse)
- `1/0` shows the divide-by-zero error banner
- Keypad click appends (`2+3` + `4` -> `2+34`)
- RAD toggle: `sin(90)` RAD `= 0.893996663601`
- Bangla toggle: title changes, result shows Bengali digit 5
- History Use button restores an expression; Clear history empties it
- 390 px mobile: `scrollWidth <= 390` (no horizontal overflow)
- Zero console/page errors

## Source hygiene

All shipped files are pure ASCII (Bengali text stored as `\uXXXX`
escapes in `js/app.js`); verified with `grep -P '[^\x00-\x7F]'`.
No network requests are made by the app (no CDN, no fetch).
