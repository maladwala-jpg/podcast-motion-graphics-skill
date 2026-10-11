#!/usr/bin/env python3
"""AI-upscale the presenter footage of a low-resolution source (e.g. 640x360 avatar video) to the output size.

  python3 scripts/upscale_hosts.py            # resumable; writes out/hostsr/chunk_*.mp4 then out/host_master.mp4
  python3 scripts/upscale_hosts.py --test 24  # upscale 24 frames from the first host range -> out/sr_test/ (PNG) + flicker report

What it does
  * works out which source frames are actually shown as presenter footage: everything NOT inside a replaced segment
    (data/scenes.json) plus the frames of split-screen host panels (project.overlays);
  * runs Real-ESRGAN (ncnn/Vulkan, GPU; pip package `realesrgan-ncnn-py`, models are bundled in the wheel) on those frames,
    then downsizes to the output size with area averaging (extra crispness);
  * STABILISES static regions: raw per-frame super-resolution shimmers (6x the frame-to-frame change of a plain resize on a
    static wall). Wherever the *source* did not change between two frames, the sharp result is blended with the previous
    output (recursive filter), moving regions (face, hands) always take the fresh frame;
  * all other frames get a plain Lanczos resize, so out/host_master.mp4 has exactly one frame per source frame;
  * writes plan.json "host_source" if missing so build_data/assemble/verify use the master instead of the soft source.

Models (--model): x4plus (default; natural skin/hair, ~1.5 s per 640x360 frame on an Apple M-series GPU),
                  x4plus-anime (smoother/faster ~0.5 s, waxy), animevideov3 (fastest, cartoon-like faces — avoid for people).
"""
import argparse, json, os, subprocess, sys, time
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from toolenv import ffmpeg_path

MODELS = {'animevideov3': 1, 'x4plus-anime': 3, 'x4plus': 4}

def needed_ranges(meta, total):
    """Source frames that are shown as presenter footage (host shots + host panels)."""
    replaced = {}
    for s in meta['scenes']:
        a, b = replaced.get(s['seg'], (s['f0'], s['f1'])); replaced[s['seg']] = (min(a, s['f0']), max(b, s['f1']))
    cur, rng = 0, []
    for a, b in sorted(replaced.values()):
        if a > cur: rng.append((cur, a))
        cur = max(cur, b)
    if cur < total: rng.append((cur, total))
    for ov in meta['project'].get('overlays', []):
        rng.append((ov['f0'], ov['f1']))
    rng.sort(); merged = []
    for a, b in rng:
        if merged and a <= merged[-1][1]: merged[-1] = (merged[-1][0], max(merged[-1][1], b))
        else: merged.append((a, b))
    return merged

class Upscaler:
    def __init__(self, model, W, H, beta, thresh):
        import realesrgan_ncnn_py as R
        self.up = R.Realesrgan(gpuid=0, model=MODELS[model]); self.W, self.H, self.beta, self.th = W, H, beta, thresh
    def sr(self, bgr):
        from PIL import Image
        o = np.array(self.up.process_pil(Image.fromarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))))
        o = cv2.cvtColor(o, cv2.COLOR_RGB2BGR)
        return cv2.resize(o, (self.W, self.H), interpolation=cv2.INTER_AREA).astype(np.float32)
    def static_mask(self, src, prev_src):
        d = cv2.absdiff(src, prev_src).max(axis=2).astype(np.float32)
        d = cv2.GaussianBlur(d, (0, 0), 1.5)
        moving = cv2.dilate((d > self.th).astype(np.uint8), np.ones((9, 9), np.uint8)).astype(np.float32)
        m = 1.0 - cv2.GaussianBlur(moving, (0, 0), 2.0)
        return cv2.resize(m, (self.W, self.H), interpolation=cv2.INTER_LINEAR)[..., None]
    def frame(self, src, prev_src, prev_out):
        f = self.sr(src)
        if prev_src is None or prev_out is None: return f
        m = self.static_mask(src, prev_src) * self.beta
        return f * (1.0 - m) + prev_out * m

def writer(path, W, H, fps):
    return subprocess.Popen([ffmpeg_path(), '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(fps), '-i', '-',
                             '-c:v', 'libx264', '-preset', 'fast', '-crf', '10', '-g', '15', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709',
                             '-color_trc', 'bt709', '-movflags', '+faststart', path], stdin=subprocess.PIPE)

