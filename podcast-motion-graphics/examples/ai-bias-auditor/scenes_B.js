/* Segment B — 3:35.5 → 5:16.9 */

/* ───────── B1 · day one at a regional credit firm · not building neural nets alone ───────── */
scene('B1', sd => {
  const L = svgLayer();
  pop(add(tag('HYPOTHETICAL SCENARIO', { icon: 'lightbulb', bg: 'var(--teal2)', s: 28 }), 960, 95), at('hypothetical') - 0.1, { s0: 0.7 });
  const cal = add(card(380, 440, { r: 34, ov: true }), 420, 530);
  add(mk('abs', { width: '380px', height: '112px', background: 'var(--terra)' }), 190, 56, cal); LBL('DAY', 190, 56, cal, { s: 58, w: 800, c: '#fff', ls: 0.14 });
  [90, 290].forEach(x => add(mk('abs', { width: '22px', height: '46px', borderRadius: '11px', background: '#2B2019' }), x, 14, cal));
  const big = add(NUM(214, { c: 'var(--fg)' }), 190, 270, cal); big.textContent = '1';
  LBL('first morning', 190, 395, cal, { s: 30, c: 'var(--muted)' });
  tl.fromTo(cal, { autoAlpha: 0, rotationX: -80, y: -40, transformPerspective: 900, transformOrigin: '50% 0%' }, { autoAlpha: 1, rotationX: 0, y: 0, duration: 0.7, ease: 'back.out(1.5)' }, at('day') - 0.15);

  const org = add(card(500, 440, { r: 34, ov: true }), 1000, 530);
  [[60, 190, 92, '#C96F3F'], [152, 140, 100, '#E8943A'], [252, 250, 112, '#7D5038'], [364, 175, 90, '#2FAFA3']].forEach(([x, hh, w, c], i) => {
    const b = add(mk('abs', { width: w + 'px', height: hh + 'px', background: c, borderRadius: '8px 8px 0 0', transformOrigin: '50% 100%' }), x + w / 2 - 20, 330 - hh / 2, org);
    tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power3.out' }, at('regional') - 0.1 + i * 0.1);
    for (let r = 0; r < Math.floor(hh / 46); r++) for (let cc = 0; cc < 2; cc++) add(mk('abs', { width: '18px', height: '22px', borderRadius: '4px', background: 'rgba(255,255,255,.55)' }), 24 + cc * 38 + (w > 100 ? 4 : 0), 30 + r * 44, b);
  });
  add(mk('abs', { width: '460px', height: '10px', background: 'rgba(125,80,56,.3)', borderRadius: '5px' }), 250, 333, org);
  add(chip('banknote', { size: 76, bg: 'var(--amber)', c: '#2B2019', k: 0.55, sq: true }), 420, 70, org);
  pop(org, at('regional') - 0.2, { s0: 0.8, dy: 50 });
  pop(add(tag('Regional credit firm', { icon: 'landmark', bg: 'var(--espresso)', s: 30 }), 1000, 800), at('credit') - 0.05, { s0: 0.7 });

  const nn = add(card(440, 440, { r: 34 }), 1520, 530);
  const layers = [[3, 80], [4, 220], [3, 360]]; const nodes = [];
  layers.forEach(([n, x], li) => { const arr = []; for (let i = 0; i < n; i++) arr.push([x, 175 + (i - (n - 1) / 2) * 90]); nodes.push(arr); });
  const nl = svgLayer(nn); nl.setAttribute('viewBox', '0 0 440 440'); nl.setAttribute('width', 440); nl.setAttribute('height', 440);
  const lineEls = [];
  for (let li = 0; li < 2; li++) nodes[li].forEach(a => nodes[li + 1].forEach(b => { const p = path(nl, `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`, { c: 'rgba(125,80,56,.35)', w: 3 }); lineEls.push(p); gsap.set(p, { autoAlpha: 0 }); }));
  tl.to(lineEls, { autoAlpha: 1, duration: 0.3, stagger: 0.02 }, at('neural') - 0.1);
  nodes.flat().forEach(([x, y], i) => { const n = add(mk('abs', { width: '34px', height: '34px', borderRadius: '50%', background: i % 3 === 0 ? '#C96F3F' : i % 3 === 1 ? '#E8943A' : '#2FAFA3', boxShadow: '0 4px 8px rgba(0,0,0,.25)' }), x, y, nn); pop(n, at('enterprise') + 0.05 + i * 0.04, { s0: 0.1, d: 0.35 }); });
  LBL('Enterprise\nneural networks', 220, 395, nn, { s: 30, w: 800, lh: 1.1 });
  pop(nn, at('enterprise') - 0.15, { s0: 0.8, dy: 50 });
  const ban = add(chip('ban', { size: 250, bg: 'rgba(0,0,0,0)', c: '#D9503A', k: 0.95, sw: 1.6, shadow: false }), 1520, 520);
  tl.fromTo(ban, { autoAlpha: 0, scale: 2.2 }, { autoAlpha: 1, scale: 1, duration: 0.32, ease: 'power4.in' }, at('networks') + 0.1);
  tl.to(nn, { opacity: 0.55, duration: 0.3 }, at('networks') + 0.4);
  const you = add(chip('user-round', { size: 96, bg: 'var(--terra)', k: 0.52 }), 1520, 800); pop(you, at('you') - 0.1, { s0: 0.4 });
  pop(add(T('on your own', { f: 'sans', s: 32, w: 800, c: 'var(--red)' }), 1670, 800), at('on') - 0.05, { s0: 0.7 });
});

