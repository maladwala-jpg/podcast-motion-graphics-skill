/* Segment A — 1:49.5 → 3:28.2 */
const NUM = (size, o = {}) => { const e = mk('abs t ' + (o.f || 'serif'), { fontSize: size + 'px', fontWeight: o.w || 700, color: o.c || 'var(--fg)', textAlign: 'center' }); e.textContent = o.t != null ? o.t : '0'; return e; };
const LBL = (t, x, y, par, o = {}) => add(T(t, Object.assign({ f: 'sans', s: 30, w: 700 }, o)), x, y, par);

/* ───────── A1 · scripts → sorting → finance / public services / hiring ───────── */
scene('A1', sd => {
  const L = svgLayer();
  const ex = add(T('_Exactly._', { s: 190, c: 'var(--acc)' }), 960, 470);
  pop(ex, 0.5, { s0: 0.5, d: 0.7, ease: 'elastic.out(1,0.55)', blur: 8 });
  gone(ex, at('we') - 0.1, { s: 0.7, dy: -120, d: 0.4 });
  const h = hero('Automated tools are *moving*', { move: at('basic') - 0.25, big: 1.55, yc: 480 });
  reveal(h, 0, { times: [at('watching') - 0.05, at('automated') - 0.12, at('tools') + 0.3, at('move') - 0.15] });

  const win = add(card(560, 400, { solid: true, r: 30 }), 400, 520);
  [['#E8943A', 40], ['#F6ECDF', 70], ['#2FAFA3', 100]].forEach(([c, x]) => add(mk('', { width: '16px', height: '16px', borderRadius: '50%', background: c, opacity: 0.9 }), x, 38, win));
  const rows = [[0, 230, '#E8943A'], [40, 300, '#F6ECDF'], [40, 190, '#2FAFA3'], [80, 260, '#F6ECDF'], [80, 150, '#C96F3F'], [40, 320, '#F6ECDF'], [0, 200, '#E8943A']];
  const lines = rows.map(([ind, w, c], i) => { const b = mk('', { position: 'absolute', left: 44 + ind + 'px', top: 92 + i * 40 + 'px', width: w + 'px', height: '18px', borderRadius: '9px', background: c, opacity: c === '#F6ECDF' ? 0.55 : 0.95, transformOrigin: '0 50%' }); win.appendChild(b); return b; });
  pop(win, at('basic') - 0.1, { s0: 0.8, dy: 40, rot: -2 });
  lines.forEach((b, i) => tl.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 0.28, ease: 'power2.out' }, at('basic') + 0.3 + i * 0.12));
  pop(add(tag('Basic office scripts', { icon: 'code-xml', bg: 'var(--terra)' }), 400, 790), at('office') - 0.05, { s0: 0.7 });

  const sorter = add(card(300, 300, { r: 46 }), 960, 520);
  const gear = mk('abs'); gear.appendChild(ico('cog', 170, 'var(--terra)', 1.7)); add(gear, 150, 150, sorter);
  const ring = add(mk('abs', { width: '300px', height: '300px', borderRadius: '46px', border: '5px solid var(--terra)' }), 150, 150, sorter);
  tl.fromTo(ring, { autoAlpha: 0.9, scale: 1 }, { autoAlpha: 0, scale: 1.35, duration: 0.8, ease: 'power2.out', repeat: 9, repeatDelay: 0.25 }, at('into') + 0.3);
  pop(sorter, at('into') + 0.1, { s0: 0.7 });
  tl.fromTo(gear, { rotation: 0 }, { rotation: 360 * 3, duration: D - at('into'), ease: 'none' }, at('into') + 0.1);
  drawOn(L, 'M 700 520 L 800 520', at('into') - 0.1, 0.4, { c: 'var(--terra)', w: 8 });
  pop(add(tag('Sorting', { icon: 'filter', bg: 'var(--espresso)' }), 960, 730), at('sorting') - 0.05, { s0: 0.7 });

  [['Finance', 'landmark', 330, 'finance', '#C96F3F'], ['Public services', 'building-2', 520, 'public', '#2FAFA3'], ['Hiring', 'briefcase-business', 710, 'hiring', '#E8943A']].forEach(([name, icon, y, word, col], i) => {
    const c = add(card(480, 150, { r: 32 }), 1560, y);
    add(chip(icon, { size: 92, sq: true, bg: col }), 84, 75, c);
    add(T(name, { f: 'sans', s: 44, w: 800, a: 'left' }), 305, 75, c);
    drawOn(L, `M 1110 520 C 1190 520 1190 ${y} 1315 ${y}`, at('processes') + 0.1 + i * 0.12, 0.5, { c: col, w: 7, dash: '2 14' });
    pop(c, at('processes') + 0.1 + i * 0.1, { s0: 0.85, a: 0.45, dx: 60, dy: 0 });
    const tt = at(word) - 0.05;
    tl.to(c, { autoAlpha: 1, scale: 1.05, duration: 0.2, ease: 'power2.out' }, tt);
    tl.to(c, { scale: 1, duration: 0.25, ease: 'power2.inOut' }, tt + 0.2);
    for (let k = 0; k < 2; k++) {
      const tok = add(chip('user-round', { size: 62, bg: col, k: 0.55 }), 1110, 520);
      tl.fromTo(tok, { autoAlpha: 0, scale: 0.4, x: 0, y: 0 }, { autoAlpha: 1, scale: 1, duration: 0.15 }, clamp(tt - 0.25 + k * 0.28));
      tl.to(tok, { x: 150, y: y - 520, duration: 0.5, ease: 'power2.inOut' }, clamp(tt - 0.15 + k * 0.28));
      tl.to(tok, { autoAlpha: 0, scale: 0.2, duration: 0.12 }, clamp(tt + 0.38 + k * 0.28));
    }
  });
});

