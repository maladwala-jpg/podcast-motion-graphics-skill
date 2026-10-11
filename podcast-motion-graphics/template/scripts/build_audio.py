#!/usr/bin/env python3
"""Build the final soundtrack to match the edited video, level every speaker turn, and write out/audio_final.wav.

  python3 scripts/build_audio.py        (assemble.py calls this for you)

1. ASSEMBLE along out/timeline.json (written by assemble.py): host and replaced-scene frames take the source audio of the same frames;
   inserted clips (title cards) get silence (+ an optional sting); holds play the source audio of the frames they REPLACED (so a final
   syllable finishes naturally) and then a very faint room-tone bed (edit key "room_tone_db", default -62 dBFS; null = silence). Edges get tiny fades.
2. LEVEL (plan.json -> "sound": {"level": {...}}): speech turns are found with an energy gate (AI-avatar voices sit on near-silence), the
   loudness of each turn is measured (ITU-R BS.1770 LUFS) and each turn is moved to `target_lufs` (gain limited to [min_gain_db, max_gain_db]).
   Gains change only inside the pauses between turns (smooth ramps), never mid-word. Then a peak limiter keeps true peak below `true_peak_db`.
   Result: host-to-host differences disappear while each speaker keeps their natural dynamics within a turn.
3. STING (plan.json -> "sound": {"sting": {"gain_db": -9}}; gain_db = peak level in dBFS, about 9 LU below the speech): a soft whoosh + chime on every inserted clip (title card); "sting": false disables it.

plan.json
  "sound": { "level": { "target_lufs": -15, "max_gain_db": 20, "min_gain_db": -15, "true_peak_db": -1.5, "gate_db": -45 },
             "sting": { "gain_db": -9 } }
No "sound" key = the source audio is used unchanged (frame-exact copy along the timeline).
"""
import json, os, sys
import numpy as np
from scipy.io import wavfile
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import audiotools as AT
SR = AT.SR

def fade_edges(x, i0, i1, ms=8):
    n = int(SR * ms / 1000)
    if i1 - i0 < 2 * n: return
    r = np.linspace(0, 1, n, dtype=np.float32)[:, None]
    x[i0:i0 + n] *= r; x[i1 - n:i1] *= r[::-1]

def pink_noise(n, rms_db, seed=3):
    """Very faint low-passed noise bed (default about -62 dBFS RMS): keeps a long pause from being dead digital silence."""
    rng = np.random.default_rng(seed); out = np.zeros((n, 2), np.float32)
    from scipy.signal import butter, lfilter
    b, a = butter(2, 2800 / (SR / 2))
    for c in range(2):
        x = lfilter(b, a, rng.standard_normal(n)); x /= max(1e-9, np.sqrt((x ** 2).mean())); out[:, c] = x * 10 ** (rms_db / 20)
    f = int(0.4 * SR)
    if n > 2 * f: out[:f] *= np.linspace(0, 1, f)[:, None]; out[-f:] *= np.linspace(1, 0, f)[:, None]
    return out

def hold_audio(src, ed, fps, n):
    """Audio for a hold = the source audio of the frames the hold REPLACED (so a word that ends just after the held frame finishes
    naturally and any real pause is kept), then a very faint room-tone bed for the rest."""
    a = int((ed['anchor_frame'] + 1) / fps * SR); b = int(ed['drop_to_frame'] / fps * SR)
    out = np.zeros((n, 2), np.float32); seg = src[a:b][:n]; out[:len(seg)] = seg
    return out, len(seg)      # the room-tone bed for the remainder is added AFTER leveling (otherwise the leveler would amplify it into hiss)

