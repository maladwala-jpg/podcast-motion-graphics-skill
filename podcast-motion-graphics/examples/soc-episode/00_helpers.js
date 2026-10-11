/* shared helpers for this episode's scenes */
const LBL = (t, x, y, par, o = {}) => add(T(t, Object.assign({ f: 'sans', s: 30, w: 700 }, o)), x, y, par);
const NUM = (size, o = {}) => { const e = mk('abs t ' + (o.f || 'serif'), { fontSize: size + 'px', fontWeight: o.w || 700, color: o.c || 'var(--fg)', textAlign: 'center' }); e.textContent = o.t != null ? o.t : '0'; return e; };
const BAR = (w, h, c, o = {}) => mk('abs', Object.assign({ width: w + 'px', height: h + 'px', borderRadius: (h / 2) + 'px', background: c || 'var(--hair)' }, o));
