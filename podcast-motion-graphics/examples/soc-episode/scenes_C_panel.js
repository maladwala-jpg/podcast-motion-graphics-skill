/* Segment C, split-screen section — 5:08.0 → 5:27.3 · Step 3: the escalation policy
   The host sits in a 9:16 panel on the right (composited by assemble.py); these scenes fill the left ~2/3.
   Content area: x 60…1257 (centre CX = 658.5). Captions are centred under the content area. */

/* C6 · Step 3 — write an escalation policy; define the exact boundary where automation must pause */
scene('C6', sd => {
  const L = svgLayer();
  pop(add(tag('STEP 3', { icon: 'list-checks', bg: 'var(--primary)', s: 36, pad: '14px 38px' }), CX, 100), 0.15, { s0: 0.5 });
  const h = hero('Write an *escalation* *policy*', { s: 72, move: at('policy') - 0.1, big: 1.3, yc: 420, yTop: 190 });
  reveal(h, 0, { times: [0.05, at('an'), at('escalation') - 0.1, at('policy') - 0.1] });

  // the policy document
  const doc = add(card(430, 500, { r: 36 }), 330, 575); pop(doc, at('policy') + 0.45, { s0: 0.8, dy: 50, rot: -2 });
  add(chip('file-text', { size: 76, bg: 'var(--primary)', k: 0.55, sq: true }), 70, 64, doc); LBL('Escalation\npolicy', 270, 64, doc, { s: 32, w: 800, lh: 1.1 });
  add(BAR(370, 3, 'var(--hair)'), 215, 130, doc);
  [['When to pause', 'pause', at('policy') + 0.95], ['What to record', 'scroll-text', at('in') + 0.15], ['Who confirms', 'user-check', at('document') + 0.05]].forEach(([n, ic, tt], i) => {
    const y = 205 + i * 98, row = add(mk('abs', { width: '380px', height: '78px', borderRadius: '22px', background: 'var(--hair)' }), 215, y, doc);
    add(chip(ic, { size: 50, bg: ['var(--secondary)', 'var(--tertiary)', 'var(--quaternary)'][i], c: i === 0 ? 'var(--ink)' : '#fff', k: 0.58, sq: true }), 44, 39, row); LBL(n, 220, 39, row, { s: 27, w: 800, a: 'left', mw: 280 });
    pop(row, tt, { s0: 0.9, dx: 30, dy: 0 });
  });
  pop(add(chip('badge-check', { size: 60, bg: 'var(--tertiary)', k: 0.58 }), 370, 448, doc), at('document') + 0.45, { s0: 0.2, r0: -40 });

  // the exact boundary
  const bx = 940, by = 585, bw = 610, bh = 470;
  const bd = add(card(bw, bh, { r: 36 }), bx, by); pop(bd, at('define') - 0.15, { s0: 0.85, dx: 60, dy: 0 });
  add(mk('abs', { width: '400px', height: '320px', borderRadius: '24px', background: 'color-mix(in srgb,var(--tertiary) 10%,transparent)' }), 230, 250, bd);
  add(mk('abs', { width: '150px', height: '320px', borderRadius: '24px', background: 'color-mix(in srgb,var(--secondary) 14%,transparent)' }), 520, 250, bd);
  LBL('Runs on its own', 230, 48, bd, { s: 28, w: 800, c: 'var(--tertiary)' }); LBL('Needs\na human', 520, 52, bd, { s: 24, w: 800, c: 'var(--secondary)', lh: 1.05 });
  const line = add(mk('abs', { width: '0px', height: '300px', borderLeft: '5px dashed var(--danger)' }), 440, 250, bd); line.style.transformOrigin = '50% 0'; gsap.set(line, { scaleY: 0 });
  tl.to(line, { scaleY: 1, duration: 0.6, ease: 'power2.out' }, at('exact') - 0.1);
  pop(add(tag('exact boundary', { icon: 'ruler', bg: 'var(--danger)', c: '#fff', s: 26, pad: '8px 20px' }), 440, 432, bd), at('boundary') - 0.1, { s0: 0.6 });
  const bot = add(chip('bot', { size: 100, bg: 'var(--primary)', k: 0.55 }), 90, 250, bd); pop(bot, at('automated') - 0.15, { s0: 0.3 });
  const botl = LBL('Automated\nsystem', 90, 342, bd, { s: 24, w: 800, lh: 1.05 }); pop(botl, at('automated') - 0.1, { s0: 0.8 });
  tl.to([bot, botl], { x: 270, duration: 1.0, ease: 'power2.in' }, at('system') - 0.15);
  const ps = add(chip('pause', { size: 96, bg: 'var(--danger)', c: '#fff', k: 0.55 }), 360, 250, bd); pop(ps, at('must') + 0.1, { s0: 0.2, r0: -40 });
  tl.fromTo(ps, { scale: 1 }, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 5, ease: 'sine.inOut', immediateRender: false }, at('pause') + 0.2);
  const hu = add(chip('user-check', { size: 86, bg: 'var(--quaternary)', k: 0.52 }), 520, 250, bd); pop(hu, at('pause') + 0.1, { s0: 0.2 });
  arrow(L, bx - bw / 2 + 360 + 36, by - bh / 2 + 250, bx - bw / 2 + 470, by - bh / 2 + 250, at('pause') + 0.15, 0.4, { c: 'var(--secondary)', w: 6, hs: 16 });
});