/* ───────── A2 · what an AI bias auditor does ───────── */
scene('A2', sd => {
  const L = svgLayer();
  const h = hero('AI Bias *Auditor*', { move: at('specialists') - 0.35, big: 1.75, yc: 430 });
  reveal(h, 0, { times: [at('ai') - 0.1, at('bias') - 0.1, at('auditor') - 0.1] });
  const sub = add(tag('an emerging functional label', { bg: 'var(--terra)', s: 36, pad: '14px 32px' }), 960, 590);
  pop(sub, at('emerging') - 0.05, { s0: 0.7 }); gone(sub, at('specialists') - 0.55, { dy: 10 });

  const sp = add(chip('user-search', { size: 150, bg: 'var(--terra)', k: 0.5 }), 250, 560); pop(sp, at('specialists') - 0.1);
  pop(add(T('Specialist', { f: 'sans', s: 34, w: 800 }), 250, 668), at('specialists') + 0.1, { s0: 0.8 });

  const org = add(mk('abs', { width: '1260px', height: '560px', border: '4px dashed rgba(232,148,58,.75)', borderRadius: '44px', background: 'rgba(255,255,255,.035)' }), 1070, 565);
  pop(org, at('organizations') - 0.15, { s0: 0.94, dy: 0, d: 0.7 });
  const orgSolid = add(mk('abs', { width: '1260px', height: '560px', border: '5px solid #F2A65A', borderRadius: '44px', boxShadow: '0 0 60px rgba(232,148,58,.45), inset 0 0 40px rgba(232,148,58,.15)' }), 1070, 565);
  gsap.set(orgSolid, { autoAlpha: 0 });
  pop(add(tag('Organization', { icon: 'building-2', bg: 'var(--amber)', c: '#2B2019' }), 640, 285), at('organizations'), { s0: 0.7 });
  arrow(L, 335, 565, 425, 565, at('assist') - 0.05, 0.45, { c: 'var(--amber)', w: 8 });
  pop(add(T('assist', { f: 'sans', s: 26, w: 700, c: 'var(--amber)' }), 380, 520), at('assist') + 0.1, { s0: 0.8 });

  const p1 = add(card(320, 400, { r: 30 }), 680, 590); pop(p1, at('testing') - 0.1, { s0: 0.85 });
  add(chip('sliders-horizontal', { size: 64, bg: 'var(--terra)', k: 0.55 }), 160, 62, p1);
  LBL('Algorithmic\nparameters', 160, 142, p1, { s: 27, lh: 1.15, w: 800 });
  const sl = (y, a, b, c, col) => {
    add(mk('', { width: '240px', height: '12px', borderRadius: '6px', background: 'rgba(246,236,223,.2)' }), 160, y, p1);
    const fl = add(mk('', { width: '240px', height: '12px', borderRadius: '6px', background: col, transformOrigin: '0 50%' }), 160, y, p1);
    const kn = add(mk('', { width: '38px', height: '38px', borderRadius: '50%', background: '#F6ECDF', boxShadow: '0 6px 12px rgba(0,0,0,.45)' }), 40, y, p1);
    gsap.set(fl, { scaleX: a }); gsap.set(kn, { x: a * 240 });
    const t0 = at('testing'); [[b, 0.7], [c, 1.3], [a + 0.15, 1.9]].forEach(([k, dt]) => { tl.to(fl, { scaleX: k, duration: 0.6, ease: 'sine.inOut' }, t0 + dt); tl.to(kn, { x: k * 240, duration: 0.6, ease: 'sine.inOut' }, t0 + dt); });
  };
  sl(240, 0.25, 0.7, 0.45, '#E8943A'); sl(305, 0.7, 0.3, 0.8, '#2FAFA3'); sl(365, 0.45, 0.85, 0.3, '#C96F3F');
  arrow(L, 845, 590, 905, 590, at('training') - 0.15, 0.3, { c: 'var(--amber)', w: 7, hs: 18 });

  const p2 = add(card(320, 400, { r: 30 }), 1070, 590); pop(p2, at('training') - 0.1, { s0: 0.85 });
  add(chip('database', { size: 64, bg: 'var(--teal2)', k: 0.55 }), 160, 62, p2);
  LBL('Training\ndatasets', 160, 142, p2, { s: 27, lh: 1.15, w: 800 });
  const g = dots(7, 5, 38, 11, '#2FAFA3'); add(g, 160, 275, p2);
  g.dots.forEach((d, i) => { if (i % 7 === 6 || (i % 7 > 4 && i % 2 === 0)) d.style.background = '#C96F3F'; });
  tl.fromTo(g.dots, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(2)', stagger: 0.015 }, at('training') + 0.2);
  const mag = mk('abs'); mag.appendChild(ico('search', 120, '#F2A65A', 2.2)); add(mag, 1010, 640);
  tl.fromTo(mag, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, at('datasets') + 0.7);
  tl.to(mag, { x: 120, y: -70, duration: 0.8, ease: 'sine.inOut' }, at('identify') - 0.4);
  tl.to(mag, { x: 30, y: 30, duration: 0.8, ease: 'sine.inOut' }, at('identify') + 0.5);
  gone(mag, at('under') - 0.1);
  arrow(L, 1235, 590, 1295, 590, at('identify') - 0.2, 0.3, { c: 'var(--amber)', w: 7, hs: 18 });

  const p3 = add(card(320, 400, { r: 30 }), 1460, 590); pop(p3, at('identify') - 0.05, { s0: 0.85 });
  LBL('Unfair\nskew', 110, 62, p3, { s: 28, w: 800, lh: 1.1 });
  [[100, 200, '#2FAFA3', 'A'], [220, 100, '#C96F3F', 'B']].forEach(([x, hgt, c, n], i) => {
    const b = add(mk('', { width: '80px', height: hgt + 'px', borderRadius: '14px 14px 6px 6px', background: c, transformOrigin: '50% 100%' }), x, 340 - hgt / 2, p3);
    tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.55, ease: 'power3.out' }, at('identify') + 0.25 + i * 0.12);
    LBL(n, x, 365, p3, { s: 26, c: 'var(--muted)' });
  });
  const warn = add(chip('triangle-alert', { size: 70, bg: '#E8943A', c: '#2B2019', k: 0.55, sq: true }), 262, 62, p3);
  pop(warn, at('unfair') - 0.1, { s0: 0.3, r0: -30 });
  tl.fromTo(warn, { rotation: 0 }, { rotation: 8, duration: 0.07, yoyo: true, repeat: 5, ease: 'none', immediateRender: false }, at('unfair') + 0.4);

  tl.to(orgSolid, { autoAlpha: 1, duration: 0.5 }, at('under') - 0.05);
  pop(add(tag('Rigorous supervision', { icon: 'shield-check', bg: '#F2A65A', c: '#2B2019', s: 32 }), 1440, 285), at('rigorous') - 0.1, { s0: 0.6 });
  pop(add(chip('eye', { size: 92, bg: 'var(--terra)', k: 0.55 }), 960, 215), at('rigorous'), { s0: 0.3 });
});

