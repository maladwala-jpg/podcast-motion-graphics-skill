/* recipes.js — ready-made, layout-adaptive scene building blocks (16:9 and 9:16).
 *
 * Each recipe builds a finished, on-brand visual into the CURRENT scene from a plain options object and times every
 * element to the spoken word. Use them inside scene('ID', sd => { ... }) — compose one or two per scene, or use them as
 * a starting point and add custom elements with the engine helpers.
 *
 *   time spec ("at"):  a spoken phrase  'finance'   -> appears just before that word is heard (at('finance') - 0.1)
 *                      or seconds       2.4         -> that exact moment
 *   icons:             any lucide name  'shield-check', 'landmark', 'brain', ...   (see references/engine-api.md)
 *   colours:           var(--primary) var(--secondary) var(--tertiary) var(--quaternary) or any CSS colour
 *   box:               optional {x,y,w,h} region override; default = the safe content area for the frame shape
 *
 *   rTitle   ({kicker, title, sub, icon, at})                          chapter / topic title card
 *   rSteps   ({heading, items:[{icon,label,sub,at}], goal:{icon,label,at}})   numbered steps with arrows
 *   rFlow    ({nodes:[{icon,label,at,color}], pulse:true})              chain of nodes joined by arrows, a pulse runs through
 *   rGrid    ({items:[{icon,label,at,color}], cols})                    icon cards popping on their words
 *   rCompare ({left:{label,icon,value,at,color}, right:{...}, unit, vs, gapAt, max})   two things side by side (numbers count up)
 *   rBars    ({title, bars:[{label,value,at,flag}], max, unit, ref:{value,label,at}, illustrative})  animated bar chart
 *   rChecklist({title, items:[{label,at}]})                             rows that tick on their words
 *   rStat    ({value, unit, prefix, label, icon, at})                   one big number that counts up
 *   rMythFact({myth:{label,at,stampAt}, fact:{label,at}, mythStamp, factStamp})   myth struck out, fact confirmed
 *
 * All text sizes/positions scale from the frame; check every scene with scripts/qa.py as usual.
 */