/* ───────── B2 · supervision · open-source, de-identified dataset ───────── */
scene('B2', sd => {
  const L = svgLayer();
  const ins = add(T('_Instead,_', { s: 150, c: 'var(--acc)' }), 960, 450); pop(ins, 0.5, { s0: 0.5, d: 0.7, ease: 'elastic.out(1,0.55)', blur: 8 }); gone(ins, at('under') - 0.15, { s: 0.7, dy: -110, d: 0.4 });
  const sen = add(chip('user-check', { size: 170, bg: 'var(--walnut)', k: 0.5 }), 340, 400); pop(sen, at('under') + 0.05);
  const ring = add(mk('abs', { width: '210px', height: '210px', borderRadius: '50%', border: '5px solid #F2A65A' }), 340, 400); tl.fromTo(ring, { autoAlpha: 0.9, scale: 1 }, { autoAlpha: 0, scale: 1.5, duration: 1, repeat: 6, repeatDelay: 0.4, ease: 'power2.out' }, at('supervision') + 0.2);
  pop(add(T('Senior validation\nengineer', { f: 'sans', s: 32, w: 800, lh: 1.12 }), 340, 560), at('senior') - 0.1, { s0: 0.8 });
  pop(add(tag('supervision', { icon: 'eye', bg: '#F2A65A', c: '#2B2019', s: 26 }), 340, 265), at('supervision') - 0.1, { s0: 0.6 });
  const you = add(chip('user-round', { size: 120, bg: 'var(--terra)', k: 0.52 }), 340, 760); pop(you, at('you') - 0.1);
  pop(add(T('You', { f: 'sans', s: 32, w: 800 }), 340, 850), at('you'), { s0: 0.8 });
  drawOn(L, 'M 340 610 L 340 690', at('you') - 0.15, 0.5, { c: '#F2A65A', w: 6, dash: '3 14' });

  const tb = add(card(900, 560, { r: 34 }), 1230, 540); pop(tb, at('reviewing') - 0.15, { s0: 0.85, dy: 40 });
  LBL('Evaluation dataset', 270, 60, tb, { s: 38, w: 800 });
  const cols = [['Person', 120], ['Region', 350], ['Score', 520], ['Outcome', 740]];
  cols.forEach(([n, x]) => LBL(n.toUpperCase(), x, 130, tb, { s: 20, w: 700, c: 'var(--muted)', ls: 0.1 }));
  add(mk('abs', { width: '820px', height: '3px', background: 'rgba(246,236,223,.2)' }), 450, 152, tb);
  const names = ['Ada L.', 'Ben K.', 'Cora M.', 'Dev P.', 'Eli R.', 'Fay T.'], ids = ['ID-4021', 'ID-1187', 'ID-7342', 'ID-0958', 'ID-5516', 'ID-2673'], reg = ['R1', 'R2', 'R3', 'R1', 'R4', 'R2'], sc = ['712', '655', '698', '603', '741', '630'], ok = [1, 0, 1, 0, 1, 1];
  names.forEach((n, i) => {
    const y = 205 + i * 56;
    if (i % 2 === 0) add(mk('abs', { width: '820px', height: '48px', borderRadius: '12px', background: 'rgba(246,236,223,.06)' }), 450, y, tb);
    const a = LBL(n, 120, y, tb, { s: 27, w: 600 }), b = LBL(ids[i], 120, y, tb, { s: 24, w: 700, c: '#F2A65A' }); gsap.set(b, { autoAlpha: 0 });
    tl.to(a, { autoAlpha: 0, duration: 0.25 }, at('de') + i * 0.07); tl.to(b, { autoAlpha: 1, duration: 0.25 }, at('de') + 0.1 + i * 0.07);
    LBL(reg[i], 350, y, tb, { s: 26, w: 600 }); LBL(sc[i], 520, y, tb, { s: 26, w: 600 });
    add(chip(ok[i] ? 'check' : 'x', { size: 38, bg: ok[i] ? '#2FAFA3' : '#D9503A', k: 0.65, sw: 3.2 }), 740, y, tb);
  });
  const mag = mk('abs'); mag.appendChild(ico('search', 110, '#F2A65A', 2.2)); add(mag, 1100, 420);
  tl.fromTo(mag, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, at('reviewing') + 0.3);
  tl.to(mag, { x: 120, y: 110, duration: 0.9, ease: 'sine.inOut' }, at('reviewing') + 0.5); tl.to(mag, { x: -40, y: 230, duration: 0.9, ease: 'sine.inOut' }, at('reviewing') + 1.4);
  gone(mag, at('de') - 0.15);
  pop(add(tag('open source', { icon: 'git-branch', bg: 'var(--teal2)', s: 28 }), 1020, 840), at('open') - 0.05, { s0: 0.7 });
  pop(add(tag('de-identified', { icon: 'eye-off', bg: '#F2A65A', c: '#2B2019', s: 28 }), 1380, 840), at('de') - 0.05, { s0: 0.7 });
});