/* ───────── A3 · "what are the hard facts?" — gates on the road ───────── */
scene('A3', sd => {
  const L = svgLayer();
  const s1 = add(T('_Sounds_ *significant…*', { s: 138 }), 960, 440);
  reveal(s1, 0, { times: [at('sounds') + 0.05, at('significant') - 0.05], dy: 30 });
  gone(s1, at('but') - 0.15, { s: 0.8, dy: -90 });
  const h = hero('The hard *facts* on getting started', { move: at('does') - 0.3, big: 1.45, yc: 450 });
  reveal(h, 0, { times: [at('the'), at('hard') - 0.1, at('facts') - 0.1, at('on'), at('getting') - 0.05, at('started') - 0.1] });

  road(L, 'M 340 610 C 620 540 760 690 980 610 S 1400 540 1600 610', at('does') + 0.3, 1.6, { w: 44, c: '#E2CBB3' });
  const stu = add(chip('graduation-cap', { size: 172, bg: 'var(--terra)', k: 0.52 }), 240, 600); pop(stu, at('does') + 0.1);
  pop(add(tag('Entry-level student', { icon: 'user-round', bg: 'var(--espresso)', s: 30 }), 240, 745), at('student') - 0.1, { s0: 0.7 });
  const g1 = add(card(350, 270, { r: 34 }), 790, 590); pop(g1, at('elite') - 0.15, { s0: 0.6, dy: 60 });
  add(chip('crown', { size: 110, bg: 'var(--amber)', c: '#2B2019', k: 0.55 }), 175, 85, g1); LBL('Elite\nbackground?', 175, 195, g1, { s: 36, w: 800, lh: 1.1 });
  const g2 = add(card(390, 270, { r: 34 }), 1230, 600); pop(g2, at('doctorate') - 0.15, { s0: 0.6, dy: 60 });
  add(chip('sigma', { size: 110, bg: 'var(--teal2)', k: 0.55 }), 195, 85, g2); LBL('Doctorate in\nmathematics?', 195, 195, g2, { s: 36, w: 800, lh: 1.1 });
  [[g1, 'elite', 930, 470], [g2, 'doctorate', 1415, 480]].forEach(([c, w, x, y]) => {
    const q = add(chip(null, { size: 78, bg: 'var(--red)' }), x, y); q.textContent = '?'; q.style.font = "800 52px/1 'InterV'"; q.style.color = '#fff';
    pop(q, at(w) + 0.25, { s0: 0.2, r0: -25 }); tl.to(q, { rotation: 10, duration: 0.18, yoyo: true, repeat: 7, ease: 'sine.inOut' }, at(w) + 0.9);
  });
  const flag = add(chip('flag', { size: 150, bg: 'var(--teal)', k: 0.52 }), 1690, 560); pop(flag, at('onto') - 0.15);
  tl.to(stu, { x: 140, y: 6, duration: 0.8, ease: 'power2.inOut' }, at('step') + 0.1);
});

