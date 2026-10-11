/* Segment C — 4:24.20 → 5:08.00 · transferable skills, the offline field mission (steps 1 and 2) */

/* C1 · "Exactly." — systemic thinking and verification skills, not vendor lock-in */
scene('C1', sd => {
  const ex = add(T('_Exactly._', { s: 180, c: 'var(--acc)' }), 960, 470); pop(ex, 0.35, { s0: 0.5, d: 0.7, ease: 'elastic.out(1,0.55)', blur: 8 }); gone(ex, at('you') - 0.15, { s: 0.7, dy: -120, d: 0.4 });
  const h = hero('Systemic thinking *and* verification', { s: 68, move: at('rather') - 0.3, big: 1.3, yc: 330, yTop: 150 });
  reveal(h, 0, { times: [at('systemic') - 0.1, at('thinking') - 0.05, at('and') - 0.05, at('verification') - 0.1] });
  const brain = add(chip('brain', { size: 200, bg: 'var(--tertiary)', k: 0.55 }), 560, 640); pop(brain, at('systemic') + 0.1, { s0: 0.2, r0: -50 });
  pop(add(tag('Systemic thinking', { icon: 'network', bg: 'var(--primary)', s: 30 }), 560, 790), at('thinking') + 0.05, { s0: 0.6 });
  const ver = add(chip('badge-check', { size: 140, bg: 'var(--secondary)', c: 'var(--ink)', k: 0.58 }), 330, 560); pop(ver, at('verification') - 0.05, { s0: 0.2 });
  pop(add(tag('Verification', { icon: 'check', bg: 'var(--dark)', s: 28 }), 330, 680), at('skills') - 0.05, { s0: 0.6 });
  // vs single vendor tool
  const v = add(card(480, 260, { r: 36 }), 1400, 640); pop(v, at('rather') - 0.1, { s0: 0.85, dx: 50, dy: 0 });
  add(chip('package', { size: 110, bg: 'var(--quaternary)', k: 0.55, sq: true }), 240, 90, v); const vt = LBL('Single vendor tool', 240, 190, v, { s: 34, w: 800 });
  const lk = add(chip('lock', { size: 80, bg: 'var(--danger)', c: '#fff', k: 0.55 }), 410, 50, v); pop(lk, at('locking') - 0.05, { s0: 0.2, r0: -30 });
  strike(vt, at('vendor') + 0.2, { c: 'var(--danger)', h: 0.1 });
  tl.to(v, { opacity: 0.45, duration: 0.5 }, at('tool') + 0.1);
  const L = svgLayer(); arrow(L, 700, 640, 1130, 640, at('locking') - 0.1, 0.7, { c: 'var(--danger)', w: 7 }); 
  pop(add(chip('x', { size: 70, bg: 'var(--danger)', k: 0.62, sw: 3.4 }), 940, 640), at('locking') + 0.4, { s0: 0.2, r0: -40 });
});

/* C2 · your practical field mission — entirely offline, no private data */
scene('C2', sd => {
  const h = hero('Your practical *field* *mission*', { s: 96, move: at('which') - 0.3, big: 1.35, yc: 400, yTop: 140 });
  reveal(h, 0, { times: [at('your') + 0.05, at('practical') - 0.1, at('field') - 0.1, at('mission') - 0.1] });
  const nx = add(tag('UP NEXT', { icon: 'arrow-right', bg: 'var(--secondary)', c: 'var(--ink)', s: 56, pad: '26px 64px' }), 960, 470); pop(nx, 0.45, { s0: 0.4, d: 0.7 }); gone(nx, at('your') - 0.15, { s: 0.7, dy: -80, d: 0.4 });
  const cp = add(chip('compass', { size: 230, bg: 'var(--tertiary)', k: 0.58 }), 960, 640); pop(cp, at('field') + 0.1, { s0: 0.2, r0: -120, d: 0.8 });
  const ring = add(mk('abs', { width: '330px', height: '330px', borderRadius: '50%', border: '6px dashed var(--primary)' }), 960, 640); pop(ring, at('field') + 0.2, { s0: 0.3, d: 0.8 }); tl.to(ring, { rotation: 360, duration: D, ease: 'none' }, 0);
  pop(add(tag('Entirely offline', { icon: 'wifi-off', bg: 'var(--dark)', s: 38, pad: '16px 36px' }), 420, 640), at('offline') - 0.1, { s0: 0.5 });
  pop(add(tag('No private data', { icon: 'shield-check', bg: 'var(--tertiary-d)', c: '#fff', s: 38, pad: '16px 36px' }), 1500, 640), at('private') - 0.1, { s0: 0.5 });
  const L = svgLayer(); drawOn(L, 'M 680 640 L 800 640', at('offline') + 0.1, 0.3, { c: 'var(--muted)', w: 5, dash: '3 12' }); drawOn(L, 'M 1120 640 L 1240 640', at('private') + 0.1, 0.3, { c: 'var(--muted)', w: 5, dash: '3 12' });
});

