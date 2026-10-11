/* Segment A — 1:40.27 → 2:56.53 · how the SOC changes, the orchestrator role, qualifications */

/* A1 · the big shift: analysts used to triage alerts by hand for hours */
scene('A1', sd => {
  const L = svgLayer();
  const h = hero('The big *shift*', { move: at('historically') - 0.2, big: 1.7, yc: 470 });
  reveal(h, 0, { times: [at('the'), at('big') - 0.05, at('shift') - 0.1] });
  const hist = add(chip('history', { size: 170, bg: 'var(--quaternary)', k: 0.55 }), 960, 500); pop(hist, at('historically') + 0.05, { s0: 0.3, r0: -60 });
  const ht = add(T('_Historically…_', { s: 70, c: 'var(--acc)' }), 960, 660); pop(ht, at('historically') + 0.25, { s0: 0.8 });
  gone(hist, at('entry') - 0.3, { dy: -30 }); gone(ht, at('entry') - 0.3, { dy: 20 });
  // the analyst
  const an = add(chip('headset', { size: 180, bg: 'var(--primary)', k: 0.52 }), 340, 580); pop(an, at('entry') - 0.1);
  pop(add(tag('Entry-level analyst', { icon: 'user-round', bg: 'var(--dark)', s: 30 }), 340, 730), at('analysts') - 0.1, { s0: 0.7 });
  // hours
  const ring = add(mk('abs', { width: '170px', height: '170px', borderRadius: '50%', border: '6px dashed var(--secondary)' }), 340, 340); pop(ring, at('hours') - 0.1, { s0: 0.4 });
  tl.to(ring, { rotation: 720, duration: 4, ease: 'none' }, at('hours'));
  pop(add(chip('timer', { size: 120, bg: 'var(--secondary)', c: 'var(--ink)', k: 0.55 }), 340, 340), at('hours') - 0.1, { s0: 0.3 });
  pop(add(tag('hours', { icon: 'hourglass', bg: 'var(--secondary)', c: 'var(--ink)', s: 30 }), 340, 455), at('hours') + 0.1, { s0: 0.6 });
  // the alert queue
  drawOn(L, 'M 880 590 L 450 590', at('manually') - 0.05, 0.6, { c: 'var(--primary)', w: 7, dash: '3 14' });
  for (let i = 0; i < 5; i++) {
    const y = 330 + i * 118, c = add(card(640, 100, { r: 28 }), 1260, y);
    add(chip('triangle-alert', { size: 66, bg: 'var(--secondary)', c: 'var(--ink)', sq: true, k: 0.55 }), 56, 50, c);
    add(BAR(280, 14, 'var(--muted)', { opacity: 0.35 }), 250, 36, c); add(BAR(190, 12, 'var(--muted)', { opacity: 0.25 }), 205, 64, c);
    add(tag('triage', { bg: 'var(--hair)', c: 'var(--muted)', s: 22, pad: '6px 16px', sh: false }), 556, 50, c);
    pop(c, i < 3 ? at('manually') + 0.05 + i * 0.3 : at('triaging') + (i - 3) * 0.3, { s0: 0.9, dx: 130, dy: 0 });
  }
  tl.to(an, { scale: 1.07, duration: 0.18, yoyo: true, repeat: 9, ease: 'sine.inOut' }, at('manually') + 0.3);
  pop(add(tag('repetitive', { icon: 'repeat', bg: 'var(--quaternary)', s: 30 }), 1260, 235), at('repetitive') - 0.15, { s0: 0.6 });
});

/* A2 · automated agents take the first triage layer — an emerging role appears */
scene('A2', sd => {
  const L = svgLayer();
  rFlow({ heading: 'A new *triage* layer', headingAt: 'initial', pulse: false, nodes: [
    { icon: 'triangle-alert', label: 'Incoming alerts', at: 0.5, color: 'var(--secondary)' },
    { icon: 'bot', label: 'Automated agents\ntriage first', at: 'agents', color: 'var(--primary)' },
    { icon: 'user-round', label: 'Human analysts', at: 'changing', color: 'var(--tertiary)' }] });
  const orc = add(chip('workflow', { size: 130, bg: 'var(--secondary)', c: 'var(--ink)', k: 0.55 }), 960, 330); pop(orc, at('emerging') - 0.15, { s0: 0.2, r0: -90, d: 0.7 });
  const ring = add(mk('abs', { width: '170px', height: '170px', borderRadius: '50%', border: '5px solid var(--secondary)' }), 960, 330); gsap.set(ring, { autoAlpha: 0 });
  tl.fromTo(ring, { autoAlpha: 0.9, scale: 1 }, { autoAlpha: 0, scale: 1.5, duration: 1, repeat: 3, repeatDelay: 0.2, ease: 'power2.out', immediateRender: false }, at('emerging') + 0.3);
  pop(add(tag('emerging role', { icon: 'sparkles', bg: 'var(--secondary)', c: 'var(--ink)', s: 32 }), 1240, 330), at('role') - 0.1, { s0: 0.5 });
  pop(add(T('Orchestrator', { f: 'serif', s: 54 }), 700, 330), at('begins') - 0.1, { s0: 0.8 });
  drawOn(L, 'M 960 398 L 960 452', at('begins'), 0.4, { c: 'var(--secondary)', w: 7, dash: '3 12' });
});