/* ───────── A4 · many routes in ───────── */
scene('A4', sd => {
  const L = svgLayer();
  const h = hero('Entry requirements *vary* *widely*', { move: at('while') - 0.2, big: 1.5, yc: 450 });
  reveal(h, 0, { times: [at('entry') - 0.1, at('requirements') - 0.1, at('vary') - 0.1, at('widely') - 0.1] });
  const upY = 395, loY = 705, sx = 230, gx = 1700, cy = 550;
  const you = add(chip('user-round', { size: 128, bg: 'var(--terra)', k: 0.52 }), sx, cy); pop(you, at('while') - 0.1);
  pop(LBL('You', sx, cy + 98, null, { s: 30, c: 'var(--muted)' }), at('while'), { s0: 0.7 });
  const goal = add(chip('flag', { size: 128, bg: 'var(--teal)', k: 0.52 }), gx, cy); pop(goal, at('degrees') + 0.1);
  pop(LBL('AI bias auditing', gx, cy + 98, null, { s: 28, c: 'var(--muted)' }), at('degrees') + 0.2, { s0: 0.7 });
  const r1 = `M ${sx + 64} ${cy} C ${sx + 170} ${cy} ${sx + 150} ${upY} ${sx + 290} ${upY} L ${gx - 290} ${upY} C ${gx - 150} ${upY} ${gx - 170} ${cy} ${gx - 64} ${cy}`;
  const r2 = `M ${sx + 64} ${cy} C ${sx + 170} ${cy} ${sx + 150} ${loY} ${sx + 290} ${loY} L ${gx - 290} ${loY} C ${gx - 150} ${loY} ${gx - 170} ${cy} ${gx - 64} ${cy}`;
  road(L, r1, at('degrees') - 0.1, 3.2, { w: 46, c: '#E2CBB3' });
  road(L, r2, at('alternative') - 0.1, 3.4, { w: 46, c: '#BFE0DA' });
  const lane = (txt, x, y, col, t) => pop(add(T(txt, { f: 'sans', s: 26, w: 800, ls: 0.16, c: col }), x, y), t, { s0: 0.8 });
  lane('DEGREES', 1000, upY - 100, 'var(--terra2)', at('degrees') - 0.1);
  lane('ALTERNATIVE PATHWAYS', 1000, loY + 100, 'var(--teal2)', at('alternative'));
  const rc = (icon, txt, x, y, col, t) => { const c = add(card(310, 130, { r: 30 }), x, y); add(chip(icon, { size: 80, sq: true, bg: col }), 66, 65, c); LBL(txt, 212, 65, c, { s: 29, w: 800, lh: 1.1 }); pop(c, t - 0.1, { s0: 0.7, dy: 30 }); };
  rc('code-xml', 'Computer\nscience', 640, upY, '#C96F3F', at('computer'));
  rc('chart-no-axes-column', 'Statistics', 980, upY, '#C96F3F', at('statistics'));
  rc('landmark', 'Public\npolicy', 1320, upY, '#C96F3F', at('public'));
  rc('award', 'Modular\ncertificates', 640, loY, '#2FAFA3', at('modular'));
  rc('scale', 'University\nethics labs', 980, loY, '#2FAFA3', at('university'));
  rc('git-branch', 'Open-source\ncommunities', 1320, loY, '#2FAFA3', at('open'));
});

