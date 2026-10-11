/* Segment B — 3:06.57 → 4:03.10 · safe supervised boundaries, the day-one scenario, will these skills stay relevant? */

/* B1 · a beginner never commands live infrastructure alone — they assist inside safe, supervised boundaries */
scene('B1', sd => {
  const L = svgLayer();
  const h = hero('A beginner does *not* command live systems *alone*', { s: 66, move: at('instead') - 0.3, big: 1.12, yc: 300, yTop: 150 });
  reveal(h, 0, { times: [at('beginner') - 0.05, at('beginner') + 0.25, at('does') + 0.1, at('not') - 0.1, at('command') - 0.05, at('live') - 0.05, at('infrastructure') - 0.05, at('alone') - 0.1] });
  const infra = add(card(380, 330, { r: 36 }), 1420, 640); pop(infra, at('live') - 0.1, { s0: 0.85, dx: 50, dy: 0 });
  add(chip('server', { size: 120, bg: 'var(--quaternary)', k: 0.55 }), 190, 100, infra); LBL('Live corporate\ninfrastructure', 190, 230, infra, { s: 30, w: 800, lh: 1.1 });
  const lock = add(chip('lock', { size: 84, bg: 'var(--danger)', c: '#fff', k: 0.55 }), 1560, 510); pop(lock, at('alone') - 0.15, { s0: 0.2, r0: -40 });
  const you = add(chip('user-round', { size: 130, bg: 'var(--primary)', k: 0.52 }), 360, 640); pop(you, at('beginner') - 0.1);
  pop(add(T('Beginner', { f: 'sans', s: 32, w: 800 }), 360, 740), at('beginner'), { s0: 0.8 });
  const xx = add(chip('x', { size: 100, bg: 'var(--danger)', k: 0.62, sw: 3.4 }), 880, 640); pop(xx, at('not') + 0.15, { s0: 0.2, r0: -40 });
  drawOn(L, 'M 440 640 L 820 640', at('command') - 0.1, 0.6, { c: 'var(--danger)', w: 7, dash: '3 14' });
  // instead: supervised boundary
  tl.to([you, infra, xx, lock], { opacity: 0.25, duration: 0.5 }, at('instead') - 0.25);
  const zone = add(mk('abs', { width: '1280px', height: '480px', border: '5px dashed var(--tertiary)', borderRadius: '50px', background: 'color-mix(in srgb,var(--tertiary) 7%,transparent)' }), 960, 660); pop(zone, at('safe') - 0.3, { s0: 0.94, dy: 0, d: 0.7 });
  pop(add(tag('Safe, supervised boundaries', { icon: 'shield-check', bg: 'var(--tertiary)', c: '#fff', s: 36, pad: '16px 38px' }), 960, 425), at('safe') - 0.15, { s0: 0.6 });
  const sen = add(chip('user-check', { size: 150, bg: 'var(--quaternary)', k: 0.5 }), 1280, 680); pop(sen, at('experienced') - 0.1);
  pop(add(T('Experienced security\nengineers', { f: 'sans', s: 30, w: 800, lh: 1.1 }), 1280, 810), at('security') - 0.1, { s0: 0.8 });
  const you2 = add(chip('user-round', { size: 150, bg: 'var(--primary)', k: 0.52 }), 640, 680); pop(you2, at('you') - 0.1);
  pop(add(T('You assist', { f: 'sans', s: 32, w: 800 }), 640, 810), at('assist') - 0.05, { s0: 0.8 });
  arrow(L, 735, 680, 1180, 680, at('assist') + 0.1, 0.7, { c: 'var(--tertiary)', w: 8 });
});