/* C3 · step 1: download an open source, non-sensitive sample dataset of mock network logs */
scene('C3', sd => {
  const L = svgLayer();
  pop(add(tag('STEP 1', { icon: 'download', bg: 'var(--primary)', s: 38, pad: '16px 40px' }), 960, 95), at('step') - 0.05, { s0: 0.5 });
  [['Open source', 'git-branch', 'var(--tertiary-d)', 650, 'open'], ['Non-sensitive', 'shield-check', 'var(--dark)', 960, 'non'], ['Sample data', 'database', 'var(--secondary)', 1270, 'sample']].forEach(([n, ic, bg, x, w]) => {
    pop(add(tag(n, { icon: ic, bg, c: bg === 'var(--secondary)' ? 'var(--ink)' : '#fff', s: 30 }), x, 195), at(w) - 0.1, { s0: 0.6 });
  });
  const repo = add(card(430, 420, { r: 36 }), 360, 560); pop(repo, at('from') - 0.2, { s0: 0.8, dx: -40, dy: 0 });
  add(chip('landmark', { size: 100, bg: 'var(--tertiary-d)', k: 0.55 }), 215, 82, repo); LBL('Authorized educational\nrepository', 215, 175, repo, { s: 30, w: 800, lh: 1.1 });
  ['network_logs_01.csv', 'network_logs_02.csv', 'network_logs_03.csv'].forEach((n, i) => { const r = add(mk('abs', { width: '350px', height: '52px', borderRadius: '14px', background: i === 1 ? 'color-mix(in srgb,var(--primary) 22%,transparent)' : 'var(--hair)', border: i === 1 ? '3px solid var(--primary)' : 'none' }), 215, 262 + i * 62, repo); add(ico('file-spreadsheet', 28, 'var(--primary)', 2.2), 40, 26, r); LBL(n, 205, 26, r, { s: 21, w: 700 }); });
  const dl = add(chip('download', { size: 130, bg: 'var(--primary)', k: 0.55 }), 800, 560); pop(dl, at('download') + 0.1, { s0: 0.2 }); tl.to(dl, { y: 12, duration: 0.45, yoyo: true, repeat: 15, ease: 'sine.inOut' }, at('download') + 0.8);
  arrow(L, 585, 560, 740, 560, at('from') - 0.1, 0.5, { c: 'var(--primary)', w: 8 }); gsap.set(dl, { x: 0 });
  // table of mock logs
  const tb = add(card(820, 470, { r: 36 }), 1380, 590); pop(tb, at('mock') - 0.2, { s0: 0.9, dy: 40 });
  LBL('Mock network traffic logs', 410, 52, tb, { s: 32, w: 800 });
  [['TIME', 100], ['SOURCE', 300], ['PORT', 500], ['STATUS', 680]].forEach(([n, x]) => LBL(n, x, 118, tb, { s: 19, w: 700, c: 'var(--muted)', ls: 0.1 }));
  add(BAR(740, 3, 'var(--hair)'), 410, 140, tb);
  for (let i = 0; i < 6; i++) { const y = 186 + i * 46; if (i % 2 === 0) add(BAR(760, 40, 'var(--hair)', { opacity: 0.5, borderRadius: '10px' }), 410, y, tb);
    [LBL('09:0' + (i + 1), 100, y, tb, { s: 22, w: 600 }), LBL('10.0.0.' + (20 + i * 7), 300, y, tb, { s: 22, w: 600 }), LBL(['443', '22', '80', '22', '443', '3389'][i], 500, y, tb, { s: 22, w: 600 }), add(chip(i === 3 ? 'x' : 'check', { size: 30, bg: i === 3 ? 'var(--danger)' : 'var(--tertiary)', k: 0.65, sw: 3.2 }), 680, y, tb)].forEach(e => pop(e, at('logs') - 0.5 + i * 0.12, { s0: 0.6, dy: 12, d: 0.35 })); }
  pop(add(tag('mock — not real data', { icon: 'sparkles', bg: 'var(--secondary)', c: 'var(--ink)', s: 22, pad: '8px 18px' }), 1380, 870 - 40), at('logs') + 0.3, { s0: 0.6 });
});