(function () {
  const PORT = SH > SW, U = Math.min(SW, SH) / 1080;
  const tm = (s, d = 0.5) => (typeof s === 'number' ? s : (s ? Math.max(0, at(s) - 0.1) : d));
  const BOX = (o) => o.box || (PORT ? { x: CL + 60, y: 300, w: CW - 120, h: SH - 300 - 490 } : { x: CL + 90, y: 190, w: CW - 180, h: 690 });
  const COLS = ['var(--primary)', 'var(--tertiary)', 'var(--secondary)', 'var(--quaternary)'];
  const colr = (o, i) => (o && o.color) || COLS[i % COLS.length];
  const onc = (c) => (c === 'var(--secondary)' ? 'var(--ink)' : '#fff');   // readable icon colour on a chip
  const lab = (t, o) => T(t, Object.assign({ f: 'sans', w: 800, mw: null }, o));
  const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
  const heading = (txt, box, t) => { if (!txt) return 0; const h = add(T(txt, { s: (PORT ? 84 : 70) * U }), CX, box.y - (PORT ? 70 : 46)); reveal(h, t, { st: 0.08 }); return 1; };

  /* ───────── title card ───────── */
  window.rTitle = function (o) {
    const t = tm(o.at, 0.5), cx = CX, cy = SH * (PORT ? 0.40 : 0.47);
    if (o.icon) {
      const ring = add(mk('abs', { width: 330 * U + 'px', height: 330 * U + 'px', borderRadius: '50%', border: `${6 * U}px dashed var(--primary)` }), cx, cy); pop(ring, t, { s0: 0.3, d: 0.8 });
      tl.to(ring, { rotation: 360, duration: D, ease: 'none' }, 0);
      const c = add(chip(o.icon, { size: 230 * U, bg: o.color || 'var(--tertiary)', k: 0.56, c: onc(o.color || 'var(--tertiary)') }), cx, cy); pop(c, t + 0.1, { s0: 0.2, r0: -90, d: 0.8 });
    }
    const ty = cy + (o.icon ? 270 * U : 0);
    const h = add(T(o.title, { s: (PORT ? 120 : 112) * U, mw: CW - 160 }), cx, ty); reveal(h, t + 0.2, { st: 0.1 });
    if (o.kicker) pop(add(tag(o.kicker.toUpperCase(), { bg: 'var(--dark)', s: 30 * U, pad: `${14 * U}px ${34 * U}px` }), cx, cy - (o.icon ? 270 * U : 140 * U)), t - 0.1, { s0: 0.6 });
    if (o.sub) pop(add(T(o.sub, { f: 'sans', s: 40 * U, w: 600, c: 'var(--muted)', mw: CW - 220 }), cx, ty + (PORT ? 180 : 140) * U), t + 0.7, { s0: 0.9, dy: 20 });
  };

  /* ───────── numbered steps ───────── */
  window.rSteps = function (o) {
    const b = BOX(o), n = o.items.length, gapA = 70 * U, hasGoal = !!o.goal;
    const hd = heading(o.heading, b, tm(o.headingAt, 0.4));
    const goalH = hasGoal ? 110 * U : 0;
    if (!PORT) {
      const cw = Math.min(470 * U, (b.w - (n - 1) * gapA) / n), ch = Math.min(470 * U, b.h - goalH - 30), cyy = b.y + (b.h - goalH) / 2 + (hd ? 20 : 0);
      const x0 = CX - ((n - 1) * (cw + gapA)) / 2;
      o.items.forEach((it, i) => {
        const x = x0 + i * (cw + gapA), t = tm(it.at, 0.6 + i * 0.8), c = colr(it, i);
        const card_ = add(card(cw, ch, { r: 36 * U }), x, cyy); pop(card_, t, { s0: 0.8, dy: 40 });
        const nb = add(chip(null, { size: 58 * U, bg: 'var(--dark)' }), 44 * U, 44 * U, card_); nb.textContent = i + 1; nb.style.font = `800 ${30 * U}px/1 'InterV'`; nb.style.color = 'var(--light)';
        add(chip(it.icon || 'sparkles', { size: Math.min(120 * U, cw * 0.3), bg: c, sq: true, k: 0.55, c: onc(c) }), cw / 2, ch * 0.27, card_);
        add(T(it.label, { f: 'sans', s: clampN(cw / 11, 26, 40) * U, w: 800, mw: cw - 56 * U, lh: 1.12 }), cw / 2, ch * (it.sub ? 0.60 : 0.66), card_);
        if (it.sub) add(T(it.sub, { f: 'sans', s: clampN(cw / 17, 20, 26) * U, w: 500, c: 'var(--muted)', mw: cw - 64 * U }), cw / 2, ch * 0.82, card_);
        if (i < n - 1) pop(add(chip('chevron-right', { size: 56 * U, bg: 'var(--dark)', k: 0.6, c: 'var(--light)' }), x + cw / 2 + gapA / 2, cyy), tm(o.items[i + 1].at, 1.2 + i * 0.8) - 0.15, { s0: 0.3 });
      });
      if (hasGoal) pop(add(tag(o.goal.label, { icon: o.goal.icon || 'flag', bg: 'var(--tertiary)', c: '#fff', s: 36 * U, pad: `${18 * U}px ${44 * U}px` }), CX, b.y + b.h - goalH / 2 + 10), tm(o.goal.at, 4), { s0: 0.5 });
    } else {
      const gap = 56 * U, ch = Math.min(300 * U, (b.h - goalH - (n - 1) * gap - 40 * U) / n), cw = b.w, used = n * ch + (n - 1) * gap + (hasGoal ? goalH + 30 * U : 0), y0 = b.y + Math.max(0, (b.h - used) / 2) + (hd ? 24 * U : 0) + ch / 2;
      o.items.forEach((it, i) => {
        const y = y0 + i * (ch + gap), t = tm(it.at, 0.6 + i * 0.8), c = colr(it, i);
        const card_ = add(card(cw, ch, { r: 40 * U }), CX, y); pop(card_, t, { s0: 0.85, dy: 40 });
        const nb = add(chip(null, { size: 54 * U, bg: 'var(--dark)' }), 40 * U, 40 * U, card_); nb.textContent = i + 1; nb.style.font = `800 ${28 * U}px/1 'InterV'`; nb.style.color = 'var(--light)';
        add(chip(it.icon || 'sparkles', { size: ch * 0.52, bg: c, sq: true, k: 0.55, c: onc(c) }), cw * 0.17 + 20 * U, ch / 2, card_);
        add(T(it.label, { f: 'sans', s: 46 * U, w: 800, mw: cw * 0.58, a: 'left', lh: 1.1 }), cw * 0.60, it.sub ? ch * 0.38 : ch / 2, card_);
        if (it.sub) add(T(it.sub, { f: 'sans', s: 30 * U, w: 500, c: 'var(--muted)', mw: cw * 0.58, a: 'left' }), cw * 0.60, ch * 0.72, card_);
        if (i < n - 1) pop(add(chip('chevron-down', { size: 50 * U, bg: 'var(--dark)', k: 0.6, c: 'var(--light)' }), CX, y + ch / 2 + gap / 2), tm(o.items[i + 1].at, 1.2 + i * 0.8) - 0.15, { s0: 0.3 });
      });
      if (hasGoal) pop(add(tag(o.goal.label, { icon: o.goal.icon || 'flag', bg: 'var(--tertiary)', c: '#fff', s: 44 * U, pad: `${22 * U}px ${50 * U}px` }), CX, y0 - ch / 2 + n * ch + (n - 1) * gap + 30 * U + goalH / 2), tm(o.goal.at, 4), { s0: 0.5 });
    }
  };

  /* ───────── chain of nodes ───────── */
  window.rFlow = function (o) {
    const b = BOX(o), n = o.nodes.length, L = svgLayer();
    const hd = heading(o.heading, b, tm(o.headingAt, 0.4));
    const size = clampN((PORT ? b.h : b.w) / n * 0.5, 90 * U, 170 * U);
    const pts = o.nodes.map((nd, i) => PORT ? [CX, b.y + 90 * U + i * ((b.h - 180 * U) / Math.max(1, n - 1))] : [b.x + (b.w / n) * (i + 0.5), b.y + b.h * 0.5]);
    o.nodes.forEach((nd, i) => {
      const [x, y] = pts[i], t = tm(nd.at, 0.6 + i * 0.9), c = colr(nd, i);
      pop(add(chip(nd.icon || 'circle-dot', { size, bg: c, k: 0.52, c: onc(c) }), x, y), t, { s0: 0.3 });
      const l = add(T(nd.label, { f: 'sans', s: (PORT ? 40 : 32) * U, w: 800, mw: PORT ? SW * 0.45 : (b.w / n) - 30 * U, a: PORT ? 'left' : 'center', lh: 1.1 }), PORT ? x + size / 2 + 40 * U + SW * 0.225 : x, PORT ? y : y + size / 2 + 56 * U); pop(l, t + 0.1, { s0: 0.8 });
      if (i > 0) {
        const [px, py] = pts[i - 1], gap = size / 2 + 18 * U;
        PORT ? arrow(L, px, py + gap, x, y - gap, t - 0.35, 0.4, { c: 'var(--dark)', w: 7 * U, hs: 22 * U }) : arrow(L, px + gap, py, x - gap, y, t - 0.35, 0.4, { c: 'var(--dark)', w: 7 * U, hs: 22 * U });
      }
    });
    if (o.pulse !== false && n > 1) {
      const tok = add(chip(null, { size: 34 * U, bg: 'var(--secondary)' }), pts[0][0], pts[0][1]); gsap.set(tok, { autoAlpha: 0 });
      const t0 = tm(o.nodes[n - 1].at, 3) + 0.5; tl.to(tok, { autoAlpha: 1, duration: 0.15 }, t0);
      for (let i = 1; i < n; i++) tl.fromTo(tok, { x: pts[i - 1][0] - pts[0][0], y: pts[i - 1][1] - pts[0][1] }, { x: pts[i][0] - pts[0][0], y: pts[i][1] - pts[0][1], duration: 0.5, ease: 'power2.inOut', immediateRender: false }, t0 + 0.15 + (i - 1) * 0.55);
      tl.to(tok, { autoAlpha: 0, duration: 0.2 }, t0 + 0.2 + (n - 1) * 0.55);
    }
  };

  /* ───────── grid of icon cards ───────── */
  window.rGrid = function (o) {
    const b = BOX(o), n = o.items.length, cols = o.cols || (PORT ? (n > 6 ? 2 : 1) : Math.min(n, n > 6 ? 4 : 3)), rows = Math.ceil(n / cols);
    const hd = heading(o.heading, b, tm(o.headingAt, 0.4)), gap = 36 * U;
    const cw = (b.w - (cols - 1) * gap) / cols, ch = Math.min(PORT ? 220 * U : 230 * U, (b.h - (rows - 1) * gap) / rows), top = b.y + (b.h - (rows * ch + (rows - 1) * gap)) / 2 + (hd ? 24 : 0);
    o.items.forEach((it, i) => {
      const r = Math.floor(i / cols), c = i % cols, inRow = (r === rows - 1) ? n - r * cols : cols;
      const x = CX - ((inRow - 1) * (cw + gap)) / 2 + c * (cw + gap), y = top + ch / 2 + r * (ch + gap), col = colr(it, i);
      const cd = add(card(cw, ch, { r: 34 * U }), x, y); pop(cd, tm(it.at, 0.6 + i * 0.6), { s0: 0.8, dy: 30 });
      const cs = Math.min(ch * 0.55, 120 * U);
      add(chip(it.icon || 'sparkles', { size: cs, bg: col, sq: true, k: 0.55, c: onc(col) }), cs / 2 + 34 * U, ch / 2, cd);
      add(T(it.label, { f: 'sans', s: clampN(cw / 13, 28, 44) * U, w: 800, mw: cw - cs - 100 * U, a: 'left', lh: 1.1 }), cs + 54 * U + (cw - cs - 100 * U) / 2, ch / 2, cd);
    });
  };

  /* ───────── two things side by side ───────── */
  window.rCompare = function (o) {
    const b = BOX(o), unit = o.unit || '', sides = [o.left, o.right], max = o.max || Math.max(sides[0].value || 0, sides[1].value || 0, 1) * 1.15;
    const hd = heading(o.heading, b, tm(o.headingAt, 0.4)), gap = (o.vs !== false ? 130 : 50) * U;
    const cw = PORT ? b.w : (b.w - gap) / 2, ch = PORT ? (b.h - gap) / 2 : Math.min(b.h, 560 * U), cy0 = b.y + b.h / 2 + (hd ? 20 : 0);
    sides.forEach((s, i) => {
      const x = PORT ? CX : CX + (i ? 1 : -1) * (cw / 2 + gap / 2), y = PORT ? b.y + ch / 2 + i * (ch + gap) : cy0, c = s.color || (i ? 'var(--tertiary)' : 'var(--primary)');
      const t = tm(s.at, 0.6 + i * 1.2), cd = add(card(cw, ch, { r: 40 * U }), x, y); pop(cd, t, { s0: 0.85, dy: 40 });
      add(chip(s.icon || 'users', { size: 96 * U, bg: c, k: 0.55, c: onc(c) }), (PORT ? 90 : 80) * U + 10, 72 * U, cd);
      add(T(s.label, { f: 'sans', s: (PORT ? 54 : 44) * U, w: 800, a: 'left', mw: cw - 240 * U }), (PORT ? 90 : 80) * U + 70 * U + (cw - 240 * U) / 2 + 40 * U, 72 * U, cd);
      if (s.value != null) {
        const num = mk('abs t serif', { fontSize: (PORT ? 150 : 128) * U + 'px', fontWeight: 700, color: c }); num.textContent = '0' + unit; add(num, cw / 2, ch * 0.52, cd); num.style.opacity = 0; tl.to(num, { opacity: 1, duration: 0.12 }, t + 0.35);
        counter(num, t + 0.4, 0.9, 0, s.value, v => Math.round(v) + unit);
        const tr = add(mk('abs', { width: cw - 120 * U + 'px', height: 26 * U + 'px', borderRadius: '99px', background: 'var(--hair)' }), cw / 2, ch * 0.83, cd);
        const fl = add(mk('abs', { width: (cw - 120 * U) * (s.value / max) + 'px', height: 26 * U + 'px', borderRadius: '99px', background: c, transformOrigin: '0 50%' }), 60 * U + (cw - 120 * U) * (s.value / max) / 2, ch * 0.83, cd);
        tl.fromTo(fl, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.out' }, t + 0.4);
      }
    });
    if (o.vs !== false) pop(add(tag(o.vsLabel || 'vs', { bg: 'var(--dark)', s: 34 * U, pad: `${14 * U}px ${30 * U}px` }), CX, PORT ? b.y + b.h / 2 : cy0), tm(o.right.at, 1.8) - 0.1, { s0: 0.4 });
    if (typeof sides[0].value === 'number' && typeof sides[1].value === 'number' && o.gap !== false) {
      const d = Math.abs(sides[0].value - sides[1].value);
      pop(add(tag(o.gapLabel || `gap: ${d}${unit === '%' ? ' pts' : unit}`, { icon: 'git-compare', bg: 'var(--secondary)', c: 'var(--ink)', s: 34 * U, pad: `${14 * U}px ${32 * U}px` }), CX, PORT ? b.y + b.h + 50 * U : cy0 + ch / 2 + 48 * U), tm(o.gapAt, tm(o.right.at, 1.8) + 1.6), { s0: 0.5 });
    }
  };

  /* ───────── animated bar chart ───────── */
  window.rBars = function (o) {
    const b = BOX(o), n = o.bars.length, max = o.max || 100, unit = o.unit || '';
    const cd = add(card(b.w, b.h, { r: 40 * U }), CX, b.y + b.h / 2); pop(cd, tm(o.at, 0.5), { s0: 0.9, dy: 40 });
    if (o.title) { const tt = add(T(o.title, { f: 'sans', s: (PORT ? 46 : 36) * U, w: 800, a: 'left' }), 0, 52 * U, cd); tt.style.left = 40 * U + 'px'; gsap.set(tt, { xPercent: 0 }); }
    if (o.illustrative !== false) add(tag('illustrative data', { bg: 'var(--hair)', c: 'var(--muted)', s: 22 * U, pad: `${8 * U}px ${18 * U}px`, sh: false }), b.w - 130 * U, 52 * U, cd);
    const px = 70 * U, py = 130 * U, pw = b.w - 2 * px, ph = b.h - py - 100 * U;
    o.bars.forEach((br, i) => {
      const t = tm(br.at, 0.9 + i * 0.5), flag = br.flag, c = flag ? 'var(--secondary)' : (br.color || 'var(--tertiary)');
      if (!PORT) {
        const bw = Math.min(140 * U, pw / n * 0.6), x = px + (pw / n) * (i + 0.5), hgt = ph * br.value / max;
        const el = add(mk('abs', { width: bw + 'px', height: hgt + 'px', borderRadius: '18px 18px 6px 6px', background: c, transformOrigin: '50% 100%' }), x, py + ph - hgt / 2, cd); tl.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: 'power3.out' }, t);
        pop(add(T(br.value + unit, { f: 'sans', s: 34 * U, w: 800 }), x, py + ph - hgt - 30 * U, cd), t + 0.35, { s0: 0.6, d: 0.35 });
        add(T(br.label, { f: 'sans', s: clampN((pw / n) / 6, 22, 32) * U, w: 700, c: 'var(--muted)', mw: pw / n - 20 * U }), x, py + ph + 44 * U, cd);
        if (flag) pop(add(chip('trending-down', { size: 64 * U, bg: 'var(--danger)', k: 0.55, sq: true, c: '#fff' }), x, py + ph - hgt - 92 * U, cd), t + 0.5, { s0: 0.2, r0: -20 });
      } else {
        const rowH = ph / n, hgt = Math.min(70 * U, rowH * 0.55), y = py + rowH * (i + 0.5), len = (pw - 250 * U) * br.value / max;
        add(T(br.label, { f: 'sans', s: 32 * U, w: 700, a: 'left', c: 'var(--muted)', mw: 200 * U }), px + 100 * U, y - hgt / 2 - 26 * U, cd);
        const el = add(mk('abs', { width: len + 'px', height: hgt + 'px', borderRadius: '14px', background: c, transformOrigin: '0 50%' }), px + len / 2, y + 8 * U, cd); tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power3.out' }, t);
        pop(add(T(br.value + unit, { f: 'sans', s: 36 * U, w: 800 }), px + len + 80 * U, y + 8 * U, cd), t + 0.35, { s0: 0.6, d: 0.35 });
        if (flag) pop(add(chip('trending-down', { size: 56 * U, bg: 'var(--danger)', k: 0.55, sq: true, c: '#fff' }), px + len + 190 * U, y + 8 * U, cd), t + 0.5, { s0: 0.2 });
      }
    });
    if (o.ref) {
      const t = tm(o.ref.at, 3);
      if (!PORT) { const yy = py + ph - ph * o.ref.value / max; const ln = add(mk('abs', { width: pw + 'px', height: '0px', borderTop: `${4 * U}px dashed var(--fg)` }), b.w / 2, yy, cd); ln.style.transformOrigin = '0 50%'; tl.fromTo(ln, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.out' }, t); pop(add(tag(o.ref.label || 'expected', { icon: 'target', bg: 'var(--dark)', s: 24 * U, pad: `${8 * U}px ${20 * U}px` }), b.w - 110 * U, yy - 34 * U, cd), t + 0.3, { s0: 0.6 }); }
      else { const xx = px + (pw - 250 * U) * o.ref.value / max; const ln = add(mk('abs', { width: '0px', height: ph + 'px', borderLeft: `${4 * U}px dashed var(--fg)` }), xx + 0 * U, py + ph / 2, cd); ln.style.transformOrigin = '50% 0'; tl.fromTo(ln, { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: 'power2.out' }, t); pop(add(tag(o.ref.label || 'expected', { icon: 'target', bg: 'var(--dark)', s: 24 * U, pad: `${8 * U}px ${20 * U}px` }), xx, py - 12 * U, cd), t + 0.3, { s0: 0.6 }); }
    }
  };

  /* ───────── checklist ───────── */
  window.rChecklist = function (o) {
    const b = BOX(o), n = o.items.length, rowH = Math.min(PORT ? 150 * U : 112 * U, (b.h - (o.title ? 130 * U : 40 * U)) / n);
    const cardH = rowH * n + (o.title ? 130 * U : 40 * U) + 20 * U, cw = Math.min(b.w, PORT ? b.w : 1280 * U);
    const cd = add(card(cw, cardH, { r: 40 * U }), CX, b.y + b.h / 2); pop(cd, tm(o.at, 0.5), { s0: 0.9, dy: 40 });
    if (o.title) add(T(o.title, { f: 'sans', s: (PORT ? 52 : 42) * U, w: 800 }), cw / 2, 60 * U, cd);
    o.items.forEach((it, i) => {
      const y = (o.title ? 130 * U : 36 * U) + rowH * (i + 0.5), t = tm(it.at, 0.9 + i * 0.7);
      const row = add(mk('abs', { width: cw - 80 * U + 'px', height: rowH - 14 * U + 'px', borderRadius: '24px', background: 'var(--hair)' }), cw / 2, y, cd); pop(row, t - 0.05, { s0: 0.95, dx: 30, dy: 0, a: 0.55 });
      add(T(it.label, { f: 'sans', s: (PORT ? 44 : 36) * U, w: 700, a: 'left', mw: cw - 260 * U }), 40 * U + 100 * U + (cw - 260 * U) / 2 - 20 * U, y, cd);
      const ck = add(chip('check', { size: Math.min(68 * U, rowH * 0.6), bg: 'var(--tertiary)', k: 0.62, sw: 3.4 }), cw - 100 * U, y, cd); pop(ck, t + 0.2, { s0: 0.1, r0: -40 });
      tl.to(row, { opacity: 1, duration: 0.25 }, t + 0.2);
    });
  };

  /* ───────── one big number ───────── */
  window.rStat = function (o) {
    const t = tm(o.at, 0.6), cx = CX, cy = SH * (PORT ? 0.40 : 0.46);
    const glow = add(mk('abs', { width: 640 * U + 'px', height: 640 * U + 'px', borderRadius: '50%', background: 'radial-gradient(circle,color-mix(in srgb,var(--primary) 26%,transparent),transparent 70%)' }), cx, cy); pop(glow, t, { s0: 0.4, d: 0.9 });
    if (o.icon) pop(add(chip(o.icon, { size: 150 * U, bg: o.color || 'var(--tertiary)', k: 0.55, c: onc(o.color || 'var(--tertiary)') }), cx, cy - 250 * U), t, { s0: 0.2, r0: -60 });
    const num = mk('abs t serif', { fontSize: (PORT ? 330 : 300) * U + 'px', fontWeight: 700, color: 'var(--fg)' }); const f = v => (o.prefix || '') + Math.round(v).toLocaleString('en-US') + (o.unit || '');
    num.textContent = f(0); add(num, cx, cy + 20 * U); num.style.opacity = 0; tl.fromTo(num, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, t);
    counter(num, t + 0.1, o.dur || 1.4, o.from || 0, o.value, f);
    if (o.label) pop(add(T(o.label, { f: 'sans', s: (PORT ? 60 : 50) * U, w: 700, c: 'var(--muted)', mw: CW - 200 * U }), cx, cy + 250 * U), t + 0.9, { s0: 0.9, dy: 20 });
  };

  /* ───────── myth vs fact ───────── */
  window.rMythFact = function (o) {
    const b = BOX(o), gap = 60 * U, cw = PORT ? b.w : (b.w - gap) / 2, ch = PORT ? (b.h - gap) / 2 : Math.min(b.h, 520 * U);
    const pos = i => PORT ? [CX, b.y + ch / 2 + i * (ch + gap)] : [CX + (i ? 1 : -1) * (cw / 2 + gap / 2), b.y + b.h / 2];
    const [mx, my] = pos(0), [fx, fy] = pos(1);
    const m = add(card(cw, ch, { r: 40 * U }), mx, my); pop(m, tm(o.myth.at, 0.6), { s0: 0.85, dy: 40 });
    add(chip('circle-help', { size: 100 * U, bg: 'var(--quaternary)', k: 0.55 }), cw / 2, ch * 0.2, m);
    const mt = add(T(o.myth.label, { f: 'sans', s: (PORT ? 52 : 42) * U, w: 800, mw: cw - 100 * U, lh: 1.15 }), cw / 2, ch * 0.5, m);
    const ms = add(stamp(o.mythStamp || 'Myth', { s: (PORT ? 80 : 68) * U }), mx, my + ch * 0.31); slam(ms, tm(o.myth.stampAt, tm(o.fact.at, 3) - 1.0), { rot: -10 });
    tl.to(m, { opacity: 0.42, duration: 0.5 }, tm(o.fact.at, 3) - 0.3);
    const f = add(card(cw, ch, { r: 40 * U }), fx, fy); pop(f, tm(o.fact.at, 3), { s0: 0.85, dx: PORT ? 0 : 70, dy: PORT ? 60 : 0 });
    add(chip('badge-check', { size: 100 * U, bg: 'var(--tertiary)', k: 0.58 }), cw / 2, ch * 0.2, f);
    add(T(o.fact.label, { f: 'sans', s: (PORT ? 52 : 42) * U, w: 800, mw: cw - 100 * U, lh: 1.15 }), cw / 2, ch * 0.5, f);
    pop(add(stamp(o.factStamp || 'Fact', { c: 'var(--tertiary-d)', s: (PORT ? 70 : 58) * U, rot: -6 }), fx, fy + ch * 0.31), tm(o.fact.at, 3) + 0.7, { s0: 0.3, r0: -20 });
  };
})();