/* ───────── B3 · slice the numbers into geographic brackets ───────── */
scene('B3', sd => {
  const L = svgLayer();
  const sup = add(chip('user-check', { size: 140, bg: 'var(--walnut)', k: 0.5 }), 260, 400); pop(sup, at('supervisor') - 0.15);
  pop(add(T('Your supervisor', { f: 'sans', s: 30, w: 800 }), 260, 495), at('supervisor') + 0.1, { s0: 0.8 });
  const bub = add(card(360, 120, { r: 28 }), 290, 640); pop(bub, at('asks') - 0.05, { s0: 0.6, dx: -20 });
  add(chip('scissors', { size: 62, bg: 'var(--terra)', k: 0.55, sq: true }), 62, 60, bub); LBL('Slice by\nregion', 235, 60, bub, { s: 32, w: 800, lh: 1.1 });
  // map split into 4 brackets
  const map = add(mk('abs', { width: '520px', height: '480px' }), 960, 520);
  const blob = 'M 80 120 C 120 40 260 30 330 70 C 400 40 480 90 470 170 C 500 240 460 330 400 380 C 340 450 220 450 160 400 C 90 380 40 300 60 220 C 40 180 60 150 80 120 Z';
  const bands = [0, 1, 2, 3].map(i => {
    const w = mk('abs', { left: 0, top: 0, width: '520px', height: '480px', clipPath: `inset(${i * 120}px 0 ${(3 - i) * 120}px 0)` });
    w.innerHTML = `<svg width="520" height="480" viewBox="0 0 520 480" style="position:absolute;left:0;top:0"><path d="${blob}" fill="${['#E8C9A6', '#E2B98E', '#DDA877', '#E8C9A6'][i]}" stroke="#7D5038" stroke-width="3"/><path d="M 120 ${70 + i * 8} q 60 40 120 10 t 140 20 M 200 40 q 20 120 -10 240 M 330 60 q -30 100 20 220 M 90 250 q 150 -40 330 20" fill="none" stroke="rgba(125,80,56,.4)" stroke-width="3" stroke-dasharray="2 8"/><circle cx="${150 + i * 55}" cy="${150 + (i % 2) * 120}" r="9" fill="#C96F3F"/><circle cx="${320 - i * 25}" cy="${190 + (i % 3) * 40}" r="8" fill="#7D5038"/></svg>`;
    map.appendChild(w); return w;
  });
  pop(map, at('asks') + 0.1, { s0: 0.8, dy: 40 });
  // slice lines
  const lines = [1, 2, 3].map(i => { const l = add(mk('abs', { width: '560px', height: '5px', background: 'var(--red)', transformOrigin: '0 50%', borderRadius: '3px' }), 960, 280 + i * 120); tl.fromTo(l, { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'power3.out' }, at('slice') + (i - 1) * 0.2); tl.to(l, { autoAlpha: 0, duration: 0.2 }, at('numbers') + 0.55); return l; });
  const sc = mk('abs'); sc.appendChild(ico('scissors', 80, '#D9503A', 2.4)); add(sc, 660, 400);
  tl.fromTo(sc, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, y: 0, duration: 0.2 }, at('slice')); tl.to(sc, { y: 240, duration: 0.8, ease: 'power1.inOut' }, at('slice') + 0.1); gone(sc, at('across'), { dy: 0, s: 0.5 });
  bands.forEach((b, i) => tl.to(b, { y: (i - 1.5) * 26, duration: 0.6, ease: 'power3.inOut' }, at('numbers') + 0.1));
  const vals = [70, 64, 36, 66];
  [0, 1, 2, 3].forEach(i => {
    const y = 400 + i * 120 + (i - 1.5) * 26 - 120 + 60 - 0; const yy = 280 + 60 + i * 120 + (i - 1.5) * 26;
    const row = add(mk('abs', { width: '330px', height: '70px' }), 1560, yy);
    LBL('Bracket ' + 'ABCD'[i], 60, 35, row, { s: 26, w: 800, c: 'var(--muted)' });
    const tr = add(mk('', { width: '190px', height: '26px', borderRadius: '13px', background: 'rgba(125,80,56,.15)' }), 235, 35, row);
    const bar = add(mk('', { width: vals[i] * 1.9 + 'px', height: '26px', borderRadius: '13px', background: i === 2 ? '#D9503A' : '#2FAFA3', transformOrigin: '0 50%' }), 140 + vals[i] * 0.95, 35, row);
    tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.out' }, at('different') + 0.25 + i * 0.28); pop(row, at('different') + 0.1 + i * 0.28, { s0: 0.9, dx: 30, dy: 0 });
    if (i === 2) { const ex = add(mk('abs', { width: '600px', height: '120px', border: '6px solid #D9503A', borderRadius: '30px', boxShadow: '0 0 40px rgba(217,80,58,.5)' }), 1370, yy + 0); gsap.set(ex, { autoAlpha: 0 }); tl.to(ex, { autoAlpha: 1, duration: 0.2 }, at('potential') - 0.1); tl.to(ex, { scale: 1.03, duration: 0.35, yoyo: true, repeat: 5, ease: 'sine.inOut' }, at('potential')); }
  });
  const al = add(chip('triangle-alert', { size: 100, bg: '#D9503A', c: '#fff', k: 0.55 }), 1750, 440); pop(al, at('anomalies') - 0.2, { s0: 0.2, r0: -30 });
  const mg = mk('abs'); mg.appendChild(ico('search', 110, '#C0612F', 2.2)); add(mg, 1180, 310); tl.fromTo(mg, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, at('spot') - 0.2); tl.to(mg, { y: 130, x: 20, duration: 0.8, ease: 'sine.inOut' }, at('spot') + 0.1);
  pop(add(T('anomaly?', { f: 'sans', s: 34, w: 800, c: 'var(--red)' }), 1750, 530), at('anomalies') + 0.05, { s0: 0.6 });
});