/* C4 · step 2: write a simple local rule or sandbox script to inspect the offline logs */
scene('C4', sd => {
  pop(add(tag('STEP 2', { icon: 'terminal', bg: 'var(--primary)', s: 38, pad: '16px 40px' }), 960, 95), at('step') - 0.05, { s0: 0.5 });
  const code = add(card(860, 560, { r: 36, bg: '#17110D', col: '#F6ECDF' }), 560, 560); code.style.boxShadow = '0 0 0 3px rgba(232,148,58,.55) inset, 0 30px 60px -22px rgba(0,0,0,.6)'; pop(code, at('write') - 0.2, { s0: 0.85, dy: 50 });
  [['#E8943A', 44], ['#F6ECDF', 74], ['#2FAFA3', 104]].forEach(([c, x]) => add(mk('abs', { width: '15px', height: '15px', borderRadius: '50%', background: c }), x, 36, code));
  LBL('detect_failed_logins.py', 430, 36, code, { s: 22, w: 700, c: '#9AA6A0' });
  const lines = ['# simple local rule', 'for event in offline_logs:', '    if event.failed_login:', '        count += 1', '    if count >= 5 and window <= 3:', '        flag("unusual pattern")'];
  lines.forEach((l, i) => { const e = mk('abs t sans', { fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '26px', fontWeight: 600, color: i === 0 ? '#9AA6A0' : i === 5 ? '#F2A65A' : '#F6ECDF', whiteSpace: 'pre' }); e.textContent = ''; add(e, 40, 110 + i * 62, code); e.style.left = '44px'; gsap.set(e, { xPercent: 0 }); typeIn(e, l, at('simple') + 0.0 + i * 0.7, 0.62); });
  const tagg = [['Local rule', 'ruler', 'local', 'var(--tertiary)'], ['Sandbox script', 'box', 'sandbox', 'var(--secondary)']];
  tagg.forEach(([n, ic, w, bg], i) => pop(add(tag(n, { icon: ic, bg, c: bg === 'var(--secondary)' ? 'var(--ink)' : '#fff', s: 30 }), 1300 + (i ? 120 : -20), 335 + i * 80), at(w) - 0.1, { s0: 0.6 }));
  const lg = add(card(560, 270, { r: 36 }), 1450, 640); pop(lg, at('inspect') - 0.15, { s0: 0.85, dx: 50, dy: 0 });
  add(chip('file-search', { size: 90, bg: 'var(--primary)', k: 0.55, sq: true }), 80, 70, lg); LBL('Offline logs', 330, 70, lg, { s: 34, w: 800 });
  [210, 170, 130].forEach((w, i) => add(BAR(w + 130, 14, i === 1 ? 'var(--danger)' : 'var(--muted)', { opacity: i === 1 ? 0.8 : 0.3 }), 220, 135 + i * 36, lg));
  const mg = mk('abs'); mg.appendChild(ico('search', 100, 'var(--secondary)', 2.2)); add(mg, 1330, 590); tl.fromTo(mg, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, at('inspect') + 0.3); tl.to(mg, { x: 250, y: 125, duration: 0.9, ease: 'sine.inOut' }, at('logs') - 0.1);
  pop(add(tag('unusual patterns', { icon: 'triangle-alert', bg: 'var(--danger)', c: '#fff', s: 30 }), 1450, 835), at('unusual') - 0.1, { s0: 0.6 });
});

/* C5 · e.g. multiple failed authentication attempts within a three-minute window */
scene('C5', sd => {
  const L = svgLayer();
  pop(add(tag('SUCH AS', { icon: 'lightbulb', bg: 'var(--tertiary)', c: '#fff', s: 32 }), 960, 100), at('such') - 0.1, { s0: 0.6 });
  const card1 = add(card(560, 340, { r: 40 }), 480, 480); pop(card1, at('multiple') - 0.15, { s0: 0.85, dy: 40 });
  add(chip('key-round', { size: 110, bg: 'var(--quaternary)', k: 0.55 }), 280, 80, card1); LBL('Failed login attempts', 280, 168, card1, { s: 34, w: 800 });
  const cnt = NUM(120, { c: 'var(--danger)' }); add(cnt, 280, 262, card1); cnt.style.opacity = 0; tl.to(cnt, { opacity: 1, duration: 0.1 }, at('multiple') + 0.1);
  counter(cnt, at('multiple') + 0.15, 1.9, 0, 5, v => '×' + Math.round(v));
  const clk = add(chip('timer', { size: 300, bg: 'var(--primary)', k: 0.5 }), 1380, 480); pop(clk, at('within') - 0.15, { s0: 0.2, r0: -60, d: 0.8 });
  const hand = add(mk('abs', { width: '10px', height: '100px', borderRadius: '5px', background: '#fff', transformOrigin: '50% 100%' }), 1380, 430); gsap.set(hand, { autoAlpha: 0 }); tl.to(hand, { autoAlpha: 1, duration: 0.2 }, at('within') + 0.4); tl.fromTo(hand, { rotation: 0 }, { rotation: 180, duration: 2.0, ease: 'none', immediateRender: false }, at('within') + 0.5);
  pop(add(tag('3-minute window', { icon: 'hourglass', bg: 'var(--secondary)', c: 'var(--ink)', s: 36, pad: '16px 38px' }), 1380, 680), at('three') - 0.1, { s0: 0.6 });
  arrow(L, 760, 480, 1200, 480, at('attempts') - 0.1, 0.6, { c: 'var(--primary)', w: 8 });
  const al = add(chip('siren', { size: 100, bg: 'var(--danger)', c: '#fff', k: 0.55 }), 960, 760); pop(al, at('window') - 0.1, { s0: 0.2, r0: -30 }); tl.fromTo(al, { scale: 1 }, { scale: 1.12, duration: 0.2, yoyo: true, repeat: 5, ease: 'sine.inOut', immediateRender: false }, at('window') + 0.3);
  pop(add(tag('flag it', { icon: 'flag', bg: 'var(--danger)', c: '#fff', s: 30 }), 960, 850), at('window') + 0.15, { s0: 0.6 });
});