/* B2 · automated tools speed things up, but juniors build judgment by checking outputs beside seniors */
scene('B2', sd => {
  const L = svgLayer();
  const h = hero('Tools speed it up. *Judgment* is built.', { s: 64, move: at('junior') - 0.3, big: 1.3, yc: 330, yTop: 150 });
  reveal(h, 0, { times: [at('automated') + 0.05, at('accelerate') - 0.1, at('accelerate') + 0.25, at('drafting') - 0.05, at('evaluative') - 0.2, at('judgment') + 0.05, at('judgment') + 0.4] });
  const t = add(card(500, 340, { r: 36 }), 460, 570); pop(t, at('automated') - 0.1, { s0: 0.85, dy: 40 });
  add(chip('bot', { size: 100, bg: 'var(--primary)', k: 0.55 }), 250, 85, t); LBL('Automated tools', 250, 180, t, { s: 36, w: 800 });
  pop(add(tag('drafting', { icon: 'file-pen', bg: 'var(--secondary)', c: 'var(--ink)', s: 26 }), 250, 245, t), at('drafting') - 0.1, { s0: 0.6 });
  pop(add(tag('anomaly detection', { icon: 'scan-search', bg: 'var(--tertiary)', c: '#fff', s: 26 }), 250, 297, t), at('anomaly') - 0.1, { s0: 0.6 });
  const bolt = add(chip('zap', { size: 70, bg: 'var(--secondary)', c: 'var(--ink)', k: 0.6 }), 710, 400); pop(bolt, at('accelerate') - 0.1, { s0: 0.2, r0: -40 });
  const pr = add(card(780, 340, { r: 36 }), 1380, 570); pop(pr, at('junior') - 0.15, { s0: 0.85, dx: 50, dy: 0 });
  add(chip('user-round', { size: 110, bg: 'var(--primary)', k: 0.52 }), 170, 100, pr); LBL('Junior analyst', 170, 190, pr, { s: 30, w: 800 });
  add(chip('user-check', { size: 110, bg: 'var(--quaternary)', k: 0.5 }), 610, 100, pr); LBL('Senior staff', 610, 190, pr, { s: 30, w: 800 });
  const ck = add(chip('clipboard-check', { size: 120, bg: 'var(--tertiary)', k: 0.55, sq: true }), 390, 100, pr); pop(ck, at('checking') - 0.1, { s0: 0.3 });
  drawOn(L, 'M 725 570 L 790 570', at('checking') - 0.2, 0.3, { c: 'var(--primary)', w: 6 });
  pop(add(tag('checking outputs', { icon: 'search-check', bg: 'var(--dark)', s: 28 }), 390, 245, pr), at('checking') + 0.05, { s0: 0.6 });
  pop(add(tag('alongside', { icon: 'users', bg: 'var(--secondary)', c: 'var(--ink)', s: 28 }), 390, 297, pr), at('alongside') - 0.1, { s0: 0.6 });
  // judgment meter
  const mt = add(BAR(640, 26, 'var(--hair)'), 1380, 855); pop(mt, at('evaluative') - 0.1, { s0: 0.9, dy: 0 });
  const fl = add(BAR(640, 26, 'var(--primary)', { transformOrigin: '0 50%' }), 1380, 855); gsap.set(fl, { scaleX: 0 }); tl.fromTo(fl, { scaleX: 0 }, { scaleX: 1, duration: 3.2, ease: 'power2.out' }, at('evaluative'));
  pop(add(tag('evaluative judgment', { icon: 'brain', bg: 'var(--primary)', s: 30 }), 1380, 800), at('judgment') - 0.15, { s0: 0.6 });
});

/* B3 · hypothetical day-one: automated script flags a traffic burst overnight and isolates it in a sandbox */
scene('B3', sd => {
  const L = svgLayer();
  pop(add(tag('HYPOTHETICAL DAY ONE', { icon: 'lightbulb', bg: 'var(--tertiary)', c: '#fff', s: 32 }), 960, 100), at('hypothetical') - 0.15, { s0: 0.6 });
  const mn = add(card(330, 330, { r: 40 }), 330, 540); pop(mn, at('picture') - 0.1, { s0: 0.8, dy: 40 });
  add(chip('moon', { size: 130, bg: 'var(--quaternary)', k: 0.55 }), 165, 105, mn); LBL('Overnight run', 165, 235, mn, { s: 30, w: 800 });
  const sun = LBL('Senior supervision', 165, 280, mn, { s: 24, c: 'var(--muted)' }); pop(sun, at('supervision') - 0.05, { s0: 0.8 });
  const sc = add(card(430, 260, { r: 36 }), 840, 540); pop(sc, at('automated') - 0.1, { s0: 0.8 });
  add(chip('bot', { size: 100, bg: 'var(--primary)', k: 0.55 }), 80, 90, sc); LBL('Automated\ndefensive script', 285, 90, sc, { s: 30, w: 800, lh: 1.1 });
    // traffic burst graph (drawn inside the script card)
  const NSV = 'http://www.w3.org/2000/svg', gs = document.createElementNS(NSV, 'svg'); gs.setAttribute('width', 300); gs.setAttribute('height', 90); gs.setAttribute('viewBox', '0 0 300 90'); gs.style.cssText = 'position:absolute;left:65px;top:150px;overflow:visible'; sc.appendChild(gs);
  drawOn(gs, 'M 0 70 L 45 68 L 80 70 L 110 25 L 135 82 L 160 8 L 190 76 L 225 62 L 300 70', at('burst') - 0.2, 1.4, { c: 'var(--danger)', w: 5 });
  const al = add(chip('triangle-alert', { size: 80, bg: 'var(--danger)', c: '#fff', k: 0.55, sq: true }), 1230 - 160, 410); pop(al, at('abnormal') - 0.1, { s0: 0.2, r0: -30 });
  tl.fromTo(al, { rotation: 0 }, { rotation: 9, duration: 0.07, yoyo: true, repeat: 5, ease: 'none', immediateRender: false }, at('abnormal') + 0.4);
  pop(add(tag('burst of abnormal traffic', { icon: 'activity', bg: 'var(--danger)', c: '#fff', s: 28 }), 840, 720), at('burst') - 0.1, { s0: 0.6 });
  // sandbox
  const box = add(mk('abs', { width: '470px', height: '400px', border: '5px dashed var(--tertiary)', borderRadius: '44px', background: 'color-mix(in srgb,var(--tertiary) 8%,transparent)' }), 1530, 540); pop(box, at('sandbox') - 0.25, { s0: 0.9, dy: 0 });
  pop(add(tag('Sandbox staging', { icon: 'box', bg: 'var(--tertiary)', c: '#fff', s: 30 }), 1530, 310), at('sandbox') - 0.1, { s0: 0.6 });
  const cube = add(chip('triangle-alert', { size: 120, bg: 'var(--secondary)', c: 'var(--ink)', k: 0.55 }), 1050 + 0, 540); gsap.set(cube, { autoAlpha: 0 });
  tl.fromTo(cube, { autoAlpha: 0, x: 0, scale: 0.6 }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.3 }, at('isolates') - 0.1);
  tl.to(cube, { x: 480, duration: 0.8, ease: 'power2.inOut' }, at('isolates') + 0.25);
  arrow(L, 1090, 700, 1420, 700, at('isolates') + 0.1, 0.6, { c: 'var(--tertiary)', w: 7 });
  pop(add(chip('shield-check', { size: 110, bg: 'var(--tertiary)', k: 0.58 }), 1530, 640), at('environment') - 0.1, { s0: 0.2 });
});

