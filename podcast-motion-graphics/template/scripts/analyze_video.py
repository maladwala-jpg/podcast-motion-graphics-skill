#!/usr/bin/env python3
"""Understand a source video before planning scenes.   Run from the project root.

  python3 scripts/analyze_video.py all <video> [--model small.en] [--language en]
  python3 scripts/analyze_video.py probe|sheets|cuts|transcribe|palette <video> [options]

probe        size, fps, frame count, audio stream
sheets       analysis/sheets/sheet_N.jpg — timestamped 1-frame-per-second contact sheets (--step seconds). READ THESE: they are
             the ground truth for "where is the presenter on screen and where is not"
cuts         analysis/cuts.json + analysis/shots.json + analysis/shots.jpg — hard cuts, one thumbnail per shot, with a
             face-detector HINT (faces=True) for shots that show a presenter. A hint only: verify against the sheets.
transcribe   data/transcript.json — word-level timestamps (faster-whisper). Prints the transcript with times.
palette      analysis/palette.png + theme.suggested.json — dominant colours of the video turned into a first-draft theme
"""
import argparse, json, math, os, subprocess, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import theme_util
from toolenv import ffmpeg_path

def cv():
    import cv2
    return cv2

def ts(t):
    return f'{int(t // 60)}:{t % 60:05.2f}'

# ───────────────────────── probe ─────────────────────────
def probe(video):
    cv2 = cv(); c = cv2.VideoCapture(video)
    if not c.isOpened(): raise SystemExit(f'cannot open {video}')
    fps, n, w, h = c.get(cv2.CAP_PROP_FPS), int(c.get(cv2.CAP_PROP_FRAME_COUNT)), int(c.get(3)), int(c.get(4))
    print(f'{video}: {w}x{h} @ {fps:.3f} fps, {n} frames = {n / fps:.2f}s ({ts(n / fps)})')
    r = subprocess.run([ffmpeg_path(), '-hide_banner', '-i', video], capture_output=True, text=True).stderr
    for l in r.splitlines():
        if 'Stream' in l or 'Duration' in l: print('  ' + l.strip())
    if w < 1280: print(f'  NOTE source is only {w}px wide: host shots will look soft when upscaled to 1080p')
    return fps, n, w, h

