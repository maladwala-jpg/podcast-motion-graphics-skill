/* Segment C — 5:27.8 → 6:30.3 */

/* ───────── C1 · your beginner-safe, offline field mission ───────── */
scene('C1', sd => {
  const h = add(T('Your *field* *mission*', { s: 132 }), 960, 215);
  reveal(h, 0, { times: [at('your') + 0.05, at('field') - 0.1, at('mission') - 0.1] });
  const ring = add(mk('abs', { width: '330px', height: '330px', borderRadius: '50%', border: '6px dashed var(--terra)' }), 960, 540); pop(ring, at('here') + 0.2, { s0: 0.3, d: 0.8 });
  tl.to(ring, { rotation: 360, duration: D, ease: 'none' }, 0);
  const cp = add(chip('compass', { size: 230, bg: 'var(--teal)', k: 0.58 }), 960, 540); pop(cp, at('here') + 0.3, { s0: 0.2, r0: -120, d: 0.8 }); tl.to(cp, { rotation: 20, duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut' }, at('mission'));
  pop(add(tag('Beginner-safe', { icon: 'shield-check', bg: 'var(--teal2)', s: 38, pad: '16px 36px' }), 590, 800), at('beginner') - 0.05, { s0: 0.5 });
  pop(add(tag('Offline', { icon: 'wifi-off', bg: 'var(--espresso)', s: 38, pad: '16px 36px' }), 1330, 800), at('offline') - 0.05, { s0: 0.5 });
});

/* ───────── C2 · step 1: download a public, non-sensitive dataset ───────── */
scene('C2', sd => {
  const L = svgLayer();
  pop(add(tag('STEP 1', { icon: 'download', bg: 'var(--terra)', s: 34, pad: '14px 34px' }), 960, 82), at('download') - 0.1, { s0: 0.5 });
  [['public', 'globe', 'var(--teal2)', 700, 'public'], ['non-sensitive', 'shield-check', 'var(--espresso)', 960, 'sensitive'], ['educational', 'graduation-cap', '#B8691A', 1260, 'educational']].forEach(([tx, ic, bg, x, w]) => pop(add(tag(tx, { icon: ic, bg, s: 30 }), x, 185), at(w) - 0.1, { s0: 0.6 }));
  const repo = add(card(420, 400, { r: 36 }), 360, 530); pop(repo, at('open') - 0.2, { s0: 0.8, dx: -40, dy: 0 });
  add(chip('database', { size: 100, bg: 'var(--teal2)', k: 0.55, sq: true }), 210, 85, repo); LBL('Open repository', 210, 175, repo, { s: 34, w: 800 });
  ['dataset_01.csv', 'dataset_02.csv', 'dataset_03.csv'].forEach((n, i) => { const r = add(mk('abs', { width: '340px', height: '52px', borderRadius: '14px', background: i === 1 ? 'rgba(201,111,63,.22)' : 'rgba(125,80,56,.1)', border: i === 1 ? '3px solid var(--terra)' : 'none' }), 210, 240 + i * 60, repo); add(ico('file-spreadsheet', 30, 'var(--terra2)', 2.2), 42, 26, r); LBL(n, 185, 26, r, { s: 24, w: 700, a: 'left' }); });
  const dl = add(chip('download', { size: 130, bg: 'var(--terra)', k: 0.55 }), 800, 520); pop(dl, at('download') + 0.1, { s0: 0.2 }); tl.to(dl, { y: 12, duration: 0.45, yoyo: true, repeat: 15, ease: 'sine.inOut' }, at('download') + 0.8);
  arrow(L, 880, 520, 990, 520, at('from') - 0.2, 0.5, { c: 'var(--terra)', w: 9 });
  const f = add(card(380, 400, { r: 36 }), 1330, 530); pop(f, at('set') - 0.3, { s0: 0.8, dx: 60, dy: 0 });
  add(chip('file-spreadsheet', { size: 120, bg: 'var(--teal)', k: 0.55, sq: true }), 190, 130, f); LBL('dataset.csv', 190, 250, f, { s: 38, w: 800 }); LBL('educational', 190, 305, f, { s: 26, c: 'var(--muted)' });
  const tb = add(card(820, 520, { r: 36 }), 1240, 560); pop(tb, at('such') - 0.1, { s0: 0.9, dy: 40 }); gone(f, at('such') - 0.15, { dy: 0, s: 0.8 });
  LBL('Synthetic university admissions', 410, 55, tb, { s: 34, w: 800 });
  [['APPLICANT', 120], ['GPA', 330], ['GROUP', 500], ['DECISION', 680]].forEach(([n, x]) => LBL(n, x, 125, tb, { s: 20, w: 700, c: 'var(--muted)', ls: 0.1 }));
  add(mk('abs', { width: '740px', height: '3px', background: 'var(--hair)' }), 410, 148, tb);
  for (let i = 0; i < 6; i++) { const y = 195 + i * 53; if (i % 2 === 0) add(mk('abs', { width: '760px', height: '46px', borderRadius: '12px', background: 'rgba(125,80,56,.08)' }), 410, y, tb);
    const rw = [LBL('S-' + (1000 + i * 37), 120, y, tb, { s: 24, w: 600 }), LBL((2.8 + (i * 7 % 10) / 10).toFixed(1), 330, y, tb, { s: 24, w: 600 }), LBL('AB'[i % 2], 500, y, tb, { s: 24, w: 600 }), add(chip(i % 3 === 1 ? 'x' : 'check', { size: 34, bg: i % 3 === 1 ? '#D9503A' : '#2FAFA3', k: 0.65, sw: 3.2 }), 680, y, tb)];
    rw.forEach(e => pop(e, at('synthetic') + 0.1 + i * 0.1, { s0: 0.6, dy: 14, d: 0.35 })); }
  pop(add(tag('synthetic', { icon: 'sparkles', bg: '#F2A65A', c: '#2B2019', s: 26 }), 1530, 280), at('synthetic') - 0.05, { s0: 0.6 });
});

/* ───────── C3 · zero private data · no live web access ───────── */
scene('C3', sd => {
  const L = svgLayer();
  const h = add(T('Two safety *checks*', { s: 74 }), 960, 118); reveal(h, 0, { times: [at('ensure') - 0.05, at('contains') - 0.1, at('zero') - 0.1] });
  const c1 = add(card(700, 540, { r: 40 }), 540, 545); pop(c1, at('zero') - 0.2, { s0: 0.8, dx: -40, dy: 40 });
  const sh = add(chip('shield-check', { size: 170, bg: 'var(--teal2)', k: 0.55 }), 175, 205, c1); pop(sh, at('zero') - 0.1, { s0: 0.2 });
  const z = add(NUM(270, { c: '#F6ECDF' }), 470, 215, c1); z.textContent = '0'; pop(z, at('zero') + 0.1, { s0: 0.3, r0: 10, d: 0.7 });
  LBL('private personal data', 350, 370, c1, { s: 40, w: 800 });
  [['user-round', 130], ['mail', 350], ['fingerprint', 570]].forEach(([ic, x], i) => { const g = add(chip(ic, { size: 76, bg: 'rgba(246,236,223,.15)', k: 0.55, c: '#F6ECDF', shadow: false }), x, 458, c1); pop(g, at('private') + 0.1 + i * 0.2, { s0: 0.3 }); const xx = add(chip('x', { size: 40, bg: '#D9503A', k: 0.7, sw: 3.4 }), x + 28, 430, c1); pop(xx, at('personal') + 0.15 + i * 0.2, { s0: 0.1 }); });
  const c2 = add(card(700, 540, { r: 40 }), 1380, 545); pop(c2, at('requires') - 0.1, { s0: 0.8, dx: 40, dy: 40 });
  const wf = add(chip('wifi-off', { size: 190, bg: 'var(--espresso)', k: 0.58, c: '#F6ECDF' }), 350, 215, c2); pop(wf, at('no') - 0.1, { s0: 0.2, r0: 40 });
  LBL('no live web access', 350, 370, c2, { s: 40, w: 800 });
  pop(add(tag('OFFLINE', { icon: 'check', bg: 'var(--teal)', c: '#fff', s: 32, pad: '14px 34px' }), 350, 455, c2), at('access') - 0.15, { s0: 0.4 });
});

/* ───────── C4 · step 2: two baseline groups → selection rates in a spreadsheet ───────── */
scene('C4', sd => {
  pop(add(tag('STEP 2', { icon: 'sheet', bg: 'var(--terra)', s: 34, pad: '14px 34px' }), 960, 82), at('step') - 0.05, { s0: 0.5 });
  const sh = add(card(1180, 560, { r: 36, ov: true }), 960, 520); pop(sh, at('pick') - 0.15, { s0: 0.88, dy: 50 });
  add(mk('abs', { width: '1180px', height: '78px', background: 'rgba(125,80,56,.1)' }), 590, 39, sh);
  add(chip(null, { size: 50, bg: 'var(--espresso)', sq: true }), 56, 39, sh); LBL('fx', 56, 39, sh, { s: 24, w: 800, c: '#F6ECDF' });
  const fm = add(mk('abs t sans', { fontSize: '30px', fontWeight: 700, color: 'var(--fg)', whiteSpace: 'pre' }), 330, 39, sh); fm.style.left = '100px'; fm.style.xPercent = 0; gsap.set(fm, { xPercent: 0 });
  typeIn(fm, '=Selected ÷ Applicants', at('calculate'), 1.0);
  [['GROUP', 190], ['APPLICANTS', 520], ['SELECTED', 800], ['SELECTION RATE', 1040]].forEach(([n, x]) => LBL(n, x, 125, sh, { s: 20, w: 700, c: 'var(--muted)', ls: 0.1 }));
  add(mk('abs', { width: '1100px', height: '3px', background: 'var(--hair)' }), 590, 150, sh);
  const rows = [['Group A', 120, 72, '#C96F3F', 1], ['Group B', 100, 45, '#2FAFA3', 1], ['Group C', 90, 54, '#8B7468', 0], ['Group D', 80, 48, '#8B7468', 0]];
  rows.forEach(([g, a, s, col, pick], i) => {
    const y = 215 + i * 85; const bar = add(mk('abs', { width: '1120px', height: '70px', borderRadius: '16px', background: pick ? col + '2e' : 'rgba(125,80,56,.06)', border: pick ? `3px solid ${col}` : 'none' }), 590, y, sh);
    const cells = [LBL(g, 190, y, sh, { s: 32, w: 800, c: pick ? col : 'var(--muted)' }), LBL(String(a), 520, y, sh, { s: 30, w: 600 }), LBL(String(s), 800, y, sh, { s: 30, w: 600 })];
    pop(bar, at('two') + 0.05 + i * 0.12, { s0: 0.96, dy: 0, a: pick ? 1 : 0.55 }); cells.forEach(c => pop(c, at('two') + 0.1 + i * 0.12, { s0: 0.8, dy: 0, a: pick ? 1 : 0.5 }));
    if (pick) { const n = NUM(40, { c: col, f: 'sans', w: 800 }); add(n, 1040, y, sh); n.style.opacity = 0; tl.to(n, { opacity: 1, duration: 0.12 }, at('rates') - 0.1 + i * 0.3); counter(n, at('rates') - 0.05 + i * 0.3, 0.7, 0, Math.round(s / a * 100), v => Math.round(v) + '%'); }
  });
  const gl = add(tag('baseline groups', { icon: 'users', bg: 'var(--espresso)', s: 28 }), 330, 840); pop(gl, at('baseline') - 0.1, { s0: 0.6 });
  pop(add(tag('basic spreadsheet', { icon: 'file-spreadsheet', bg: 'var(--teal2)', s: 28 }), 1480, 840), at('basic') - 0.1, { s0: 0.6 });
});

/* ───────── C5 · a noticeable variance → candidate for review ───────── */
scene('C5', sd => {
  const L = svgLayer();
  [['Group A', 640, '#C96F3F', 'one'], ['Group B', 1280, '#2FAFA3', 'group']].forEach(([n, x, col, w], i) => { const gc = add(chip('users', { size: 150, bg: col, k: 0.55 }), x, 420); pop(gc, at(w) - 0.1 + i * 0.15, { s0: 0.3 }); const gl = LBL(n, x, 540, null, { s: 36, w: 800 }); pop(gl, at(w) + i * 0.15, { s0: 0.7 }); gone(gc, at('positive') - 0.25, { dy: -100, s: 0.5 }); gone(gl, at('positive') - 0.25, { dy: -100, s: 0.5 }); });
  const q = add(chip('git-compare', { size: 150, bg: 'var(--terra)', k: 0.55 }), 960, 420); pop(q, at('noticeable') - 0.2, { s0: 0.2, r0: -90, d: 0.7 }); gone(q, at('positive') - 0.25, { dy: -100, s: 0.5 });
  const t1 = add(T('A noticeable *variance*', { s: 100 }), 960, 660); reveal(t1, 0, { times: [at('noticeable') - 0.2, at('noticeable') - 0.1, at('variance') - 0.05] }); gone(t1, at('positive') - 0.25, { dy: -100, s: 0.8 });
  const cd = add(card(1240, 600, { r: 40 }), 960, 520); pop(cd, at('positive') - 0.2, { s0: 0.9, dy: 50 });
  LBL('Positive outcomes', 620, 55, cd, { s: 36, w: 800 });
  const bars = [[300, 330, '#C96F3F', 'Group A', 60], [900, 247, '#2FAFA3', 'Group B', 45]];
  bars.forEach(([x, hh, col, n, v], i) => {
    const b = add(mk('abs', { width: '220px', height: hh + 'px', borderRadius: '22px 22px 8px 8px', background: col, transformOrigin: '50% 100%' }), x + 80, 500 - hh / 2, cd); tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: 'power3.out' }, at('positive') + 0.3 + i * (at('compared') - at('positive') - 0.2));
    LBL(n, x + 80, 545, cd, { s: 34, w: 800 }); const nv = NUM(64, { c: '#F6ECDF', f: 'sans', w: 800 }); add(nv, x + 80, 500 - hh + 52, cd); nv.style.opacity = 0; tl.to(nv, { opacity: 1, duration: 0.12 }, at('positive') + 0.5 + i * (at('compared') - at('positive') - 0.2)); counter(nv, at('positive') + 0.5 + i * (at('compared') - at('positive') - 0.2), 0.7, 0, v, x => Math.round(x) + '%');
  });
  add(mk('abs', { width: '1080px', height: '2px', background: 'rgba(246,236,223,.25)' }), 620, 503, cd);
  const gp = drawOn(svgLayer(cd), 'M 600 170 L 640 170 L 640 253 L 600 253', at('another') - 0.2, 0.6, { c: '#F2A65A', w: 7 });
  pop(add(tag('variance', { icon: 'git-compare', bg: '#F2A65A', c: '#2B2019', s: 28 }), 770, 212, cd), at('another'), { s0: 0.6 });
  const ring = add(mk('abs', { width: '300px', height: '340px', border: '6px dashed #F2A65A', borderRadius: '34px' }), 1260, 650); pop(ring, at('isolated') - 0.1, { s0: 1.3, dy: 0, d: 0.5 });
  const mg = mk('abs'); mg.appendChild(ico('search', 120, '#F2A65A', 2.2)); add(mg, 1500, 430); tl.fromTo(mg, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, at('isolated') - 0.1); tl.to(mg, { x: -110, y: 40, duration: 0.8, ease: 'sine.inOut' }, at('isolated') + 0.2);
  const fl = add(tag('candidate area for review', { icon: 'flag', bg: '#D9503A', s: 32, pad: '16px 36px' }), 1260, 880 - 0); pop(fl, at('candidate') - 0.1, { s0: 0.5 });
});