/* B4 · your task: inspect the agent summary against synthetic telemetry, verify not a false positive, document */
scene('B4', sd => {
  const L = svgLayer();
  const fwt = add(T('Redesign the company *firewall*?', { s: 82 }), 960, 470); reveal(fwt, 0, { times: [at('your') + 0.1, at('redesigning') - 0.05, at('the') + 0.0, at('company') - 0.05, at('firewall') - 0.1] });
  strike(fwt, at('firewall') + 0.25, { c: 'var(--danger)', h: 0.07, top: '52%' });
  pop(add(tag('not your task', { icon: 'ban', bg: 'var(--danger)', c: '#fff', s: 36, pad: '16px 38px' }), 960, 600), at('not') - 0.05, { s0: 0.6 });
  gone(fwt, at('under') - 0.4, { dy: -130, s: 0.7, d: 0.45 }); gone(fwt.nextSibling, at('under') - 0.4, { dy: -100, s: 0.8, d: 0.45 });
  // steps as a vertical checklist
  const sen = add(chip('user-check', { size: 150, bg: 'var(--quaternary)', k: 0.5 }), 280, 700); pop(sen, at('under') - 0.1);
  pop(add(T('Senior analyst\nguides you', { f: 'sans', s: 30, w: 800, lh: 1.1 }), 280, 830), at('senior') - 0.1, { s0: 0.8 });
  const steps = [['Inspect the agent\'s summary', 'file-search', 'inspect', 'var(--primary)', 310], ['Compare to synthetic telemetry', 'git-compare', 'synthetic', 'var(--tertiary)', 465], ['Verify: not a false positive', 'badge-check', 'verify', 'var(--secondary)', 620], ['Document the anomaly', 'notebook-pen', 'document', 'var(--quaternary)', 775]];
  steps.forEach(([n, ic, w, col, y], i) => {
    const c = add(card(850, 128, { r: 30 }), 1300, y); pop(c, at(w) - 0.1, { s0: 0.8, dx: 60, dy: 0 });
    const nb = add(chip(null, { size: 50, bg: 'var(--dark)' }), 42, 64, c); nb.textContent = i + 1; nb.style.font = "800 26px/1 'InterV'"; nb.style.color = 'var(--light)';
    add(chip(ic, { size: 84, bg: col, sq: true, k: 0.55, c: col === 'var(--secondary)' ? 'var(--ink)' : '#fff' }), 130, 64, c); LBL(n, 500, 64, c, { s: 33, w: 800, a: 'left', mw: 640 });
    pop(add(chip('check', { size: 52, bg: 'var(--tertiary)', k: 0.62, sw: 3.4 }), 790, 64, c), at(w) + 0.9 + (i === 3 ? 0.2 : 0), { s0: 0.1, r0: -40 });
  });
  });

/* B5 · will these skills become obsolete? */
scene('B5', sd => {
  const q = add(chip(null, { size: 230, bg: 'var(--secondary)' }), 960, 400); q.textContent = '?'; q.style.font = "800 150px/1 'InterV'"; q.style.color = 'var(--ink)'; pop(q, at('if') - 0.1, { s0: 0.2, r0: -40, d: 0.7 });
  tl.to(q, { rotation: 8, duration: 0.2, yoyo: true, repeat: 9, ease: 'sine.inOut' }, at('do') - 0.2);
  const h = add(T('Do these skills become *obsolete* quickly?', { s: 78, mw: 1500 }), 960, 660); reveal(h, 0, { times: [at('do') - 0.1, at('these') - 0.05, at('skills') - 0.05, at('become') - 0.05, at('obsolete') - 0.1, at('quickly') - 0.1] });
  pop(add(tag('agentic tools keep evolving', { icon: 'refresh-cw', bg: 'var(--primary)', s: 34, pad: '16px 38px' }), 960, 170), at('agentic') - 0.1, { s0: 0.6 });
});
