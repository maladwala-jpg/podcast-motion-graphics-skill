/* Career Moonshots — motion graphics library (GSAP, deterministic seek) */
(function () {
  const P_ = window.PROJECT || {}, FPS = P_.fps || 30, SW = P_.width || 1920, SH = P_.height || 1080, PAL = window.PAL || {};
  window.S = {};
  let CBOX = { x: 0, w: SW, cx: SW / 2 };   // usable content area (shrinks when a host panel is beside the graphics)
  window.scene = (id, fn) => { S[id] = fn; };
  let R, tl, D, W, THEME;
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- basics ---------- */
  const mk = (cls, css, html) => { const e = document.createElement('div'); if (cls) e.className = cls; if (css) Object.assign(e.style, css); if (html != null) e.innerHTML = html; return e; };
  const put = (e, x, y) => { e.style.position = 'absolute'; e.style.left = x + 'px'; e.style.top = y + 'px'; gsap.set(e, { xPercent: -50, yPercent: -50 }); return e; };
  const add = (e, x, y, parent) => { (parent || R).appendChild(e); if (x != null) put(e, x, y); return e; };
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  function at(phrase, nth = 1, which = 's') {
    const toks = phrase.split(/\s+/).map(norm).filter(Boolean); let found = 0;
    for (let i = 0; i <= W.length - toks.length; i++) {
      if (toks.every((t, j) => norm(W[i + j].w) === t)) { found++; if (found === nth) return which === 's' ? W[i].s : W[i + toks.length - 1].e; }
    }
    throw new Error('at(): "' + phrase + '" is not in this scene\'s transcript words. Words available: ' + W.map(w => w.w.replace(/[^A-Za-z0-9\-\']/g, '') + '@' + w.s.toFixed(1)).join(' '));
  }
  const endAt = (p, n = 1) => at(p, n, 'e');
  const clamp = (t) => Math.max(0, Math.min(t, D - 0.05));

  /* ---------- icons ---------- */
  function ico(name, size = 48, color = 'currentColor', sw = 2) {
    const s = ICONS[name]; if (!s) throw new Error('icon missing: ' + name);
    const e = document.createElementNS(NS, 'svg');
    e.setAttribute('viewBox', '0 0 24 24'); e.setAttribute('width', size); e.setAttribute('height', size);
    e.setAttribute('fill', 'none'); e.setAttribute('stroke', color); e.setAttribute('stroke-width', sw);
    e.setAttribute('stroke-linecap', 'round'); e.setAttribute('stroke-linejoin', 'round');
    e.innerHTML = s; e.style.display = 'block'; return e;
  }
  function chip(name, o = {}) {
    const size = o.size || 96, e = mk('chip', { width: size + 'px', height: size + 'px', borderRadius: o.r || (o.sq ? size * 0.28 + 'px' : '50%'), background: o.bg || 'var(--primary)', color: o.c || '#fff' });
    if (o.shadow !== false) e.style.boxShadow = o.sh || '0 14px 26px -10px rgba(60,25,5,.55), 0 0 0 ' + (o.ring || 0) + 'px rgba(255,255,255,.0), inset 0 2px 0 rgba(255,255,255,.28)';
    if (name) e.appendChild(ico(name, size * (o.k || 0.52), o.c || '#fff', o.sw || 2));
    return e;
  }
  /* ---------- text ---------- */
  function wrapTok(tok) {
    let m;
    if ((m = tok.match(/^\*(.+)\*([^*]*)$/))) return `<span class="w acc">${m[1]}${m[2]}</span>`;
    if ((m = tok.match(/^_(.+)_([^_]*)$/))) return `<span class="w" style="font-style:italic">${m[1]}${m[2]}</span>`;
    if ((m = tok.match(/^==(.+)==([^=]*)$/))) return `<span class="w"><span class="hl">${m[1]}</span></span>${m[2]}`;
    if ((m = tok.match(/^~(.+)~([^~]*)$/))) return `<span class="w x">${m[1]}</span>${m[2]}`;
    return `<span class="w">${tok}</span>`;
  }
  function T(str, o = {}) {
    const e = mk('abs t ' + (o.f === 'sans' ? 'sans' : o.f === 'hand' ? 'hand' : 'serif'));
    const s = e.style;
    s.fontSize = (o.s || 80) + 'px'; s.fontWeight = o.w || (o.f === 'sans' ? 700 : 600); s.color = o.c || 'var(--fg)'; s.textAlign = o.a || 'center';
    if (o.i) s.fontStyle = 'italic'; if (o.ls != null) s.letterSpacing = o.ls + 'em'; if (o.lh) s.lineHeight = o.lh;
    if (o.mw) { s.whiteSpace = 'normal'; s.width = o.mw + 'px'; } else s.whiteSpace = 'pre';
    if (o.uc) s.textTransform = 'uppercase';
    e.innerHTML = str.split('\n').map(line => line.split(' ').map(wrapTok).join(' ')).join('<br>');
    e.words = [...e.querySelectorAll('.w')];
    return e;
  }
  const accent = () => (THEME === 'dark' ? (PAL.highlight || '#F2A65A') : (PAL.accent_light || '#C0612F'));

  /* ---------- animation helpers ---------- */
  function pop(e, t, o = {}) {
    const f = { autoAlpha: 0, scale: o.s0 != null ? o.s0 : 0.6, y: o.dy != null ? o.dy : 28, x: o.dx || 0, rotation: o.r0 || 0 };
    if (o.blur) f.filter = 'blur(' + o.blur + 'px)';
    const to = { autoAlpha: o.a != null ? o.a : 1, scale: o.sc || 1, y: 0, x: 0, rotation: o.r || 0, duration: o.d || 0.55, ease: o.ease || 'back.out(1.6)' };
    if (o.blur) to.filter = 'blur(0px)';
    tl.fromTo(e, f, to, clamp(t));
    return e;
  }
  function gone(e, t, o = {}) {
    tl.to(e, { autoAlpha: 0, scale: o.s != null ? o.s : 0.92, y: o.dy != null ? o.dy : -18, x: o.dx || 0, duration: o.d || 0.35, ease: o.ease || 'power2.in' }, clamp(t));
    return e;
  }
  // staggered word reveal; times: optional array of absolute times per word
  function reveal(e, t, o = {}) {
    const ws = e.words;
    const from = { autoAlpha: 0, y: o.dy != null ? o.dy : 46, scale: o.s0 != null ? o.s0 : 0.92, filter: 'blur(' + (o.blur != null ? o.blur : 10) + 'px)' };
    ws.forEach((w, i) => {
      let tt = o.times ? o.times[i] : t + i * (o.st != null ? o.st : 0.07);
      if (o.times && (tt == null || isNaN(tt))) tt = (o.times.filter(v => v != null && !isNaN(v)).slice(-1)[0] || 0) + 0.25 * (i - o.times.length + 1); // fewer times than words: trail after the last given time instead of showing at t=0
      tl.fromTo(w, from, { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: o.d || 0.55, ease: o.ease || 'power3.out' }, clamp(tt));
    });
    e.querySelectorAll('.hl').forEach((h, i) => tl.to(h, { backgroundSize: '100% 100%', duration: 0.5, ease: 'power2.out' }, clamp((o.hlAt != null ? o.hlAt : t + 0.35) + i * 0.15)));
    return e;
  }
  function wordsAt(e, phrases, o = {}) { // phrases: array of spoken phrases → time per word index
    const times = phrases.map(p => (typeof p === 'number' ? p : at(p)));
    return reveal(e, 0, Object.assign({}, o, { times }));
  }
  function strike(e, t, o = {}) {
    const ln = mk('', { position: 'absolute', left: '-4%', top: o.top || '56%', height: (o.h || 0.1) + 'em', width: '108%', background: o.c || 'var(--danger)', transformOrigin: '0 50%', borderRadius: '99px' });
    e.style.fontSize || 0; e.appendChild(ln); tl.fromTo(ln, { scaleX: 0 }, { scaleX: 1, duration: o.d || 0.35, ease: 'power3.out' }, clamp(t)); return ln;
  }
  // hero headline: appears big at screen centre, then glides to its top position
  function hero(str, o = {}) {
    const yTop = o.yTop || Math.round(SH * 0.11), yc = o.yc || Math.round(SH * 0.43), big = o.big || 1.5;
    const h = add(T(str, { s: o.s || Math.round(SH * 0.069), c: o.c }), o.x || CBOX.cx, yTop);
    gsap.set(h, { y: yc - yTop, scale: big });
    tl.to(h, { y: 0, scale: 1, duration: o.md || 0.75, ease: 'power3.inOut' }, clamp(o.move));
    return h;
  }
  function drift(e, t, d, o = {}) { tl.to(e, Object.assign({ duration: d, ease: 'none' }, o), clamp(t)); }

  /* ---------- svg lines ---------- */
  function svgLayer(parent) { const s = document.createElementNS(NS, 'svg'); s.setAttribute('width', SW); s.setAttribute('height', SH); s.setAttribute('viewBox', `0 0 ${SW} ${SH}`); s.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none'; (parent || R).appendChild(s); return s; }
  function path(layer, d, o = {}) {
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('fill', o.fill || 'none');
    p.setAttribute('stroke', o.c || 'var(--primary)'); p.setAttribute('stroke-width', o.w || 6); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
    if (o.dash) p.setAttribute('stroke-dasharray', o.dash);
    layer.appendChild(p); return p;
  }
  function drawOn(layer, d, t, dur, o = {}) { // animated stroke draw-on (pathLength-normalised)
    const p = path(layer, d, o); p.setAttribute('pathLength', 1);
    if (o.dash) { // dashed lines: reveal by clip-mask style opacity wipe
      const m = p; gsap.set(m, { autoAlpha: 0 }); tl.to(m, { autoAlpha: 1, duration: 0.3 }, clamp(t)); return p;
    }
    p.style.strokeDasharray = 1; p.style.strokeDashoffset = 1;
    tl.to(p, { strokeDashoffset: 0, duration: dur || 0.6, ease: o.ease || 'power2.inOut' }, clamp(t)); return p;
  }
  let maskN = 0;
  // road: thick path with dashed centre line, revealed by an animated mask
  function road(layer, d, t, dur, o = {}) {
    const id = 'rm' + (maskN++);
    let defs = layer.querySelector('defs'); if (!defs) { defs = document.createElementNS(NS, 'defs'); layer.appendChild(defs); }
    const m = document.createElementNS(NS, 'mask'); m.setAttribute('id', id); m.setAttribute('maskUnits', 'userSpaceOnUse'); m.setAttribute('x', 0); m.setAttribute('y', 0); m.setAttribute('width', SW); m.setAttribute('height', SH);
    const mp = path(m, d, { c: '#fff', w: (o.w || 40) + 30 }); mp.setAttribute('pathLength', 1); mp.style.strokeDasharray = 1; mp.style.strokeDashoffset = 1; defs.appendChild(m);
    const g = document.createElementNS(NS, 'g'); g.setAttribute('mask', `url(#${id})`); layer.appendChild(g);
    path(g, d, { c: o.c || PAL.road || '#E2CBB3', w: o.w || 40 }); path(g, d, { c: o.dc || '#fff', w: 4, dash: '3 20' });
    tl.to(mp, { strokeDashoffset: 0, duration: dur || 1, ease: o.ease || 'power2.inOut' }, clamp(t)); return g;
  }
  function arrow(layer, x1, y1, x2, y2, t, dur, o = {}) {
    const bend = o.bend || 0; const mx = (x1 + x2) / 2 + bend * (y2 - y1) * 0.0 , my = (y1 + y2) / 2;
    const cx = o.cx != null ? o.cx : (x1 + x2) / 2, cy = o.cy != null ? o.cy : (y1 + y2) / 2 + bend;
    const d = bend || o.cx != null ? `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}` : `M${x1} ${y1} L${x2} ${y2}`;
    const p = drawOn(layer, d, t, dur, o);
    const ang = Math.atan2(y2 - cy, x2 - cx) * 180 / Math.PI; const hs = (o.hs || 22);
    const h = document.createElementNS(NS, 'path'); h.setAttribute('d', `M${-hs} ${-hs * 0.7} L0 0 L${-hs} ${hs * 0.7}`); h.setAttribute('fill', 'none'); h.setAttribute('stroke', o.c || 'var(--primary)'); h.setAttribute('stroke-width', o.w || 6); h.setAttribute('stroke-linecap', 'round'); h.setAttribute('stroke-linejoin', 'round');
    h.setAttribute('transform', `translate(${x2} ${y2}) rotate(${ang})`); layer.appendChild(h); gsap.set(h, { autoAlpha: 0 });
    tl.to(h, { autoAlpha: 1, duration: 0.12 }, clamp(t + (dur || 0.6) * 0.92)); return p;
  }

  /* ---------- widgets ---------- */
  function card(w, h, o = {}) {
    const e = mk('card' + (o.solid ? ' solid' : '') + (o.cls ? ' ' + o.cls : ''), { width: w + 'px', height: h + 'px' });
    if (o.r != null) e.style.borderRadius = o.r + 'px'; if (o.bg) e.style.background = o.bg; if (o.col) e.style.color = o.col; if (o.ov) e.style.overflow = 'hidden';
    return e;
  }
  function tag(text, o = {}) {
    const e = mk('pillbtn', { background: o.bg || 'var(--dark)', color: o.c || 'var(--light)', fontSize: (o.s || 28) + 'px', padding: o.pad || '12px 26px' });
    if (o.icon) e.appendChild(ico(o.icon, (o.s || 28) + 4, o.c || 'var(--light)', 2.4));
    const sp = document.createElement('span'); sp.textContent = text; e.appendChild(sp);
    if (o.sh !== false) e.style.boxShadow = '0 12px 22px -10px rgba(40,18,4,.5)';
    return e;
  }
  function stamp(text, o = {}) {
    const c = o.c || 'var(--danger)';
    const e = mk('abs', { border: (o.bw || 8) + 'px solid ' + c, color: c, padding: '8px 30px', borderRadius: '16px', font: `800 ${o.s || 64}px/1 'InterV'`, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', background: o.bg || 'transparent' });
    e.textContent = text; e.style.transform = 'rotate(' + (o.rot || -8) + 'deg)'; return e;
  }
  function slam(e, t, o = {}) {
    const rot = o.rot != null ? o.rot : -8;
    tl.fromTo(e, { autoAlpha: 0, scale: 2.6, rotation: rot - 10 }, { autoAlpha: 1, scale: 1, rotation: rot, duration: 0.32, ease: 'power4.in' }, clamp(t));
    if (o.shake !== false) tl.fromTo(e, { x: 0, y: 0 }, { x: 7, y: 4, duration: 0.05, yoyo: true, repeat: 3, ease: 'none', immediateRender: false }, clamp(t + 0.32));
    return e;
  }
  function counter(e, t, dur, from, to, fmt) {
    const o = { v: from }; const f = fmt || (v => Math.round(v));
    e.textContent = f(from);
    tl.to(o, { v: to, duration: dur, ease: 'power2.out', onUpdate: () => { e.textContent = f(o.v); } }, clamp(t));
  }
  function typeIn(e, text, t, dur) {
    const o = { v: 0 }; e.textContent = '';
    tl.to(o, { v: text.length, duration: dur, ease: 'none', onUpdate: () => { e.textContent = text.slice(0, Math.round(o.v)); } }, clamp(t));
  }
  function person(kind, size = 120, o = {}) { // avatar chip
    const bg = o.bg || (kind === 'you' ? 'var(--primary)' : kind === 'senior' ? 'var(--quaternary)' : 'var(--tertiary-d)');
    const ic = o.icon || (kind === 'you' ? 'user-round' : kind === 'senior' ? 'user-check' : 'users-round');
    return chip(ic, { size, bg, k: 0.5 });
  }
  function dots(cols, rows, gap, r, fill, o = {}) { // returns group with .dots array
    const g = mk('abs', { width: cols * gap + 'px', height: rows * gap + 'px' }); g.dots = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const d = mk('', { position: 'absolute', left: x * gap + 'px', top: y * gap + 'px', width: r * 2 + 'px', height: r * 2 + 'px', borderRadius: '50%', background: fill, opacity: 1 });
      g.appendChild(d); g.dots.push(d);
    }
    return g;
  }

  /* ---------- transitions ---------- */
  const TCOV = 0.46; // seconds for a full wipe
  const WOOD = (PAL.slats && PAL.slats.length ? PAL.slats : ['#B3643A', '#C26F42', '#A85B32', '#BE6A3D', '#9C5530', '#C77A4B', '#AF6038', '#BC693F', '#A25833', '#C4723F', '#AB5E35', '#B96740']);
  function shade(hex, k) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const f = v => Math.max(0, Math.min(255, Math.round(v * k))); return `rgb(${f(r)},${f(g)},${f(b)})`; }
  function barsEl(n, vertical, color, wood) {
    const g = mk('abs', { left: 0, top: 0, width: SW + 'px', height: SH + 'px' }); g.bars = [];
    const size = vertical ? SW / n : SH / n;
    for (let i = 0; i < n; i++) {
      const b = mk('', { position: 'absolute' });
      const base = wood ? WOOD[i % WOOD.length] : shade(color, 0.94 + ((i * 37) % 11) / 90);
      if (vertical) { b.style.cssText += `left:${i * size - 0.5}px;top:-2px;width:${size + 1}px;height:${SH + 4}px;`; b.style.background = `linear-gradient(90deg,${shade(base, 0.9)},${base} 18%,${shade(base, 1.06)} 70%,${shade(base, 0.86)})`; b.style.boxShadow = 'inset 3px 0 0 rgba(0,0,0,.16),inset -2px 0 0 rgba(255,220,170,.18)'; }
      else { b.style.cssText += `top:${i * size - 0.5}px;left:-2px;height:${size + 1}px;width:${SW + 4}px;`; b.style.background = `linear-gradient(180deg,${shade(base, 0.9)},${base} 20%,${shade(base, 1.05)} 75%,${shade(base, 0.86)})`; b.style.boxShadow = 'inset 0 3px 0 rgba(0,0,0,.14)'; }
      g.appendChild(b); g.bars.push(b);
    }
    if (wood) { const led = mk('', { position: 'absolute', left: 0, right: 0, bottom: '96px', height: '6px', background: 'linear-gradient(90deg,rgba(255,200,120,0),rgba(255,214,150,.9),rgba(255,200,120,0))', filter: 'blur(1px)' }); g.appendChild(led); g.led = led; }
    return g;
  }
  const IRIS_ORIGINS = [[0.5, 0.5], [0.14, 0.24], [0.86, 0.76], [0.14, 0.76], [0.86, 0.24], [0.5, 0.5], [0.5, 0.92], [0.5, 0.07], [0.14, 0.5], [0.86, 0.5]].map(([a, b]) => [Math.round(a * SW), Math.round(b * SH)]), IRIS_R = Math.round(Math.hypot(SW, SH)) + 60 + 'px';
  function buildTrans(host, spec, which, idx) {
    const isIn = which === 'in', SPD = spec.speed || 1;   // SPD < 1 = faster wipes (short title cards)
    if (spec.kind === 'none') { // no neighbouring shot: gentle fade from / to the background
      const cam = document.getElementById('cam');
      if (isIn) tl.fromTo(cam, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, 0); else tl.to(cam, { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, D - 0.45);
      return;
    }
    if (spec.kind === 'host' && spec.style === 'dissolve') { // plain cross-dissolve to/from the neighbouring host frame (no wipe)
      const im = document.createElement('img'); im.src = spec.still; im.style.cssText = `position:absolute;left:0;top:0;width:${SW}px;height:${SH}px`; host.appendChild(im);
      if (isIn) tl.fromTo(im, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.35, ease: 'none' }, 0); else tl.fromTo(im, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'none' }, D - 0.37);
      return;
    }
    const T0 = isIn ? 0 : D - TCOV * SPD - (spec.kind === 'host' ? 0.13 * SPD : 0.035);
    const style = spec.style, color = spec.color || PAL.primary || '#C96F3F', wood = spec.kind === 'host';
    const els = [];
    if (style === 'slats' || style === 'bars') {
      const vertical = style === 'slats';
      const g = barsEl(vertical ? Math.round(SW / 160) : Math.round(SH / 135), vertical, color, wood); host.appendChild(g);
      const dir = vertical ? 'yPercent' : 'xPercent';
      const stagger = { each: (vertical ? 0.016 : 0.026) * SPD, from: 'start' };
      const start = isIn && wood ? 0.1 * SPD : 0;
      if (isIn) { gsap.set(g.bars, { [dir]: 0 }); tl.fromTo(g.bars, { [dir]: 0 }, { [dir]: 100, duration: 0.28 * SPD, ease: 'power2.in', stagger }, start); if (g.led) tl.fromTo(g.led, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2 }, start); }
      else { tl.fromTo(g.bars, { [dir]: -100 }, { [dir]: 0, duration: 0.28 * SPD, ease: 'power2.out', stagger }, T0); if (g.led) tl.fromTo(g.led, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, T0 + 0.2); }
    } else if (style === 'diag') {
      const BW = Math.max(SW, SH) * 2.3, BH = Math.max(SW, SH) * 1.9, TRV = BW + SW; const wrap = mk('abs', { left: 0, top: 0, width: SW + 'px', height: SH + 'px' }); host.appendChild(wrap);
      const mkBand = (col, off) => { const w = mk('abs', { left: 0, top: 0, width: SW + 'px', height: SH + 'px' }); const b = mk('', { position: 'absolute', left: (SW / 2 - BW / 2 + off) + 'px', top: (SH / 2 - BH / 2) + 'px', width: BW + 'px', height: BH + 'px', background: col, transform: 'rotate(-14deg)' }); w.appendChild(b); wrap.appendChild(w); return w; };
      const b2 = mkBand(shade(color, 1.2), 90), b1 = mkBand(color, 0);
      if (isIn) { tl.fromTo(b1, { x: 0 }, { x: TRV, duration: 0.42, ease: 'power3.in' }, 0); tl.fromTo(b2, { x: 0 }, { x: TRV, duration: 0.42, ease: 'power3.in' }, 0.05); }
      else { tl.fromTo(b2, { x: -TRV }, { x: 0, duration: 0.42, ease: 'power3.out' }, T0); tl.fromTo(b1, { x: -TRV }, { x: 0, duration: 0.42, ease: 'power3.out' }, T0 + 0.05); }
    } else if (style === 'iris') {
      const o = IRIS_ORIGINS[(idx || 0) % IRIS_ORIGINS.length]; const e = mk('abs', { left: 0, top: 0, width: SW + 'px', height: SH + 'px', background: color }); host.appendChild(e);
      if (isIn) { e.style.webkitMaskImage = `radial-gradient(circle at ${o[0]}px ${o[1]}px, transparent var(--r), #000 calc(var(--r) + 2px))`; tl.fromTo(e, { '--r': '0px' }, { '--r': IRIS_R, duration: 0.5, ease: 'power3.in' }, 0); }
      else { e.style.clipPath = `circle(var(--r) at ${o[0]}px ${o[1]}px)`; tl.fromTo(e, { '--r': '0px' }, { '--r': IRIS_R, duration: 0.5, ease: 'power3.in' }, T0 - 0.04); }
    } else if (style === 'tiles') {
      const cols = 16, s = SW / cols, rows = Math.ceil(SH / s); const g = mk('abs', { left: 0, top: 0, width: SW + 'px', height: SH + 'px' }); host.appendChild(g); const tiles = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const t = mk('', { position: 'absolute', left: c * s - 0.5 + 'px', top: r * s - 0.5 + 'px', width: s + 1 + 'px', height: s + 1 + 'px', background: shade(color, 0.95 + ((c * 7 + r * 13) % 9) / 100) }); g.appendChild(t); tiles.push(t); }
      const org = (idx || 0) % 2 ? 0 : tiles.length - 1;
      if (isIn) tl.fromTo(tiles, { scale: 1 }, { scale: 0, duration: 0.22, ease: 'power2.in', stagger: { amount: 0.3, from: org, grid: [rows, cols] } }, 0);
      else tl.fromTo(tiles, { scale: 0 }, { scale: 1, duration: 0.22, ease: 'power2.out', stagger: { amount: 0.3, from: org, grid: [rows, cols] } }, T0);
    }
    if (spec.kind === 'host') { // crossfade to/from the neighbouring host still
      const im = document.createElement('img'); im.src = spec.still; im.style.cssText = `position:absolute;left:0;top:0;width:${SW}px;height:${SH}px`; host.appendChild(im);
      if (isIn) tl.fromTo(im, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.1, ease: 'none' }, 0);
      else tl.fromTo(im, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1, ease: 'none' }, D - 0.1);
    }
  }
  function buildBothTrans(sd, idx) {
    const host = document.getElementById('trans'); host.innerHTML = '';
    const mkc = () => { const c = mk('abs', { left: 0, top: 0, width: SW + 'px', height: SH + 'px' }); host.appendChild(c); return c; };
    buildTrans(mkc(), sd.in, 'in', idx);
    buildTrans(mkc(), sd.out, 'out', idx + 1);
  }

  /* ---------- captions ---------- */
  function buildCaps(cues) {
    const host = document.getElementById('caps'); host.innerHTML = '';
    cues.forEach(c => {
      const p = mk('pill'); p.textContent = c.text.replace(new RegExp('(.{1,' + (window.__capWrap || ((P_.captions || {}).wrap) || 90) + '})(\\s|$)', 'g'), '$1\n').trimEnd(); host.appendChild(p);
      tl.fromTo(p, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power1.out' }, c.t0);
      tl.to(p, { autoAlpha: 0, duration: 0.08 }, Math.max(c.t0 + 0.12, c.t1 - 0.08));
    });
  }

  /* ---------- ambient floating shapes ---------- */
  function ambient(id) {
    const host = document.getElementById('amb'); host.innerHTML = '';
    let seed = 0; for (const c of id) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const cols = THEME === 'dark' ? [PAL.secondary, PAL.tertiary, PAL.primary, PAL.light] : [PAL.primary, PAL.tertiary, PAL.secondary, PAL.quaternary]; cols.forEach((c, i) => { if (!c) cols[i] = '#C96F3F'; });
    for (let i = 0; i < 18; i++) {
      const s = 10 + rnd() * 18, kind = rnd() < 0.55 ? 'sq' : rnd() < 0.5 ? 'ci' : 'plus';
      const e = mk('', { position: 'absolute', left: rnd() * SW + 'px', top: rnd() * SH + 'px', width: s + 'px', height: s + 'px', background: kind === 'plus' ? 'transparent' : cols[Math.floor(rnd() * cols.length)], opacity: (0.16 + rnd() * 0.22), borderRadius: kind === 'ci' ? '50%' : kind === 'sq' ? '3px' : '0' });
      if (kind === 'plus') { e.innerHTML = `<div style="position:absolute;left:0;right:0;top:45%;height:22%;background:${cols[i % cols.length]}"></div><div style="position:absolute;top:0;bottom:0;left:45%;width:22%;background:${cols[i % cols.length]}"></div>`; }
      host.appendChild(e);
      tl.fromTo(e, { y: 0, rotation: 0 }, { y: -(40 + rnd() * 90), rotation: (rnd() - 0.5) * 120, duration: D, ease: 'none' }, 0);
    }
  }

  /* ---------- init ---------- */
  const API = { mk, put, add, at, endAt, hero, road, ico, chip, T, pop, gone, reveal, wordsAt, strike, drift, svgLayer, path, drawOn, arrow, card, tag, stamp, slam, counter, typeIn, person, dots, accent, clamp, gsap, SW, SH, FPS, PAL };
  Object.assign(window, API);
  Object.defineProperty(window, 'tl', { get: () => tl });
  Object.defineProperty(window, 'D', { get: () => D });
  Object.defineProperty(window, 'THEME', { get: () => THEME });
  Object.defineProperty(window, 'R', { get: () => R });
  Object.defineProperty(window, 'CX', { get: () => CBOX.cx });   // horizontal centre of the content area
  Object.defineProperty(window, 'CW', { get: () => CBOX.w });    // width of the content area
  Object.defineProperty(window, 'CL', { get: () => CBOX.x });    // left edge of the content area

  window.initScene = async function (id, opt = {}) {
    const sd = SCENE_DATA[id]; if (!sd) throw new Error('unknown scene ' + id);
    await Promise.all(['600 40px Fraunces', 'italic 600 40px Fraunces', '700 40px InterV', '500 40px InterV', '800 40px InterV', '700 40px Caveat'].map(f => document.fonts.load(f)));
    await document.fonts.ready;
    const stage = document.getElementById('stage'); stage.className = 'theme-' + sd.theme; THEME = sd.theme;
    stage.style.setProperty('--acc', accent());
    CBOX = sd.content_box || { x: 0, w: SW, cx: SW / 2 };
    const old = document.getElementById('panelframe'); if (old) old.remove();
    if (sd.panel) { // frame (ring + shadow) for the host-video panel that assemble.py composites on top of this clip
      const r = sd.panel.rect, f = document.createElement('div'); f.id = 'panelframe';
      f.style.cssText = `position:absolute;left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;border-radius:${sd.panel.radius}px;background:#120D0A;box-shadow:${sd.panel.ring ? '0 0 0 6px color-mix(in srgb,var(--secondary) 85%,transparent),' : ''}0 40px 80px -20px rgba(0,0,0,.6)`;
      stage.insertBefore(f, document.getElementById('caps'));
    }
    const capsEl = document.getElementById('caps'); capsEl.style.left = '0px'; capsEl.style.right = '0px'; capsEl.style.width = '';
    window.__capWrap = sd.caption_box ? 64 : 0;
    if (sd.caption_box) { capsEl.style.left = sd.caption_box.x + 'px'; capsEl.style.right = 'auto'; capsEl.style.width = sd.caption_box.w + 'px'; stage.style.setProperty('--cap-maxw', (sd.caption_box.w - 70) + 'px'); }
    const cp = P_.captions || {}; if (cp.bottom != null) stage.style.setProperty('--cap-bottom', cp.bottom + 'px'); if (cp.size) stage.style.setProperty('--cap-size', cp.size + 'px'); if (cp.max_width) stage.style.setProperty('--cap-maxw', cp.max_width + 'px');
    document.querySelectorAll('.acc').forEach(() => {});
    R = document.getElementById('content'); R.innerHTML = ''; D = sd.D; W = sd.words;
    tl = gsap.timeline({ paused: true, defaults: { overwrite: false } });
    tl.to({}, { duration: 0.0001 }, D);
    // camera drift
    tl.fromTo(document.getElementById('cam'), { scale: 1, x: 0, y: 0 }, { scale: 1.035, x: -10, y: -6, duration: D, ease: 'none' }, 0);
    ambient(id);
    if (!S[id]) throw new Error('scene not authored: ' + id);
    S[id](sd);
    if (!opt.nocaps) buildCaps(sd.cues);
    if (!opt.notrans) buildBothTrans(sd, Math.abs([...id].reduce((a, c) => a + c.charCodeAt(0), 0)) % 7);
    tl.pause(0);
    window.__tl = tl; window.__D = D; window.__n = sd.n;
    window.__seek = (f) => { tl.time(Math.min(f / FPS, tl.duration()), false); return true; };
    window.__seek(0); window.__ready = true;
  };
})();