def sting(n, gain_db, seed=7):
    """Soft whoosh that swells into a two-note chime, with a light exit swish — all synthesised (no samples, no licensing)."""
    rng = np.random.default_rng(seed); t = np.arange(n) / SR; dur = n / SR
    def noise_sweep(f0, f1, t0, t1, peak_at):
        out = np.zeros(n); i0, i1 = int(t0 * SR), min(n, int(t1 * SR)); y = 0.0
        x = rng.standard_normal(i1 - i0); L = i1 - i0; u = np.arange(L) / L
        fc = f0 * (f1 / f0) ** u; al = 1 - np.exp(-2 * np.pi * fc / SR); seg = np.zeros(L)
        for k in range(L): y += al[k] * (x[k] - y); seg[k] = y
        env = np.where(u < peak_at, (u / peak_at) ** 2, ((1 - u) / (1 - peak_at)) ** 1.5)
        out[i0:i1] = seg * env * 3.2; return out
    ch = []
    for c in range(2):
        w = noise_sweep(260, 6500, 0.0, min(0.62, dur * .4), 0.8) + 0.55 * noise_sweep(5200, 380, max(0.0, dur - 0.5), dur - 0.05, 0.35)
        env_c = np.where(t >= 0.38, np.exp(-(t - 0.38) / 0.42), 0.0)
        chime = env_c * (np.sin(2 * np.pi * 880 * t) + 0.55 * np.sin(2 * np.pi * 1318.5 * t + 0.4) + 0.2 * np.sin(2 * np.pi * 1760 * t)) * 0.16
        ch.append(w * 0.22 + chime)
    s = np.stack(ch, 1).astype(np.float32); s /= max(1e-6, np.abs(s).max()); s *= 10 ** (gain_db / 20)
    fade = int(0.03 * SR); s[:fade] *= np.linspace(0, 1, fade)[:, None]; s[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return s

def level(a, cfg, report):
    tgt = cfg.get('target_lufs', -15.0); gmax = cfg.get('max_gain_db', 20.0); gmin = cfg.get('min_gain_db', -15.0)
    utts = AT.utterances(a, SR, cfg.get('gate_db', -45.0), cfg.get('min_gap', 0.35), cfg.get('min_len', 0.5))
    before = AT.utterance_lufs(a, utts)
    g_db = []
    for L in before: g_db.append(0.0 if not np.isfinite(L) else float(np.clip(tgt - L, gmin, gmax)))
    # gain envelope at 5 ms resolution: constant over a turn, smoothstep ramps across the pause between turns
    res = int(SR * 0.005); n = len(a) // res + 1; env = np.zeros(n)
    t = np.arange(n) * res / SR
    if utts:
        env[:] = g_db[0]
        for i in range(len(utts)):
            s, e = utts[i]; env[(t >= s) & (t < e)] = g_db[i]
            if i + 1 < len(utts):
                s2 = utts[i + 1][0]; gap = s2 - e; ramp = min(0.45, max(0.05, gap - 0.1)); r0 = e + (gap - ramp) / 2; m = (t >= e) & (t < s2)
                u = np.clip((t[m] - r0) / ramp, 0, 1); u = u * u * (3 - 2 * u); env[m] = g_db[i] + (g_db[i + 1] - g_db[i]) * u
            if i == 0: env[t < s] = g_db[0]
        env[t >= utts[-1][1]] = g_db[-1]
    g = np.interp(np.arange(len(a)) / SR, t, 10 ** (env / 20)).astype(np.float32)
    out = a * g[:, None]
    # peak limiter: 1 ms blocks, 5 ms look-ahead (min filter), instant attack, 60 ms release, then smoothed -> keeps true peak under the ceiling
    from scipy.ndimage import minimum_filter1d, uniform_filter1d
    ceil = 10 ** (cfg.get('true_peak_db', -1.5) / 20) * 0.97; blk = int(SR * 0.001); nb = len(out) // blk
    pk = np.abs(out[:nb * blk]).max(1).reshape(nb, blk).max(1); need = np.minimum(1.0, ceil / np.maximum(pk, 1e-9))
    need = minimum_filter1d(need, size=11); gain = np.ones(nb); g = 1.0; rel = np.exp(-1 / 60.0)
    for i in range(nb):
        g = need[i] if need[i] < g else min(need[i], 1 - rel * (1 - g)); gain[i] = g
    gs = np.interp(np.arange(len(out)), (np.arange(nb) + 0.5) * blk, gain); gs = uniform_filter1d(gs, size=2 * blk).astype(np.float32)
    out = out * gs[:, None]
    after = AT.utterance_lufs(out, utts)
    report.update({'turns': len(utts), 'before': AT.spread_stats(before), 'after': AT.spread_stats(after), 'gain_db_min': float(min(g_db)) if g_db else 0, 'gain_db_max': float(max(g_db)) if g_db else 0,
                   'true_peak_db_after': AT.true_peak_db(out), 'integrated_lufs_after': AT.loudness(out), 'target_lufs': tgt})
    return out.astype(np.float32)

def main():
    plan = json.load(open('plan.json')); tl = json.load(open('out/timeline.json')); FPS = tl['fps']
    cfg = plan.get('sound') or {}
    src_path = plan['source'] if tl['mode'] == 'replace' else plan['audio']
    src = AT.load_audio(src_path)
    total = round(tl['out_total_frames'] / FPS * SR); out = np.zeros((total, 2), np.float32); inserts = []; tones = []
    for p in tl['pieces']:
        s0, s1 = round(p['out_f0'] / FPS * SR), round(p['out_f1'] / FPS * SR); n = s1 - s0
        if p['kind'] == 'hold':
            ed = next(e for e in tl['edits'] if e['id'] == p['id']); out[s0:s1], used = hold_audio(src, ed, FPS, n); fade_edges(out, s0, s1, 3); tones.append((s0 + used, s1, ed.get('room_tone_db', -62.0)))
        elif p['kind'] == 'scene' and p.get('insert'):
            inserts.append((s0, s1)); fade_edges(out, s0, s1)
        else:
            a0 = round(p['src_f0'] / FPS * SR); seg = src[a0:a0 + n]; out[s0:s0 + len(seg)] = seg
    report = {}
    if cfg.get('level'):
        out = level(out, cfg['level'], report)
    for t0, t1, db in tones:          # faint room tone for the long pauses of holds (after leveling, so it stays inaudible)
        if db is not None and t1 - t0 > 0.5 * SR: out[t0:t1] += pink_noise(t1 - t0, db)
    st = cfg.get('sting', {})
    if cfg and st is not False and inserts:
        gdb = st.get('gain_db', -9.0) if isinstance(st, dict) else -9.0
        for s0, s1 in inserts: out[s0:s1] += sting(s1 - s0, gdb)
        report['sting_inserts'] = len(inserts)
    out = np.clip(out, -1.0, 1.0)
    os.makedirs('out', exist_ok=True); wavfile.write('out/audio_final.wav', SR, out.astype(np.float32))
    report['duration_s'] = len(out) / SR; json.dump(report, open('out/audio_report.json', 'w'), indent=1)
    if 'before' in report:
        b, a = report['before'], report['after']
        print(f"leveled {report['turns']} speech turns: loudness spread (std) {b['std']:.2f} dB -> {a['std']:.2f} dB;  range {b['min']:.1f}..{b['max']:.1f} -> {a['min']:.1f}..{a['max']:.1f} LUFS;  "
              f"gains {report['gain_db_min']:+.1f}..{report['gain_db_max']:+.1f} dB;  integrated {report['integrated_lufs_after']:.1f} LUFS, true peak {report['true_peak_db_after']:.1f} dBTP")
    print(f"wrote out/audio_final.wav ({report['duration_s']:.2f}s)")

if __name__ == '__main__':
    main()
