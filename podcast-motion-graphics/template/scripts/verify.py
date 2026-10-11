#!/usr/bin/env python3
"""Post-render checks, driven by out/timeline.json (written by assemble.py).  Run:  python3 scripts/verify.py [out/final.mp4]

 1 structure   frame count == timeline total; size; fps; audio length == video length
 2 hosts       every kept presenter run matches the presenter footage (host master if plan.host_source, else the upscaled source), PSNR >= 38 dB
 3 replaced    scene clips that replace source frames differ strongly from the old scenes
 4 holds       the first hold frame continues the last kept frame (no visible jump); its last frame equals the edit's final frame
 5 panels      split-screen host panels show the presenter crop (>= 30 dB) at the right moment
 6 audio       with plan "sound": speech turns are even (loudness std dB), peak below the ceiling, integrated loudness reported.
               without it (unedited): sample count, zero lag and ~1.0 correlation against the source audio
 7 seams       out/seams.jpg - frames either side of every host<->graphics/hold/insert boundary (LOOK AT IT)
Exit code 1 if any hard check fails.
"""
import json, os, subprocess, sys
import numpy as np, cv2
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from toolenv import ffmpeg_path
from PIL import Image, ImageDraw

OUT = sys.argv[1] if len(sys.argv) > 1 else 'out/final.mp4'
plan = json.load(open('plan.json')); meta = json.load(open('data/scenes.json')); P = meta['project']
W, H, FPS, mode = P['width'], P['height'], P['fps'], P['mode']
tl = json.load(open('out/timeline.json')) if os.path.exists('out/timeline.json') else None
if tl is None: raise SystemExit('out/timeline.json missing — run scripts/assemble.py first')
pieces = tl['pieces']; exp_frames = tl['out_total_frames']
fails = []
def check(ok, msg):
    print(('PASS  ' if ok else 'FAIL  ') + msg)
    if not ok: fails.append(msg)

o = cv2.VideoCapture(OUT); n = 0
while True:
    ok, _ = o.read()
    if not ok: break
    n += 1
check(n == exp_frames, f'frame count {n} == timeline {exp_frames}' + (f' (source {tl["source_total_frames"]}, {exp_frames - tl["source_total_frames"]:+d})' if exp_frames != tl['source_total_frames'] else ''))
check((int(o.get(3)), int(o.get(4))) == (W, H), f'size {int(o.get(3))}x{int(o.get(4))} == {W}x{H}')
check(abs(o.get(cv2.CAP_PROP_FPS) - FPS) < 0.01, f'fps {o.get(cv2.CAP_PROP_FPS):.2f} == {FPS}')
def fr(c, i): c.set(cv2.CAP_PROP_POS_FRAMES, i); return c.read()[1]
def psnr(a, b):
    h = min(a.shape[0], b.shape[0]); w = min(a.shape[1], b.shape[1]); a, b = a[:h, :w], b[:h, :w]
    m = np.mean((a.astype(np.float32) - b.astype(np.float32)) ** 2); return 99.0 if m == 0 else float(10 * np.log10(255 ** 2 / m))