/* ───────── B4 · lower approval rates in some postal regions ───────── */
scene('B4', sd => {
  const fl = add(chip('flask-conical', { size: 150, bg: 'var(--teal2)', k: 0.55 }), 960, 330); pop(fl, at('hypothetical') - 0.15, { s0: 0.3, r0: -30 }); gone(fl, at('you') - 0.15, { dy: -80 });
  const hx = add(T('Hypothetical *exercise*', { s: 118 }), 960, 520); reveal(hx, 0, { times: [at('hypothetical') - 0.05, at('exercise') - 0.05] }); gone(hx, at('you') - 0.15, { dy: -80, s: 0.8 });
  pop(add(tag('HYPOTHETICAL EXERCISE', { icon: 'flask-conical', bg: 'var(--teal2)', s: 26 }), 960, 62), at('you') + 0.2, { s0: 0.7 });
  const h = hero('What you *observe*', { move: at('applicants') - 0.25, big: 1.6, yc: 450, yTop: 150 });
  reveal(h, 0, { times: [at('you') - 0.15, at('you') + 0.2, at('observe') - 0.05] });
  const ch = add(card(1280, 560, { r: 36 }), 960, 560); pop(ch, at('applicants') - 0.15, { s0: 0.88, dy: 50 });
  LBL('Approval rate by postal region', 330, 52, ch, { s: 34, w: 800 });
  pop(add(tag('illustrative data', { bg: 'rgba(246,236,223,.14)', c: 'var(--muted)', s: 22, pad: '8px 18px', sh: false }), 1105, 52, ch), at('postal') + 0.3, { s0: 0.8 });
  const base = 470, maxh = 330, vals = [78, 74, 46, 76, 43, 79], bw = 120;
  for (let i = 0; i < 6; i++) {
    const x = 165 + i * 172, low = vals[i] < 60, hgt = maxh * vals[i] / 100;
    const b = add(mk('', { width: bw + 'px', height: hgt + 'px', borderRadius: '16px 16px 6px 6px', background: '#2FAFA3', transformOrigin: '50% 100%' }), x, base - hgt / 2, ch);
    tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'power3.out' }, at('postal') + 0.15 + i * 0.16);
    LBL('P' + (i + 1), x, base + 30, ch, { s: 26, w: 700, c: 'var(--muted)' });
    const v = LBL(vals[i] + '%', x, base - hgt - 28, ch, { s: 30, w: 800 }); pop(v, at('postal') + 0.5 + i * 0.16, { s0: 0.6, d: 0.35 });
    if (low) { tl.to(b, { backgroundColor: '#E8943A', duration: 0.3 }, at('lower') + (i === 2 ? 0 : 0.35)); const ar = add(chip('trending-down', { size: 66, bg: '#D9503A', c: '#fff', k: 0.55, sq: true }), x, base - hgt - 85, ch); pop(ar, at('lower') + (i === 2 ? 0.1 : 0.45), { s0: 0.2, r0: -20 }); }
  }
  add(mk('abs', { width: '1020px', height: '2px', background: 'rgba(246,236,223,.25)' }), 590, base + 3, ch);
  const ey = base - maxh * 0.7; const ex = add(mk('abs', { width: '1020px', height: '0px', borderTop: '4px dashed #F6ECDF' }), 590, ey, ch); ex.style.transformOrigin = '0 50%';
  tl.fromTo(ex, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.out' }, at('than') - 0.1);
  pop(add(tag('expected', { icon: 'target', bg: '#F6ECDF', c: '#2B2019', s: 26, pad: '8px 20px' }), 1160, ey - 36, ch), at('expected') - 0.1, { s0: 0.6 });
});

/* ───────── B5 · is the neighbourhood code a proxy for segregation? ───────── */
scene('B5', sd => {
  const L = svgLayer();
  [[0, 0], [75, 40], [-75, 40]].forEach(([dx, dy], i) => { const p = add(chip('user-round', { size: 112, bg: ['var(--terra)', 'var(--teal2)', 'var(--amber)'][i], k: 0.52, c: i === 2 ? '#2B2019' : '#fff' }), 290 + dx, 440 + dy); pop(p, at('working') - 0.1 + i * 0.12, { s0: 0.3 }); });
  pop(add(tag('Your team', { icon: 'users-round', bg: 'var(--espresso)', s: 30 }), 290, 640), at('team') - 0.1, { s0: 0.7 });
  const code = add(card(400, 230, { r: 32 }), 820, 400); pop(code, at('neighborhood') - 0.15, { s0: 0.75, dy: 40 });
  add(chip('map-pin', { size: 86, bg: 'var(--terra)', k: 0.55, sq: true }), 80, 80, code); LBL('Neighborhood\ncode', 270, 80, code, { s: 32, w: 800, lh: 1.1 });
  const pill = add(mk('abs', { background: 'var(--espresso)', color: '#F6ECDF', borderRadius: '14px', padding: '10px 26px', font: "800 42px/1 'InterV'", letterSpacing: '.08em', whiteSpace: 'nowrap' }), 200, 175, code); pill.textContent = 'XY-4021'; pop(pill, at('codes') - 0.05, { s0: 0.7 });
  const mp = add(card(640, 500, { r: 36 }), 1450, 530); pop(mp, at('historical') - 0.15, { s0: 0.85, dx: 60, dy: 0 });
  LBL('Historical demographic\nsegregation', 320, 62, mp, { s: 32, w: 800, lh: 1.1 });
  const pal = ['#C96F3F', '#2FAFA3', '#E8943A'];
  const grid = [[0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1], [0, 0, 2, 1, 1, 1], [2, 2, 2, 2, 1, 1], [2, 2, 2, 2, 2, 2]];
  grid.forEach((row, r) => row.forEach((v, c) => { const t = add(mk('abs', { width: '82px', height: '58px', borderRadius: '12px', background: pal[v], opacity: 0.9 }), 74 + c * 90 + 16, 150 + r * 66, mp); pop(t, at('demographic') - 0.1 + (r + c) * 0.045, { s0: 0.2, d: 0.35 }); }));
  const lk = drawOn(L, 'M 1020 420 C 1090 420 1100 500 1130 540', at('proxy') - 0.2, 0.7, { c: '#C0612F', w: 8, dash: '2 16' });
  pop(add(tag('proxy variable?', { icon: 'link', bg: '#C0612F', s: 32, pad: '14px 30px' }), 900, 640), at('proxy') - 0.1, { s0: 0.6 });
  const mg = mk('abs'); mg.appendChild(ico('search', 120, '#7D5038', 2.2)); add(mg, 860, 560); tl.fromTo(mg, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, at('investigate') - 0.1); tl.to(mg, { x: 120, y: -60, duration: 1.2, ease: 'sine.inOut' }, at('investigate') + 0.3); gone(mg, at('proxy') - 0.1, { dy: 0 });
  // highlight matching patches
  [[0, 0], [1, 3], [3, 1]].forEach(([r, c], i) => { const hl = add(mk('abs', { width: '92px', height: '68px', border: '5px solid #fff', borderRadius: '16px', boxShadow: '0 0 24px rgba(255,255,255,.9)' }), 74 + c * 90 + 16, 150 + r * 66, mp); gsap.set(hl, { autoAlpha: 0 }); tl.to(hl, { autoAlpha: 1, duration: 0.25, yoyo: true, repeat: 3 }, at('segregation') - 0.5 + i * 0.25); });
});