# ───────────────────────── sheets ─────────────────────────
def sheets(video, step=1.0, cols=10, rows=8, thumb=192):
    from PIL import Image, ImageDraw
    os.makedirs('analysis/thumbs', exist_ok=True); os.makedirs('analysis/sheets', exist_ok=True)
    for f in os.listdir('analysis/thumbs'): os.remove(os.path.join('analysis/thumbs', f))
    subprocess.run([ffmpeg_path(), '-hide_banner', '-loglevel', 'error', '-y', '-i', video, '-vf', f'fps=1/{step},scale={thumb}:-2', 'analysis/thumbs/t_%05d.jpg'], check=True)
    fs = sorted(os.listdir('analysis/thumbs')); per = cols * rows
    first = Image.open('analysis/thumbs/' + fs[0]); tw, th = first.size
    out = []
    for si in range(math.ceil(len(fs) / per)):
        sheet = Image.new('RGB', (cols * tw, rows * th)); d = ImageDraw.Draw(sheet)
        for i, f in enumerate(fs[si * per:(si + 1) * per]):
            t = (si * per + i) * step; x, y = (i % cols) * tw, (i // cols) * th
            sheet.paste(Image.open('analysis/thumbs/' + f), (x, y)); d.rectangle([x, y, x + 44, y + 12], fill=(0, 0, 0)); d.text((x + 2, y + 1), f'{int(t // 60)}:{int(t % 60):02d}', fill=(255, 255, 0))
        p = f'analysis/sheets/sheet_{si + 1}.jpg'; sheet.save(p, quality=85); out.append(p)
    print(f'{len(out)} sheet(s):', ', '.join(out), f'(each covers {per * step:.0f}s)')
    return out

# ───────────────────────── cuts / shots / faces ─────────────────────────
def cuts(video, thr=12.0, face_min=0.065):
    cv2 = cv(); c = cv2.VideoCapture(video); fps = c.get(cv2.CAP_PROP_FPS); n_total = int(c.get(cv2.CAP_PROP_FRAME_COUNT))
    prev, diffs = None, []
    while True:
        ok, f = c.read()
        if not ok: break
        s = cv2.resize(f, (160, 90), interpolation=cv2.INTER_AREA).astype(np.float32)
        diffs.append(0.0 if prev is None else float(np.abs(s - prev).mean())); prev = s
    d = np.array(diffs); cut_frames = [0] + [int(i) for i in np.where(d > thr)[0]]
    shots = [(a, (cut_frames[i + 1] if i + 1 < len(cut_frames) else len(d))) for i, a in enumerate(cut_frames)]
    # merge tiny shots (flashes / double-detections)
    merged = []
    for a, b in shots:
        if merged and b - a < 6: merged[-1] = (merged[-1][0], b)
        else: merged.append((a, b))
    shots = merged
    try:
        fc1 = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        fc2 = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')
    except AttributeError:   # OpenCV 5 removed cascades; setup.sh pins opencv<5
        fc1 = fc2 = None
        print('NOTE face detection unavailable with this OpenCV build — judge presenter shots from the contact sheets')
    info = []
    for a, b in shots:
        best = 0.0
        for q in (0.25, 0.5, 0.75):
            idx = int(a + (b - 1 - a) * q); c.set(cv2.CAP_PROP_POS_FRAMES, idx); ok, f = c.read()
            if not ok: continue
            w = f.shape[1]; g = cv2.cvtColor(cv2.resize(f, (640, int(640 * f.shape[0] / w))), cv2.COLOR_BGR2GRAY); mn = int(640 * face_min)
            for fc in ((fc1, fc2) if fc1 is not None else ()):
                for im in (g, cv2.flip(g, 1)) if fc is fc2 else (g,):
                    r = fc.detectMultiScale(im, 1.1, 6, minSize=(mn, mn))
                    if len(r): best = max(best, max(x[2] for x in r) / 640)
        info.append({'start_frame': a, 'end_frame': b, 'start': round(a / fps, 3), 'end': round(b / fps, 3), 'dur': round((b - a) / fps, 2), 'face_width_frac': round(float(best), 3), 'faces': bool(best >= face_min)})
    os.makedirs('analysis', exist_ok=True)
    json.dump({'fps': fps, 'cuts': cut_frames, 'shots': info}, open('analysis/shots.json', 'w'), indent=1)
    json.dump(cut_frames, open('analysis/cuts.json', 'w'))
    # thumbnail per shot
    from PIL import Image, ImageDraw
    cols, tw = 6, 300; th = int(tw * 9 / 16); rows = math.ceil(len(info) / cols)
    sheet = Image.new('RGB', (cols * tw, rows * th)); dr = ImageDraw.Draw(sheet)
    for i, s in enumerate(info):
        idx = (s['start_frame'] + s['end_frame']) // 2; c.set(cv2.CAP_PROP_POS_FRAMES, idx); ok, f = c.read()
        if not ok: continue
        im = Image.fromarray(cv2.cvtColor(f, cv2.COLOR_BGR2RGB)).resize((tw, th)); x, y = (i % cols) * tw, (i // cols) * th; sheet.paste(im, (x, y))
        dr.rectangle([x, y, x + tw, y + 13], fill=(0, 0, 0)); dr.text((x + 3, y + 1), f'#{i} f{s["start_frame"]}-{s["end_frame"]} {ts(s["start"])} {"FACE" if s["faces"] else "-"}', fill=(255, 255, 0) if s['faces'] else (140, 255, 255))
    sheet.save('analysis/shots.jpg', quality=85)
    print(f'{len(info)} shots (hard-cut threshold {thr}); wrote analysis/shots.json, analysis/shots.jpg')
    for i, s in enumerate(info):
        print(f'  #{i:3d} frames {s["start_frame"]:6d}-{s["end_frame"]:6d}  {ts(s["start"])} -> {ts(s["end"])}  {s["dur"]:6.2f}s  face={s["faces"]!s:5s} ({s["face_width_frac"]:.2f})')
    print('Face flags are a HINT. Dissolves are not detected as cuts. Confirm every boundary on the contact sheets before planning.')

# ───────────────────────── transcribe ─────────────────────────
def transcribe(video, model='small.en', language='en', out='data/transcript.json'):
    from faster_whisper import WhisperModel
    os.makedirs('data', exist_ok=True); os.makedirs('analysis', exist_ok=True)
    wav = 'analysis/audio.wav'
    subprocess.run([ffmpeg_path(), '-hide_banner', '-loglevel', 'error', '-y', '-i', video, '-vn', '-ac', '1', '-ar', '16000', wav], check=True)
    m = WhisperModel(model, device='cpu', compute_type='int8')
    segs, _ = m.transcribe(wav, word_timestamps=True, language=language if language != 'auto' else None)
    res = [{'start': s.start, 'end': s.end, 'text': s.text.strip(), 'words': [{'w': w.word, 's': w.start, 'e': w.end} for w in s.words]} for s in segs]
    json.dump(res, open(out, 'w'), indent=1)
    for s in res: print(f'[{s["start"]:7.2f} - {s["end"]:7.2f}] {s["text"]}')
    print(f'wrote {out}. Proofread it: whisper mishears names and jargon, and captions are built from this text.')

# ───────────────────────── palette ─────────────────────────
def palette(video, samples=24, k=8):
    cv2 = cv(); c = cv2.VideoCapture(video); n = int(c.get(cv2.CAP_PROP_FRAME_COUNT))
    pts = []
    for idx in np.linspace(0, n - 1, samples).astype(int):
        c.set(cv2.CAP_PROP_POS_FRAMES, int(idx)); ok, f = c.read()
        if ok: pts.append(cv2.resize(f, (80, 45), interpolation=cv2.INTER_AREA).reshape(-1, 3))
    data = np.concatenate(pts).astype(np.float32)
    _, lab, cen = cv2.kmeans(data, k, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 1.0), 4, cv2.KMEANS_PP_CENTERS)
    share = np.bincount(lab.flatten(), minlength=k) / len(lab)
    cands = sorted([(theme_util.rgb2hex((r, g, b)), float(share[i])) for i, (b, g, r) in enumerate(cen)], key=lambda x: -x[1])
    def sv(h): hh, s, v = theme_util.hsv(h); return hh, s, v
    sat = [x for x in cands if sv(x[0])[1] > 0.30 and 0.35 < sv(x[0])[2] < 0.95]
    if sat:
        primary = max(sat, key=lambda x: sv(x[0])[1] * math.sqrt(x[1]) * (1.0 - abs(sv(x[0])[2] - 0.72)))[0]
    else:
        primary = '#C96F3F'; print('NOTE the video has no saturated colours; falling back to a warm default primary')
    hp = sv(primary)[0]
    def hdist(a, b): d = abs(a - b) % 1.0; return min(d, 1 - d)
    sec = [x for x in sat if 0.03 < hdist(sv(x[0])[0], hp) < 0.17 and x[0] != primary]
    secondary = max(sec, key=lambda x: sv(x[0])[1])[0] if sec else theme_util.from_hsv(hp + 0.04, 0.80, 0.95)
    ter = [x for x in sat if hdist(sv(x[0])[0], hp) > 0.28]
    tertiary = max(ter, key=lambda x: sv(x[0])[1] * math.sqrt(x[1]))[0] if ter else theme_util.from_hsv(hp + 0.47, 0.72, 0.68)
    darkest = min(cands, key=lambda x: theme_util.luminance(x[0]))[0]
    dark = darkest if theme_util.luminance(darkest) < 60 else theme_util.mix(darkest, '#000000', 0.5)
    lightc = max([x for x in cands if sv(x[0])[1] < 0.5] or cands, key=lambda x: theme_util.luminance(x[0]))[0]
    light = lightc if theme_util.luminance(lightc) > 205 else theme_util.mix(lightc, '#FFFFFF', 0.6)
    quaternary = theme_util.from_hsv(hp, min(1, sv(primary)[1] * 0.8), sv(primary)[2] * 0.58)
    theme = {'name': 'sampled-from-video', 'primary': primary, 'secondary': secondary, 'tertiary': tertiary, 'quaternary': quaternary, 'dark': theme_util.mix(dark, '#1a0f08', 0.25), 'light': light}
    json.dump(theme, open('theme.suggested.json', 'w'), indent=2)
    from PIL import Image, ImageDraw
    os.makedirs('analysis', exist_ok=True)
    sw = Image.new('RGB', (160 * max(len(cands), 6), 340), (255, 255, 255)); d = ImageDraw.Draw(sw)
    for i, (h, s) in enumerate(cands):
        d.rectangle([i * 160, 0, i * 160 + 158, 150], fill=h); d.text((i * 160 + 6, 156), f'{h} {s * 100:.0f}%', fill=(0, 0, 0))
    for i, (k2, v) in enumerate([(k2, theme[k2]) for k2 in theme_util.CORE]):
        d.rectangle([i * 160, 190, i * 160 + 158, 300], fill=v); d.text((i * 160 + 6, 306), f'{k2} {v}', fill=(0, 0, 0))
    sw.save('analysis/palette.png')
    print('dominant colours:', ', '.join(f'{h} ({s * 100:.0f}%)' for h, s in cands))
    print('suggested theme  :', json.dumps({k2: theme[k2] for k2 in theme_util.CORE}))
    print('wrote theme.suggested.json + analysis/palette.png. Review the swatches; copy to theme.json and adjust by eye.')

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('cmd', choices=['probe', 'sheets', 'cuts', 'transcribe', 'palette', 'all'])
    ap.add_argument('video'); ap.add_argument('--step', type=float, default=1.0); ap.add_argument('--model', default='small.en')
    ap.add_argument('--language', default='en'); ap.add_argument('--threshold', type=float, default=12.0); ap.add_argument('--face-min', type=float, default=0.065)
    a = ap.parse_args()
    if a.cmd in ('probe', 'all'): probe(a.video)
    if a.cmd in ('sheets', 'all'): sheets(a.video, a.step)
    if a.cmd in ('cuts', 'all'): cuts(a.video, a.threshold, a.face_min)
    if a.cmd in ('palette', 'all'): palette(a.video)
    if a.cmd in ('transcribe', 'all'): transcribe(a.video, a.model, a.language)