/* ───────── C6 · step 3: the one-page model fairness brief ───────── */
scene('C6', sd => {
  const L = svgLayer();
  pop(add(tag('STEP 3', { icon: 'pen-line', bg: 'var(--terra)', s: 34, pad: '14px 34px' }), 960, 82), at('step') - 0.05, { s0: 0.5 });
  const doc = add(card(1340, 600, { r: 36 }), 960, 490); pop(doc, at('draft') - 0.2, { s0: 0.85, dy: 70, rot: 1 });
  const tt = add(T('Model Fairness Brief', { s: 54, a: 'left' }), 340, 58, doc); tt.style.left = '60px'; gsap.set(tt, { xPercent: 0 });
  reveal(tt, 0, { times: [at('model') - 0.1, at('fairness') - 0.1, at('brief') - 0.15], dy: 20, blur: 6 });
  const rb = add(tag('1 page', { icon: 'file-text', bg: '#C0612F', s: 26, pad: '10px 24px' }), 1190, 58, doc); pop(rb, at('one') - 0.05, { s0: 0.4, r0: 15 });
  add(mk('abs', { width: '1220px', height: '3px', background: 'var(--hair)' }), 670, 110, doc);
  const colx = [230, 670, 1110];
  // 1 — observed variance
  const s1 = add(mk('abs', { width: '380px', height: '420px' }), colx[0], 340, doc); pop(s1, at('state') - 0.15, { s0: 0.8, dy: 30 });
  LBL('1 · Observed variance', 190, 20, s1, { s: 28, w: 800 });
  [[100, 190, '#C96F3F'], [250, 140, '#2FAFA3']].forEach(([x, hh, col]) => { const b = add(mk('abs', { width: '110px', height: hh + 'px', borderRadius: '14px 14px 5px 5px', background: col, transformOrigin: '50% 100%' }), x, 330 - hh / 2, s1); tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power3.out' }, at('observed') + 0.1); });
  add(mk('abs', { width: '340px', height: '2px', background: 'var(--hair)' }), 190, 333, s1); pop(add(tag('Δ gap', { bg: '#F2A65A', c: '#2B2019', s: 24, pad: '8px 20px', sh: false }), 190, 105, s1), at('variance') + 0.05, { s0: 0.4 });
  // 2 — two missing context variables
  const s2 = add(mk('abs', { width: '380px', height: '420px' }), colx[1], 340, doc); pop(s2, at('suggest') - 0.15, { s0: 0.8, dy: 30 });
  LBL('2 · Missing context variables', 190, 20, s2, { s: 28, w: 800 });
  [['Variable 1', 'two'], ['Variable 2', 'potential']].forEach(([n, w], i) => { const c = add(mk('abs', { width: '340px', height: '110px', borderRadius: '24px', background: 'rgba(125,80,56,.1)', border: '3px dashed var(--terra)' }), 190, 130 + i * 140, s2); add(chip('circle-help', { size: 64, bg: 'var(--terra)', k: 0.6 }), 60, 55, c); LBL(n, 205, 55, c, { s: 30, w: 800 }); pop(c, at(w) + (i ? 0.5 : 0) - 0.05, { s0: 0.6, dx: -20, dy: 0 }); });
  const ex = drawOn(L, 'M 780 360 C 740 280 640 270 560 300', at('explain') - 0.15, 0.7, { c: '#C0612F', w: 6, dash: '3 12' });
  pop(add(tag('might explain the skew', { icon: 'lightbulb', bg: '#F2A65A', c: '#2B2019', s: 26, pad: '12px 26px' }), 670, 725), at('explain') + 0.1, { s0: 0.6 });
  // 3 — escalation guideline
  const s3 = add(mk('abs', { width: '380px', height: '420px' }), colx[2], 340, doc); pop(s3, at('outline') - 0.15, { s0: 0.8, dy: 30 });
  LBL('3 · Escalation guideline', 190, 20, s3, { s: 28, w: 800 });
  const fb = add(mk('abs', { width: '320px', height: '90px', borderRadius: '22px', background: 'rgba(125,80,56,.12)', border: '3px solid var(--hair)' }), 190, 130, s3); LBL('If gap persists…', 160, 45, fb, { s: 28, w: 700 }); pop(fb, at('escalation') - 0.1, { s0: 0.7 });
  const ar = add(chip('arrow-down', { size: 60, bg: 'var(--terra)', k: 0.6 }), 190, 235, s3); pop(ar, at('guideline') - 0.05, { s0: 0.3 });
  const hr = add(mk('abs', { width: '340px', height: '110px', borderRadius: '26px', background: 'var(--espresso)', color: '#F6ECDF' }), 190, 340, s3); add(chip('user-check', { size: 70, bg: 'var(--teal)', k: 0.55 }), 62, 55, hr); LBL('Human review', 215, 55, hr, { s: 32, w: 800, c: '#F6ECDF' }); pop(hr, at('human') - 0.15, { s0: 0.6, dy: 20 });
});

/* ───────── C7 · a concrete portfolio artifact ───────── */
scene('C7', sd => {
  const h = add(T('A *concrete* portfolio artifact', { s: 84 }), 960, 130); reveal(h, 0, { times: [at('a') - 0.1, at('concrete') - 0.1, at('portfolio') - 0.1, at('artifact') - 0.1] });
  const fo = add(mk('abs', { width: '520px', height: '420px' }), 620, 560); pop(fo, at('portfolio') - 0.25, { s0: 0.7, dy: 50 });
  add(mk('abs', { width: '200px', height: '56px', borderRadius: '22px 22px 0 0', background: '#B8691A' }), 110, 40, fo);
  const pg = add(card(380, 300, { r: 22 }), 260, 190, fo); pg.style.zIndex = 1; tl.fromTo(pg, { y: -420, rotation: -8 }, { y: 0, rotation: -3, duration: 0.8, ease: 'power3.out' }, at('portfolio') + 0.1);
  LBL('Model Fairness\nBrief', 190, 90, pg, { s: 34, w: 800, lh: 1.1 }); [140, 170, 200].forEach((y, i) => add(mk('abs', { width: 260 - i * 40 + 'px', height: '12px', borderRadius: '6px', background: 'var(--hair)' }), 190 - i * 20, y + 40, pg));
  const fb = add(mk('abs', { width: '520px', height: '330px', borderRadius: '26px', background: 'linear-gradient(180deg,#E8943A,#C96F3F)', boxShadow: '0 30px 50px -20px rgba(0,0,0,.6)' }), 260, 255, fo); fb.style.zIndex = 2;
  add(chip('folder-check', { size: 120, bg: 'rgba(255,255,255,.25)', k: 0.6, c: '#fff', shadow: false }), 260, 165, fb);
  pop(add(tag('Portfolio artifact', { icon: 'briefcase-business', bg: 'var(--espresso)', s: 30 }), 620, 830), at('artifact') - 0.1, { s0: 0.6 });
  const bd = add(mk('abs', { width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(232,148,58,.22),rgba(232,148,58,0) 70%)' }), 1330, 540); pop(bd, at('demonstrating') - 0.1, { s0: 0.4, d: 0.8 });
  const br = add(chip('brain', { size: 250, bg: 'var(--teal)', k: 0.55 }), 1330, 520); pop(br, at('systematic') - 0.2, { s0: 0.2, r0: -40, d: 0.7 });
  [[-170, -120], [180, -110], [0, -210]].forEach(([dx, dy], i) => { const s = add(chip('star', { size: 78, bg: '#F2A65A', c: '#2B2019', k: 0.55 }), 1330 + dx, 520 + dy); pop(s, at('critical') + 0.1 + i * 0.12, { s0: 0.1, r0: -90 }); });
  pop(add(tag('Systematic critical thinking', { icon: 'badge-check', bg: '#F6ECDF', c: '#2B2019', s: 32, pad: '16px 36px' }), 1330, 770), at('systematic') + 0.1, { s0: 0.5 });
  const burst = []; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; const p = add(mk('abs', { width: '16px', height: '16px', borderRadius: i % 2 ? '50%' : '3px', background: ['#F2A65A', '#2FAFA3', '#C96F3F', '#F6ECDF'][i % 4] }), 1330, 520); gsap.set(p, { autoAlpha: 0 }); tl.fromTo(p, { autoAlpha: 1, x: 0, y: 0, scale: 1 }, { x: Math.cos(a) * 280, y: Math.sin(a) * 260, scale: 0.2, autoAlpha: 0, duration: 0.9, ease: 'power2.out' }, at('thinking') - 0.05); burst.push(p); }
});