/* C7 · after the pause: audit trail → human confirmation → only then, a simulated quarantine */
scene('C7', sd => {
  const L = svgLayer();
  const h = add(T('The safe escalation *flow*', { s: 66 }), CX, 165); reveal(h, 0, { times: [0.35, 0.55, 0.75, 0.9] });
  const xs = [201, 506, 811, 1116], cy = 540, cw = 255, ch = 340;
  const stage = (i, icon, label, col, t, ink) => {
    const c = add(card(cw, ch, { r: 36 }), xs[i], cy); pop(c, t, { s0: 0.8, dy: 40 });
    const nb = add(chip(null, { size: 46, bg: 'var(--dark)' }), 38, 38, c); nb.textContent = i + 1; nb.style.font = "800 24px/1 'InterV'"; nb.style.color = 'var(--light)';
    add(chip(icon, { size: 100, bg: col, k: 0.55, c: ink ? 'var(--ink)' : '#fff' }), cw / 2, 118, c);
    LBL(label, cw / 2, 218, c, { s: 29, w: 800, lh: 1.1, mw: cw - 30 });
    return c;
  };
  const c1 = stage(0, 'pause', 'System\npauses', 'var(--secondary)', 0.3, true);
  const c2 = stage(1, 'file-clock', 'Audit trail\ngenerated', 'var(--tertiary)', at('audit') - 0.2);
  [0, 1, 2].forEach(i => pop(add(BAR(150 - i * 30, 12, 'var(--muted)', { opacity: 0.35 }), 80 + (150 - i * 30) / 2, 275 + i * 20, c2), at('audit') + 0.25 + i * 0.18, { s0: 0.4, dy: 0, d: 0.35 }));
  const c3 = stage(2, 'user-check', 'Human\nconfirms', 'var(--quaternary)', at('request') - 0.15);
  pop(add(tag('Approve', { icon: 'check', bg: 'var(--tertiary)', c: '#fff', s: 22, pad: '8px 20px', sh: false }), cw / 2, 285, c3), at('confirmation') + 0.35, { s0: 0.4 });
  const c4 = stage(3, 'shield-alert', 'Simulated\nquarantine', 'var(--primary)', at('simulated') - 0.2);
  pop(add(tag('simulated only', { icon: 'flask-conical', bg: 'var(--secondary)', c: 'var(--ink)', s: 22, pad: '8px 18px', sh: false }), cw / 2, 290, c4), at('quarantine') - 0.15, { s0: 0.4 });
  // connectors
  const gap = (a, b) => [xs[a] + cw / 2 + 8, xs[b] - cw / 2 - 8];
  [[0, 1, 0.65], [1, 2, at('request') - 0.35]].forEach(([a, b, t]) => { const [x1, x2] = gap(a, b); arrow(L, x1, cy, x2, cy, t, 0.3, { c: 'var(--dark)', w: 6, hs: 14 }); });
  // the gate before the quarantine: locked until the human has confirmed
  const lk = add(chip('lock', { size: 60, bg: 'var(--danger)', c: '#fff', k: 0.58 }), (xs[2] + xs[3]) / 2, cy, null); pop(lk, at('before') - 0.1, { s0: 0.2, r0: -40 });
  const ul = add(chip('lock-open', { size: 60, bg: 'var(--tertiary)', c: '#fff', k: 0.58 }), (xs[2] + xs[3]) / 2, cy, null); gsap.set(ul, { autoAlpha: 0 });
  tl.to(lk, { autoAlpha: 0, scale: 0.6, duration: 0.2 }, at('applying') + 0.1); tl.fromTo(ul, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, at('applying') + 0.2);
  pop(add(tag('Nothing is applied until a human confirms', { icon: 'hand', bg: 'var(--dark)', s: 30, pad: '14px 34px' }), CX, 800), at('before') + 0.1, { s0: 0.6 });
});