seam_rows = []
if mode == 'replace':
    host_path = P.get('host_source') or plan['source']; hc = cv2.VideoCapture(host_path); sc = cv2.VideoCapture(plan['source'])
    hw, hh = hc.get(3), hc.get(4); sw = sc.get(3)
    def hostf(i):
        f = fr(hc, i)
        if int(f.shape[1]) != W: f = cv2.resize(f, (W, H), interpolation=cv2.INTER_LANCZOS4)
        return f
    worst = 99.0; src_pieces = [p for p in pieces if p['kind'] == 'src']
    for p in src_pieces:
        L = p['out_f1'] - p['out_f0']; pts = sorted(set([0, 1, L // 2, L - 2, L - 1] + list(np.linspace(0, L - 1, 8).astype(int)))); pts = [k for k in pts if 0 <= k < L]
        vals = [psnr(hostf(p['src_f0'] + k), fr(o, p['out_f0'] + k)) for k in pts]; worst = min(worst, min(vals))
        print(f'      presenter frames src {p["src_f0"]}-{p["src_f1"] - 1} -> out {p["out_f0"]}-{p["out_f1"] - 1}: min {min(vals):.1f} dB  mean {np.mean(vals):.1f} dB')
    if src_pieces: check(worst >= 38, f'presenter footage intact (worst PSNR {worst:.1f} dB vs {"host master" if P.get("host_source") else "source"}; >= 38 expected from the re-encode only)')
    for p in pieces:
        if p['kind'] == 'scene' and not p['insert']:
            L = p['out_f1'] - p['out_f0']; pts = np.linspace(45, L - 45, 6).astype(int) if L > 120 else [L // 2]
            vals = [psnr(cv2.resize(fr(sc, p['src_f0'] + k), (W, H)), fr(o, p['out_f0'] + k)) for k in pts]
            if np.mean(vals) >= 20: check(False, f'scene {p["id"]} still resembles the old footage (mean PSNR {np.mean(vals):.1f} dB)')
    check(True, 'replaced scenes differ from the old footage')
    for i, p in enumerate(pieces):
        if p['kind'] == 'hold':
            prev = pieces[i - 1]; a = fr(o, p['out_f0'] - 1); b = fr(o, p['out_f0']); lastf = fr(o, p['out_f1'] - 1)
            check(psnr(a, b) >= 30, f'hold "{p["id"]}" continues the last kept frame without a jump ({psnr(a, b):.1f} dB)')
            ed = next(e for e in tl['edits'] if e['id'] == p['id']); L = p['out_f1'] - p['out_f0']
            print(f'      hold "{p["id"]}": {L} frames = {L / FPS:.2f}s after source frame {p["anchor"]}, source frames {p["anchor"] + 1}-{p["drop_to"] - 1} dropped, net +{ed["net_frames"] / FPS:.2f}s')
    for ov in tl.get('overlays', []):
        r, cr = ov['rect'], ov['crop']; k = hw / sw; first = next(p for p in pieces if p.get('id') == ov['scenes'][0]); L = next(p for p in pieces if p.get('id') == ov['scenes'][-1])['out_f1'] - first['out_f0']
        a0 = int((ov['delay'] + ov['fade_in'] + 0.1) * FPS); a1 = L - int((ov['fade_out'] + 0.1) * FPS); vals = []
        for kk in np.linspace(a0, a1 - 1, 8).astype(int):
            src = hostf_raw = fr(hc, ov['f0'] + kk); c = src[round(cr['y'] * k):round((cr['y'] + cr['h']) * k), round(cr['x'] * k):round((cr['x'] + cr['w']) * k)]
            c = cv2.resize(c, (r['w'], r['h']), interpolation=cv2.INTER_LANCZOS4); got = fr(o, first['out_f0'] + kk)[r['y']:r['y'] + r['h'], r['x']:r['x'] + r['w']]; m = ov['radius'] + 8
            vals.append(psnr(c[m:-m, m:-m], got[m:-m, m:-m]))
        check(min(vals) >= 30, f'host panel "{ov.get("id")}" shows the presenter crop (min PSNR {min(vals):.1f} dB over 8 frames)')
    # seam rows: around every presenter<->graphics/hold/insert boundary
    for i in range(1, len(pieces)):
        a, b = pieces[i - 1], pieces[i]
        if (a['kind'] == 'src') != (b['kind'] == 'src') or a['kind'] == 'hold' or b['kind'] == 'hold':
            e = b['out_f0']; lab = f'{a.get("id", "host")}->{b.get("id", "host")} @{e}'
            seam_rows.append((lab, [e + d for d in (-14, -9, -5, -2, 0, 3, 8, 14)]))
else:
    print('      (standalone mode: no presenter footage to compare)')

# ---------------------------------------------------------------- audio
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import audiotools as AT
a_out = AT.load_audio(OUT); dur_v = exp_frames / FPS
check(abs(len(a_out) / AT.SR - dur_v) <= 2.0 / FPS, f'audio length {len(a_out) / AT.SR:.3f}s == video length {dur_v:.3f}s')
cfg = plan.get('sound') or {}
utts = AT.utterances(a_out, AT.SR, (cfg.get('level') or {}).get('gate_db', -45.0)); lu = AT.utterance_lufs(a_out, utts); st = AT.spread_stats(lu)
tp = AT.true_peak_db(a_out); integ = AT.loudness(a_out)
print(f'      speech turns: {st["n"]}, loudness per turn {st["min"]:.1f}..{st["max"]:.1f} LUFS (median {st["median"]:.1f}, std {st["std"]:.2f} dB); integrated {integ:.1f} LUFS; true peak {tp:.1f} dBTP')
if cfg.get('level'):
    check(st['std'] < 1.8, f'speaker levels are even (std {st["std"]:.2f} dB; before leveling the source had ~4.8)')
    check(tp <= -0.5, f'true peak {tp:.1f} dBTP is below -0.5 dBTP (AAC re-encode headroom)')
elif mode == 'replace' and not tl['edits'] and exp_frames == tl['source_total_frames'] and not any(p.get('insert') for p in pieces):
    src_a = AT.load_audio(plan['source']); m = min(len(src_a), len(a_out)); w = min(AT.SR * 60, m); s0 = (m - w) // 2
    X = np.fft.rfft(src_a[s0:s0 + w].mean(1), 2 * w); Y = np.fft.rfft(a_out[s0:s0 + w].mean(1), 2 * w); c = np.fft.irfft(X * np.conj(Y)); c = np.concatenate([c[-w + 1:], c[:w]])
    lag = int(np.argmax(c)) - (w - 1); corr = float(np.corrcoef(src_a[:m].mean(1), a_out[:m].mean(1))[0, 1])
    check(lag == 0, f'audio lag {lag} samples'); check(corr > 0.99, f'audio correlation {corr:.5f}')

# ---------------------------------------------------------------- seams
if seam_rows:
    tw, th = 240, int(240 * H / W); sheet = Image.new('RGB', (tw * 8, th * len(seam_rows))); d = ImageDraw.Draw(sheet)
    for r_, (name, idx) in enumerate(seam_rows):
        for c_, i in enumerate(idx):
            i = max(0, min(n - 1, i)); im = Image.fromarray(cv2.cvtColor(fr(o, i), cv2.COLOR_BGR2RGB)).resize((tw, th), Image.LANCZOS); sheet.paste(im, (c_ * tw, r_ * th))
            d.rectangle([c_ * tw, r_ * th, c_ * tw + 64, r_ * th + 12], fill=(0, 0, 0)); d.text((c_ * tw + 2, r_ * th + 1), f'f{i}', fill=(255, 255, 0))
        d.rectangle([0, r_ * th + th - 14, 230, r_ * th + th], fill=(0, 0, 0)); d.text((3, r_ * th + th - 12), name, fill=(0, 255, 255))
    sheet.save('out/seams.jpg', quality=88); print('      wrote out/seams.jpg  <- open it and check every seam')
print('\nALL CHECKS PASSED' if not fails else f'\n{len(fails)} CHECK(S) FAILED')
sys.exit(1 if fails else 0)
