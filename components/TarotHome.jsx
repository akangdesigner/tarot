'use client'
// 夜讀塔羅首頁：主視覺、三步驟占卜（選主題與牌陣 → 抽牌 → 調整牌位與正逆位後翻牌）、牌陣說明、FAQ。
// 版面照 Claude Design「Tarot Home v3」重現；正逆位抽牌時隨機決定；翻牌前使用者可以轉動牌背，但不影響正逆位。
import React from 'react'
import { css, Hv } from '@/lib/css'
import { TAROT } from '@/lib/tarot-data'
import { RitualFX } from '@/lib/ritual-fx'
import { SPREADS, FAQS } from '@/lib/content'

const THEMES = [
  { key: 'career', label: '事業', en: 'CAREER', glyph: '♃︎', sub: '工作 · 轉職 · 合作', ph: '例：我該接受新的工作邀約嗎？' },
  { key: 'love', label: '愛情', en: 'LOVE', glyph: '♀︎', sub: '關係 · 曖昧 · 復合', ph: '例：我和他的關係接下來會怎麼發展？' },
  { key: 'study', label: '學業', en: 'STUDY', glyph: '☿︎', sub: '考試 · 升學 · 方向', ph: '例：這次考試我該把重心放在哪裡？' }
]
const RN = ['I', 'II', 'III', 'IV', 'V']
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const h = React.createElement
const seeded = (s) => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
// 三角函數的小數在伺服器和瀏覽器可能差一點，取兩位避免 hydration 不一致
const n2 = (x) => Math.round(x * 100) / 100

const NOISE_FINE = "url(data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27220%27%20height%3D%27220%27%3E%3Cfilter%20id%3D%27n%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.9%27%20numOctaves%3D%273%27%20stitchTiles%3D%27stitch%27%2F%3E%3CfeColorMatrix%20values%3D%270%200%200%200%200.95%200%200%200%200%200.9%200%200%200%200%200.8%200%200%200%200.09%200%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url%28%23n%29%27%2F%3E%3C%2Fsvg%3E)"
const NOISE_CLOUD = "url(data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27520%27%20height%3D%27520%27%3E%3Cfilter%20id%3D%27n%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%270.012%27%20numOctaves%3D%274%27%20stitchTiles%3D%27stitch%27%2F%3E%3CfeColorMatrix%20values%3D%270%200%200%200%200.85%200%200%200%200%200.68%200%200%200%200%200.42%200%200%200%200.16%200%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url%28%23n%29%27%2F%3E%3C%2Fsvg%3E)"
const NOISE_VELVET = "url(data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%27180%27%20height%3D%27180%27%3E%3Cfilter%20id%3D%27n%27%3E%3CfeTurbulence%20type%3D%27fractalNoise%27%20baseFrequency%3D%271.5%27%20numOctaves%3D%272%27%20stitchTiles%3D%27stitch%27%2F%3E%3CfeColorMatrix%20values%3D%270%200%200%200%200.85%200%200%200%200%200.75%200%200%200%200%200.95%200%200%200%200.13%200%27%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%27100%25%27%20height%3D%27100%25%27%20filter%3D%27url%28%23n%29%27%2F%3E%3C%2Fsvg%3E)"
const CARD_BACK_BG = 'background-color:#141327;background-image:radial-gradient(circle, rgba(227,201,143,0.35) 0 6%, transparent 7%), radial-gradient(circle, transparent 0 22%, rgba(201,164,92,0.5) 23%, transparent 24.5%), repeating-linear-gradient(45deg,rgba(201,164,92,0.09) 0 1px,transparent 1px 6px),repeating-linear-gradient(-45deg,rgba(201,164,92,0.09) 0 1px,transparent 1px 6px);'
const TABLE = 'position:relative;width:100%;background:#120a1c;border:3px solid transparent;border-image:linear-gradient(135deg,#6e5020,#f1dca6 14%,#9c7634 30%,#ecd194 46%,#7a5a26 62%,#e0bf78 80%,#5e441a) 1;box-shadow:0 0 0 1px #07050c, 0 0 0 2px rgba(227,201,143,0.4), 0 0 26px rgba(227,201,143,0.12), 0 22px 60px rgba(0,0,0,0.65), inset 0 0 0 1px #07050c, inset 0 0 0 4px #120a1c, inset 0 0 0 5px rgba(227,201,143,0.5);'
const GOLD_BTN = 'linear-gradient(180deg,#f1dca6,#c9a45c 60%,#b08a44)'
const SYMBOL_FONT = "'Noto Sans Symbols','Noto Sans Symbols 2','Segoe UI Symbol','Apple Symbols',serif"

