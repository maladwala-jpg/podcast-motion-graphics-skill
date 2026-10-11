/* Title card inserted at 0:46 (frame 1392) — the cut from the hook to the main body.
   3.0 s (about 2 s fully readable), fast wood-slat wipes (wipe_speed 0.6). No transcript words, so every beat is timed in plain seconds. */
scene('T1', sd => {
  const cx = SW / 2;
  // soft radar sweep behind everything (SOC = watchtower)
  const sweep = add(mk('abs', { width: '1500px', height: '1500px', borderRadius: '50%', background: 'conic-gradient(from 0deg, color-mix(in srgb,var(--secondary) 0%,transparent) 0deg, color-mix(in srgb,var(--secondary) 22%,transparent) 70deg, color-mix(in srgb,var(--secondary) 0%,transparent) 71deg)', opacity: 0 }), cx, 470);
  tl.fromTo(sweep, { autoAlpha: 0, rotation: -80 }, { autoAlpha: 0.9, rotation: 340, duration: 2.6, ease: 'power1.inOut' }, 0.05);
  // kicker
  pop(add(tag("TODAY'S CAREER PATHWAY", { icon: 'compass', bg: 'var(--secondary)', c: 'var(--ink)', s: 34, pad: '16px 42px' }), cx, 190), 0.12, { s0: 0.5, d: 0.45 });
  // icon with pulse rings
  [0, 1].forEach(i => { const r = add(mk('abs', { width: '210px', height: '210px', borderRadius: '50%', border: '5px solid var(--secondary)' }), cx, 395); gsap.set(r, { autoAlpha: 0 }); tl.fromTo(r, { autoAlpha: 0.8, scale: 1 }, { autoAlpha: 0, scale: 2.1, duration: 0.9, ease: 'power2.out', immediateRender: false }, 0.3 + i * 0.35); });
  pop(add(chip('shield-check', { size: 190, bg: 'var(--primary)', k: 0.52 }), cx, 395), 0.2, { s0: 0.2, r0: -70, d: 0.6, ease: 'back.out(1.8)' });
  // title
  const t = add(T('Autonomous *SOC*\nOrchestrator', { s: 128, lh: 1.02 }), cx, 640); reveal(t, 0, { times: [0.35, 0.47, 0.6], dy: 40, blur: 8, d: 0.45 });
  // subtitle
  pop(add(T('Security Operations Center', { f: 'sans', s: 42, w: 700, c: 'var(--muted)' }), cx, 862), 0.78, { s0: 0.92, dy: 20, d: 0.45 });
  const line = add(mk('abs', { width: '420px', height: '6px', borderRadius: '3px', background: 'var(--secondary)', transformOrigin: '50% 50%' }), cx, 800); tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.out' }, 0.7);
});