/* A3 · the orchestrator monitors, audits and tests the software agents */
scene('A3', sd => {
  const L = svgLayer();
  const old = add(T('Manually copying *log* *entries*', { s: 92 }), 960, 470); reveal(old, 0, { times: [at('rather') - 0.1, at('manually') - 0.1, at('log') - 0.1, at('entries') - 0.1] });
  strike(old, at('entries') + 0.15, { c: 'var(--danger)', h: 0.07, top: '52%' });
  gone(old, at('orchestrator') - 0.35, { dy: -140, s: 0.7, d: 0.45 });
  const hub = add(chip('workflow', { size: 240, bg: 'var(--secondary)', c: 'var(--ink)', k: 0.5 }), 650, 620); pop(hub, at('orchestrator') - 0.15, { s0: 0.2, r0: -90, d: 0.8 });
  pop(add(T('Orchestrator', { f: 'serif', s: 58 }), 650, 800), at('orchestrator') + 0.1, { s0: 0.8 });
  const duty = [['Monitoring', 'eye', 'monitoring', 'var(--primary)', 390], ['Auditing', 'clipboard-check', 'auditing', 'var(--tertiary)', 570], ['Testing', 'flask-conical', 'testing', 'var(--secondary)', 750]];
  duty.forEach(([n, ic, w, col, y], i) => {
    const c = add(card(470, 124, { r: 30 }), 1130, y); pop(c, at(w) - 0.1, { s0: 0.8, dx: -40, dy: 0 });
    add(chip(ic, { size: 80, bg: col, sq: true, k: 0.55, c: col === 'var(--secondary)' ? 'var(--ink)' : '#fff' }), 70, 62, c); LBL(n, 290, 62, c, { s: 40, w: 800 });
    arrow(L, 790, 620, 888, y, at(w) - 0.25, 0.45, { c: col, w: 7, hs: 20, bend: i === 0 ? -30 : i === 2 ? 30 : 0 });
  });
  const ag = add(card(260, 560, { r: 36 }), 1670, 570); pop(ag, at('software') - 0.15, { s0: 0.85, dx: 50, dy: 0 });
  LBL('Software\nagents', 130, 62, ag, { s: 30, w: 800, lh: 1.1 });
  [0, 1, 2].forEach(i => {
    const by = 480 + i * 140;
    pop(add(chip('bot', { size: 90, bg: 'var(--dark)', c: 'var(--light)', k: 0.55 }), 130, 190 + i * 140, ag), at('agents') + 0.1 + i * 0.15, { s0: 0.3 });
    arrow(L, 1372, duty[i][4], 1538, by, at('agents') + 0.15 + i * 0.15, 0.4, { c: 'var(--dark)', w: 5, hs: 16 });
  });
  const flag = add(chip('triangle-alert', { size: 70, bg: 'var(--danger)', c: '#fff', k: 0.55, sq: true }), 1752, 478); pop(flag, at('flag') - 0.05, { s0: 0.2, r0: -30 });
  tl.fromTo(flag, { rotation: 0 }, { rotation: 9, duration: 0.07, yoyo: true, repeat: 5, ease: 'none', immediateRender: false }, at('flag') + 0.4);
  pop(add(tag('anomalies', { icon: 'siren', bg: 'var(--danger)', c: '#fff', s: 26 }), 1670, 235), at('anomalies') - 0.15, { s0: 0.6 });
});

/* A4 · section title */
scene('A4', sd => rTitle({ kicker: 'Let us look at', title: 'Realistic *qualifications*', icon: 'graduation-cap', at: 0.8 }));

