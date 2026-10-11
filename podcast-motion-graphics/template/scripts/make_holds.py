#!/usr/bin/env python3
"""Build the "hold" clips declared in plan.json -> edits (lengthen a presenter shot so an expression can settle).

  python3 scripts/make_holds.py [--preview]       writes out/clips/<edit id>.mp4 (+ out/holds/<id>_preview.jpg with --preview)

plan.json
  "edits": [ { "id": "hold1", "type": "hold",
               "anchor_frame": 7905,        // LAST source frame kept (choose the best frame: eyes open, mouth closed/smiling)
               "drop_to_frame": 7926,       // source resumes here; frames anchor+1 .. drop_to-1 are DROPPED (the glitchy ones)
               "extra_seconds": 5.0,        // NET lengthening of the video
               "window": 8,                 // how many source frames before the anchor the hold sweeps back through
               "zoom": 0.02,                // optional: tiny extra "breathing" zoom at the far end of the sweep
               "push_in": { "to": 1.2, "seconds": 1.1, "center": [0.5, 0.03] } } ]   // optional slow camera push-in (see below)

How it looks: starting on the anchor frame, the hold eases back through the `window` frames (a smile that softly broadens) and
returns to the anchor on its last frame, with a very slow zoom — one gentle "breath" over the whole hold, using frame blending
(no optical-flow ghosts). There is no cut at either end: the first and last hold frames equal the anchor.
Frames come from plan.host_source (the AI-upscaled master) when it exists, else from the soft source.

Burned-in captions: source avatar videos usually carry the presenter's own caption on their frames, and the last caption LINGERS on the
anchor frame. A frozen caption would look wrong for the whole hold, so use `push_in`: a slow camera push-in (zoom to 1.2 about a point near
the top-centre) slides the bottom ~15 % of the frame out of view within about a second, which carries the caption away like a normal
camera move. (Inpainting the caption was tried and leaves a visible smear on busy backgrounds; `"erase_caption": true` still exists but is
not recommended; a clean plate from another shot did not line up either.) With no caption on the anchor frame, push_in is optional.

Transitions: if a plan segment sets "in_still_from_edit": "<edit id>" this script writes assets/host_<segment>_in.png from the LAST hold frame
(so the wipe that follows starts from exactly what is on screen, including the push-in).
"""
import json, os, subprocess, sys
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from toolenv import ffmpeg_path

def detect_caption(src_frame):
    """Bounding box (x0,y0,x1,y1, in source pixels) of a burned-in caption pill in the bottom band, or None."""
    H, W = src_frame.shape[:2]; by0 = int(H * 0.82); band = src_frame[by0:, :]
    white = (band.min(axis=2) > 205).astype(np.uint8)
    closed = cv2.morphologyEx(white, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_RECT, (21, 3)))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(closed)
    c = [s for s in stats[1:] if s[2] >= 60 and 5 <= s[3] <= 34]
    if not c: return None
    s = max(c, key=lambda t: t[2]); x, y, w, h = int(s[0]), int(s[1]) + by0, int(s[2]), int(s[3])
    return (x - 12, y - 8, x + w + 12, y + h + 8)

def erase_box(img, box, scale):
    """Inpaint a rectangular region (box in source px) of a float32 BGR frame, feathered."""
    x0, y0, x1, y1 = [int(round(v * scale)) for v in box]; H, W = img.shape[:2]
    m = 40; X0, Y0, X1, Y1 = max(0, x0 - m), max(0, y0 - m), min(W, x1 + m), min(H, y1 + m)
    crop = np.clip(img[Y0:Y1, X0:X1], 0, 255).astype(np.uint8)
    mask = np.zeros(crop.shape[:2], np.uint8); cv2.rectangle(mask, (x0 - X0 - 3, y0 - Y0 - 3), (x1 - X0 + 3, y1 - Y0 + 3), 255, -1)
    inp = cv2.inpaint(crop, mask, 7, cv2.INPAINT_TELEA).astype(np.float32)
    a = cv2.GaussianBlur(mask.astype(np.float32) / 255.0, (0, 0), 3.0)[..., None]
    out = img.copy(); out[Y0:Y1, X0:X1] = inp * a + img[Y0:Y1, X0:X1] * (1 - a)
    return out