/* ───────── A5a · three skills blend ───────── */
scene('A5a', sd => {
  const h = hero('Foundational *skills*', { move: at('core') - 0.2, big: 1.6, yc: 440 });
  reveal(h, 0, { times: [at('foundational') - 0.1, at('skills') - 0.1] });
  const mkCircle = (col, x, y, t) => { const c = mk('abs', { width: '350px', height: '350px', borderRadius: '50%', background: col, opacity: 0.62, mixBlendMode: 'multiply' }); add(c, x, y); pop(c, t, { s0: 0.3, a: 0.62, d: 0.7 }); return c; };
  const c1 = mkCircle('#C96F3F', 560, 570, at('core') - 0.1), c2 = mkCircle('#2FAFA3', 1360, 570, at('introductory') - 0.1), c3 = mkCircle('#E8943A', 960, 720, at('socio') - 0.1);
  const sv = svgLayer(c1); drawOn(sv, 'M 60 235 C 115 235 135 105 175 105 C 215 105 235 235 290 235', at('statistical') - 0.1, 1.0, { c: '#2B211B', w: 8 });
  path(sv, 'M 40 240 L 310 240', { c: 'rgba(43,33,27,.5)', w: 5 });
  const i2 = mk('abs'); i2.appendChild(ico('braces', 150, '#17504A', 2)); add(i2, 175, 175, c2); pop(i2, at('introductory') + 0.2, { s0: 0.3 });
  const i3 = mk('abs'); i3.appendChild(ico('users-round', 130, '#7A3E10', 2)); add(i3, 175, 175, c3); pop(i3, at('socio') + 0.2, { s0: 0.3 });
  const t1 = add(tag('Data literacy', { icon: 'chart-no-axes-column', bg: 'var(--terra)', s: 32 }), 560, 340); pop(t1, at('data') - 0.1, { s0: 0.7 });
  const t2 = add(tag('Introductory scripting', { icon: 'code-xml', bg: 'var(--teal2)', s: 32 }), 1360, 340); pop(t2, at('introductory'), { s0: 0.7 });
  const t3 = add(tag('Socio-technical reasoning', { icon: 'handshake', bg: '#B8691A', s: 32 }), 960, 850); pop(t3, at('socio') + 0.1, { s0: 0.7 });
  const tc = at('with') + 0.55;
  tl.to(c1, { x: 280, y: -70, duration: 0.9, ease: 'power3.inOut' }, tc); tl.to(c2, { x: -280, y: -70, duration: 0.9, ease: 'power3.inOut' }, tc); tl.to(c3, { y: -50, duration: 0.9, ease: 'power3.inOut' }, tc);
  tl.to(t1, { x: 120, y: 60, duration: 0.9, ease: 'power3.inOut' }, tc); tl.to(t2, { x: -120, y: 60, duration: 0.9, ease: 'power3.inOut' }, tc);
  pop(add(chip('star', { size: 120, bg: '#2B2019', c: '#F2A65A', k: 0.55 }), 960, 560), tc + 0.8, { s0: 0.2, r0: -90, d: 0.7 });
});