def last_frame(path):
    c = cv2.VideoCapture(path); n = int(c.get(cv2.CAP_PROP_FRAME_COUNT)); c.set(cv2.CAP_PROP_POS_FRAMES, n - 1); ok, f = c.read(); return f.astype(np.float32) if ok else None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', default='x4plus', choices=list(MODELS)); ap.add_argument('--chunk', type=int, default=300)
    ap.add_argument('--beta', type=float, default=0.8, help='static-region history weight (0 = no stabilising)')
    ap.add_argument('--thresh', type=float, default=6.0, help='source change (0-255) above which a pixel counts as moving')
    ap.add_argument('--test', type=int, default=0, help='upscale only N frames and report flicker'); ap.add_argument('--test-start', type=int, default=None)
    a = ap.parse_args()
    plan = json.load(open('plan.json')); meta = json.load(open('data/scenes.json')); P = meta['project']
    W, H, FPS, total = P['width'], P['height'], P['fps'], P['total_frames']
    src_path = plan['source']; cap = cv2.VideoCapture(src_path)
    rngs = needed_ranges(meta, total); need = np.zeros(total, bool)
    for s, e in rngs: need[s:e] = True
    print(f'{int(need.sum())} presenter frames to upscale of {total}; ranges: {rngs}')
    U = Upscaler(a.model, W, H, a.beta, a.thresh)
    if a.test:
        s0 = a.test_start if a.test_start is not None else rngs[0][0] + 200
        os.makedirs('out/sr_test', exist_ok=True); prev = pf = None; outs, lans = [], []
        t = time.time()
        for i in range(s0, s0 + a.test):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i); ok, f = cap.read()
            o = U.frame(f, pf, prev); outs.append(o.astype(np.uint8)); prev, pf = o, f
            lans.append(cv2.resize(f, (W, H), interpolation=cv2.INTER_LANCZOS4))
        print('%.2f s/frame' % ((time.time() - t) / a.test))
        roi = (slice(int(H * .1), int(H * .5)), slice(int(W * .78), int(W * .98)))
        fl = lambda L: float(np.mean([np.abs(L[k + 1][roi].astype(np.float32) - L[k][roi].astype(np.float32)).mean() for k in range(len(L) - 1)]))
        print('background flicker (mean abs frame diff)  lanczos %.3f   upscaled+stabilised %.3f' % (fl(lans), fl(outs)))
        cv2.imwrite('out/sr_test/sr.png', outs[-1]); cv2.imwrite('out/sr_test/lanczos.png', lans[-1]); return
    os.makedirs('out/hostsr', exist_ok=True); t0 = time.time(); done = 0
    nchunks = (total + a.chunk - 1) // a.chunk
    for ci in range(nchunks):
        s, e = ci * a.chunk, min(total, (ci + 1) * a.chunk); path = f'out/hostsr/chunk_{ci:04d}.mp4'
        if os.path.exists(path) and os.path.exists(path + '.ok'): continue
        w = writer(path, W, H, FPS); cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, s - 1))
        prev_src = prev_out = None
        if s > 0:
            ok, prev_src = cap.read()
            if need[s - 1] and ci > 0 and os.path.exists(f'out/hostsr/chunk_{ci - 1:04d}.mp4'): prev_out = last_frame(f'out/hostsr/chunk_{ci - 1:04d}.mp4')
        else: cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        for i in range(s, e):
            ok, f = cap.read()
            if not ok: raise SystemExit(f'cannot read source frame {i}')
            if need[i]:
                chain = prev_src is not None and i > 0 and need[i - 1]
                o = U.frame(f, prev_src if chain else None, prev_out if chain else None); done += 1
            else:
                o = cv2.resize(f, (W, H), interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
            w.stdin.write(np.clip(o, 0, 255).astype(np.uint8).tobytes()); prev_src, prev_out = f, o
        w.stdin.close(); w.wait(); open(path + '.ok', 'w').write('ok')
        el = time.time() - t0; print(f'chunk {ci + 1}/{nchunks} frames {s}-{e - 1} done; upscaled so far {done}; elapsed {el / 60:.1f} min', flush=True)
    lst = 'out/hostsr/list.txt'; open(lst, 'w').write(''.join(f"file 'chunk_{ci:04d}.mp4'\n" for ci in range(nchunks)))
    subprocess.run([ffmpeg_path(), '-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', 'out/host_master.mp4'], check=True)
    fresh = json.load(open('plan.json'))      # re-read: this job runs for hours and plan.json is edited meanwhile; never write back the copy loaded at the start
    if not fresh.get('host_source'):
        fresh['host_source'] = 'out/host_master.mp4'; json.dump(fresh, open('plan.json', 'w'), indent=2)
    print('wrote out/host_master.mp4 and set plan.host_source')

if __name__ == '__main__':
    main()