/* A5 · requirements vary: degree vs diplomas / certifications / apprenticeships */
scene('A5', sd => {
  const h = hero('Entry requirements *vary* *widely*', { move: at('many') - 0.3, big: 1.5, yc: 450 });
  reveal(h, 0, { times: [at('entry') - 0.1, at('requirements') - 0.1, at('vary') - 0.1, at('widely') - 0.1] });
  const big = add(card(520, 400, { r: 40 }), 540, 590); pop(big, at('computer') - 0.2, { s0: 0.8, dy: 50 });
  add(chip('graduation-cap', { size: 150, bg: 'var(--primary)', k: 0.52 }), 260, 120, big);
  LBL('Computer science\ndegrees', 260, 270, big, { s: 44, w: 800, lh: 1.1 });
  pop(add(tag('many employers', { icon: 'building-2', bg: 'var(--dark)', s: 28 }), 540, 350), at('many') - 0.1, { s0: 0.6 });
  pop(add(tag('while others value…', { icon: 'sparkles', bg: 'var(--tertiary)', c: '#fff', s: 28 }), 1370, 330), at('while') - 0.1, { s0: 0.6 });
  [['Vocational diplomas', 'scroll-text', 'vocational', 'var(--secondary)', 440], ['Network certifications', 'award', 'network', 'var(--tertiary)', 580], ['Technical apprenticeships', 'wrench', 'technical', 'var(--quaternary)', 720]].forEach(([n, ic, w, col, y]) => {
    const c = add(card(680, 118, { r: 30 }), 1370, y); pop(c, at(w) - 0.15, { s0: 0.8, dx: 60, dy: 0 });
    add(chip(ic, { size: 80, bg: col, sq: true, k: 0.55, c: col === 'var(--secondary)' ? 'var(--ink)' : '#fff' }), 70, 59, c); LBL(n, 400, 59, c, { s: 36, w: 800, mw: 520 });
  });
});

/* A6 · core fundamentals as a foundation stack */
scene('A6', sd => {
  const h = hero('Core *fundamentals*', { move: at('operating') - 0.3, big: 1.6, yc: 440 });
  reveal(h, 0, { times: [at('core') - 0.1, at('fundamentals') - 0.1] });
  [['Operating systems', 'cpu', 'operating', 'var(--quaternary)', 770, 1000], ['Networking models', 'network', 'networking', 'var(--tertiary)', 600, 860], ['Basic scripting', 'terminal', 'basic', 'var(--primary)', 430, 720]].forEach(([n, ic, w, col, y, wd]) => {
    const c = add(card(wd, 150, { r: 36 }), 960, y); pop(c, at(w) - 0.2, { s0: 0.7, dy: 60 });
    add(chip(ic, { size: 96, bg: col, sq: true, k: 0.55 }), 90, 75, c); LBL(n, wd / 2 + 40, 75, c, { s: 50, w: 800 });
  });
  pop(add(tag('languages like Python', { icon: 'file-code', bg: 'var(--secondary)', c: 'var(--ink)', s: 30 }), 1400, 330), at('languages') - 0.1, { s0: 0.6 });
});

/* A7 · the myth: elite cryptography from day one */
scene('A7', sd => {
  pop(add(tag('Common perception', { icon: 'message-circle', bg: 'var(--tertiary)', c: '#fff', s: 36 }), 960, 150), at('common') - 0.1, { s0: 0.6 });
  const bub = add(card(1000, 470, { r: 60 }), 960, 540); pop(bub, at('defensive') - 0.2, { s0: 0.8, dy: 40 });
  add(chip('lock', { size: 220, bg: 'var(--quaternary)', k: 0.52 }), 230, 235, bub);
  ['0110', '1011', '0101', '1100'].forEach((b, i) => { const t = add(tag(b, { bg: 'var(--hair)', c: 'var(--muted)', s: 28, pad: '8px 20px', sh: false }), [90, 380, 140, 400][i], [90, 380, 380, 90][i], bub); pop(t, at('cyberwork') + i * 0.12, { s0: 0.4 }); tl.to(t, { y: i % 2 ? -12 : 12, duration: 1.1, yoyo: true, repeat: 3, ease: 'sine.inOut' }, at('cyberwork') + 0.5); });
  const el = add(T('Elite cryptography\nmastery', { s: 64, mw: 520, a: 'left', lh: 1.08 }), 700, 200, bub); el.style.left = '440px'; gsap.set(el, { xPercent: 0 }); reveal(el, 0, { times: [at('elite') - 0.1, at('cryptography') - 0.1, at('mastery') - 0.1] });
  pop(add(tag('from day one', { icon: 'sunrise', bg: 'var(--secondary)', c: 'var(--ink)', s: 34 }), 715, 380, bub), at('from') - 0.15, { s0: 0.6 });
  const m = add(stamp('Myth', { s: 96 }), 1390, 330); slam(m, at('mastery') + 0.25, { rot: -10 });
});

/* A8 · the reality: foundational literacy */
scene('A8', sd => {
  const rx = add(T('_In_ _reality,_', { s: 150, c: 'var(--acc)' }), 960, 470); pop(rx, 0.5, { s0: 0.5, d: 0.7, ease: 'elastic.out(1,0.55)', blur: 8 }); gone(rx, at('you') - 0.15, { s: 0.7, dy: -120, d: 0.4 });
  rGrid({ heading: 'Foundational *literacy*', headingAt: 'foundational', cols: 3, items: [
    { icon: 'git-merge', label: 'System dependencies', at: 'dependencies', color: 'var(--primary)' },
    { icon: 'shield', label: 'Boundary enforcement', at: 'boundary', color: 'var(--tertiary)' },
    { icon: 'radar', label: 'Threat identification', at: 'threat', color: 'var(--secondary)' }] });
});