/* ───────── A5b · calculate disparate impact ───────── */
scene('A5b', sd => {
  pop(add(T('WHAT MATTERS', { f: 'sans', s: 30, w: 800, ls: 0.22, c: 'var(--amber)' }), 960, 48), at('what') - 0.05, { s0: 0.8 });
  const h = hero('Calculate *disparate* *impact*', { move: at('impact') + 0.35, big: 1.5, yc: 440 });
  reveal(h, 0, { times: [at('calculate') - 0.1, at('disparate') - 0.1, at('impact') - 0.1] });
  const grp = (x, name, ok, col, t) => {
    const c = add(card(460, 430, { r: 36 }), x, 560); pop(c, t - 0.15, { s0: 0.85, dy: 40 });
    add(chip('users', { size: 70, bg: col, k: 0.55 }), 70, 62, c); LBL(name, 250, 62, c, { s: 42, w: 800 });
    const g = dots(5, 2, 62, 24, col); add(g, 230, 190, c);
    g.dots.forEach((d, i) => { if (i >= ok) { d.style.background = 'transparent'; d.style.border = '4px solid rgba(246,236,223,.38)'; } });
    tl.fromTo(g.dots, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(2.2)', stagger: 0.04 }, t + 0.1);
    const n = NUM(104, { c: col }); add(n, 230, 335, c); n.style.opacity = 0; tl.to(n, { opacity: 1, duration: 0.15 }, t + 0.35);
    counter(n, t + 0.4, 0.8, 0, ok * 10, v => Math.round(v) + '%');
    LBL('approved', 230, 395, c, { s: 26, c: 'var(--muted)' });
  };
  grp(470, 'Group A', 8, '#2FAFA3', at('comparing')); grp(1450, 'Group B', 5, '#E8943A', at('decision') + 0.2);
  const bd = add(mk('abs', { background: '#F6ECDF', color: '#2B2019', borderRadius: '99px', padding: '16px 34px', boxShadow: '0 18px 30px -12px rgba(0,0,0,.6)' }), 960, 540);
  bd.innerHTML = `<span style="font:800 38px/1 'InterV';white-space:nowrap">50% ÷ 80% = <span style="color:#C0612F">0.63</span></span>`;
  pop(bd, at('across') - 0.05, { s0: 0.5 });
  pop(add(T('illustrative numbers', { f: 'sans', s: 24, w: 600, c: 'var(--muted)' }), 960, 600), at('across') + 0.2, { s0: 0.9 });
});

/* ───────── A6 · ivory tower myth vs practical verification ───────── */
scene('A6', sd => {
  const h = hero('Algorithmic safety = *ivory* *tower*?', { move: at('ivory') - 0.4, big: 1.4, yc: 450 });
  reveal(h, 0, { times: [at('algorithmic') - 0.1, at('safety') - 0.1, at('purely') - 0.05, at('ivory') - 0.1, at('tower') - 0.1] });
  const tw = mk('abs', { width: '360px', height: '560px' }); add(tw, 520, 560);
  const part = (css, html) => { const e = mk('', Object.assign({ position: 'absolute' }, css), html); tw.appendChild(e); return e; };
  [[110, 470, 150, 70], [190, 480, 120, 60], [40, 495, 130, 60], [240, 500, 110, 55]].forEach(([x, y, w, hh]) => part({ left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px', borderRadius: '50%', background: '#fff', boxShadow: '0 10px 20px rgba(60,30,10,.18)' }));
  part({ left: '85px', top: '430px', width: '190px', height: '40px', borderRadius: '10px', background: '#E9DCC2' });
  part({ left: '105px', top: '150px', width: '150px', height: '290px', borderRadius: '6px', background: 'linear-gradient(90deg,#F7EEDB,#EFE3C9 60%,#E4D5B6)', boxShadow: '0 12px 24px rgba(60,30,10,.2)' });
  [200, 280, 360].forEach(y => part({ left: '160px', top: y + 'px', width: '40px', height: '58px', borderRadius: '20px 20px 4px 4px', background: '#B7A07A' }));
  part({ left: '95px', top: '95px', width: '170px', height: '70px', borderRadius: '85px 85px 0 0', background: '#C96F3F' });
  part({ left: '178px', top: '30px', width: '5px', height: '70px', background: '#7D5038' });
  part({ left: '183px', top: '34px', width: '0', height: '0', borderTop: '16px solid transparent', borderBottom: '16px solid transparent', borderLeft: '46px solid #E8943A' });
  pop(tw, at('ivory') - 0.1, { s0: 0.6, dy: 60 });
  pop(add(tag('Ivory tower', { icon: 'graduation-cap', bg: 'var(--espresso)' }), 520, 870), at('tower'), { s0: 0.7 });
  const myth = add(stamp('Myth', { s: 74 }), 520, 520); slam(myth, at('discipline') + 0.15, { rot: -12 });
  tl.to(tw, { opacity: 0.35, duration: 0.5 }, at('but') - 0.2);
  const pc = add(card(640, 530, { r: 36 }), 1390, 565); pop(pc, at('real') - 0.1, { s0: 0.85, dx: 80, dy: 0 });
  add(chip('building-2', { size: 84, bg: 'var(--terra)', k: 0.55, sq: true }), 76, 76, pc); LBL('Real organizations', 372, 76, pc, { s: 38, w: 800 });
  [['Run the tests', 'need'], ['Check against the data', 'practical'], ['Verify in practice', 'verification']].forEach(([txt, w], i) => {
    const y = 200 + i * 105;
    const row = add(mk('abs', { width: '560px', height: '86px', borderRadius: '22px', background: 'rgba(125,80,56,.09)' }), 320, y, pc); LBL(txt, 270, 43, row, { s: 31, w: 700, a: 'left' });
    const ck = add(chip('check', { size: 56, bg: 'var(--teal)', k: 0.62, sw: 3.2 }), 500, 43, row); pop(row, at(w) - 0.1, { s0: 0.9, dx: 40, dy: 0 }); pop(ck, at(w) + 0.25, { s0: 0.2 });
  });
  const vf = add(stamp('Verified', { c: 'var(--teal2)', s: 54, rot: -6 }), 1500, 800); slam(vf, at('verification') + 0.35, { rot: -6 });
});

/* ───────── A7 · hands-on, reproducible, documented ───────── */
scene('A7', sd => {
  const L = svgLayer();
  const h = hero('Hands-on. *Reproducible.*', { move: at('model') - 0.15, big: 1.55, yc: 440 });
  reveal(h, 0, { times: [at('hands') - 0.05, at('reproducible') - 0.1] });
  const doc = add(card(430, 500, { r: 30 }), 440, 520); pop(doc, at('model') - 0.1, { s0: 0.8, dy: 50, rot: -2 });
  add(chip('file-check', { size: 70, bg: 'var(--terra)', k: 0.55, sq: true }), 70, 64, doc);
  LBL('Model risk\ndocumentation', 275, 64, doc, { s: 30, w: 800, lh: 1.1 });
  [['Scope', 0], ['Method', 1], ['Results', 2], ['Limits', 3]].forEach(([n, i]) => {
    const y = 160 + i * 80; LBL(n, 100, y, doc, { s: 24, w: 700, c: 'var(--muted)', a: 'left' });
    add(mk('', { width: 230 - i * 20 + 'px', height: '14px', borderRadius: '7px', background: 'rgba(246,236,223,.25)' }), 300 - i * 10, y + 28, doc);
    add(mk('', { width: '34px', height: '34px', borderRadius: '10px', border: '3px solid rgba(246,236,223,.45)' }), 375, y, doc);
    pop(add(chip('check', { size: 34, bg: 'var(--teal)', k: 0.7, sw: 3.5, sq: true }), 375, y, doc), at('model') + 0.6 + i * 0.35, { s0: 0.1 });
  });
  const cur = mk('abs'); cur.appendChild(ico('mouse-pointer-2', 64, '#F6ECDF', 2)); cur.firstChild.style.fill = '#F2A65A'; add(cur, 650, 450);
  tl.fromTo(cur, { autoAlpha: 0, x: 120, y: 90 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.5, ease: 'power2.out' }, at('model') + 0.1);
  [1, 2, 3].forEach(i => tl.to(cur, { y: i * 80, duration: 0.3, ease: 'power2.inOut' }, at('model') + 0.6 + (i - 1) * 0.35 + 0.35 - 0.3 + 0.05));
  [['Run 1', 0], ['Run 2', 1], ['Run 3', 2]].forEach(([n, i]) => {
    const y = 390 + i * 125; const r = add(card(300, 104, { r: 24 }), 900, y); pop(r, at('showing') - 0.9 + i * 0.28, { s0: 0.8, dx: -40, dy: 0 });
    add(chip('repeat', { size: 58, bg: 'var(--teal2)', k: 0.6, sq: true }), 52, 52, r); LBL(n, 140, 52, r, { s: 28, w: 800 });
    pop(add(tag('0.88', { bg: '#F6ECDF', c: '#2B2019', s: 26, pad: '8px 18px', sh: false }), 240, 52, r), at('showing') - 0.6 + i * 0.28, { s0: 0.4 });
  });
  arrow(L, 665, 520, 735, 520, at('showing') - 1.0, 0.3, { c: 'var(--amber)', w: 7, hs: 18 });
  const cx = 1450, cyy = 660, rr = 215, P = a => [cx + rr * Math.cos(Math.PI - a * Math.PI), cyy - rr * Math.sin(Math.PI - a * Math.PI)];
  const arc = (a0, a1) => { const [x0, y0] = P(a0), [x1, y1] = P(a1); return `M ${x0} ${y0} A ${rr} ${rr} 0 0 1 ${x1} ${y1}`; };
  const gl = svgLayer();
  const z1 = path(gl, arc(0, 0.8), { c: '#C96F3F', w: 44 }), z2 = path(gl, arc(0.8, 1), { c: '#2FAFA3', w: 44 });
  [z1, z2].forEach(z => { z.setAttribute('pathLength', 1); z.style.strokeDasharray = 1; z.style.strokeDashoffset = 1; z.setAttribute('stroke-linecap', 'butt'); });
  tl.to(z1, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' }, at('fairness') - 0.15); tl.to(z2, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, at('fairness') + 0.5);
  const [bx0, by0] = P(0.8), ca = Math.cos(Math.PI - 0.8 * Math.PI), sa = Math.sin(Math.PI - 0.8 * Math.PI);
  const base = path(gl, `M ${bx0 - 36 * ca} ${by0 + 36 * sa} L ${bx0 + 40 * ca} ${by0 - 40 * sa}`, { c: '#F6ECDF', w: 7 }); gsap.set(base, { autoAlpha: 0 }); tl.to(base, { autoAlpha: 1, duration: 0.2 }, at('baselines') - 0.2);
  pop(add(tag('agreed baseline', { icon: 'ruler', bg: '#F6ECDF', c: '#2B2019', s: 26, pad: '10px 22px' }), 1450, 735), at('agreed') - 0.05, { s0: 0.6 });
  const nd = add(mk('', { width: '12px', height: '190px', borderRadius: '6px', background: '#F6ECDF', transformOrigin: '50% 100%', boxShadow: '0 6px 12px rgba(0,0,0,.4)' }), cx, cyy - 95);
  const hub = add(mk('', { width: '46px', height: '46px', borderRadius: '50%', background: '#F2A65A' }), cx, cyy); gsap.set(hub, { autoAlpha: 0 }); tl.to(hub, { autoAlpha: 1, duration: 0.2 }, at('fairness'));
  gsap.set(nd, { rotation: -76, autoAlpha: 0 }); tl.to(nd, { autoAlpha: 1, duration: 0.2 }, at('fairness'));
  tl.to(nd, { rotation: 62, duration: 1.1, ease: 'elastic.out(1,0.5)' }, at('meets'));
  pop(add(tag('Meets baseline', { icon: 'badge-check', bg: 'var(--teal)', c: '#fff', s: 34 }), cx, 392), at('baselines') + 0.1, { s0: 0.5 });
  const es = add(card(720, 96, { r: 24 }), 960, 845); pop(es, at('rather') - 0.1, { s0: 0.8, dy: 40 });
  add(chip('scroll-text', { size: 56, bg: 'rgba(246,236,223,.2)', k: 0.6, sq: true }), 52, 48, es); const et = LBL('Theoretical essays', 330, 48, es, { s: 38, w: 700 });
  strike(et, at('theoretical') + 0.3, { c: 'var(--red)', h: 0.09 });
  tl.to(es, { opacity: 0.55, duration: 0.3 }, at('essays') + 0.1);
});