const GRP = () => { const g = mk('abs', { left: 0, top: 0, width: '1920px', height: '1080px' }); R.appendChild(g); gsap.set(g, { xPercent: 0, yPercent: 0 }); return g; };

/* ───────── B6 · document → draft → propose ───────── */
scene('B6', sd => {
  const L = svgLayer();
  const steps = [
    [420, 'notebook-pen', '#C96F3F', 'Document the\nexact variance', 'document', 1],
    [960, 'file-text', '#2FAFA3', 'Draft an\naudit memo', 'draft', 2],
    [1500, 'sliders-horizontal', '#E8943A', 'Propose boundary\nconstraints', 'propose', 3]];
  steps.forEach(([x, icon, col, title, w, n]) => {
    const c = add(card(440, 440, { r: 36 }), x, 490); pop(c, at(w) - 0.2, { s0: 0.8, dy: 50 });
    add(chip(icon, { size: 92, bg: col, k: 0.55, sq: true, c: col === '#E8943A' ? '#2B2019' : '#fff' }), 220, 85, c);
    const nb = add(chip(null, { size: 56, bg: '#F6ECDF' }), 48, 48, c); nb.textContent = n; nb.style.font = "800 30px/1 'InterV'"; nb.style.color = '#2B2019';
    LBL(title, 220, 190, c, { s: 34, w: 800, lh: 1.1 });
    if (n === 1) { // bell curve with spread
      const s = svgLayer(c); drawOn(s, 'M 80 400 C 130 400 150 270 220 270 C 290 270 310 400 360 400', at(w) + 0.3, 0.9, { c: '#C96F3F', w: 7 });
      path(s, 'M 60 404 L 380 404', { c: 'rgba(246,236,223,.35)', w: 4 });
      drawOn(s, 'M 150 345 L 290 345 M 150 335 L 150 355 M 290 335 L 290 355', at('variance') - 0.2, 0.5, { c: '#F6ECDF', w: 5 });
      pop(LBL('σ²', 220, 322, c, { s: 34, w: 800, c: '#F6ECDF' }), at('variance') + 0.1, { s0: 0.4 });
    }
    if (n === 2) { [[330, 220], [370, 280], [410, 190]].forEach(([y, w2], i) => { const ln = add(mk('', { width: w2 + 'px', height: '16px', borderRadius: '8px', background: i === 0 ? '#2FAFA3' : 'rgba(246,236,223,.4)', transformOrigin: '0 50%' }), 220 - 110 + w2 / 2 - 30 + 30, y - 40 + i * 0, c); tl.fromTo(ln, { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, at('memorandum') - 0.5 + i * 0.25); ln.style.top = (300 + i * 40) + 'px'; });
      pop(add(tag('MEMO', { bg: '#F6ECDF', c: '#2B2019', s: 22, pad: '6px 16px', sh: false }), 340, 270, c), at('audit') - 0.1, { s0: 0.6 }); }
    if (n === 3) {
      add(mk('', { width: '320px', height: '12px', borderRadius: '6px', background: 'rgba(246,236,223,.22)' }), 220, 360, c);
      const rg = add(mk('', { width: '160px', height: '12px', borderRadius: '6px', background: '#E8943A', transformOrigin: '50% 50%' }), 220, 360, c); tl.fromTo(rg, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.out' }, at('boundary') - 0.1);
      [140, 300].forEach((px, i) => { const k = add(mk('', { width: '38px', height: '38px', borderRadius: '50%', background: '#F6ECDF', boxShadow: '0 6px 12px rgba(0,0,0,.5)' }), 220, 360, c); tl.fromTo(k, { x: 0 }, { x: px - 220, duration: 0.5, ease: 'power3.out' }, at('boundary') - 0.1); });
      LBL('min', 140, 410, c, { s: 22, c: 'var(--muted)' }); LBL('max', 300, 410, c, { s: 22, c: 'var(--muted)' });
    }
  });
  arrow(L, 650, 490, 730, 490, at('help') - 0.2, 0.35, { c: '#F2A65A', w: 7, hs: 18 }); arrow(L, 1190, 490, 1270, 490, at('and') - 0.1, 0.35, { c: '#F2A65A', w: 7, hs: 18 });
  [420, 960, 1500].forEach((x, i) => drawOn(L, `M ${x} 715 C ${x} 760 ${960 + (x - 960) * 0.25} 745 ${960 + (x - 960) * 0.2} 775`, at('senior') - 0.3 + i * 0.1, 0.5, { c: '#F2A65A', w: 5, dash: '3 12' }));
  const se = add(tag('Senior engineers evaluate', { icon: 'user-check', bg: '#F2A65A', c: '#2B2019', s: 36, pad: '18px 40px' }), 960, 815); pop(se, at('senior') - 0.1, { s0: 0.6 });
  const ck = add(chip('badge-check', { size: 84, bg: 'var(--teal)', k: 0.58 }), 1330, 815); pop(ck, at('evaluate') - 0.1, { s0: 0.2, r0: -60 });
});

/* ───────── B7 · supervision makes it practical · tools evolve, foundation stays ───────── */
scene('B7', sd => {
  const L = svgLayer();
  const g1 = GRP();
  const h = add(T('Supervision makes it *practical*', { s: 92 }), 960, 330, g1); reveal(h, 0, { times: [at('supervision') - 0.1, at('makes') - 0.1, at('that') - 0.05, at('practical') - 0.1] });
  const sen = add(chip('user-check', { size: 130, bg: 'var(--walnut)', k: 0.5 }), 640, 620, g1), you = add(chip('user-round', { size: 130, bg: 'var(--terra)', k: 0.5 }), 1280, 620, g1), eye = add(chip('eye', { size: 100, bg: 'var(--amber)', c: '#2B2019', k: 0.55 }), 960, 620, g1);
  [[sen, 0.9], [eye, 1.15], [you, 1.3]].forEach(([e, dt]) => pop(e, at('supervision') + dt - 0.9, { s0: 0.3 }));
  drawOn(svgLayer(g1), 'M 710 620 L 890 620 M 1030 620 L 1210 620', at('involved') - 0.2, 0.6, { c: 'var(--terra)', w: 7, dash: '3 14' });
  pop(add(T('Senior', { f: 'sans', s: 28, w: 800 }), 640, 715, g1), at('supervision'), { s0: 0.8 }); pop(add(T('You', { f: 'sans', s: 28, w: 800 }), 1280, 715, g1), at('involved'), { s0: 0.8 });
  const pr = add(chip('badge-check', { size: 150, bg: 'var(--teal)', k: 0.6 }), 960, 800 - 20, g1); pop(pr, at('practical') - 0.1, { s0: 0.2, r0: -80, d: 0.7 });
  tl.to(g1, { autoAlpha: 0, scale: 0.94, duration: 0.45, ease: 'power2.in' }, at('as') - 0.4);
  // part 2 — tools evolve
  const hdr = add(T('As tools *evolve*', { s: 74 }), 960, 118); reveal(hdr, 0, { times: [at('as') - 0.05, at('underlying') - 0.05, at('evolve') - 0.1] });
  const icons = [['hammer', 'wrench'], ['wrench', 'cpu'], ['cpu', 'bot'], ['bot', 'sparkles']];
  icons.forEach(([a, b], i) => {
    const x = 465 + i * 330; const c = add(card(270, 190, { r: 32 }), x, 345); pop(c, at('tools') - 0.1 + i * 0.12, { s0: 0.7, dy: 40 });
    const ia = add(chip(a, { size: 90, bg: ['#C96F3F', '#2FAFA3', '#E8943A', '#7D5038'][i], k: 0.55, sq: true, c: i === 2 ? '#2B2019' : '#fff' }), 135, 72, c);
    const ib = add(chip(b, { size: 90, bg: ['#2FAFA3', '#E8943A', '#7D5038', '#C96F3F'][i], k: 0.55, sq: true, c: i === 1 ? '#2B2019' : '#fff' }), 135, 72, c); gsap.set(ib, { autoAlpha: 0, rotation: -90, scale: 0.4 });
    const la = LBL('Tool v' + (i + 1), 135, 150, c, { s: 28, w: 800 }), lb = LBL('Tool v' + (i + 2), 135, 150, c, { s: 28, w: 800, c: 'var(--acc)' }); gsap.set(lb, { autoAlpha: 0 });
    const te = at('evolve') + i * 0.14;
    tl.to([ia, la], { autoAlpha: 0, scale: 0.4, rotation: 90, duration: 0.3 }, te); tl.to(ib, { autoAlpha: 1, rotation: 0, scale: 1, duration: 0.4, ease: 'back.out(1.8)' }, te + 0.1); tl.to(lb, { autoAlpha: 1, duration: 0.3 }, te + 0.2);
  });
  const rf = add(chip('refresh-cw', { size: 76, bg: 'var(--terra)', k: 0.55 }), 960, 480); pop(rf, at('evolve') - 0.1, { s0: 0.2 }); tl.to(rf, { rotation: 720, duration: 2.4, ease: 'power2.inOut' }, at('evolve'));
  const sl = add(card(1400, 220, { r: 40, solid: true }), 960, 700); pop(sl, at('foundational') - 0.25, { s0: 0.9, dy: 80 });
  LBL('FOUNDATIONAL SKILLS', 700, 38, sl, { s: 24, w: 800, ls: 0.2, c: '#F2A65A' });
  [['chart-no-axes-column', 'Data literacy', '#C96F3F'], ['code-xml', 'Scripting', '#2FAFA3'], ['handshake', 'Socio-technical\nreasoning', '#E8943A']].forEach(([ic, tx, col], i) => { const x = 250 + i * 450; add(chip(ic, { size: 92, bg: col, k: 0.55, sq: true, c: i === 2 ? '#2B2019' : '#fff' }), x - 110, 130, sl); LBL(tx, x + 80, 130, sl, { s: 32, w: 800, lh: 1.1, c: '#F6ECDF' }); });
  pop(add(tag('relevant?', { icon: 'check', bg: 'var(--teal)', c: '#fff', s: 34, pad: '14px 32px' }), 780, 530), at('relevant') - 0.1, { s0: 0.5 });
  pop(add(tag('obsolete?', { icon: 'x', bg: '#8B7468', c: '#fff', s: 34, pad: '14px 32px' }), 1140, 530), at('obsolete') - 0.1, { s0: 0.5 });
});

/* ───────── B8 · the tool can find variance, but can't define fairness ───────── */
scene('B8', sd => {
  const L = svgLayer();
  const tool = add(card(420, 460, { r: 36 }), 400, 510); pop(tool, at('automated') - 0.1, { s0: 0.8 });
  add(chip('cpu', { size: 100, bg: 'var(--terra)', k: 0.55, sq: true }), 210, 80, tool); LBL('Automated tool', 210, 170, tool, { s: 34, w: 800 });
  [60, 110, 80, 140, 70].forEach((hh, i) => { const b = add(mk('', { width: '46px', height: hh + 'px', borderRadius: '10px 10px 4px 4px', background: i === 3 ? '#E8943A' : '#2FAFA3', transformOrigin: '50% 100%' }), 80 + i * 65, 390 - hh / 2, tool); tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power3.out' }, at('identify') + i * 0.1); });
  add(mk('abs', { width: '340px', height: '3px', background: 'rgba(246,236,223,.25)' }), 210, 392, tool);
  pop(add(tag('variance found', { icon: 'check', bg: 'var(--teal)', c: '#fff', s: 26, pad: '10px 24px' }), 210, 440, tool), at('mathematical') - 0.1, { s0: 0.6 });
  const wall = add(mk('abs', { width: '0px', height: '520px', borderLeft: '6px dashed rgba(217,80,58,.9)' }), 960, 520); tl.fromTo(wall, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power3.out' }, at('but') - 0.1);
  const arw = arrow(L, 635, 520, 925, 520, at('they') - 0.1, 0.5, { c: '#F2A65A', w: 9 });
  const bx = add(chip('x', { size: 120, bg: '#D9503A', k: 0.6, sw: 3.4 }), 960, 520); pop(bx, at('cannot') + 0.15, { s0: 0.2, r0: -40 }); tl.to(bx, { x: 6, duration: 0.06, yoyo: true, repeat: 5, ease: 'none' }, at('cannot') + 0.7);
  pop(add(T('cannot define', { f: 'sans', s: 30, w: 800, c: '#F08A76' }), 960, 612), at('define') - 0.05, { s0: 0.7 });
  const com = add(mk('abs', { width: '600px', height: '600px', borderRadius: '50%', border: '4px dashed rgba(47,175,163,.7)', background: 'radial-gradient(circle,rgba(47,175,163,.18),rgba(47,175,163,0) 70%)' }), 1480, 520); pop(com, at('what') - 0.1, { s0: 0.6, dy: 0 });
  const pts = [[0, -140], [150, -60], [140, 100], [0, 170], [-150, 90], [-150, -70], [0, 10]];
  const pe = pts.map(([dx, dy], i) => { const p = add(chip('user-round', { size: 78, bg: ['#C96F3F', '#2FAFA3', '#E8943A', '#7D5038', '#2FAFA3', '#C96F3F', '#F2A65A'][i], k: 0.55, c: i === 6 ? '#2B2019' : '#fff' }), 1480 + dx, 520 + dy); pop(p, at('fairness') - 0.2 + i * 0.07, { s0: 0.2 }); tl.to(p, { y: i % 2 ? -10 : 10, duration: 1.2 + (i % 3) * 0.2, yoyo: true, repeat: 4, ease: 'sine.inOut' }, at('fairness') + 0.2); return p; });
  const sl = svgLayer(); [[0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]].forEach(([a, b], i) => { const p = drawOn(sl, `M ${1480 + pts[a][0]} ${520 + pts[a][1]} L ${1480 + pts[b][0]} ${520 + pts[b][1]}`, at('public') - 0.1 + i * 0.03, 0.4, { c: 'rgba(246,236,223,.3)', w: 3 }); });
  pop(add(tag('what fairness requires', { icon: 'scale', bg: '#F6ECDF', c: '#2B2019', s: 28 }), 1340, 250), at('fairness') - 0.1, { s0: 0.6 });
  pop(add(tag('public context', { icon: 'globe', bg: 'var(--teal)', c: '#fff', s: 28 }), 1640, 330), at('public') - 0.1, { s0: 0.6 });
  pop(add(tag('living community', { icon: 'heart', bg: '#E8943A', c: '#2B2019', s: 30 }), 1480, 830), at('living') - 0.1, { s0: 0.6 });
});

/* ───────── B9 · balancing accuracy and equity ───────── */
scene('B9', sd => {
  const L = svgLayer();
  const post = add(mk('abs', { width: '20px', height: '330px', borderRadius: '10px', background: 'var(--espresso)' }), 960, 430); pop(post, at('balancing') - 0.1, { s0: 1, dy: 60 });
  const base = add(mk('abs', { width: '300px', height: '38px', borderRadius: '19px', background: 'var(--espresso)' }), 960, 612); pop(base, at('balancing') - 0.1, { s0: 0.6 });
  const piv = add(chip(null, { size: 54, bg: 'var(--amber)' }), 960, 280);
  const beam = add(mk('abs', { width: '800px', height: '20px', borderRadius: '10px', background: 'var(--espresso)' }), 960, 280); gsap.set(beam, { rotation: -9 }); pop(beam, at('balancing') - 0.05, { s0: 1, dy: 0, r0: -9, r: -9 });
  const mkPan = (x, icon, txt, col, t, off, dark) => {
    const p = add(mk('abs', { width: '340px', height: '170px' }), x, 480); const st = add(mk('', { width: '5px', height: '170px', background: 'var(--espresso)' }), 170, -10, p);
    const cd = add(card(340, 150, { r: 30 }), 170, 105, p); add(chip(icon, { size: 84, bg: col, k: 0.55, sq: true, c: dark ? '#2B2019' : '#fff' }), 70, 75, cd); LBL(txt, 232, 75, cd, { s: 30, w: 800, lh: 1.1 });
    gsap.set(p, { y: off }); pop(p, t, { s0: 0.6, dy: 40 }); return p;
  };
  const pl = mkPan(580, 'target', 'Predictive\naccuracy', '#C96F3F', at('predictive') - 0.1, 62, false); const pr = mkPan(1340, 'scale', 'Equity', '#2FAFA3', at('equity') - 0.1, -62, false);
  tl.to(pl, { y: 0, duration: 0.9, ease: 'elastic.out(1,0.55)' }, at('demands') - 0.1); tl.to(pr, { y: 0, duration: 0.9, ease: 'elastic.out(1,0.55)' }, at('demands') - 0.1); tl.to(beam, { rotation: 0, duration: 0.9, ease: 'elastic.out(1,0.55)' }, at('demands') - 0.1);
  [[520, 'brain', 'Contextual\nhuman judgment', 'contextual', '#C96F3F'], [960, 'gavel', 'Legal\nliteracy', 'legal', '#E8943A'], [1400, 'messages-square', 'Communication', 'communication', '#2FAFA3']].forEach(([x, ic, tx, w, col], i) => {
    const c = add(card(380, 140, { r: 30 }), x, 790); pop(c, at(w) - 0.15, { s0: 0.7, dy: 50 }); add(chip(ic, { size: 80, bg: col, k: 0.55, sq: true, c: i === 1 ? '#2B2019' : '#fff' }), 72, 70, c); LBL(tx, 248, 70, c, { s: 29, w: 800, lh: 1.1 });
    drawOn(L, `M ${x} 720 C ${x} 680 ${960 + (x - 960) * 0.25} 690 ${960 + (x - 960) * 0.2} 635`, at(w), 0.5, { c: '#C0612F', w: 5, dash: '3 12' });
  });
});

/* ───────── B10 · software changes, the core skills transfer ───────── */
scene('B10', sd => {
  const L = svgLayer();
  const vers = [['wrench', '#C96F3F'], ['hammer', '#2FAFA3'], ['cpu', '#E8943A'], ['bot', '#7D5038']]; const vc = [];
  vers.forEach(([ic, col], i) => {
    const x = 450 + i * 340; const c = add(card(290, 150, { r: 30 }), x, 250); pop(c, [at('testing'), at('software'), at('change') - 0.1, at('over') + 0.05][i] - 0.1, { s0: 0.7, dy: 40 });
    add(chip(ic, { size: 80, bg: col, k: 0.55, sq: true, c: i === 2 ? '#2B2019' : '#fff' }), 70, 75, c); LBL('Testing\nsoftware v' + (i + 1), 205, 75, c, { s: 27, w: 800, lh: 1.1 }); vc.push(c);
    if (i < 3) drawOn(L, `M ${x + 160} 250 L ${x + 180} 250`, at('over'), 0.2, { c: '#F2A65A', w: 6 });
  });
  pop(add(tag('changes over time', { icon: 'refresh-cw', bg: 'var(--terra)', s: 30 }), 960, 100), at('change') - 0.1, { s0: 0.6 });
  const core = add(card(1500, 270, { r: 44 }), 960, 640); pop(core, at('core') - 0.25, { s0: 0.9, dy: 70 });
  pop(add(tag('Core capability', { icon: 'star', bg: '#F2A65A', c: '#2B2019', s: 30 }), 360, 520), at('core') + 0.05, { s0: 0.6 });
  [['search', 'Question\ndata sources', 'question', '#C96F3F'], ['scan-search', 'Evaluate\nedge cases', 'evaluate', '#2FAFA3'], ['landmark', 'Translate findings\ninto clear policy', 'translate', '#E8943A']].forEach(([ic, tx, w, col], i) => {
    const x = 330 + i * 480; const s = add(card(430, 150, { r: 30, solid: true }), x - 960 + 960 - 0, 0); s.remove(); // placeholder (kept simple)
    const sk = add(mk('abs', { width: '430px', height: '150px', borderRadius: '30px', background: 'rgba(246,236,223,.09)', border: '2px solid rgba(246,236,223,.18)' }), 510 + i * 450, 665); pop(sk, at(w) - 0.15, { s0: 0.7, dy: 40 });
    add(chip(ic, { size: 84, bg: col, k: 0.55, sq: true, c: i === 2 ? '#2B2019' : '#fff' }), 70, 75, sk); LBL(tx, 265, 75, sk, { s: 30, w: 800, lh: 1.1 });
  });
  vc.forEach((c, i) => { const x = 450 + i * 340; drawOn(L, `M ${x} 330 L ${x} 505`, at('transfers') + i * 0.3, 0.5, { c: '#F2A65A', w: 6, dash: '3 12' });
    const dot = add(chip(null, { size: 26, bg: '#F2A65A' }), x, 505); gsap.set(dot, { autoAlpha: 0 }); tl.to(dot, { autoAlpha: 1, duration: 0.1 }, at('transfers') + i * 0.3); tl.to(dot, { y: -175, duration: 0.55, ease: 'power2.in' }, at('transfers') + i * 0.3 + 0.1); tl.to(dot, { autoAlpha: 0, duration: 0.1 }, at('transfers') + i * 0.3 + 0.62);
    tl.to(c, { boxShadow: '0 0 0 4px #F2A65A, 0 0 40px rgba(242,166,90,.7)', duration: 0.25 }, at('transfers') + i * 0.3 + 0.65); });
  pop(add(tag('transfers across every iteration', { icon: 'infinity', bg: '#F6ECDF', c: '#2B2019', s: 30 }), 960, 835), at('every') - 0.1, { s0: 0.6 });
});