/* C8 · document your reasoning — practise explaining the technical trade-offs */
scene('C8', sd => {
  const h = hero('Document your *reasoning*', { s: 62, move: at('document'), big: 1.0, yc: 170, yTop: 170 });
  reveal(h, 0, { times: [at('document') - 0.05, at('your') - 0.05, at('reasoning') - 0.15] });
  // reasoning notebook
  const nb = add(card(420, 450, { r: 36 }), 290, 560); pop(nb, at('reasoning') - 0.1, { s0: 0.8, dy: 50, rot: 2 });
  add(chip('notebook-pen', { size: 76, bg: 'var(--secondary)', c: 'var(--ink)', k: 0.55, sq: true }), 70, 64, nb); LBL('My reasoning', 270, 64, nb, { s: 31, w: 800 });
  add(BAR(360, 3, 'var(--hair)'), 210, 126, nb);
  ['Why we paused', 'What the logs showed', 'What a human decided'].forEach((n, i) => {
    const row = add(mk('abs', { width: '360px', height: '74px', borderRadius: '20px', background: 'var(--hair)' }), 210, 200 + i * 92, nb); LBL(n, 190, 37, row, { s: 24, w: 700, a: 'left', mw: 300 });
    pop(row, at('reasoning') + 0.3 + i * 0.35, { s0: 0.9, dx: 30, dy: 0 });
    pop(add(chip('check', { size: 40, bg: 'var(--tertiary)', k: 0.65, sw: 3.4 }), 338, 37, row), at('reasoning') + 0.55 + i * 0.35, { s0: 0.1, r0: -40 });
  });
  // trade-off scale: speed of automation vs safety
  const px = 880, py = 360;
  const post = add(mk('abs', { width: '16px', height: '300px', borderRadius: '8px', background: 'var(--light)' }), px, py + 150); pop(post, at('technical') - 0.35, { s0: 1, dy: 40 });
  const base = add(mk('abs', { width: '220px', height: '30px', borderRadius: '15px', background: 'var(--light)' }), px, py + 312); pop(base, at('technical') - 0.35, { s0: 0.6 });
  const beam = add(mk('abs', { width: '520px', height: '16px', borderRadius: '8px', background: 'var(--light)' }), px, py); gsap.set(beam, { rotation: -8 }); pop(beam, at('technical') - 0.3, { s0: 1, dy: 0, r0: -8, r: -8 });
  pop(add(chip(null, { size: 40, bg: 'var(--secondary)' }), px, py), at('technical') - 0.3, { s0: 0.2 });
  const pan = (dx, ic, n, col, ink, off) => { const p = add(mk('abs', { width: '230px', height: '170px' }), px + dx, py + 135); const c = add(card(230, 120, { r: 28 }), 115, 110, p); add(chip(ic, { size: 60, bg: col, c: ink ? 'var(--ink)' : '#fff', k: 0.58, sq: true }), 52, 60, c); LBL(n, 150, 60, c, { s: 26, w: 800, lh: 1.05 }); add(mk('abs', { width: '4px', height: '60px', background: 'var(--light)' }), 115, 25, p); gsap.set(p, { y: off }); pop(p, at('technical') - 0.1, { s0: 0.6, dy: 40 }); return p; };
  const pl = pan(-225, 'zap', 'Speed', 'var(--secondary)', true, 38), pr = pan(225, 'shield-check', 'Safety', 'var(--tertiary)', false, -38);
  tl.to([pl, pr], { y: 0, duration: 0.9, ease: 'elastic.out(1,0.55)' }, at('trade') - 0.15); tl.to(beam, { rotation: 0, duration: 0.9, ease: 'elastic.out(1,0.55)' }, at('trade') - 0.15);
  pop(add(tag('explain the trade-offs', { icon: 'messages-square', bg: 'var(--primary)', s: 28 }), 880, 800), at('explaining') - 0.1, { s0: 0.6 });
});
