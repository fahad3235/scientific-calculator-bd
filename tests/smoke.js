// Headless-Chrome smoke test via raw CDP (no puppeteer dependency).
// Usage: node tests/smoke.js -- exits non-zero on any failure or page error.
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = 9347;
const FILE = 'file://' + path.resolve(__dirname, '..', 'index.html');
let failures = 0;
const pageErrors = [];
function check(name, cond, extra) {
  console.log((cond ? 'ok - ' : 'FAIL - ') + name + (cond ? '' : ' :: ' + (extra || '')));
  if (!cond) failures++;
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function poll(fn, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try { if (await fn()) return true; } catch (e) { /* retry */ }
    await wait(200);
  }
  return false;
}

(async () => {
  const chrome = spawn('/opt/meta-chromium/chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu',
    '--remote-debugging-port=' + PORT, '--user-data-dir=/tmp/scicalc-smoke-' + process.pid,
    'about:blank',
  ], { stdio: 'ignore' });
  let targets = [];
  for (let i = 0; i < 50 && targets.length === 0; i++) {
    await wait(200);
    try {
      targets = JSON.parse(await new Promise((res, rej) => {
        http.get('http://127.0.0.1:' + PORT + '/json/list', (r) => {
          let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(d));
        }).on('error', rej);
      }));
    } catch (e) { /* retry */ }
  }
  if (!targets.length) { console.log('FAIL - chrome did not start'); process.exit(2); }
  const wsUrl = targets[0].webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  await new Promise((res) => { ws.onopen = res; });
  let seq = 0; const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      pageErrors.push(JSON.stringify(msg.params.args));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      pageErrors.push(JSON.stringify(msg.params.exceptionDetails).slice(0, 300));
    }
  };
  const send = (method, params) => new Promise((res) => {
    const id = ++seq; pending.set(id, res); ws.send(JSON.stringify({ id, method, params }));
  });
  const ev = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.result && r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 300));
    return r.result ? r.result.result.value : undefined;
  };
  await send('Page.enable', {});
  await send('Runtime.enable', {});
  await send('Page.navigate', { url: FILE });
  await poll(async () => (await ev('document.querySelectorAll("#keys button").length')) === 35, 10000);

  const setExpr = async (v) => {
    await ev(`(function(){var e=document.getElementById("expr");e.value=${JSON.stringify(v)};e.dispatchEvent(new Event("input",{bubbles:true}));})()`);
    await wait(150);
  };
  const clickEquals = async () => {
    await ev('document.querySelector(\'[data-act="equals"]\').click()');
    await wait(150);
  };

  check('title is Scientific Calculator BD', (await ev('document.title')) === 'Scientific Calculator BD');
  check('35 keypad buttons render', (await ev('document.querySelectorAll("#keys button").length')) === 35);
  check('default angle is DEG', (await ev('document.getElementById("angleBtn").textContent')) === 'DEG');

  await setExpr('2+3*4');
  check('live preview 2+3*4 = 14', (await ev('document.getElementById("result").textContent')) === '= 14');
  await clickEquals();
  check('commit 2+3*4 = 14, history has 1 row', (await ev('document.querySelectorAll("#histList li").length')) === 1);

  await setExpr('sin(90)');
  await clickEquals();
  check('sin(90) DEG = 1', (await ev('document.getElementById("result").textContent')) === '= 1');

  await setExpr('ans+1');
  await clickEquals();
  check('Ans reuse: ans+1 = 2', (await ev('document.getElementById("result").textContent')) === '= 2');

  await setExpr('1/0');
  await clickEquals();
  check('1/0 shows divide-by-zero error', await (async () => {
    const hidden = await ev('document.getElementById("error").hidden');
    const txt = await ev('document.getElementById("error").textContent');
    return hidden === false && txt.includes('divide by zero');
  })());

  await setExpr('2+3');
  check('keypad: clicking 4 appends to make 2+34', await (async () => {
    await ev('document.querySelector(\'[data-ins="4"]\').click()');
    await wait(100);
    return (await ev('document.getElementById("expr").value')) === '2+34';
  })());

  check('angle toggle to RAD + sin(90) RAD ~ 0.8939966636', await (async () => {
    await ev('document.getElementById("angleBtn").click()');
    await wait(100);
    await setExpr('sin(90)');
    const txt = await ev('document.getElementById("result").textContent');
    return txt === '= 0.893996663601';
  })());
  await ev('document.getElementById("angleBtn").click()'); // back to DEG

  check('lang toggle switches title + Bengali digits', await (async () => {
    await ev('document.getElementById("langBtn").click()');
    await wait(200);
    const title = await ev('document.getElementById("title").textContent');
    await setExpr('2+3');
    const res = await ev('document.getElementById("result").textContent');
    // 5 in Bengali digits is U+09EB
    return title !== 'Scientific Calculator BD' && res.includes(String.fromCharCode(0x09eb));
  })());
  check('lang toggle back to English', await (async () => {
    await ev('document.getElementById("langBtn").click()');
    await wait(200);
    return (await ev('document.getElementById("title").textContent')) === 'Scientific Calculator BD';
  })());

  check('history Use button restores expression', await (async () => {
    await ev('document.querySelector("#histList li .use").click()');
    await wait(100);
    return (await ev('document.getElementById("expr").value')) !== '';
  })());

  check('clear history empties list', await (async () => {
    await ev('document.getElementById("clearHistBtn").click()');
    await wait(100);
    return (await ev('document.querySelectorAll("#histList li").length')) === 0;
  })());

  check('390px mobile: no horizontal overflow', await (async () => {
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await wait(300);
    const w = await ev('document.documentElement.scrollWidth');
    await send('Emulation.clearDeviceMetricsOverride', {});
    return w <= 390;
  })());

  check('zero console/page errors', pageErrors.length === 0, pageErrors.join(' | ').slice(0, 300));

  try { ws.close(); } catch (e) {}
  chrome.kill();
  console.log(failures === 0 ? 'smoke: ALL PASS' : `smoke: ${failures} FAILURES`);
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.log('smoke harness error: ' + e.message); process.exit(2); });