def main():
    meta = json.load(open('data/scenes.json')); P = meta['project']; plan = json.load(open('plan.json'))
    W, H, FPS = P['width'], P['height'], P['fps']
    eds = P.get('edits', [])
    if not eds: print('no edits in plan.json'); return
    path = P.get('host_source') or plan['source']; cap = cv2.VideoCapture(path)
    print('hold frames from', path)
    def get(i):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i); ok, f = cap.read()
        if not ok: raise SystemExit(f'cannot read frame {i} of {path}')
        if f.shape[1] != W: f = cv2.resize(f, (W, H), interpolation=cv2.INTER_LANCZOS4)
        return f.astype(np.float32)
    os.makedirs('out/clips', exist_ok=True); os.makedirs('out/holds', exist_ok=True)
    for ed in eds:
        A, N, k, z = ed['anchor_frame'], ed['n_frames'], ed['window'], ed['zoom']
        cx, cy = ed.get('zoom_center', [0.5, 0.4])
        frames = [get(A - k + 1 + i) for i in range(k)]            # frames[-1] is the anchor
        if ed.get('erase_caption', False):
            sc_ = cv2.VideoCapture(plan['source']); sc_.set(cv2.CAP_PROP_POS_FRAMES, A); okc, sf = sc_.read()
            box = detect_caption(sf) if okc else None
            if box:
                scale = W / sf.shape[1]; frames = [erase_box(f_, box, scale) for f_ in frames]
                print(f'  {ed["id"]}: erased the burned-in caption {box} from the hold frames')
        outp = f'out/clips/{ed["id"]}.mp4'
        ff = subprocess.Popen([ffmpeg_path(), '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                               '-c:v', 'libx264', '-preset', 'medium', '-crf', '10', '-g', str(FPS), '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709',
                               '-color_trc', 'bt709', '-color_range', 'tv', '-movflags', '+faststart', outp], stdin=subprocess.PIPE)
        sheet = []
        pi = ed.get('push_in'); first_u8 = last_u8 = None
        for j in range(N):
            pos = 0.5 * (1 + np.cos(2 * np.pi * j / (N - 1)))      # 1 at the anchor, 0 at the far end of the sweep, back to 1
            f = pos * (k - 1); i0 = int(np.floor(f)); i1 = min(k - 1, i0 + 1); a = f - i0
            img = frames[i0] * (1 - a) + frames[i1] * a
            s = 1.0 + z * (1 - pos); ccx, ccy = cx, cy
            if pi:
                u = min(1.0, j / max(1.0, pi.get('seconds', 1.0) * FPS)); u = u * u * (3 - 2 * u)      # smoothstep
                s *= 1.0 + (pi['to'] - 1.0) * u; ccx, ccy = pi.get('center', [cx, cy])
            if s > 1.0005:
                M = np.array([[s, 0, (1 - s) * ccx * W], [0, s, (1 - s) * ccy * H]], np.float32)
                img = cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
            u8 = np.clip(img, 0, 255).astype(np.uint8); ff.stdin.write(u8.tobytes())
            if j == 0: first_u8 = u8
            last_u8 = u8
            if j in (0, N // 8, N // 4, 3 * N // 8, N // 2, 5 * N // 8, 3 * N // 4, N - 1): sheet.append((j, u8))
        ff.stdin.close(); ff.wait()
        cv2.imwrite(f'out/holds/{ed["id"]}_last.png', last_u8); cv2.imwrite(f'out/holds/{ed["id"]}_first.png', first_u8)
        os.makedirs('assets', exist_ok=True)
        for sg in plan.get('segments', []):
            if sg.get('in_still_from_edit') == ed['id']: cv2.imwrite(f'assets/host_{sg["id"]}_in.png', last_u8); print(f'  wrote assets/host_{sg["id"]}_in.png from the last frame of {ed["id"]}')
            if sg.get('out_still_from_edit') == ed['id']: cv2.imwrite(f'assets/host_{sg["id"]}_out.png', first_u8)
        print(f'{ed["id"]}: {N} frames ({N / FPS:.2f}s) -> {outp}   anchor {A}, window {k}, drops {A + 1}..{ed["drop_to_frame"] - 1}, net +{ed["net_frames"] / FPS:.2f}s')
        if '--preview' in sys.argv:
            from PIL import Image, ImageDraw
            tw, th = 480, int(480 * H / W); sh = Image.new('RGB', (tw * 4, th * 2)); d = ImageDraw.Draw(sh)
            for n_, (j, u8) in enumerate(sheet):
                x, y = (n_ % 4) * tw, (n_ // 4) * th; sh.paste(Image.fromarray(cv2.cvtColor(u8, cv2.COLOR_BGR2RGB)).resize((tw, th), Image.LANCZOS), (x, y))
                d.rectangle([x, y, x + 70, y + 13], fill=(0, 0, 0)); d.text((x + 2, y + 1), f'hold f{j}', fill=(255, 255, 0))
            sh.save(f'out/holds/{ed["id"]}_preview.jpg', quality=90)

if __name__ == '__main__':
    main()
