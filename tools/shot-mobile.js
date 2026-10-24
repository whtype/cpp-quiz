/**
 * 真·手机尺寸截图
 * -------------------------------------
 * 为什么需要它：Chrome 的 --window-size 有最小宽度限制（约 500px），
 * 直接 `--window-size=390,844` 截出来的其实是 512 视口被裁掉右边，
 * 看着就像"页面在手机上溢出"。这个脚本用 DevTools 协议强行把视口
 * 设成 390×844，才是手机浏览器真实的样子。
 *
 * 用法：
 *   node tools/shot-mobile.js --url https://whtype.github.io/cpp-quiz/ --out shot.png
 *   node tools/shot-mobile.js --url ... --w 430 --h 932 --full
 *
 * 参数：
 *   --url  必填
 *   --out  输出 png，默认 shot.png
 *   --w    视口宽，默认 390（iPhone 14/15 逻辑宽）
 *   --h    视口高，默认 844
 *   --full 截整页（默认只截一屏）
 *   --wait 加载后额外等待毫秒，默认 700
 */

const { spawn } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

function arg(name, def) {
  const i = process.argv.indexOf('--' + name)
  if (i < 0) return def
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}

const url = arg('url')
const out = String(arg('out', 'shot.png'))
const W = Number(arg('w', 390))
const H = Number(arg('h', 844))
const FULL = arg('full', false) === true
const WAIT = Number(arg('wait', 700))
const PORT = 9333

if (!url) {
  console.error('缺 --url')
  process.exit(1)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getJSON(p) {
  const r = await fetch(`http://127.0.0.1:${PORT}${p}`)
  return r.json()
}

async function main() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'shot-'))
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank'
  ], { stdio: 'ignore' })

  // 等浏览器起来
  let ver = null
  for (let i = 0; i < 60; i++) {
    try { ver = await getJSON('/json/version'); break } catch (e) { await sleep(200) }
  }
  if (!ver) { chrome.kill(); throw new Error('浏览器没起来') }

  const target = await getJSON(`/json/new?${encodeURIComponent('about:blank')}`.replace('/json/new?', '/json/new?'))
    .catch(async () => {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })
      return r.json()
    })

  const ws = new WebSocket(target.webSocketDebuggerUrl)
  let id = 0
  const pending = new Map()
  const events = []

  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })

  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.id && pending.has(msg.id)) {
      const { res, rej } = pending.get(msg.id)
      pending.delete(msg.id)
      msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result)
    } else if (msg.method) {
      events.push(msg.method)
    }
  }

  const send = (method, params) => new Promise((res, rej) => {
    const mid = ++id
    pending.set(mid, { res, rej })
    ws.send(JSON.stringify({ id: mid, method, params: params || {} }))
  })

  await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    width: W, height: H, deviceScaleFactor: 2, mobile: true
  })
  await send('Emulation.setTouchEmulationEnabled', { enabled: true })

  await send('Page.navigate', { url })

  // 等 load 事件，最多 15 秒
  for (let i = 0; i < 150; i++) {
    if (events.indexOf('Page.loadEventFired') >= 0) break
    await sleep(100)
  }
  await sleep(WAIT)

  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: FULL
  })
  fs.writeFileSync(out, Buffer.from(shot.data, 'base64'))
  console.log(`${out}  ${W}×${H}${FULL ? ' (整页)' : ''}  ${Math.round(fs.statSync(out).size / 1024)}KB`)

  ws.close()
  chrome.kill()
  await sleep(300)
  try { fs.rmSync(profile, { recursive: true, force: true }) } catch (e) {}
}

main().catch((e) => {
  console.error('失败:', e.message)
  process.exit(1)
})