function starField(n, seed, opt) {
  const r = seeded(seed)
  const kids = []
  for (let i = 0; i < n; i++) {
    const sparkle = r() < (opt.sparkle || 0)
    const size = sparkle ? 8 + r() * 8 : 1 + r() * (opt.max || 2)
    const st = { position: 'absolute', left: (r() * 100).toFixed(2) + '%', top: (r() * 100).toFixed(2) + '%', animation: `twinkle ${(2.5 + r() * 4).toFixed(2)}s ease-in-out ${(r() * 5).toFixed(2)}s infinite`, opacity: 0.3 }
    kids.push(sparkle
      ? h('span', { key: i, style: { ...st, fontSize: size, lineHeight: 1, color: '#f3e4bd', textShadow: '0 0 8px rgba(243,228,189,0.8)' } }, '✦')
      : h('span', { key: i, style: { ...st, width: size, height: size, borderRadius: '50%', background: '#f6ecd2', boxShadow: `0 0 ${size * 3}px rgba(246,236,210,0.7)` } }))
  }
  return h('div', { style: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' } }, kids)
}
function flame(delay) {
  return h(React.Fragment, null,
    h('span', { style: { position: 'absolute', left: 0, top: '-1.6em', width: '12em', height: '12em', transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,190,110,0.32), rgba(234,88,12,0.1) 35%, transparent 68%)', animation: `glow 2.8s ease-in-out ${delay}s infinite`, pointerEvents: 'none' } }),
    h('span', { style: { position: 'absolute', left: '-0.45em', top: '-2.7em', width: '0.9em', height: '2.2em', transformOrigin: '50% 90%', borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%', background: 'radial-gradient(ellipse at 50% 78%, #fffbe8 0%, #ffe29a 30%, #f59e42 60%, rgba(234,88,12,0) 76%)', animation: `flicker 2.2s ease-in-out ${delay}s infinite` } }))
}
function mist() {
  const blob = (k, l, t, w, hh, d, del, a) => h('span', { key: k, style: { position: 'absolute', left: l, top: t, width: w, height: hh, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(210,200,235,${a}), transparent 70%)`, filter: 'blur(24px)', animation: `drift ${d}s ease-in-out ${del}s infinite alternate` } })
  return h('div', { style: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' } },
    blob(1, '-10%', '35%', '70%', '70%', 22, 0, 0.12), blob(2, '40%', '45%', '75%', '65%', 28, -6, 0.1), blob(3, '10%', '60%', '90%', '60%', 34, -12, 0.08))
}
function orb() {
  return h(React.Fragment, null,
    h('span', { style: { position: 'absolute', inset: '-25%', background: 'conic-gradient(from 0deg, transparent, rgba(200,180,255,0.4), transparent 30%, rgba(255,230,250,0.3), transparent 60%, rgba(150,190,255,0.35), transparent)', filter: 'blur(12px)', animation: 'swirl 16s linear infinite' } }),
    h('span', { style: { position: 'absolute', left: '20%', top: '45%', width: '60%', height: '30%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.35), transparent 70%)', filter: 'blur(6px)', animation: 'drift 7s ease-in-out infinite alternate' } }),
    h('span', { style: { position: 'absolute', left: '26%', top: '18%', width: '18%', height: '12%', borderRadius: '50%', background: 'rgba(255,255,255,0.7)', filter: 'blur(3px)' } }))
}
function astrolabe() {
  const s = '#c9a45c', kids = []
  ;[98, 90, 72, 66, 40, 34].forEach((r, i) => kids.push(h('circle', { key: 'c' + i, cx: 0, cy: 0, r, stroke: s, strokeWidth: i % 2 ? 0.3 : 0.5, fill: 'none' })))
  for (let i = 0; i < 72; i++) { const a = (i * 5) * Math.PI / 180, r1 = i % 6 ? 94 : 91; kids.push(h('line', { key: 't' + i, x1: n2(Math.cos(a) * r1), y1: n2(Math.sin(a) * r1), x2: n2(Math.cos(a) * 98), y2: n2(Math.sin(a) * 98), stroke: s, strokeWidth: 0.4 })) }
  const Z = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
  for (let i = 0; i < 12; i++) {
    const a = (i * 30) * Math.PI / 180, b = (i * 30 + 15) * Math.PI / 180
    kids.push(h('line', { key: 'd' + i, x1: n2(Math.cos(a) * 66), y1: n2(Math.sin(a) * 66), x2: n2(Math.cos(a) * 90), y2: n2(Math.sin(a) * 90), stroke: s, strokeWidth: 0.4 }))
    kids.push(h('text', { key: 'z' + i, x: n2(Math.cos(b) * 78), y: n2(Math.sin(b) * 78 + 3), fill: s, fontSize: 9, textAnchor: 'middle', fontFamily: "'Noto Sans Symbols','Noto Sans Symbols 2',serif" }, Z[i] + '︎'))
  }
  const tri = (rot) => [0, 1, 2].map((k) => { const a = (rot + k * 120 - 90) * Math.PI / 180; return `${(Math.cos(a) * 34).toFixed(2)},${(Math.sin(a) * 34).toFixed(2)}` }).join(' ')
  kids.push(h('polygon', { key: 'p1', points: tri(0), stroke: s, strokeWidth: 0.5, fill: 'none' }))
  kids.push(h('polygon', { key: 'p2', points: tri(180), stroke: s, strokeWidth: 0.5, fill: 'none' }))
  return h('svg', { viewBox: '-100 -100 200 200', width: '100%', height: '100%', style: { display: 'block', animation: 'swirl 360s linear infinite' } }, kids)
}
const FX = { sparks: starField(26, 31, { max: 2.2, sparkle: 0.25 }), flameA: flame(0), flameB: flame(-0.9), mist: mist(), orb: orb(), astro: astrolabe() }
const R = RitualFX
const RF = {
  far: R.stars(h, { n: 220, seed: 3, min: 0.5, max: 1.2, kf: 'twinkleSoft', anim: 0.45, minDur: 5, maxDur: 11, base: 0.5 }),
  mid: R.stars(h, { n: 80, seed: 11, min: 1, max: 2.2, kf: 'twinkle', minDur: 4, maxDur: 8 }),
  near: R.stars(h, { n: 12, seed: 23, sparkle: true, min: 9, max: 15, kf: 'twinkle', minDur: 5, maxDur: 9 }),
  fog: R.fog(h), tableFog: R.fog(h, { alpha: 1.5 }),
  velvet1: R.velvet(h, { seed: 1 }), velvet2: R.velvet(h, { seed: 2 }), velvet3: R.velvet(h, { seed: 3 }),
  faces: Array.from({ length: 78 }, (_, i) => R.deckFace(h, i))
}
const rectOf = (el) => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height } }

function Divider({ style }) {
  return (
    <svg width="220" height="14" viewBox="0 0 220 14" fill="none" aria-hidden="true" style={{ display: 'block', ...style }}>
      <path d="M0 7H92M128 7H220" stroke="#c9a45c" strokeOpacity=".55" /><path d="M110 1L116 7L110 13L104 7Z" stroke="#c9a45c" />
      <circle cx="110" cy="7" r="1.6" fill="#e3c98f" /><circle cx="98" cy="7" r="1.4" fill="#c9a45c" /><circle cx="122" cy="7" r="1.4" fill="#c9a45c" />
    </svg>
  )
}
function Corner({ style }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="#c9a45c" aria-hidden="true" style={{ position: 'absolute', ...style }}>
      <path d="M1 33V12C1 6 6 1 12 1h21" /><path d="M6 33V15c0-5 4-9 9-9h18" strokeOpacity=".45" /><circle cx="12" cy="12" r="2" fill="#e3c98f" stroke="none" />
    </svg>
  )
}
function ChapterHead({ eyebrow, title, en, extra }) {
  return (
    <div style={css('display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;')}>
      <span style={css("font-family:'Cinzel',serif;font-size:12px;letter-spacing:0.32em;color:#c9a45c;")}>{eyebrow}</span>
      <h2 style={css('margin:0;font-weight:600;font-size:clamp(1.35rem,3.8vw,1.8rem);letter-spacing:0.1em;color:#f3e9d2;')}>{title}{extra}</h2>
      <span style={css("font-family:'Lora',serif;font-style:italic;font-size:14px;color:#a89f8e;")}>{en}</span>
    </div>
  )
}
function Logo() {
  return (
    <>
      <span style={css("font-family:'Noto Sans Symbols','Noto Sans Symbols 2',serif;font-size:20px;color:#e3c98f;line-height:1;")}>☾</span>
      <span style={css('font-weight:600;font-size:18px;letter-spacing:0.2em;color:#f3e9d2;')}>夜讀塔羅</span>
      <span style={css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.24em;color:#c9a45c;")}>NOCTURNE</span>
    </>
  )
}

export default class TarotHome extends React.Component {
  state = { step: 1, topic: 'career', spread: 'time', question: '',
    phase: 'vortex', order: [], delays: null, busy: false,
    picks: [], flyers: [], landed: [], shuffleId: 0,
    arrange: true, slotOf: [], flipped: [], selected: null, hiddenCards: [], dropTarget: null, swapping: false,
    vw: 390, toolW: null, faq: 0 }
  toolRef = React.createRef()
  qRef = React.createRef()
  spreadRef = React.createRef()
  timers = []
  _rot = []

  componentDidMount() {
    this.onResize = () => {
      const el = this.toolRef.current
      const w = el ? el.getBoundingClientRect().width : 0
      this.setState({ vw: window.innerWidth || 390, toolW: w > 0 ? w : null })
    }
    this.onScroll = () => {
      const y = window.scrollY || 0
      document.querySelectorAll('[data-parallax]').forEach((n) => { const k = parseFloat(n.getAttribute('data-parallax')), m = parseFloat(n.getAttribute('data-max')); n.style.transform = `translate3d(0,${-Math.min(y * k, m)}px,0)` })
    }
    window.addEventListener('resize', this.onResize)
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.onResize()
    if (window.ResizeObserver && this.toolRef.current) { this.ro = new ResizeObserver(this.onResize); this.ro.observe(this.toolRef.current) }
    this.later(this.onResize, 300)
  }
  componentWillUnmount() { window.removeEventListener('resize', this.onResize); window.removeEventListener('scroll', this.onScroll); this.endDrag(); this.ro && this.ro.disconnect(); this.clearTimers() }
  clearTimers() { this.timers.forEach(clearTimeout); this.timers = [] }
  later(fn, ms) { this.timers.push(setTimeout(fn, ms)) }
  scrollTool() {
    this.later(() => { const el = this.toolRef.current; if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' }) }, 30)
  }
  spreadDef() { return SPREADS.find((s) => s.key === this.state.spread) }

  startDraw = () => {
    this.clearTimers()
    this.endDrag()
    const order = shuffle([...Array(78).keys()])
    this.setState((s) => ({ step: 2, phase: 'vortex', order, delays: null, busy: true, picks: [], flyers: [], landed: [], shuffleId: s.shuffleId + 1,
      arrange: true, slotOf: [], flipped: [], selected: null, hiddenCards: [], dropTarget: null, swapping: false }))
    this.later(() => { const d = []; order.forEach((k, s) => { d[k] = 120 + s * 9 }); this.setState({ phase: 'draw', delays: d }) }, 2800)
    this.later(() => this.setState({ busy: false, delays: null }), 2800 + 120 + 78 * 9 + 800)
    this.scrollTool()
  }
  pick = (k, e) => {
    const st = this.state, need = this.spreadDef().pos.length
    if (st.phase !== 'draw' || st.busy || st.picks.length >= need || st.picks.some((p) => p.k === k)) return
    const idx = st.picks.length
    const el = e && e.currentTarget, target = document.querySelector(`[data-tray-slot="${idx}"]`)
    let fl = null
    if (el && target) {
      const a = el.getBoundingClientRect(), b = target.getBoundingClientRect(), w = el.offsetWidth, hh = el.offsetHeight
      fl = { id: 'p' + Date.now() + '-' + idx, idx, rot: this._rot[k] || 0, from: { x: a.left + a.width / 2 - w / 2, y: a.top + a.height / 2 - hh / 2, w, h: hh }, to: { x: b.left, y: b.top, w: b.width, h: b.height } }
    }
    // 正逆位抽牌時隨機決定；翻牌前的「轉向」只是讓使用者轉動牌背，不影響正逆位，翻開時才照 rev 擺正
    this.setState((s) => ({ picks: [...s.picks, { k, id: k, rev: Math.random() < 0.5, turned: false }], flyers: fl ? [...s.flyers, fl] : s.flyers, landed: fl ? s.landed : [...s.landed, idx] }))
    if (fl) this.later(() => this.land(fl), 900)
  }
  land(fl) {
    if (fl.idx == null || fl.done) return
    fl.done = true
    this.setState((s) => (s.landed.includes(fl.idx) ? null : { landed: [...s.landed, fl.idx] }))
    this.later(() => this.setState((s) => ({ flyers: s.flyers.filter((f) => f.id !== fl.id) })), 800)
  }
  toReading = () => {
    const n = this.spreadDef().pos.length
    if (this.state.landed.length < n) return
    this.clearTimers()
    this.setState({ step: 3, arrange: true, slotOf: [...Array(n).keys()], flipped: Array(n).fill(false), flyers: [], selected: null, hiddenCards: [], dropTarget: null, swapping: false })
    this.scrollTool()
  }

  // ── 翻牌前：調換牌位、切換正逆位 ──
  toggleRev = (i) => {
    if (!this.state.arrange || this.state.swapping) return
    this.setState((s) => ({ picks: s.picks.map((p, j) => (j === i ? { ...p, turned: !p.turned } : p)), selected: null }))
  }
  cardEl(i) { const r = this.spreadRef.current; return r ? r.querySelector(`[data-card-i="${i}"]`) : null }
  slotEl(p) { const r = this.spreadRef.current; return r ? r.querySelector(`[data-pos-box="${p}"]`) : null }
  slotAt(x, y) {
    const r = this.spreadRef.current; if (!r) return null
    let hit = null
    r.querySelectorAll('[data-pos-box]').forEach((n) => { const b = n.getBoundingClientRect(); if (x >= b.left - 8 && x <= b.right + 8 && y >= b.top - 8 && y <= b.bottom + 8) hit = +n.getAttribute('data-pos-box') })
    return hit
  }
  swap(i, p2, flyBoth) {
    const st = this.state, slotOf = st.slotOf.slice(), p1 = slotOf[i], j = slotOf.indexOf(p2)
    if (p1 === p2 || j < 0) return
    const flyers = [], hidden = []
    const mk = (who, toP) => { const a = this.cardEl(who), b = this.slotEl(toP); if (a && b) { flyers.push({ id: 's' + Date.now() + '-' + who, from: rectOf(a), to: rectOf(b), seed: 40 + who }); hidden.push(who) } }
    mk(j, p1)
    if (flyBoth) mk(i, p2)
    slotOf[i] = p2; slotOf[j] = p1
    this.setState({ slotOf, selected: null, dropTarget: null, flyers: [...st.flyers, ...flyers], hiddenCards: hidden, swapping: true })
    this.later(() => this.setState((s) => ({ hiddenCards: [], swapping: false, flyers: s.flyers.filter((f) => !flyers.some((x) => x.id === f.id)) })), 860)
  }
  onCardDown = (i, e) => {
    const st = this.state
    if (st.step !== 3 || !st.arrange || st.swapping) return
    const el = this.cardEl(i); if (!el) return
    this.endDrag()
    const d = { i, el, sx: e.clientX, sy: e.clientY, moved: 0, active: false }
    d.move = (ev) => {
      const dx = ev.clientX - d.sx, dy = ev.clientY - d.sy
      d.moved = Math.max(d.moved, Math.abs(dx) + Math.abs(dy))
      if (!d.active && d.moved > 6) { d.active = true; d.t = el.style.transition; d.z = el.style.zIndex; el.style.transition = 'none'; el.style.zIndex = '60' }
      if (!d.active) return
      ev.preventDefault && ev.preventDefault()
      d.dx = dx; d.dy = dy
      el.style.transform = `translate(${dx}px,${dy}px) scale(1.08) rotate(${(dx * 0.03).toFixed(1)}deg)`
      el.style.filter = 'drop-shadow(0 0 16px rgba(243,214,140,0.75))'
      const t = this.slotAt(ev.clientX, ev.clientY)
      if (t !== this.state.dropTarget) this.setState({ dropTarget: t })
    }
    d.up = (ev) => {
      this.endDrag()
      if (!d.active) return
      this._suppressClick = true
      const t = this.slotAt(ev.clientX, ev.clientY), p1 = this.state.slotOf[i]
      const left = parseFloat(el.style.left) || 0, top = parseFloat(el.style.top) || 0
      el.style.left = (left + d.dx) + 'px'; el.style.top = (top + d.dy) + 'px'
      el.style.transform = 'none'; el.style.filter = ''
      void el.offsetWidth
      el.style.transition = d.t; el.style.zIndex = d.z
      if (t != null && t !== p1) this.swap(i, t, false)
      else { el.style.left = left + 'px'; el.style.top = top + 'px'; this.setState({ dropTarget: null }) }
    }
    this._drag = d
    window.addEventListener('pointermove', d.move, { passive: false })
    window.addEventListener('pointerup', d.up)
    window.addEventListener('pointercancel', d.up)
  }
  endDrag() { const d = this._drag; if (!d) return; window.removeEventListener('pointermove', d.move); window.removeEventListener('pointerup', d.up); window.removeEventListener('pointercancel', d.up); this._drag = null }
  onCardClick = (i) => {
    if (this._suppressClick) { this._suppressClick = false; return }
    const st = this.state
    if (st.step !== 3) return
    if (st.arrange) {
      if (st.swapping) return
      if (st.selected == null) this.setState({ selected: i })
      else if (st.selected === i) this.setState({ selected: null })
      else this.swap(st.selected, st.slotOf[i], true)
      return
    }
    this.flip(i)
  }
  startReveal = () => {
    const st = this.state
    if (!st.arrange || st.swapping) return
    this.setState({ arrange: false, selected: null })
    const first = st.slotOf.indexOf(0)
    this.later(() => this.flip(first), 250)
  }
  flip = (i) => this.setState((s) => { if (s.arrange) return null; const f = s.flipped.slice(); f[i] = true; return { flipped: f } })
  flipNext = () => { const st = this.state; const n = st.slotOf.length; for (let p = 0; p < n; p++) { const i = st.slotOf.indexOf(p); if (!st.flipped[i]) { this.flip(i); return } } }
  newQuestion = () => {
    this.clearTimers()
    this.endDrag()
    this.setState({ step: 1, question: '', picks: [], flipped: [], flyers: [], landed: [], selected: null, hiddenCards: [] })
    this.scrollTool()
    this.later(() => this.qRef.current && this.qRef.current.focus({ preventScroll: true }), 600)
  }

  vals() {
    const { step, topic, spread, question, phase, order, delays, busy, picks, flyers, landed, shuffleId, arrange, slotOf, flipped, selected, hiddenCards, dropTarget, swapping, vw, toolW, faq } = this.state
    const T = TAROT
    const isDesk = vw >= 900
    const sp = this.spreadDef()
    const need = sp.pos.length
    const theme = THEMES.find((t) => t.key === topic)
    const pagePad = clamp(vw * 0.04, 16, 24)
    const panelPad = clamp(vw * 0.045, 16, 48)
    const outer = toolW || (Math.min(vw, 1152) - pagePad * 2)
    const inner = outer - panelPad * 2 - 2
    const tablePad = Math.round(clamp(vw * 0.04, 14, 36))
    const tableInner = inner - tablePad * 2 - 2

    const stepsNav = ['選主題與牌陣', '抽牌', '翻牌解讀'].map((label, i) => {
      const n = i + 1, active = n === step, done = n < step
      return { num: RN[i], label,
        line: i < 2 ? (done ? 'rgba(201,164,92,0.6)' : 'rgba(201,164,92,0.2)') : 'transparent',
        color: active ? '#f3e9d2' : done ? '#a89f8e' : '#5f5848',
        ring: active ? '#e3c98f' : done ? 'rgba(201,164,92,0.55)' : 'rgba(201,164,92,0.22)',
        bg: active ? 'rgba(201,164,92,0.18)' : '#0e0c18',
        glow: active ? '0 0 20px rgba(227,201,143,0.35)' : 'none',
        numColor: active ? '#f6e7bf' : done ? '#c9a45c' : '#5f5848' }
    })
    const themes = THEMES.map((t) => { const on = t.key === topic; return { ...t, on,
      bd: on ? 'rgba(227,201,143,0.9)' : 'rgba(201,164,92,0.3)',
      bg: on ? 'radial-gradient(ellipse 80% 55% at 50% 38%, rgba(201,164,92,0.22), rgba(20,19,39,0.92) 72%)' : 'rgba(20,19,39,0.55)',
      glow: on ? '0 0 36px rgba(201,164,92,0.25), inset 0 0 0 5px #0e0c18, inset 0 0 0 6px rgba(227,201,143,0.45)' : 'inset 0 0 0 5px #0e0c18, inset 0 0 0 6px rgba(201,164,92,0.12)',
      glyphColor: on ? '#f3dfa8' : '#7d7566', glyphShadow: on ? '0 0 22px rgba(243,223,168,0.75)' : 'none',
      labelColor: on ? '#f3e9d2' : '#a89f8e', enColor: on ? '#e3c98f' : '#6f6857',
      onClick: () => this.setState({ topic: t.key }) } })
    const spreads = SPREADS.map((s, i) => { const on = s.key === spread; return { key: s.key, name: s.name, on, numeral: RN[i], count: s.pos.length,
      color: on ? '#f3e9d2' : '#9d937e', numColor: on ? '#e3c98f' : '#6f6857',
      line: on ? '#e3c98f' : 'transparent', lineGlow: on ? '0 0 12px rgba(227,201,143,0.7)' : 'none',
      onClick: () => this.setState({ spread: s.key }) } })

    // 絨布上的牌陣預覽
    const pvW = Math.round(isDesk ? Math.min(tableInner, 620) : tableInner)
    const units = Math.max(...sp.pos.map((p) => p[2])) + 1, maxY = Math.max(...sp.pos.map((p) => p[3]))
    const pgap = isDesk ? 22 : 10, plabel = 30
    const pcw = Math.floor(Math.min(need === 1 ? (isDesk ? 116 : 92) : (isDesk ? 90 : 70), (pvW - (units - 1) * pgap) / units))
    const pch = Math.round(pcw * 1.66), prow = pch + plabel + 8
    const offX = (pvW - (units * pcw + (units - 1) * pgap)) / 2
    const pvH = Math.round(maxY * prow + pch + plabel)
    const pvSlots = [0, 1, 2, 3, 4].map((i) => { const p = sp.pos[i]
      return p ? { left: Math.round(offX + p[2] * (pcw + pgap)), top: Math.round(p[3] * prow), opacity: 1, label: p[0], numeral: RN[i] }
        : { left: Math.round(pvW / 2 - pcw / 2), top: Math.round(pvH / 2 - pch / 2), opacity: 0, label: '', numeral: '' } })

    // 牌堆：洗牌漩渦 → 牌扇
    const W = tableInner
    const cols = isDesk ? 26 : 13, rows = Math.ceil(78 / cols), mid = (cols - 1) / 2
    const cw = Math.round(isDesk ? clamp(W / 13, 54, 74) : clamp(W / 6.4, 38, 60))
    const ch = Math.round(cw * 1.62)
    const stepX = (W - cw) / (cols - 1)
    const stepY = ch * (isDesk ? 0.7 : 0.56)
    const arc = isDesk ? 0.16 : 0.5, rotK = isDesk ? 1 : 2
    const H = Math.round((rows - 1) * stepY + ch + arc * mid * mid + 14)
    const full = picks.length >= need
    const isDraw = phase === 'draw'
    const deckCards = order.map((k, s) => {
      let x = W / 2 - cw / 2, y = H / 2 - ch / 2, r = 0, op = 0
      if (isDraw) { const row = Math.floor(s / cols), c = s % cols, d = c - mid; x = c * stepX; y = 10 + row * stepY + arc * d * d; r = d * rotK; op = 1 }
      this._rot[k] = r
      const taken = picks.some((p) => p.k === k)
      const base = `rotate(${r.toFixed(1)}deg)`
      const dl = busy && delays ? Math.round(delays[k] || 0) : 0
      const canPick = isDraw && !busy && !taken && !full
      return { k, left: Math.round(x), top: Math.round(y), z: s, face: RF.faces[k],
        transform: base, opacity: taken ? 0.05 : (isDraw && full ? 0.4 : op),
        cursor: canPick ? 'pointer' : 'default',
        hover: canPick ? `transform:${base} translateY(-16px) scale(1.06);filter:drop-shadow(0 0 10px rgba(243,214,140,0.9)) brightness(1.15);z-index:300;` : '',
        transition: busy
          ? `left 820ms cubic-bezier(0.16,1,0.3,1) ${dl}ms, top 820ms cubic-bezier(0.16,1,0.3,1) ${dl}ms, transform 820ms cubic-bezier(0.16,1,0.3,1) ${dl}ms, opacity 400ms ease ${dl}ms, filter 240ms ease`
          : 'left 300ms ease, top 300ms ease, transform 260ms ease, opacity 300ms ease, filter 240ms ease',
        onClick: (e) => this.pick(k, e) }
    })
    const trayW = isDesk ? 56 : 46, trayH = Math.round(trayW * 1.62)
    const tray = sp.pos.map((p, i) => { const f = landed.includes(i), next = !f && i === picks.length && isDraw; return {
      label: p[0], num: f ? '✦' : RN[i], numColor: f || next ? '#e3c98f' : '#5f5848', labelColor: f || next ? '#e3c98f' : '#6f6857',
      border: f || next ? 'rgba(243,214,140,0.85)' : 'rgba(201,164,92,0.45)',
      bg: f ? '#141327' : 'rgba(4,2,8,0.55)',
      pattern: f ? 'repeating-linear-gradient(45deg,rgba(201,164,92,0.09) 0 1px,transparent 1px 5px),repeating-linear-gradient(-45deg,rgba(201,164,92,0.09) 0 1px,transparent 1px 5px)' : 'none',
      shadow: f ? '0 0 0 3px rgba(8,5,14,0.7), 0 0 0 4px rgba(243,214,140,0.5), 0 0 22px rgba(227,201,143,0.45)' : next ? 'inset 0 4px 10px rgba(0,0,0,0.85), 0 0 0 3px rgba(8,5,14,0.7), 0 0 0 4px rgba(243,214,140,0.7), 0 0 22px 3px rgba(243,214,140,0.4)' : 'inset 0 4px 10px rgba(0,0,0,0.85), 0 0 0 3px rgba(8,5,14,0.7), 0 0 0 4px rgba(201,164,92,0.3)',
      fx: f ? R.burst(h, { w: trayW, h: trayH, color: 'gold', delay: 0, n: 14, key: 'tb' + i + '-' + shuffleId }) : null } })
    const flyerEls = flyers.map((f) => R.flight(h, { ...f, onDone: () => this.land(f) }))

    // 翻牌與解讀
    const colW = isDesk ? (inner - 48) * 0.56 : inner
    const avail = colW - tablePad * 2 - 2
    const gap = isDesk ? 18 : 10, labelH = 58
    const maxCW = need === 1 ? (isDesk ? 220 : 170) : (isDesk ? 140 : 120)
    const rcw = Math.floor(Math.min(maxCW, (avail - (units - 1) * gap) / units))
    const rch = Math.round(rcw * 1.72)
    const rowH = rch + labelH + gap
    const picked = picks.map((p) => ({ ...p, card: T.cards[p.id] }))
    const cardAt = (p) => slotOf.indexOf(p)
    const posXY = (p) => ({ left: Math.round(sp.pos[p][2] * (rcw + gap)), top: Math.round(sp.pos[p][3] * rowH) })
    const rdSlots = sp.pos.map((p, pi) => {
      const i = cardAt(pi), pk = picked[i], card = pk && pk.card, f = i >= 0 && !!flipped[i], rev = !!(pk && pk.rev), tgt = dropTarget === pi
      return { p: pi, ...posXY(pi), label: p[0], numeral: RN[pi], cardI: i, rev,
        sub: f && card ? `${card.name}${rev ? ' · 逆' : ''}` : '', subColor: rev ? '#cfc8ff' : '#ece2cc',
        bd: tgt ? 'rgba(255,232,178,1)' : 'rgba(243,214,140,0.6)',
        glow: `inset 0 6px 14px rgba(0,0,0,0.85), inset 0 0 0 4px rgba(8,5,14,0.5), inset 0 0 0 5px rgba(201,164,92,0.3), 0 0 0 4px rgba(8,5,14,0.65), 0 0 0 5px rgba(243,214,140,${tgt ? 0.95 : 0.45}), 0 0 ${tgt ? 30 : 18}px ${tgt ? 6 : 3}px rgba(243,214,140,${tgt ? 0.6 : 0.26})` }
    })
    const rdCards = picked.slice(0, need).map((pk, i) => {
      const p = slotOf[i] == null ? i : slotOf[i], f = !!flipped[i], card = pk.card, rev = !!pk.rev, sel = selected === i
      const backRing = 'rgba(201,164,92,0.35)'
      return { i, ...posXY(p), z: sel ? 20 : 10, opacity: hiddenCards.includes(i) ? 0 : 1,
        lift: sel ? 'translateY(-10px) scale(1.05)' : 'none', touch: arrange ? 'none' : 'auto',
        backGlow: sel ? 'inset 0 0 0 5px #141327, inset 0 0 0 6px rgba(243,214,140,0.8), 0 0 30px rgba(243,214,140,0.65), 0 14px 30px rgba(0,0,0,0.6)'
          : `inset 0 0 0 5px #141327, inset 0 0 0 6px ${backRing}, 0 14px 30px rgba(0,0,0,0.6)`,
        rot: f ? 'rotateY(180deg)' : 'rotateY(0deg)', zrot: (f ? rev : pk.turned) ? 'rotate(180deg)' : 'rotate(0deg)',
        zTransition: arrange ? 'transform 600ms cubic-bezier(0.16,1,0.3,1)' : 'transform 900ms cubic-bezier(0.6,0,0.2,1)',
        backMark: '#e3c98f',
        faceGlow: !f ? '0 0 0 1px rgba(227,201,143,0.5)' : rev ? '0 0 0 1px rgba(195,186,255,0.85), 0 0 46px rgba(150,140,255,0.5), 0 14px 30px rgba(0,0,0,0.6)' : '0 0 0 1px rgba(227,201,143,0.85), 0 0 46px rgba(243,212,138,0.45), 0 14px 30px rgba(0,0,0,0.6)',
        burst: f ? R.burst(h, { w: rcw, h: rch, color: rev ? 'violet' : 'gold', key: 'rb' + i + '-' + shuffleId, seed: 9 + i }) : null,
        bgImg: `url("${card.img}")`, alt: `${card.name}（${card.en}）偉特塔羅牌${rev ? '逆位' : '正位'}`, num: card.num, name: card.name,
        cursor: arrange ? 'grab' : f ? 'default' : 'pointer', aria: arrange ? '拖曳或點選以調換位置' : f ? card.name : '翻開這張牌',
        onDown: (e) => this.onCardDown(i, e), onClick: () => this.onCardClick(i) }
    })
    const details = sp.pos.map((p, pi) => {
      const i = cardAt(pi), pk = picked[i], card = pk && pk.card, f = i >= 0 && !!flipped[i] && !!card
      const rev = pk && pk.rev
      // 測試期只給一句簡短結論，完整解讀由占卜師本人來做
      const text = f ? (rev ? card.rev : card.up) : ''
      return { numeral: RN[pi], label: p[0], flipped: f, hiddenText: arrange ? '尚未翻開' : '尚未翻開 · 點擊牌面',
        name: f ? card.name : '', en: f ? card.en : '', orient: rev ? '逆位' : '正位',
        oColor: rev ? '#cfc8ff' : '#f1dca6', oBd: rev ? 'rgba(195,186,255,0.5)' : 'rgba(227,201,143,0.6)', oBg: rev ? 'rgba(150,140,255,0.1)' : 'rgba(201,164,92,0.12)',
        kwText: f ? (rev ? card.revKw : card.upKw).join(' · ') : '', cap: text.slice(0, 1), rest: text.slice(1), posNote: p[1] }
    })
    const nFlipped = flipped.filter(Boolean).length
    const allFlipped = step === 3 && !arrange && nFlipped === need

    const spreadDocs = SPREADS.map((s, i) => {
      const mx = Math.max(...s.pos.map((p) => p[2])), my = Math.max(...s.pos.map((p) => p[3]))
      return { key: s.key, name: s.name, long: s.long, numeral: RN[i], count: s.pos.length, posText: s.pos.map((p) => p[0]).join(' · '),
        mini: s.pos.map((p) => ({ l: Math.round(p[2] * 16), t: Math.round(p[3] * 22) })), miniW: Math.round(mx * 16 + 12), miniH: Math.round(my * 22 + 19) }
    })
    const faqs = FAQS.map(([q, a], i) => ({ q, a, numeral: RN[i], open: faq === i, sign: faq === i ? '−' : '+', onClick: () => this.setState({ faq: faq === i ? -1 : i }) }))
    const ready = landed.length >= need

    return {
      isDesk, step, stepsNav, themes, spreads, sp, need, theme, question, phase, full, isDraw, tablePad,
      pv: { w: pvW, h: pvH, cw: pcw, ch: pch, slots: pvSlots, numSize: Math.round(pcw * 0.26) },
      deck: { cards: deckCards, h: H, cw, ch },
      shuffleFx: phase === 'vortex' ? R.shuffle(h, { cw, ch, R: Math.min(W, H) * 0.3, id: shuffleId }) : null,
      tray, trayW, trayH, flyerEls, ready, picks, arrange, swapping,
      rd: { slots: rdSlots, cards: rdCards, cw: rcw, ch: rch, w: Math.round(units * rcw + (units - 1) * gap), h: Math.round(maxY * rowH + rch + labelH), numSize: Math.round(rcw * 0.22) },
      flipHint: arrange
        ? (need > 1 ? '翻牌前可以調整：把牌拖到別的位置互換，或先後點兩張牌對調；想把哪張牌轉過來，就按牌下面的「轉向」。好了就按「翻牌」。' : '翻牌前，想把牌轉過來就按牌下面的「轉向」。好了就按「翻牌」。')
        : allFlipped ? '所有牌都已翻開' : `點擊牌面，依序翻開 · ${nFlipped} / ${need}`,
      details, allFlipped, canFlipNext: step === 3 && !arrange && nFlipped < need, spreadDocs, faqs
    }
  }

  render() {
    const v = this.vals()
    const { isDesk, sp, pv, deck, rd } = v
    const question = v.question
    return (
      <div style={css('min-height:100vh;background:#0b0a12;position:relative;overflow:hidden;')}>
        <div aria-hidden="true" style={css('position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:radial-gradient(ellipse 55% 38% at 18% 12%, rgba(64,86,170,0.30), transparent 70%), radial-gradient(ellipse 38% 28% at 32% 24%, rgba(120,90,190,0.16), transparent 70%), radial-gradient(ellipse 45% 35% at 86% 34%, rgba(40,110,140,0.16), transparent 70%), radial-gradient(ellipse 34% 24% at 76% 72%, rgba(150,70,120,0.11), transparent 70%), radial-gradient(ellipse 70% 40% at 50% 108%, rgba(201,164,92,0.08), transparent 70%), linear-gradient(118deg, transparent 28%, rgba(170,170,230,0.05) 42%, rgba(235,215,175,0.07) 50%, rgba(170,170,230,0.04) 58%, transparent 72%), linear-gradient(180deg, #070912 0%, #0b0a18 45%, #0a0810 100%);')}>
          <div data-parallax="0.02" data-max="120" style={css('position:absolute;left:0;right:0;top:0;height:calc(100% + 120px);')}>{RF.far}</div>
          <div data-parallax="0.05" data-max="260" style={css('position:absolute;left:0;right:0;top:0;height:calc(100% + 260px);')}>{RF.mid}</div>
          <div data-parallax="0.1" data-max="460" style={css('position:absolute;left:0;right:0;top:0;height:calc(100% + 460px);')}>{RF.near}</div>
          <div style={css('position:absolute;inset:0;')}>{RF.fog}</div>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: NOISE_FINE, opacity: 0.7 }} />
          <div style={css('position:absolute;inset:0;background:radial-gradient(ellipse 120% 90% at 50% 40%, transparent 55%, rgba(0,0,0,0.55));')} />
        </div>

        <header style={css('position:sticky;top:0;z-index:50;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);background:rgba(11,10,18,0.78);border-bottom:1px solid rgba(201,164,92,0.18);')}>
          <div style={css('max-width:1152px;margin:0 auto;padding:0 clamp(16px,4vw,24px);height:60px;display:flex;align-items:center;justify-content:space-between;gap:16px;')}>
            <a href="#top" style={css('display:flex;align-items:center;gap:10px;')}><Logo /></a>
            {isDesk ? (
              <nav style={css('display:flex;align-items:center;gap:28px;')}>
                <Hv href="#reading" style="font-size:14px;letter-spacing:0.12em;color:#b3a993;" hover="color:#f3e9d2;">線上占卜</Hv>
                <Hv href="#spreads" style="font-size:14px;letter-spacing:0.12em;color:#b3a993;" hover="color:#f3e9d2;">牌陣說明</Hv>
                <Hv href="#faq" style="font-size:14px;letter-spacing:0.12em;color:#b3a993;" hover="color:#f3e9d2;">常見問題</Hv>
                <Hv href="#reading" style="font-size:14px;letter-spacing:0.12em;color:#1a140a;padding:8px 20px;border-radius:2px;background:linear-gradient(180deg,#ecd49b,#c9a45c);box-shadow:0 0 24px rgba(227,201,143,0.25);" hover="color:#1a140a;filter:brightness(1.08);">開始占卜</Hv>
              </nav>
            ) : (
              <a href="#reading" style={css('font-size:13px;letter-spacing:0.1em;color:#1a140a;padding:8px 16px;border-radius:2px;background:linear-gradient(180deg,#ecd49b,#c9a45c);')}>開始占卜</a>
            )}
          </div>
        </header>

        <section id="top" style={css('position:relative;z-index:1;padding:clamp(36px,7vw,80px) 0 0;display:flex;flex-direction:column;align-items:center;overflow:hidden;')}>
          <div style={css('position:absolute;left:50%;top:clamp(-40px,-4vw,0px);width:clamp(420px,80vw,820px);aspect-ratio:1;transform:translateX(-50%);opacity:0.22;pointer-events:none;')}>{FX.astro}</div>
          <span style={css('position:absolute;top:clamp(24px,5vw,60px);right:clamp(16px,8vw,120px);width:clamp(56px,10vw,120px);aspect-ratio:1;border-radius:50%;box-shadow:inset clamp(-14px,-2.4vw,-28px) clamp(4px,0.8vw,10px) 0 0 #efe2bf, 0 0 80px rgba(239,226,191,0.18);pointer-events:none;')} />
          <svg viewBox="0 0 200 120" fill="none" aria-hidden="true" style={css('position:absolute;top:clamp(60px,10vw,120px);left:clamp(8px,5vw,90px);width:clamp(110px,20vw,240px);pointer-events:none;')}>
            <path d="M8 92L46 70L82 80L112 50L150 42L176 14M112 50L140 10" stroke="#c9a45c" strokeOpacity=".4" strokeWidth=".8" />
            {[[8, 92, 1.8], [46, 70, 2.4], [82, 80, 1.6], [112, 50, 2.8], [150, 42, 1.8], [176, 14, 2.2], [140, 10, 1.5]].map(([cx, cy, r]) => <circle key={cx} cx={cx} cy={cy} r={r} fill="#f3e4bd" />)}
          </svg>

          <div style={css('position:relative;max-width:720px;padding:0 clamp(16px,4vw,24px);display:flex;flex-direction:column;align-items:center;text-align:center;')}>
            <div aria-hidden="true" style={css('display:flex;align-items:center;gap:clamp(8px,1.6vw,12px);margin-bottom:22px;')}>
              <span style={css('width:10px;height:10px;border-radius:50%;border:1px solid rgba(227,201,143,0.55);')} />
              <span style={css('width:10px;height:10px;border-radius:50%;border:1px solid rgba(227,201,143,0.25);box-shadow:inset -3px 0 0 0 #e3c98f;')} />
              <span style={css('width:10px;height:10px;border-radius:50%;border:1px solid rgba(227,201,143,0.3);background:linear-gradient(90deg,transparent 50%,#e3c98f 50%);')} />
              <span style={css('width:10px;height:10px;border-radius:50%;background:#e3c98f;box-shadow:inset 3px 0 0 0 #0b0a12;')} />
              <span style={css('width:12px;height:12px;border-radius:50%;background:#f3e4bd;box-shadow:0 0 12px rgba(243,228,189,0.8);')} />
              <span style={css('width:10px;height:10px;border-radius:50%;background:#e3c98f;box-shadow:inset -3px 0 0 0 #0b0a12;')} />
              <span style={css('width:10px;height:10px;border-radius:50%;border:1px solid rgba(227,201,143,0.3);background:linear-gradient(90deg,#e3c98f 50%,transparent 50%);')} />
              <span style={css('width:10px;height:10px;border-radius:50%;border:1px solid rgba(227,201,143,0.25);box-shadow:inset 3px 0 0 0 #e3c98f;')} />
              <span style={css('width:10px;height:10px;border-radius:50%;border:1px solid rgba(227,201,143,0.55);')} />
            </div>
            <span style={css("font-family:'Cinzel',serif;font-size:clamp(11px,1.6vw,13px);letter-spacing:0.32em;color:#c9a45c;")}>RIDER · WAITE · MCMIX</span>
            <h1 style={css('margin:18px 0 0;font-weight:600;font-size:clamp(2.1rem,7.4vw,4.1rem);line-height:1.3;letter-spacing:0.1em;color:#f3e9d2;text-wrap:balance;')}>安靜下來，<br /><span style={css('background:linear-gradient(180deg,#f8ebc6 10%,#c9a45c 90%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 18px rgba(227,201,143,0.35));')}>為你的問題抽一張牌</span></h1>
            <Divider style={{ margin: '22px 0 0' }} />
            <p style={css('margin:20px 0 0;max-width:520px;font-size:clamp(15px,2.2vw,17px);line-height:2;color:#b3a993;text-wrap:pretty;')}>用 1909 年偉特塔羅原版 78 張牌。選好主題、想好問題，自己抽牌，再一張一張翻開。</p>
            <Hv href="#reading" style="margin-top:30px;display:inline-flex;align-items:center;gap:14px;min-height:54px;padding:14px 34px;border-radius:2px;font-size:16px;letter-spacing:0.18em;color:#1a140a;background:linear-gradient(180deg,#f1dca6,#c9a45c 60%,#b08a44);box-shadow:0 0 0 1px #0b0a12, 0 0 0 2px rgba(227,201,143,0.6), 0 0 40px rgba(227,201,143,0.3);" hover="color:#1a140a;filter:brightness(1.08);"><span style={{ fontSize: 11 }}>✦</span>開始占卜<span style={{ fontSize: 11 }}>✦</span></Hv>
            <span style={css('margin-top:14px;font-size:12px;letter-spacing:0.12em;color:#7d7566;')}>免費 · 不用註冊 · 結果僅供參考</span>
          </div>

          <div aria-hidden="true" style={css('position:relative;width:100%;max-width:1080px;height:clamp(300px,74vw,560px);margin-top:clamp(12px,3vw,32px);')}>
            <div style={{ ...css('position:absolute;left:-12%;right:-12%;bottom:0;height:48%;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);'), background: `${NOISE_VELVET}, radial-gradient(ellipse 50% 70% at 50% 10%, #36224d 0%, #1f1431 50%, #0c0816 100%)` }} />
            <div style={css('position:absolute;left:-1%;right:-1%;bottom:48%;height:1px;background:linear-gradient(90deg,transparent,rgba(227,201,143,0.55) 20%,rgba(227,201,143,0.55) 80%,transparent);')} />
            <div style={css('position:absolute;left:0;right:0;bottom:calc(48% - 7px);height:6px;background:repeating-linear-gradient(90deg,rgba(201,164,92,0.35) 0 2px,transparent 2px 8px);-webkit-mask-image:linear-gradient(90deg,transparent,#000 20%,#000 80%,transparent);mask-image:linear-gradient(90deg,transparent,#000 20%,#000 80%,transparent);')} />
            <div style={css('position:absolute;left:0;right:0;bottom:0;height:60%;background:radial-gradient(ellipse 40% 55% at 22% 35%, rgba(245,158,66,0.16), transparent 70%), radial-gradient(ellipse 30% 50% at 86% 40%, rgba(245,158,66,0.12), transparent 70%);pointer-events:none;')} />

            <div style={css('position:absolute;left:clamp(14px,8%,110px);bottom:34%;display:flex;align-items:flex-end;gap:clamp(6px,1.4vw,14px);font-size:clamp(9px,1.4vw,15px);')}>
              <span style={css('position:relative;display:block;width:2em;height:9em;border-radius:0.5em 0.5em 0.15em 0.15em;background:linear-gradient(90deg,#b9a98a,#f3e8cf 40%,#e6d6b2 70%,#9c8a6a);box-shadow:0 0 30px rgba(245,158,66,0.25);')}>
                <span style={css('position:absolute;left:50%;top:-0.6em;width:1px;height:0.7em;background:#2a2118;')} />
                <span style={css('position:absolute;left:50%;top:0;width:0;height:0;')}>{FX.flameA}</span>
              </span>
              <span style={css('position:relative;display:block;width:1.6em;height:5.6em;border-radius:0.5em 0.5em 0.15em 0.15em;background:linear-gradient(90deg,#b9a98a,#f3e8cf 40%,#e6d6b2 70%,#9c8a6a);')}>
                <span style={css('position:absolute;left:50%;top:-0.6em;width:1px;height:0.7em;background:#2a2118;')} />
                <span style={css('position:absolute;left:50%;top:0;width:0;height:0;')}>{FX.flameB}</span>
              </span>
            </div>

            <div style={css('position:absolute;right:clamp(8px,7%,110px);bottom:31%;width:clamp(84px,18vw,180px);display:flex;flex-direction:column;align-items:center;')}>
              <span style={css('position:relative;display:block;width:100%;aspect-ratio:1;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 34% 30%, rgba(255,255,255,0.75) 0, rgba(230,220,255,0.25) 12%, rgba(140,120,200,0.18) 40%, rgba(40,30,80,0.55) 80%, rgba(20,15,40,0.85) 100%);box-shadow:0 0 50px rgba(170,150,240,0.35), inset 0 -10px 30px rgba(10,5,30,0.6), inset 0 0 0 1px rgba(255,255,255,0.12);')}>{FX.orb}</span>
              <span style={css('display:block;width:62%;height:clamp(16px,3.6vw,34px);margin-top:-6%;clip-path:polygon(18% 0,82% 0,100% 100%,0 100%);background:linear-gradient(90deg,#6e5428,#e3c98f 45%,#a8833f 70%,#5a431e);')} />
            </div>

            <div style={css('position:absolute;left:50%;bottom:7%;transform:translateX(-50%);perspective:900px;')}>
              <div style={css('display:flex;align-items:flex-end;gap:clamp(8px,1.8vw,18px);transform:rotateX(50deg);transform-origin:50% 100%;')}>
                <span style={css('display:block;width:clamp(58px,13vw,128px);aspect-ratio:11/19;transform:rotate(-6deg) translateY(6%);border-radius:6px;border:1px solid rgba(201,164,92,0.7);' + CARD_BACK_BG + 'box-shadow:inset 0 0 0 4px #141327, inset 0 0 0 5px rgba(201,164,92,0.4), 0 16px 30px rgba(0,0,0,0.6);')} />
                <span style={css("display:block;width:clamp(64px,14.5vw,142px);aspect-ratio:11/19;border-radius:6px;background:#e9e2cf url('" + (process.env.NEXT_PUBLIC_BASE_PATH || '') + "/tarot/major-18.jpg') center/cover no-repeat;box-shadow:0 0 0 1px rgba(227,201,143,0.6), 0 0 50px rgba(227,201,143,0.28), 0 18px 34px rgba(0,0,0,0.6);")} />
                <span style={css('display:block;width:clamp(58px,13vw,128px);aspect-ratio:11/19;transform:rotate(7deg) translateY(4%);border-radius:6px;border:1px solid rgba(201,164,92,0.7);' + CARD_BACK_BG + 'box-shadow:inset 0 0 0 4px #141327, inset 0 0 0 5px rgba(201,164,92,0.4), 0 16px 30px rgba(0,0,0,0.6);')} />
              </div>
            </div>
            <div style={css('position:absolute;inset:auto 0 0 0;height:70%;')}>{FX.mist}</div>
            <div style={css('position:absolute;inset:0 0 40% 0;')}>{FX.sparks}</div>
            <div style={css('position:absolute;left:0;right:0;bottom:0;height:90px;background:linear-gradient(180deg,transparent,rgba(8,8,18,0.92));')} />
          </div>
        </section>

        <main style={css('position:relative;z-index:1;max-width:1152px;margin:0 auto;padding:0 clamp(16px,4vw,24px);')}>
          <section id="reading" ref={this.toolRef} style={{ ...css('position:relative;margin-top:clamp(8px,2vw,24px);padding:clamp(28px,6vw,56px) clamp(16px,4.5vw,48px);border:1px solid rgba(201,164,92,0.5);box-shadow:inset 0 0 0 6px #0e0c18, inset 0 0 0 7px rgba(201,164,92,0.22), 0 30px 80px rgba(0,0,0,0.6);'), background: `${NOISE_CLOUD}, ${NOISE_FINE}, radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,164,92,0.08), transparent 70%), radial-gradient(ellipse 130% 100% at 50% 40%, rgba(17,15,29,0.93) 45%, rgba(6,5,12,0.97) 100%)` }}>
            <Corner style={{ top: 10, left: 10 }} />
            <Corner style={{ top: 10, right: 10, transform: 'scaleX(-1)' }} />
            <Corner style={{ bottom: 10, left: 10, transform: 'scaleY(-1)' }} />
            <Corner style={{ bottom: 10, right: 10, transform: 'scale(-1,-1)' }} />

            <ol style={css('list-style:none;margin:0 auto clamp(28px,5vw,44px);padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));max-width:520px;')}>
              {v.stepsNav.map((s) => (
                <li key={s.num} style={css('position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;')}>
                  <span style={{ ...css('position:absolute;top:17px;left:calc(50% + 24px);right:calc(-50% + 24px);height:1px;'), background: s.line }} />
                  <span style={{ ...css('width:34px;height:34px;transform:rotate(45deg);display:flex;align-items:center;justify-content:center;'), border: `1px solid ${s.ring}`, background: s.bg, boxShadow: s.glow }}><span style={{ ...css("transform:rotate(-45deg);font-family:'Cinzel',serif;font-size:13px;"), color: s.numColor }}>{s.num}</span></span>
                  <span style={{ ...css('margin-top:6px;font-size:12px;letter-spacing:0.12em;'), color: s.color }}>{s.label}</span>
                </li>
              ))}
            </ol>

            {v.step === 1 && (
              <div style={css('display:flex;flex-direction:column;gap:clamp(40px,7vw,64px);')}>
                <div style={css('display:flex;flex-direction:column;align-items:center;gap:22px;')}>
                  <ChapterHead eyebrow="CAPITULUM · I" title="你想問哪一個面向？" en="Choose the realm of your question" />
                  <div style={css('display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,2.4vw,24px);width:100%;max-width:640px;')}>
                    {v.themes.map((t) => (
                      <Hv as="button" key={t.key} onClick={t.onClick} aria-pressed={t.on} style={`cursor:pointer;position:relative;aspect-ratio:3/4.4;padding:clamp(14px,3vw,24px) 6px clamp(12px,2.4vw,20px);border-radius:999px 999px 6px 6px / 46% 46% 6px 6px;border:1px solid ${t.bd};background:${t.bg};box-shadow:${t.glow};display:flex;flex-direction:column;align-items:center;justify-content:space-between;transition:all 400ms ease;`} hover="border:1px solid rgba(227,201,143,0.8);">
                        <span style={{ ...css("font-family:'Cinzel',serif;font-size:clamp(9px,1.5vw,11px);letter-spacing:0.24em;margin-top:8%;"), color: t.enColor }}>{t.en}</span>
                        <span style={{ fontFamily: SYMBOL_FONT, fontSize: 'clamp(36px,8vw,58px)', lineHeight: 1, color: t.glyphColor, textShadow: t.glyphShadow, transition: 'all 400ms ease' }}>{t.glyph}</span>
                        <span style={css('display:flex;flex-direction:column;align-items:center;gap:2px;')}>
                          <span style={{ ...css('font-size:clamp(17px,3.4vw,22px);font-weight:600;letter-spacing:0.2em;'), color: t.labelColor }}>{t.label}</span>
                          <span style={css('font-size:clamp(10px,1.7vw,12px);line-height:1.5;color:#8a8170;')}>{t.sub}</span>
                        </span>
                      </Hv>
                    ))}
                  </div>
                </div>

                <div style={css('display:flex;flex-direction:column;align-items:center;gap:22px;')}>
                  <ChapterHead eyebrow="CAPITULUM · II" title="選擇牌陣" en="Lay out the spread upon the cloth" />
                  <div role="tablist" style={css('display:grid;grid-template-columns:repeat(5,minmax(0,1fr));width:100%;max-width:660px;border-top:1px solid rgba(201,164,92,0.25);border-bottom:1px solid rgba(201,164,92,0.25);')}>
                    {v.spreads.map((s) => (
                      <Hv as="button" key={s.key} role="tab" aria-selected={s.on} onClick={s.onClick} style="cursor:pointer;position:relative;background:none;border:none;padding:14px 2px 12px;min-height:64px;display:flex;flex-direction:column;align-items:center;gap:3px;" hover="background:rgba(201,164,92,0.06);">
                        <span style={{ ...css("font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.1em;"), color: s.numColor }}>{s.numeral}</span>
                        <span style={{ ...css('font-size:clamp(13px,2.4vw,16px);font-weight:600;letter-spacing:0.04em;white-space:nowrap;'), color: s.color }}>{s.name}</span>
                        <span style={css('font-size:11px;color:#7d7566;')}>{s.count} 張</span>
                        <span style={{ ...css('position:absolute;left:18%;right:18%;bottom:-1px;height:2px;'), background: s.line, boxShadow: s.lineGlow }} />
                      </Hv>
                    ))}
                  </div>

                  <div style={{ ...css(TABLE), padding: 'clamp(28px,5vw,44px) clamp(14px,4vw,36px) clamp(22px,4vw,32px)' }}>{RF.velvet1}
                    <span style={css("position:absolute;top:14px;left:50%;transform:translateX(-50%);font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.4em;color:rgba(241,220,166,0.85);text-shadow:0 0 8px rgba(0,0,0,0.9);white-space:nowrap;")}>✦ {sp.name} ✦</span>
                    <div style={{ position: 'relative', margin: '12px auto 0', width: pv.w, height: pv.h, transition: 'height 500ms cubic-bezier(0.16,1,0.3,1)' }}>
                      {pv.slots.map((c, i) => (
                        <div key={i} style={{ ...css('position:absolute;transition:left 600ms cubic-bezier(0.16,1,0.3,1), top 600ms cubic-bezier(0.16,1,0.3,1), opacity 400ms ease;display:flex;flex-direction:column;align-items:center;'), left: c.left, top: c.top, width: pv.cw, opacity: c.opacity }}>
                          <span style={{ ...css("display:flex;align-items:center;justify-content:center;border-radius:5px;border:1px solid rgba(201,164,92,0.7);background-color:#141327;background-image:radial-gradient(circle, transparent 0 22%, rgba(201,164,92,0.4) 23%, transparent 24.5%), repeating-linear-gradient(45deg,rgba(201,164,92,0.08) 0 1px,transparent 1px 6px),repeating-linear-gradient(-45deg,rgba(201,164,92,0.08) 0 1px,transparent 1px 6px);box-shadow:inset 0 0 0 3px #141327, inset 0 0 0 4px rgba(201,164,92,0.35), 0 0 0 4px rgba(8,5,14,0.75), 0 0 0 5px rgba(243,214,140,0.55), 0 0 20px 4px rgba(243,214,140,0.3), 0 12px 24px rgba(0,0,0,0.6);font-family:'Cinzel',serif;color:#e3c98f;"), width: pv.cw, height: pv.ch, fontSize: pv.numSize }}>{c.numeral}</span>
                          <span style={css('margin-top:12px;font-size:12px;line-height:1.35;letter-spacing:0.08em;text-align:center;color:#f1dca6;white-space:nowrap;text-shadow:0 0 8px rgba(0,0,0,0.9);')}>{c.label}</span>
                        </div>
                      ))}
                    </div>
                    <p style={css('position:relative;margin:22px auto 0;max-width:520px;text-align:center;text-shadow:0 0 6px #0b0612, 0 0 14px #0b0612;font-size:14px;line-height:1.9;color:#c7baa0;text-wrap:pretty;')}>{sp.long}</p>
                  </div>
                </div>

                <div style={css('display:flex;flex-direction:column;align-items:center;gap:18px;')}>
                  <ChapterHead eyebrow="CAPITULUM · III" title="你的問題" en="Write it down, as if in ink" extra={<span style={css('margin-left:10px;font-size:13px;font-weight:400;letter-spacing:0.1em;color:#7d7566;')}>選填</span>} />
                  <div style={css('width:100%;max-width:600px;')}>
                    <Hv as="textarea" ref={this.qRef} value={question} onChange={(e) => this.setState({ question: e.target.value })} placeholder={v.theme.ph} rows={2} maxLength={80} aria-label="你的問題" style="width:100%;resize:none;padding:14px 4px 12px;font-size:clamp(16px,2.6vw,18px);line-height:1.9;text-align:center;letter-spacing:0.04em;color:#f3e9d2;background:transparent;border:none;border-bottom:1px solid rgba(201,164,92,0.5);outline:none;font-family:inherit;" focus="border-bottom:1px solid #e3c98f;box-shadow:0 12px 24px -18px rgba(227,201,143,0.6);" />
                    <p style={css('margin:12px 0 0;text-align:center;font-size:12px;line-height:1.8;color:#7d7566;')}>問題寫具體一點比較好解讀，像「我該接受新的工作邀約嗎」就比「我的未來如何」好。</p>
                  </div>
                </div>

                <div style={css('display:flex;flex-direction:column;align-items:center;gap:14px;')}>
                  <Divider />
                  <Hv as="button" onClick={this.startDraw} style={`cursor:pointer;border:none;width:100%;max-width:380px;min-height:56px;margin-top:6px;padding:14px 28px;border-radius:2px;display:flex;align-items:center;justify-content:center;gap:14px;font-size:17px;letter-spacing:0.18em;color:#1a140a;background:${GOLD_BTN};box-shadow:0 0 0 1px #0e0c18, 0 0 0 2px rgba(227,201,143,0.6), 0 0 44px rgba(227,201,143,0.3);transition:filter 200ms ease, box-shadow 300ms ease;`} hover="filter:brightness(1.08);box-shadow:0 0 0 1px #0e0c18, 0 0 0 2px rgba(227,201,143,0.8), 0 0 60px rgba(227,201,143,0.45);"><span style={{ fontSize: 11 }}>✦</span>洗牌，開始抽牌<span style={{ fontSize: 11 }}>✦</span></Hv>
                  <span style={css('font-size:12px;letter-spacing:0.12em;color:#7d7566;')}>{`${v.theme.label} · ${sp.name} · 抽 ${v.need} 張`}</span>
                </div>
              </div>
            )}

            {v.step === 2 && (
              <div style={css('display:flex;flex-direction:column;align-items:center;gap:24px;')}>
                <div style={css('display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;')}>
                  <span style={css("font-family:'Cinzel',serif;font-size:12px;letter-spacing:0.32em;color:#c9a45c;")}>{v.phase === 'vortex' ? 'MISCERE' : 'ELIGE'}</span>
                  <h2 style={css('margin:0;font-weight:600;font-size:clamp(1.35rem,3.8vw,1.8rem);letter-spacing:0.1em;color:#f3e9d2;')}>{v.phase === 'vortex' ? '洗牌中…' : v.full ? '牌已抽齊' : `請抽 ${v.need} 張牌`}</h2>
                  <span style={css('max-width:520px;font-size:14px;line-height:1.8;color:#a89f8e;text-wrap:pretty;')}>{v.phase === 'vortex' ? '洗牌中，心裡想著你的問題。' : '想著你的問題，憑感覺點牌。'}</span>
                </div>
                {!!question.trim() && <p style={css('margin:0;max-width:560px;text-align:center;font-size:16px;line-height:1.8;letter-spacing:0.04em;color:#e8d8b0;')}>「{question}」</p>}

                <div style={{ ...css(TABLE), padding: v.tablePad }}>{RF.velvet2}
                  <div style={css('position:absolute;inset:0;overflow:hidden;pointer-events:none;')}>{RF.tableFog}</div>
                  <div style={{ position: 'relative', width: '100%', height: deck.h, userSelect: 'none', WebkitUserSelect: 'none' }}>
                    {deck.cards.map((c) => (
                      <Hv as="button" key={c.k} onClick={c.onClick} aria-label="抽這張牌" style={`position:absolute;left:${c.left}px;top:${c.top}px;width:${deck.cw}px;height:${deck.ch}px;padding:0;border:none;background:none;cursor:${c.cursor};opacity:${c.opacity};z-index:${c.z};transform:${c.transform};transition:${c.transition};`} hover={c.hover}>{c.face}</Hv>
                    ))}
                    {v.shuffleFx}
                  </div>
                </div>

                {v.step === 2 && v.isDraw && (
                  <div style={css('display:flex;flex-direction:column;align-items:center;gap:14px;width:100%;')}>
                    <div style={css('display:flex;align-items:baseline;gap:10px;font-size:13px;letter-spacing:0.12em;color:#a89f8e;')}>
                      <span>已抽</span>
                      <span style={css("font-family:'Cinzel',serif;font-size:18px;color:#f3e9d2;")}>{v.picks.length} / {v.need}</span>
                    </div>
                    <div style={css('display:flex;flex-wrap:wrap;justify-content:center;gap:clamp(8px,2vw,16px);')}>
                      {v.tray.map((s, i) => (
                        <div key={i} style={{ ...css('display:flex;flex-direction:column;align-items:center;gap:6px;'), width: v.trayW }}>
                          <div data-tray-slot={i} style={{ ...css("position:relative;border-radius:5px;transition:all 400ms ease;display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif;font-size:12px;"), width: v.trayW, height: v.trayH, border: `1px solid ${s.border}`, backgroundColor: s.bg, backgroundImage: s.pattern, boxShadow: s.shadow, color: s.numColor }}>{s.num}{s.fx}</div>
                          <span style={{ ...css('font-size:11px;line-height:1.3;text-align:center;'), color: s.labelColor }}>{s.label}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={this.toReading} disabled={!v.ready} style={{ ...css('border:none;width:100%;max-width:380px;min-height:56px;margin-top:8px;padding:14px 28px;border-radius:2px;font-size:17px;letter-spacing:0.18em;transition:all 300ms ease;'), cursor: v.ready ? 'pointer' : 'not-allowed', color: v.ready ? '#1a140a' : '#5f5848', background: v.ready ? GOLD_BTN : 'rgba(201,164,92,0.06)', boxShadow: v.ready ? '0 0 0 1px #0e0c18, 0 0 0 2px rgba(227,201,143,0.6), 0 0 44px rgba(227,201,143,0.3)' : 'inset 0 0 0 1px rgba(201,164,92,0.2)' }}>排入牌陣</button>
                  </div>
                )}
                <Hv as="button" onClick={() => { this.clearTimers(); this.setState({ step: 1, flyers: [], busy: false }); this.scrollTool() }} style="cursor:pointer;background:none;border:none;padding:8px 0;font-size:13px;letter-spacing:0.1em;color:#7d7566;" hover="color:#e3c98f;">← 重新選擇</Hv>
              </div>
            )}

            {v.step === 3 && (
              <div style={css('display:flex;flex-direction:column;gap:28px;')}>
                <div style={css('display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;')}>
                  <span style={css("font-family:'Cinzel',serif;font-size:12px;letter-spacing:0.32em;color:#c9a45c;")}>{v.arrange ? 'DISPONE · 翻牌前調整' : `${v.theme.en} · ${sp.name}`}</span>
                  <h2 style={css('margin:0;max-width:640px;font-weight:600;font-size:clamp(1.3rem,3.8vw,1.8rem);line-height:1.5;letter-spacing:0.06em;color:#f3e9d2;text-wrap:balance;')}>{question.trim() ? `「${question.trim()}」` : `${v.theme.label} · 抽牌結果`}</h2>
                  <span style={css('max-width:560px;font-size:13px;letter-spacing:0.08em;color:#a89f8e;')}>{v.flipHint}</span>
                </div>

                <div style={css('display:flex;flex-wrap:wrap;gap:clamp(28px,4vw,48px);align-items:flex-start;')}>
                  <div style={{ ...css('min-width:0;display:flex;flex-direction:column;align-items:center;gap:20px;'), flex: `1 1 ${isDesk ? '52%' : '100%'}` }}>
                    <div style={{ ...css(TABLE), padding: v.tablePad }}>{RF.velvet3}
                      <div style={css('position:absolute;inset:0;overflow:hidden;pointer-events:none;')}>{RF.tableFog}</div>
                      <div ref={this.spreadRef} style={{ position: 'relative', width: rd.w, height: rd.h, margin: '0 auto', userSelect: 'none', WebkitUserSelect: 'none' }}>
                        {rd.slots.map((s) => (
                          <div key={s.p} style={{ position: 'absolute', left: s.left, top: s.top, width: rd.cw }}>
                            <div data-pos-box={s.p} style={{ ...css('border-radius:8px;background:radial-gradient(ellipse 70% 60% at 50% 42%, rgba(30,18,44,0.55), rgba(4,2,8,0.75));display:flex;align-items:center;justify-content:center;transition:all 250ms ease;'), width: rd.cw, height: rd.ch, border: `1px solid ${s.bd}`, boxShadow: s.glow }}><span style={{ ...css("font-family:'Cinzel',serif;color:rgba(243,214,140,0.8);text-shadow:0 0 12px rgba(243,214,140,0.65);"), fontSize: rd.numSize }}>{s.numeral}</span></div>
                            <div style={css('padding-top:12px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:4px;')}>
                              <span style={css('max-width:100%;font-size:11px;letter-spacing:0.1em;color:#f1dca6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 0 8px rgba(0,0,0,0.9);')}>{s.label}</span>
                              {v.arrange && s.cardI >= 0 ? (
                                <button onClick={() => this.toggleRev(s.cardI)} aria-label="把這張牌轉個方向" style={css('cursor:pointer;min-height:26px;padding:2px 10px;border-radius:999px;font-size:11px;letter-spacing:0.12em;white-space:nowrap;transition:all 250ms ease;color:#f1dca6;border:1px solid rgba(227,201,143,0.6);background:rgba(201,164,92,0.12);')}>↻ 轉向</button>
                              ) : (
                                <span style={{ ...css('max-width:100%;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'), color: s.subColor }}>{s.sub}</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {rd.cards.map((c) => (
                          <div key={c.i} data-card-i={c.i} style={{ ...css('position:absolute;transition:left 520ms cubic-bezier(0.16,1,0.3,1), top 520ms cubic-bezier(0.16,1,0.3,1), transform 300ms ease, opacity 160ms ease;'), left: c.left, top: c.top, width: rd.cw, height: rd.ch, zIndex: c.z, opacity: c.opacity, transform: c.lift, touchAction: c.touch }}>
                            <button onPointerDown={c.onDown} onClick={c.onClick} aria-label={c.aria} style={{ display: 'block', position: 'relative', width: rd.cw, height: rd.ch, padding: 0, border: 'none', background: 'none', cursor: c.cursor, perspective: 1200, touchAction: c.touch }}>
                              <span style={{ position: 'absolute', inset: 0, display: 'block', transformStyle: 'preserve-3d', transform: c.zrot, transition: c.zTransition }}>
                                <span style={{ position: 'absolute', inset: 0, display: 'block', transformStyle: 'preserve-3d', transition: 'transform 1000ms cubic-bezier(0.16,1,0.3,1)', transform: c.rot }}>
                                  <span style={{ ...css('position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-radius:7px;backface-visibility:hidden;-webkit-backface-visibility:hidden;border:1px solid rgba(201,164,92,0.7);background-color:#141327;background-image:radial-gradient(circle, rgba(227,201,143,0.3) 0 5%, transparent 6%), radial-gradient(circle, transparent 0 24%, rgba(201,164,92,0.45) 25%, transparent 26.5%), repeating-linear-gradient(45deg,rgba(201,164,92,0.08) 0 1px,transparent 1px 7px),repeating-linear-gradient(-45deg,rgba(201,164,92,0.08) 0 1px,transparent 1px 7px);transition:box-shadow 300ms ease;'), boxShadow: c.backGlow }}>
                                    <span style={{ fontSize: rd.numSize, lineHeight: 1, color: c.backMark, textShadow: '0 0 14px rgba(227,201,143,0.7)', transition: 'color 300ms ease' }}>✦</span>
                                    <span aria-hidden="true" style={{ position: 'absolute', top: '9%', left: '50%', transform: 'translateX(-50%)', fontSize: Math.max(10, rd.numSize * 0.5), color: c.backMark, opacity: 0.85 }}>▲</span>
                                  </span>
                                  <span style={{ ...css('position:absolute;inset:0;display:block;border-radius:7px;overflow:hidden;transform:rotateY(180deg);backface-visibility:hidden;-webkit-backface-visibility:hidden;background:#e9e2cf;transition:box-shadow 900ms ease 250ms;'), boxShadow: c.faceGlow }}>
                                    <span style={css('position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:8px;text-align:center;color:#1e1b2e;')}>
                                      <span style={css("font-family:'Cinzel',serif;font-size:12px;")}>{c.num}</span>
                                      <span style={css('font-size:14px;font-weight:600;line-height:1.3;')}>{c.name}</span>
                                    </span>
                                    <span role="img" aria-label={c.alt} style={{ position: 'absolute', inset: 0, display: 'block', backgroundImage: c.bgImg, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                  </span>
                                </span>
                              </span>
                            </button>
                            <div style={css('position:absolute;inset:0;pointer-events:none;z-index:4;')}>{c.burst}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {v.arrange && (
                      <Hv as="button" onClick={this.startReveal} style={`cursor:pointer;border:none;width:100%;max-width:380px;min-height:56px;padding:14px 28px;border-radius:2px;display:flex;align-items:center;justify-content:center;gap:14px;font-size:17px;letter-spacing:0.18em;color:#1a140a;opacity:${v.swapping ? 0.5 : 1};background:${GOLD_BTN};box-shadow:0 0 0 1px #0e0c18, 0 0 0 2px rgba(227,201,143,0.6), 0 0 44px rgba(227,201,143,0.3);transition:opacity 200ms ease, filter 200ms ease;`} hover="filter:brightness(1.08);"><span style={{ fontSize: 11 }}>✦</span>翻牌<span style={{ fontSize: 11 }}>✦</span></Hv>
                    )}
                    {v.canFlipNext && (
                      <Hv as="button" onClick={this.flipNext} style="cursor:pointer;min-height:50px;padding:12px 30px;border-radius:2px;font-size:15px;letter-spacing:0.16em;color:#e8d8b0;border:1px solid rgba(201,164,92,0.55);background:rgba(201,164,92,0.06);transition:all 200ms ease;" hover="background:rgba(201,164,92,0.14);color:#f3e9d2;">翻開下一張</Hv>
                    )}
                  </div>

                  <div style={css('flex:1 1 360px;min-width:0;display:flex;flex-direction:column;')}>
                    {v.details.map((d) => (
                      <article key={d.numeral} style={css('padding:22px 0;border-top:1px solid rgba(201,164,92,0.22);display:flex;flex-direction:column;gap:12px;')}>
                        <div style={css('display:flex;align-items:center;gap:12px;')}>
                          <span style={css("font-family:'Cinzel',serif;font-size:13px;color:#c9a45c;min-width:22px;")}>{d.numeral}</span>
                          <span style={css('height:1px;width:18px;background:rgba(201,164,92,0.5);')} />
                          <span style={css('font-size:13px;letter-spacing:0.24em;color:#e3c98f;')}>{d.label}</span>
                        </div>
                        {d.flipped ? (
                          <div style={css('display:flex;flex-direction:column;gap:12px;')}>
                            <div style={css('display:flex;align-items:baseline;flex-wrap:wrap;gap:6px 12px;')}>
                              <h3 style={css('margin:0;font-size:22px;font-weight:600;letter-spacing:0.08em;color:#f3e9d2;')}>{d.name}</h3>
                              <span style={css("font-family:'Lora',serif;font-style:italic;font-size:14px;color:#8a8170;")}>{d.en}</span>
                              <span style={{ ...css('font-size:11px;letter-spacing:0.16em;padding:2px 10px;'), border: `1px solid ${d.oBd}`, color: d.oColor, background: d.oBg }}>{d.orient}</span>
                            </div>
                            <p style={css('margin:0;font-size:13px;letter-spacing:0.1em;color:#c9a45c;')}>{d.kwText}</p>
                            <p style={css('margin:0;font-size:13px;line-height:1.7;color:#8a8170;')}>{d.posNote}</p>
                            <p style={css('margin:0;font-size:15px;line-height:2;color:#d6cab0;text-wrap:pretty;')}><span style={css('float:left;width:52px;height:52px;margin:4px 12px 0 0;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700;line-height:1;color:#f1dca6;border:1px solid rgba(201,164,92,0.6);background:radial-gradient(circle, rgba(201,164,92,0.18), transparent 70%), #141327;box-shadow:inset 0 0 0 3px #141327, inset 0 0 0 4px rgba(201,164,92,0.3);')}>{d.cap}</span>{d.rest}</p>
                          </div>
                        ) : (
                          <p style={css("margin:0;font-family:'Lora',serif;font-style:italic;font-size:14px;color:#5f5848;")}>{d.hiddenText}</p>
                        )}
                      </article>
                    ))}
                    {v.allFlipped && (
                      <div style={css('padding-top:26px;border-top:1px solid rgba(201,164,92,0.22);display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center;')}>
                        <Divider />
                        <p style={css('margin:0;font-size:14px;line-height:1.9;color:#8a8170;')}>以上是簡短結論。想聽完整解讀，把這個畫面截圖，傳給邀請你來抽牌的人。</p>
                        <div style={css('display:flex;flex-wrap:wrap;gap:12px;width:100%;')}>
                          <Hv as="button" onClick={this.startDraw} style={`cursor:pointer;flex:1 1 160px;border:none;min-height:52px;padding:12px 24px;border-radius:2px;font-size:16px;letter-spacing:0.16em;color:#1a140a;background:${GOLD_BTN};box-shadow:0 0 0 1px #0e0c18, 0 0 0 2px rgba(227,201,143,0.6), 0 0 36px rgba(227,201,143,0.25);`} hover="filter:brightness(1.08);">再抽一次</Hv>
                          <Hv as="button" onClick={this.newQuestion} style="cursor:pointer;flex:1 1 160px;min-height:52px;padding:12px 24px;border-radius:2px;font-size:16px;letter-spacing:0.16em;color:#e8d8b0;border:1px solid rgba(201,164,92,0.55);background:transparent;" hover="background:rgba(201,164,92,0.1);color:#f3e9d2;">換一個問題</Hv>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section id="spreads" style={css('position:relative;padding:clamp(72px,11vw,120px) 0 0;')}>
            <svg viewBox="0 0 160 100" fill="none" aria-hidden="true" style={css('position:absolute;top:clamp(40px,7vw,80px);right:0;width:clamp(100px,16vw,180px);pointer-events:none;')}>
              <path d="M6 70L40 52L70 66L96 30L130 22L154 50" stroke="#c9a45c" strokeOpacity=".35" strokeWidth=".8" />
              {[[6, 70, 1.6], [40, 52, 2.2], [70, 66, 1.5], [96, 30, 2.6], [130, 22, 1.8], [154, 50, 2]].map(([cx, cy, r]) => <circle key={cx} cx={cx} cy={cy} r={r} fill="#f3e4bd" />)}
            </svg>
            <div style={css('display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;margin-bottom:clamp(32px,5vw,48px);')}>
              <span style={css("font-family:'Cinzel',serif;font-size:12px;letter-spacing:0.32em;color:#c9a45c;")}>LIBER SPREADS</span>
              <h2 style={css('margin:0;font-weight:600;font-size:clamp(1.7rem,5vw,2.6rem);letter-spacing:0.12em;color:#f3e9d2;')}>常用牌陣說明</h2>
              <Divider style={{ marginTop: 8 }} />
              <p style={css('margin:10px 0 0;max-width:560px;font-size:15px;line-height:1.9;color:#a89f8e;text-wrap:pretty;')}>每個牌位問的事情不一樣。同一張牌放在「障礙」跟放在「優勢」，意思差很多。</p>
            </div>
            <div style={css('display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr));gap:clamp(16px,2.4vw,24px);')}>
              {v.spreadDocs.map((s) => (
                <article key={s.key} style={{ ...css('position:relative;padding:clamp(24px,4vw,32px);border:1px solid rgba(201,164,92,0.4);box-shadow:inset 0 0 0 5px #0e0c18, inset 0 0 0 6px rgba(201,164,92,0.16);display:flex;flex-direction:column;gap:16px;'), background: `${NOISE_CLOUD}, ${NOISE_FINE}, rgba(15,13,26,0.9)` }}>
                  <div style={css('display:flex;align-items:center;gap:16px;')}>
                    <span style={{ ...css('flex-shrink:0;width:76px;height:76px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(201,164,92,0.4);'), background: `${NOISE_VELVET}, radial-gradient(ellipse at 50% 45%, #2b1a3f, #110a1c 90%)` }}>
                      <span style={{ position: 'relative', display: 'block', width: s.miniW, height: s.miniH }}>
                        {s.mini.map((m, i) => <span key={i} style={{ ...css('position:absolute;width:12px;height:19px;border-radius:2px;border:1px solid rgba(227,201,143,0.75);background:#141327;'), left: m.l, top: m.t }} />)}
                      </span>
                    </span>
                    <div style={css('display:flex;flex-direction:column;gap:2px;min-width:0;')}>
                      <span style={css("font-family:'Cinzel',serif;font-size:12px;letter-spacing:0.2em;color:#c9a45c;")}>{s.numeral} · {s.count} CARDS</span>
                      <h3 style={css('margin:0;font-size:21px;font-weight:600;letter-spacing:0.12em;color:#f3e9d2;')}>{s.name}</h3>
                    </div>
                  </div>
                  <p style={css('margin:0;font-size:13px;letter-spacing:0.08em;line-height:1.8;color:#e3c98f;')}>{s.posText}</p>
                  <p style={css('margin:0;font-size:14px;line-height:2;color:#c7baa0;text-wrap:pretty;')}>{s.long}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="faq" style={css('padding:clamp(72px,11vw,120px) 0 0;max-width:820px;margin:0 auto;')}>
            <div style={css('display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;margin-bottom:clamp(28px,4vw,40px);')}>
              <span style={css("font-family:'Cinzel',serif;font-size:12px;letter-spacing:0.32em;color:#c9a45c;")}>QUAESTIONES</span>
              <h2 style={css('margin:0;font-weight:600;font-size:clamp(1.7rem,5vw,2.6rem);letter-spacing:0.12em;color:#f3e9d2;')}>常見問題</h2>
              <Divider style={{ marginTop: 8 }} />
            </div>
            <div style={css('border-bottom:1px solid rgba(201,164,92,0.22);')}>
              {v.faqs.map((f) => (
                <div key={f.numeral} style={css('border-top:1px solid rgba(201,164,92,0.22);')}>
                  <Hv as="button" onClick={f.onClick} aria-expanded={f.open} style="cursor:pointer;width:100%;display:flex;align-items:center;gap:16px;padding:22px 0;background:none;border:none;text-align:left;color:#f3e9d2;font-size:clamp(16px,2.4vw,18px);font-weight:500;letter-spacing:0.06em;min-height:44px;" hover="color:#f1dca6;">
                    <span style={css("flex-shrink:0;font-family:'Cinzel',serif;font-size:13px;color:#c9a45c;min-width:28px;")}>{f.numeral}</span>
                    <span style={{ flex: 1 }}>{f.q}</span>
                    <span style={css('flex-shrink:0;width:26px;height:26px;transform:rotate(45deg);border:1px solid rgba(201,164,92,0.5);display:flex;align-items:center;justify-content:center;')}><span style={css('transform:rotate(-45deg);font-size:14px;line-height:1;color:#e3c98f;')}>{f.sign}</span></span>
                  </Hv>
                  {/* 答案一律輸出在 HTML 裡（收合時隱藏），讓搜尋引擎讀得到 */}
                  <p hidden={!f.open} style={css('margin:0;padding:0 42px 24px 44px;font-size:15px;line-height:2;color:#b3a993;text-wrap:pretty;')}>{f.a}</p>
                </div>
              ))}
            </div>
            <p style={css("margin:22px 0 0;text-align:center;font-family:'Lora',serif;font-style:italic;font-size:13px;line-height:1.7;color:#5f5848;")}>Card images: Rider–Waite–Smith Tarot (1909), illustrated by Pamela Colman Smith · Public domain</p>
          </section>
        </main>

        <footer style={css('position:relative;z-index:1;margin-top:clamp(80px,12vw,140px);border-top:1px solid rgba(201,164,92,0.2);')}>
          <div style={css('max-width:1152px;margin:0 auto;padding:44px clamp(16px,4vw,24px) 32px;display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center;')}>
            <a href="#top" style={css('display:flex;align-items:center;gap:10px;')}><Logo /></a>
            <div style={css('display:flex;gap:28px;flex-wrap:wrap;justify-content:center;')}>
              <Hv href="#reading" style="font-size:13px;letter-spacing:0.12em;color:#a89f8e;" hover="color:#f3e9d2;">線上占卜</Hv>
              <Hv href="#spreads" style="font-size:13px;letter-spacing:0.12em;color:#a89f8e;" hover="color:#f3e9d2;">牌陣說明</Hv>
              <Hv href="#faq" style="font-size:13px;letter-spacing:0.12em;color:#a89f8e;" hover="color:#f3e9d2;">常見問題</Hv>
            </div>
            <Divider />
            <p style={css('margin:0;font-size:12px;line-height:1.8;letter-spacing:0.06em;color:#5f5848;')}>© 2026 夜讀塔羅 · 占卜結果僅供參考，不構成任何專業建議</p>
          </div>
        </footer>
        {v.flyerEls}
      </div>
    )
  }
}
