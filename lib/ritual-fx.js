// 星空、霧、絨布桌、洗牌漩渦、翻牌光爆、飛牌光軌等視覺特效（都以 React.createElement 產生）。
const seeded = (s) => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
// 三角函數的小數在伺服器和瀏覽器可能差一點，取兩位避免 hydration 不一致
const n2 = (x) => Math.round(x * 100) / 100
  const BACK_IMG = 'radial-gradient(circle, rgba(227,201,143,0.3) 0 5%, transparent 6%), radial-gradient(circle, transparent 0 24%, rgba(201,164,92,0.45) 25%, transparent 27%), repeating-linear-gradient(45deg,rgba(201,164,92,0.08) 0 1px,transparent 1px 5px),repeating-linear-gradient(-45deg,rgba(201,164,92,0.08) 0 1px,transparent 1px 5px)';
  const back = (x) => Object.assign({ display: 'block', borderRadius: 5, border: '1px solid rgba(201,164,92,0.7)', backgroundColor: '#141327', backgroundImage: BACK_IMG, boxShadow: 'inset 0 0 0 3px #141327, inset 0 0 0 4px rgba(201,164,92,0.32), 0 6px 14px rgba(0,0,0,0.55)' }, x);
  // o.t (seconds) freezes the animation at that moment
  const anim = (o, name, dur, delay, ease, iter, dir) => ({
    animationName: name, animationDuration: dur + 's', animationTimingFunction: ease || 'ease',
    animationDelay: ((delay || 0) - (o && o.t != null ? o.t : 0)).toFixed(3) + 's',
    animationIterationCount: iter || 1, animationFillMode: 'both', animationDirection: dir || 'normal',
    animationPlayState: o && o.t != null ? 'paused' : 'running'
  });
  const COL = {
    gold: { core: '255,247,224', mid: '243,212,138', ring: '#f1dca6', spark: '#fbe9b8' },
    violet: { core: '240,236,255', mid: '150,140,255', ring: '#c3baff', spark: '#ddd6ff' }
  };

  function stars(h, o) {
    const r = seeded(o.seed || 1), kids = [];
    for (let i = 0; i < o.n; i++) {
      const size = o.min + r() * (o.max - o.min);
      const animated = r() < (o.anim == null ? 1 : o.anim);
      const dur = (o.minDur || 3) + r() * ((o.maxDur || 6) - (o.minDur || 3));
      const st = Object.assign({ position: 'absolute', left: (r() * 100).toFixed(2) + '%', top: (r() * 100).toFixed(2) + '%', opacity: o.base || 0.55 },
        animated ? anim(o, o.kf || 'twinkle', dur.toFixed(2), -r() * dur, 'ease-in-out', 'infinite') : {});
      if (o.sparkle) {
        kids.push(h('span', { key: i, style: Object.assign(st, { width: size * 3, height: size * 3, marginLeft: -size * 1.5, marginTop: -size * 1.5, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(246,236,210,0.35), transparent 60%)' }) },
          h('span', { style: { fontSize: size, lineHeight: 1, color: '#fbf1d6', textShadow: '0 0 6px #fff, 0 0 14px rgba(243,228,189,0.9)' } }, '✦')));
      } else {
        const tint = r() < 0.2 ? '200,215,255' : r() < 0.3 ? '255,226,190' : '246,236,214';
        kids.push(h('span', { key: i, style: Object.assign(st, { width: size, height: size, borderRadius: '50%', background: `rgb(${tint})`, boxShadow: size > 1.3 ? `0 0 ${size * 3}px rgba(${tint},0.75)` : 'none' }) }));
      }
    }
    return h('div', { style: { position: 'absolute', inset: 0, pointerEvents: 'none' } }, kids);
  }

  function fog(h, o) {
    o = o || {};
    const a = o.alpha || 1;
    const blob = (k, l, t, w, hh, d, del, al, tint) => h('span', { key: k, style: Object.assign({ position: 'absolute', left: l, top: t, width: w, height: hh, borderRadius: '50%', background: `radial-gradient(ellipse, rgba(${tint},${al * a}), transparent 68%)`, filter: 'blur(30px)' }, anim(null, 'drift', d, del, 'ease-in-out', 'infinite', 'alternate')) });
    return h('div', { style: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' } }, [
      blob(1, '-20%', '8%', '80%', '38%', 46, -10, 0.07, '150,165,230'),
      blob(2, '45%', '30%', '75%', '34%', 58, -30, 0.06, '190,170,230'),
      blob(3, '-10%', '62%', '90%', '40%', 52, -20, 0.07, '170,180,220'),
      blob(4, '30%', '80%', '80%', '30%', 64, -5, 0.05, '230,205,170')
    ]);
  }

  function deckFace(h, i) {
    return h('span', { style: back(Object.assign({ position: 'absolute', inset: 0 }, anim(null, 'deckFloat', (3.2 + (i % 7) * 0.34).toFixed(2), -((i * 0.53) % 4), 'ease-in-out', 'infinite', 'alternate'))) });
  }

  function shuffle(h, o) {
    const r = seeded(o.seed || 5), { cw, ch, R } = o, n = 20, D = 2.8, kids = [];
    kids.push(h('span', { key: 'g', style: Object.assign({ position: 'absolute', left: -R * 1.7, top: -R * 1.7, width: R * 3.4, height: R * 3.4, borderRadius: '50%', background: 'radial-gradient(circle, rgba(243,214,140,0.30), rgba(201,164,92,0.09) 38%, transparent 66%)' }, anim(o, 'ringPulse', D, 0, 'ease-in-out')) }));
    const tri = (rot) => [0, 1, 2].map((k) => { const a = (rot + k * 120 - 90) * Math.PI / 180; return `${(50 + Math.cos(a) * 46).toFixed(2)},${(50 + Math.sin(a) * 46).toFixed(2)}`; }).join(' ');
    kids.push(h('span', { key: 'ring', style: Object.assign({ position: 'absolute', left: -R - ch * 0.62, top: -R - ch * 0.62, width: (R + ch * 0.62) * 2, height: (R + ch * 0.62) * 2 }, anim(o, 'ringPulse', D, 0.1, 'ease-in-out')) },
      h('span', { style: Object.assign({ position: 'absolute', inset: 0, display: 'block', borderRadius: '50%', border: '1px dashed rgba(227,201,143,0.55)' }, anim(o, 'swirl', 9, 0, 'linear', 'infinite')) }),
      h('span', { style: { position: 'absolute', inset: '7%', display: 'block', borderRadius: '50%', border: '1px solid rgba(227,201,143,0.28)', boxShadow: '0 0 30px rgba(243,214,140,0.25), inset 0 0 30px rgba(243,214,140,0.15)' } }),
      h('svg', { viewBox: '0 0 100 100', style: Object.assign({ position: 'absolute', inset: '24%', width: '52%', height: '52%' }, anim(o, 'swirl', 14, 0, 'linear', 'infinite', 'reverse')) },
        h('polygon', { points: tri(0), fill: 'none', stroke: 'rgba(227,201,143,0.4)', strokeWidth: 0.8 }),
        h('polygon', { points: tri(180), fill: 'none', stroke: 'rgba(227,201,143,0.4)', strokeWidth: 0.8 }),
        h('circle', { cx: 50, cy: 50, r: 46, fill: 'none', stroke: 'rgba(227,201,143,0.3)', strokeWidth: 0.6 }))));
    const dust = [];
    for (let i = 0; i < 40; i++) {
      const rr = R * (0.35 + r() * 1.05), dur = 1.8 + r() * 3, sz = 1.4 + r() * 2.6;
      dust.push(h('span', { key: i, style: Object.assign({ position: 'absolute', left: 0, top: 0, width: 0, height: 0 }, anim(o, 'swirl', dur.toFixed(2), -r() * dur, 'linear', 'infinite', i % 3 ? 'normal' : 'reverse')) },
        h('span', { style: Object.assign({ position: 'absolute', left: -sz / 2, top: -rr, width: sz, height: sz, borderRadius: '50%', background: '#fbe9b8', boxShadow: `0 0 ${sz * 3}px rgba(251,233,184,0.9)` }, anim(o, 'twinkle', 1.2 + r(), -r(), 'ease-in-out', 'infinite')) })));
    }
    kids.push(h('span', { key: 'dust', style: Object.assign({ position: 'absolute', left: 0, top: 0 }, anim(o, 'ringPulse', D, 0.2, 'ease-in-out')) }, dust));
    for (let i = 0; i < n; i++) {
      const s = i % 2 ? 1 : -1;
      kids.push(h('span', { key: 'c' + i, style: back(Object.assign({ position: 'absolute', left: -cw / 2, top: -ch / 2, width: cw, height: ch, '--a': (i * 360 / n) + 'deg', '--sx': (s * (cw * 0.85 + (i % 4) * 3)) + 'px', '--sr': (s * (10 + (i % 3) * 5)) + 'deg', '--sy': (((i % 5) - 2) * 2) + 'px', '--R': R + 'px', boxShadow: 'inset 0 0 0 3px #141327, inset 0 0 0 4px rgba(201,164,92,0.4), 0 0 14px rgba(243,214,140,0.35), 0 8px 18px rgba(0,0,0,0.5)' }, anim(o, 'ritualShuffle', D, i * 0.012, 'cubic-bezier(.65,0,.35,1)'))) }));
    }
    return h('div', { key: 'shuf' + (o.id || 0), style: { position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none', zIndex: 4 } }, kids);
  }

  function burst(h, o) {
    const r = seeded(o.seed || 9), c = COL[o.color || 'gold'], M = Math.max(o.w, o.h), d = o.delay == null ? 0.15 : o.delay, kids = [];
    const S = M * 2.2;
    kids.push(h('span', { key: 'f', style: Object.assign({ position: 'absolute', left: -S / 2, top: -S / 2, width: S, height: S, borderRadius: '50%', background: `radial-gradient(circle, rgba(${c.core},1) 0, rgba(${c.mid},0.75) 14%, rgba(${c.mid},0.22) 34%, transparent 62%)`, mixBlendMode: 'screen' }, anim(o, 'burstFlash', 1.1, d, 'ease-out')) }));
    const S2 = S * 1.25;
    kids.push(h('span', { key: 'r', style: Object.assign({ position: 'absolute', left: -S2 / 2, top: -S2 / 2, width: S2, height: S2, borderRadius: '50%', background: `repeating-conic-gradient(from 0deg, rgba(${c.mid},0.6) 0deg 2.4deg, transparent 2.4deg 14deg)`, WebkitMaskImage: 'radial-gradient(circle, #000 8%, transparent 62%)', maskImage: 'radial-gradient(circle, #000 8%, transparent 62%)' }, anim(o, 'burstRays', 1.4, d, 'ease-out')) }));
    const S3 = M * 0.7;
    kids.push(h('span', { key: 'ring', style: Object.assign({ position: 'absolute', left: -S3 / 2, top: -S3 / 2, width: S3, height: S3, borderRadius: '50%', border: `2px solid ${c.ring}`, boxShadow: `0 0 18px ${c.ring}, inset 0 0 12px ${c.ring}` }, anim(o, 'burstRing', 0.95, d, 'cubic-bezier(.1,.6,.3,1)')) }));
    for (let i = 0; i < (o.n || 28); i++) {
      const a = r() * Math.PI * 2, dist = (0.55 + r() * 0.95) * M * 0.95, glyph = r() < 0.3, sz = glyph ? 8 + r() * 6 : 2 + r() * 3;
      const st = Object.assign({ position: 'absolute', left: -sz / 2, top: -sz / 2, '--dx': (Math.cos(a) * dist).toFixed(1) + 'px', '--dy': (Math.sin(a) * dist + dist * 0.15).toFixed(1) + 'px' }, anim(o, 'burstSpark', (1.1 + r() * 0.6).toFixed(2), d + r() * 0.12, 'cubic-bezier(.1,.7,.3,1)'));
      kids.push(glyph
        ? h('span', { key: 's' + i, style: Object.assign(st, { fontSize: sz, lineHeight: 1, color: c.spark, textShadow: `0 0 8px ${c.spark}` }) }, '✦')
        : h('span', { key: 's' + i, style: Object.assign(st, { width: sz, height: sz, borderRadius: '50%', background: c.spark, boxShadow: `0 0 ${sz * 3}px ${c.spark}` }) }));
    }
    return h('div', { key: o.key || 'burst', style: { position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none', zIndex: 5 } }, kids);
  }

  // card flight with stardust trail. from/to: {x,y,w,h} top-left boxes. o.at (0-1) renders a frozen frame (absolute coords).
  function flight(h, o) {
    const { from, to } = o;
    const p0 = { x: from.x + from.w / 2, y: from.y + from.h / 2 }, p2 = { x: to.x + to.w / 2, y: to.y + to.h / 2 };
    const dist = Math.hypot(p2.x - p0.x, p2.y - p0.y);
    const side = p2.x >= p0.x ? 1 : -1;
    const p1 = { x: (p0.x + p2.x) / 2 + side * dist * 0.35, y: Math.min(p0.y, p2.y) - Math.max(60, dist * 0.25) };
    const bez = (s) => ({ x: (1 - s) * (1 - s) * p0.x + 2 * (1 - s) * s * p1.x + s * s * p2.x, y: (1 - s) * (1 - s) * p0.y + 2 * (1 - s) * s * p1.y + s * s * p2.y });
    const ratio = to.w / from.w, rot0 = o.rot || 0;
    const cardT = (s) => { const p = bez(s); const sc = (1 + (ratio - 1) * s) * (1 + 0.4 * Math.sin(Math.PI * s)); return `translate(${(p.x - from.w / 2).toFixed(1)}px,${(p.y - from.h / 2).toFixed(1)}px) scale(${sc.toFixed(3)}) rotate(${(rot0 * (1 - s) - 16 * Math.sin(Math.PI * s)).toFixed(1)}deg)`; };
    const r = seeded(o.seed || 13), N = 18, pos = o.at != null ? 'absolute' : 'fixed';
    const glow = 'inset 0 0 0 3px #141327, inset 0 0 0 4px rgba(227,201,143,0.6), 0 0 28px rgba(243,214,140,0.85), 0 0 60px rgba(243,214,140,0.35)';
    const trail = [];
    for (let k = 0; k < 22; k++) {
      const glyph = k % 5 === 2, sz = glyph ? 7 + r() * 5 : (k < 6 ? 16 - k * 2 : 2 + r() * 3);
      const jx = (r() - 0.5) * 18, jy = (r() - 0.5) * 18, soft = k < 6;
      const base = { position: pos, left: 0, top: 0, width: sz, height: sz, pointerEvents: 'none', zIndex: 199 };
      const look = glyph ? { fontSize: sz, lineHeight: 1, color: '#fbe9b8', textShadow: '0 0 8px #fbe9b8' }
        : soft ? { borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,240,200,0.9), rgba(243,212,138,0.3) 50%, transparent 72%)', filter: 'blur(2px)' }
          : { borderRadius: '50%', background: '#fbe9b8', boxShadow: `0 0 ${sz * 3}px rgba(251,233,184,0.9)` };
      const at = (s) => { const p = bez(Math.max(0, s)); const spread = soft ? 0 : 1 + k * 0.08; return `translate(${(p.x - sz / 2 + jx * spread * (soft ? 0 : 1)).toFixed(1)}px,${(p.y - sz / 2 + jy * spread * (soft ? 0 : 1)).toFixed(1)}px)`; };
      if (o.at != null) {
        const s = o.at - (k + 1) * 0.03;
        if (s <= 0.02) continue;
        trail.push(h('span', { key: 't' + k, style: Object.assign(base, look, { transform: at(s), opacity: Math.max(0.1, 1 - k / 22) }) }, glyph ? '✦' : null));
      } else {
        const frames = []; for (let i = 0; i <= N; i++) { const s = i / N; frames.push({ transform: at(s), opacity: i === 0 ? 0 : i === N ? 0 : (1 - k / 26) }); }
        trail.push(h('span', { key: 't' + k, ref: (node) => { if (node && !node.__a) node.__a = node.animate(frames, { duration: 820, delay: 30 + k * 24, easing: 'cubic-bezier(.5,0,.25,1)', fill: 'both' }); }, style: Object.assign(base, look, { opacity: 0 }) }, glyph ? '✦' : null));
      }
    }
    const cardStyle = back({ position: pos, left: 0, top: 0, width: from.w, height: from.h, zIndex: 200, pointerEvents: 'none', boxShadow: glow, transformOrigin: '50% 50%' });
    let card;
    if (o.at != null) card = h('span', { key: 'card', style: Object.assign(cardStyle, { transform: cardT(o.at) }) });
    else {
      const frames = []; for (let i = 0; i <= N; i++) frames.push({ transform: cardT(i / N) });
      card = h('span', { key: 'card', ref: (node) => { if (node && !node.__a) { node.__a = node.animate(frames, { duration: 820, easing: 'cubic-bezier(.5,0,.25,1)', fill: 'forwards' }); node.__a.onfinish = () => o.onDone && o.onDone(); } }, style: Object.assign(cardStyle, { transform: cardT(0) }) });
    }
    return h('div', { key: o.id != null ? 'fl' + o.id : 'fl', style: { position: o.at != null ? 'absolute' : 'static', inset: 0, pointerEvents: 'none' } }, trail.concat([card]));
  }

  // velvet reading cloth: noise texture, arcane circle, candle glow, stars, crystal glints, vignette, carved corners
  function velvet(h, o) {
    o = o || {};
    const seed = o.seed || 1, id = 'vv' + seed, r = seeded(seed * 97 + 5), G = 'rgba(227,201,143,0.42)';
    const L = [];
    L.push(h('div', { key: 'base', style: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 70% at 50% 45%, #2d1a3e 0%, #1b1029 45%, #0d0716 80%, #06030a 100%)' } }));
    L.push(h('svg', { key: 'tex', width: '100%', height: '100%', style: { position: 'absolute', inset: 0, display: 'block' } },
      h('defs', null,
        h('filter', { id: id + 'm', x: 0, y: 0, width: '100%', height: '100%' }, h('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.011 0.02', numOctaves: 3, seed: seed + 7 }), h('feColorMatrix', { values: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0.02  -1.6 0 0 0 1.05' })),
        h('filter', { id: id + 'l', x: 0, y: 0, width: '100%', height: '100%' }, h('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.018 0.03', numOctaves: 3, seed: seed + 3 }), h('feColorMatrix', { values: '0 0 0 0 0.72  0 0 0 0 0.56  0 0 0 0 0.92  1.5 0 0 0 -0.62' })),
        h('filter', { id: id + 'g', x: 0, y: 0, width: '100%', height: '100%' }, h('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.9', numOctaves: 2, seed: seed + 11, stitchTiles: 'stitch' }), h('feColorMatrix', { values: '0 0 0 0 1  0 0 0 0 0.9  0 0 0 0 1  1.1 0 0 0 -0.45' }))),
      h('rect', { width: '100%', height: '100%', filter: `url(#${id}m)`, opacity: 0.6 }),
      h('rect', { width: '100%', height: '100%', filter: `url(#${id}l)`, opacity: 0.32 }),
      h('rect', { width: '100%', height: '100%', filter: `url(#${id}g)`, opacity: 0.22 })));
    L.push(h('div', { key: 'sheen', style: { position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,0.05), transparent 30%, transparent 70%, rgba(255,255,255,0.03))' } }));
    const glow = (k, l, t, sz, del, a) => h('span', { key: k, style: Object.assign({ position: 'absolute', left: l, top: t, width: sz, aspectRatio: '1', transform: 'translate(-50%,-50%)', borderRadius: '50%', background: `radial-gradient(circle, rgba(255,186,104,${a}), rgba(234,88,12,${a * 0.3}) 38%, transparent 68%)` }, anim(null, 'glow', 3.2, del, 'ease-in-out', 'infinite')) });
    L.push(glow('g1', '2%', '4%', '75%', 0, 0.26), glow('g2', '98%', '96%', '65%', -1.4, 0.2), glow('g3', '96%', '6%', '38%', -0.6, 0.12));
    // arcane circle
    const ring = [], inner = [];
    [97, 93.5, 79, 76].forEach((rr, i) => ring.push(h('circle', { key: 'c' + i, r: rr, fill: 'none', stroke: G, strokeWidth: i % 2 ? 0.35 : 0.6 })));
    for (let i = 0; i < 120; i++) { const a = i * 3 * Math.PI / 180, r1 = i % 10 === 0 ? 89 : i % 5 === 0 ? 91 : 92.2; ring.push(h('line', { key: 't' + i, x1: n2(Math.cos(a) * r1), y1: n2(Math.sin(a) * r1), x2: n2(Math.cos(a) * 93.5), y2: n2(Math.sin(a) * 93.5), stroke: G, strokeWidth: 0.35 })); }
    const Z = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    for (let i = 0; i < 12; i++) {
      const a = (i * 30 - 90) * Math.PI / 180, b = (i * 30 + 15 - 90) * Math.PI / 180;
      ring.push(h('line', { key: 'd' + i, x1: n2(Math.cos(a) * 79), y1: n2(Math.sin(a) * 79), x2: n2(Math.cos(a) * 89), y2: n2(Math.sin(a) * 89), stroke: G, strokeWidth: 0.4 }));
      ring.push(h('text', { key: 'z' + i, x: n2(Math.cos(b) * 84.2), y: n2(Math.sin(b) * 84.2 + 2.4), fill: 'rgba(235,210,150,0.6)', fontSize: 6.6, textAnchor: 'middle', fontFamily: "'Noto Sans Symbols','Noto Sans Symbols 2','Segoe UI Symbol',serif" }, Z[i] + '\uFE0E'));
    }
    const poly = (n, rr, rot) => [...Array(n)].map((_, k) => { const a = (rot + k * 360 / n - 90) * Math.PI / 180; return `${(Math.cos(a) * rr).toFixed(2)},${(Math.sin(a) * rr).toFixed(2)}`; }).join(' ');
    [66, 63].forEach((rr, i) => inner.push(h('circle', { key: 'ic' + i, r: rr, fill: 'none', stroke: G, strokeWidth: i ? 0.3 : 0.5 })));
    inner.push(h('polygon', { key: 'sq1', points: poly(4, 63, 0), fill: 'none', stroke: G, strokeWidth: 0.45 }));
    inner.push(h('polygon', { key: 'sq2', points: poly(4, 63, 45), fill: 'none', stroke: G, strokeWidth: 0.45 }));
    for (let i = 0; i < 16; i++) { const a = (i * 22.5 - 90) * Math.PI / 180, r2 = i % 2 ? 34 : 46; inner.push(h('line', { key: 'ray' + i, x1: n2(Math.cos(a) * 14), y1: n2(Math.sin(a) * 14), x2: n2(Math.cos(a) * r2), y2: n2(Math.sin(a) * r2), stroke: G, strokeWidth: i % 2 ? 0.3 : 0.5 })); }
    inner.push(h('polygon', { key: 'h1', points: poly(3, 30, 0), fill: 'none', stroke: G, strokeWidth: 0.45 }));
    inner.push(h('polygon', { key: 'h2', points: poly(3, 30, 180), fill: 'none', stroke: G, strokeWidth: 0.45 }));
    [30, 14, 6].forEach((rr, i) => inner.push(h('circle', { key: 'k' + i, r: rr, fill: 'none', stroke: G, strokeWidth: 0.4 })));
    for (let i = 0; i < 8; i++) { const a = (i * 45 - 90) * Math.PI / 180; inner.push(h('circle', { key: 'dot' + i, cx: n2(Math.cos(a) * 70.5), cy: n2(Math.sin(a) * 70.5), r: 1.1, fill: 'rgba(243,214,140,0.7)' })); }
    const spin = (dur, dir) => Object.assign({ transformBox: 'view-box', transformOrigin: '50% 50%' }, anim(null, 'swirl', dur, 0, 'linear', 'infinite', dir));
    L.push(h('svg', { key: 'arc', viewBox: '-100 -100 200 200', preserveAspectRatio: 'xMidYMid meet', style: { position: 'absolute', left: '3%', top: '3%', width: '94%', height: '94%', overflow: 'visible', filter: 'drop-shadow(0 0 2.5px rgba(243,214,140,0.45))' } },
      h('g', { style: spin(300) }, ring), h('g', { style: spin(220, 'reverse') }, inner)));
    // stars + crystal glints
    L.push(h('div', { key: 'st', style: { position: 'absolute', inset: 0 } }, stars(h, { n: 26, seed: seed + 60, min: 0.6, max: 1.6, kf: 'twinkle', minDur: 2.5, maxDur: 6 })));
    L.push(h('div', { key: 'sp', style: { position: 'absolute', inset: 0 } }, stars(h, { n: 5, seed: seed + 80, sparkle: true, min: 6, max: 10, kf: 'twinkle', minDur: 3, maxDur: 6 })));
    for (let i = 0; i < 7; i++) {
      const edge = r() < 0.5, x = edge ? (r() < 0.5 ? 3 + r() * 14 : 83 + r() * 14) : 5 + r() * 90, y = edge ? 5 + r() * 90 : (r() < 0.5 ? 3 + r() * 12 : 85 + r() * 12), w = 4 + r() * 4;
      L.push(h('span', { key: 'cr' + i, style: Object.assign({ position: 'absolute', left: x + '%', top: y + '%', width: w, height: w * 1.7, clipPath: 'polygon(50% 0,100% 45%,50% 100%,0 45%)', background: 'linear-gradient(135deg,#ffffff,#d9d2ff 40%,rgba(150,135,230,0.55) 75%,rgba(255,255,255,0.9))', transform: `rotate(${(r() * 60 - 30).toFixed(0)}deg)` }, anim(null, 'twinkle', (2.4 + r() * 3).toFixed(2), -r() * 4, 'ease-in-out', 'infinite')) }));
    }
    L.push(h('div', { key: 'vig', style: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 85% 80% at 50% 48%, transparent 42%, rgba(0,0,0,0.5) 78%, rgba(0,0,0,0.82) 100%)' } }));
    // carved gold corners + edge ornaments
    const corner = (k, st) => h('svg', { key: k, width: 52, height: 52, viewBox: '0 0 52 52', fill: 'none', style: Object.assign({ position: 'absolute', filter: 'drop-shadow(0 0 3px rgba(243,214,140,0.45))' }, st) },
      h('path', { d: 'M3 50V16C3 8.8 8.8 3 16 3h34', stroke: '#e3c98f', strokeWidth: 1.2 }),
      h('path', { d: 'M9 50V19c0-5.5 4.5-10 10-10h31', stroke: '#c9a45c', strokeOpacity: 0.55 }),
      h('path', { d: 'M16 16c7 0 10 5 7.5 9.5-2.2 3.6-8 2.6-8-1.6 0-2.6 3.2-3.4 4.6-1.6', stroke: '#e3c98f', strokeWidth: 0.9 }),
      h('path', { d: 'M28 5.5q7-5 14 0q-7 5-14 0z', stroke: '#e3c98f', strokeWidth: 0.8, fill: 'rgba(227,201,143,0.15)' }),
      h('path', { d: 'M5.5 28q-5 7 0 14q5-7 0-14z', stroke: '#e3c98f', strokeWidth: 0.8, fill: 'rgba(227,201,143,0.15)' }),
      h('circle', { cx: 16, cy: 16, r: 2.2, fill: '#f1dca6' }));
    L.push(corner('c1', { left: 4, top: 4 }), corner('c2', { right: 4, top: 4, transform: 'scaleX(-1)' }), corner('c3', { left: 4, bottom: 4, transform: 'scaleY(-1)' }), corner('c4', { right: 4, bottom: 4, transform: 'scale(-1,-1)' }));
    const mid = (k, st) => h('svg', { key: k, width: 92, height: 14, viewBox: '0 0 92 14', fill: 'none', style: Object.assign({ position: 'absolute', left: '50%', marginLeft: -46, filter: 'drop-shadow(0 0 3px rgba(243,214,140,0.4))' }, st) },
      h('path', { d: 'M2 7c10 0 14-5 22-5 6 0 8 5 14 5M90 7c-10 0-14-5-22-5-6 0-8 5-14 5', stroke: '#e3c98f', strokeWidth: 0.9 }),
      h('path', { d: 'M46 1l6 6-6 6-6-6z', stroke: '#f1dca6', fill: 'rgba(227,201,143,0.2)' }), h('circle', { cx: 46, cy: 7, r: 1.6, fill: '#f6e7bf' }));
    L.push(mid('m1', { top: 3 }), mid('m2', { bottom: 3, transform: 'scaleY(-1)' }));
    return h('div', { 'aria-hidden': true, style: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' } }, L);
  }

  export const RitualFX = { stars, fog, deckFace, shuffle, burst, flight, back, anim, velvet };
