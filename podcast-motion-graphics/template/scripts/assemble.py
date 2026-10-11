#!/usr/bin/env python3
"""Assemble the final video: presenter footage + rendered scene clips + inserts + holds + split-screen panels + soundtrack.

  python3 scripts/assemble.py [out/final.mp4] [crf=14] [--no-audio]

Pipeline (video is encoded ONCE, then audio is muxed in; nothing is re-encoded twice):
  1. build the edit TIMELINE (out/timeline.json): presenter source frames, scene clips (replacing source frames), inserted clips
     (title cards, no source frames), and hold clips (lengthened presenter moments, see make_holds.py);
  2. filter graph -> out/video_only.mp4  (libx264 high, yuv420p, bt709, CRF as given, -g 2*fps);
  3. scripts/build_audio.py -> out/audio_final.wav  (assembled along the timeline, leveled, sting, room tone);
  4. mux: AAC-LC 192 kbps, +faststart, never -shortest.

replace mode    presenter frames come from plan.host_source (the AI-upscaled master, see upscale_hosts.py) when it exists, else from plan.source;
                audio from plan.source.  Without edits/inserts the output has exactly the source's frame count.
standalone mode no presenter footage; clips are concatenated and plan.audio is the soundtrack.
"""
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from toolenv import ffmpeg_path

args = [a for a in sys.argv[1:] if not a.startswith('--')]
OUT = args[0] if args else 'out/final.mp4'
CRF = args[1] if len(args) > 1 else '14'
NO_AUDIO = '--no-audio' in sys.argv
plan = json.load(open('plan.json')); meta = json.load(open('data/scenes.json'))
P, scenes = meta['project'], meta['scenes']
W, H, FPS, total, mode = P['width'], P['height'], P['fps'], P['total_frames'], P['mode']
edits = {e['id']: e for e in P.get('edits', [])}
overlays = P.get('overlays', []) if mode == 'replace' else []
for s in scenes:
    if not os.path.exists(f'out/clips/{s["id"]}.mp4'): raise SystemExit(f'missing clip out/clips/{s["id"]}.mp4 — run: node scripts/render.mjs all --par 4')
for e in edits.values():
    if not os.path.exists(f'out/clips/{e["id"]}.mp4'): raise SystemExit(f'missing hold clip out/clips/{e["id"]}.mp4 — run: python3 scripts/make_holds.py')

# ---------------------------------------------------------------- 1. timeline
bounds = {}
for s in scenes:
    a, b = bounds.get(s['seg'], (s['f0'], s['f1'])); bounds[s['seg']] = (min(a, s['f0']), max(b, s['f1']))
segs = sorted(bounds.items(), key=lambda kv: (kv[1][0], 0 if kv[1][0] == kv[1][1] else 1))
used = set()
def host_pieces(a, b):
    out, cur = [], a
    for ed in sorted(edits.values(), key=lambda e: e['anchor_frame']):
        A, dt = ed['anchor_frame'], ed['drop_to_frame']
        if cur <= A < b:
            if dt > b: raise SystemExit(f'edit {ed["id"]}: drop_to_frame {dt} is beyond the end of the presenter range ({b})')
            out += [('src', cur, A + 1), ('hold', ed['id'])]; cur = dt; used.add(ed['id'])
    if cur < b: out.append(('src', cur, b))
    return out
seq, cur = [], 0
for sid, (a, b) in segs:
    if mode == 'replace' and a > cur: seq += host_pieces(cur, a)
    seq += [('scene', s['id']) for s in scenes if s['seg'] == sid]; cur = max(cur, b)
if mode == 'replace' and cur < total: seq += host_pieces(cur, total)
if set(edits) - used: raise SystemExit(f'edit(s) {sorted(set(edits) - used)} do not fall inside a presenter range (anchor must be in footage that is kept)')
by_id = {s['id']: s for s in scenes}; pieces, f = [], 0
for kind, x, *rest in seq:
    if kind == 'src': n = rest[0] - x; pieces.append({'kind': 'src', 'out_f0': f, 'out_f1': f + n, 'src_f0': x, 'src_f1': rest[0]})
    elif kind == 'hold': n = edits[x]['n_frames']; pieces.append({'kind': 'hold', 'id': x, 'out_f0': f, 'out_f1': f + n, 'anchor': edits[x]['anchor_frame'], 'drop_to': edits[x]['drop_to_frame']})
    else: s = by_id[x]; n = s['n']; pieces.append({'kind': 'scene', 'id': x, 'insert': bool(s.get('insert')), 'out_f0': f, 'out_f1': f + n, 'src_f0': s['f0'], 'src_f1': s['f1']})
    f += n
out_total = f
os.makedirs('out', exist_ok=True)
json.dump({'fps': FPS, 'mode': mode, 'out_total_frames': out_total, 'source_total_frames': total, 'pieces': pieces, 'edits': list(edits.values()), 'overlays': overlays}, open('out/timeline.json', 'w'), indent=1)
print(f'timeline: {len(pieces)} pieces, {out_total} frames = {out_total / FPS:.2f}s (source {total} frames = {total / FPS:.2f}s, {out_total - total:+d} frames)')

# ---------------------------------------------------------------- 2. video
inputs, fc = [], []
host_path = None
if mode == 'replace':
    host_path = P.get('host_source') or plan['source']; inputs += ['-i', host_path]
clip_idx = {}
def add_clip(cid):
    clip_idx[cid] = len(inputs) // 2; inputs.extend(['-i', f'out/clips/{cid}.mp4'])
for p in pieces:
    if p['kind'] in ('scene', 'hold'): add_clip(p['id'])
n_host = sum(1 for p in pieces if p['kind'] == 'src') + len(overlays)
if n_host:
    import cv2
    hc = cv2.VideoCapture(host_path); hw, hh = hc.get(3), hc.get(4)
    sc_ = cv2.VideoCapture(plan['source']); sw = sc_.get(3)
    ratio = hw / sw
    fit = 'null' if (abs(hw / hh - W / H) < 0.01 and int(hw) == W) else (f'scale={W}:{H}:flags=lanczos' if abs(hw / hh - W / H) < 0.01 else f'scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H}')
    fc.append(f'[0:v]split={n_host}' + ''.join(f'[h{k}]' for k in range(n_host)) if n_host > 1 else '[0:v]null[h0]')
labels, hk = [], 0
for i, p in enumerate(pieces):
    if p['kind'] == 'src':
        fc.append(f"[h{hk}]trim=start_frame={p['src_f0']}:end_frame={p['src_f1']},setpts=PTS-STARTPTS,{fit},setsar=1,format=yuv420p[P{i}]"); hk += 1
    else:
        fc.append(f"[{clip_idx[p['id']]}:v]setpts=PTS-STARTPTS,setsar=1,format=yuv420p[P{i}]")
    labels.append(f'P{i}')
fc.append(''.join(f'[{l}]' for l in labels) + f'concat=n={len(labels)}:v=1:a=0[v0]')
# split-screen host panels: crop the presenter from the (upscaled) host video, round the corners, fade, overlay on the finished clips
from PIL import Image, ImageDraw
mask_inputs, last = [], 'v0'
for j, ov in enumerate(overlays):
    r, cr = ov['rect'], ov['crop']
    first = next(p for p in pieces if p.get('id') == ov['scenes'][0]); lastp = next(p for p in pieces if p.get('id') == ov['scenes'][-1])
    T0 = first['out_f0'] / FPS; dur = (lastp['out_f1'] - first['out_f0']) / FPS
    mask = Image.new('L', (r['w'], r['h']), 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, r['w'] - 1, r['h'] - 1], radius=ov['radius'], fill=255)
    mpath = f'out/mask_{ov.get("id", j)}.png'; mask.save(mpath)
    mi = len(inputs) // 2 + len(mask_inputs) // 6; mask_inputs += ['-loop', '1', '-framerate', str(FPS), '-i', mpath]
    k = ratio; fi, fo, dl = ov['fade_in'], ov['fade_out'], ov['delay']
    fc.append(f"[h{hk}]trim=start_frame={ov['f0']}:end_frame={ov['f1']},setpts=PTS-STARTPTS,crop={round(cr['w'] * k)}:{round(cr['h'] * k)}:{round(cr['x'] * k)}:{round(cr['y'] * k)},"
              f"scale={r['w']}:{r['h']}:flags=lanczos,setsar=1,format=yuv420p[pc{j}]"); hk += 1
    fc.append(f"[{mi}:v]format=gray,trim=duration={dur:.4f},setpts=PTS-STARTPTS[pm{j}]")
    fc.append(f"[pc{j}][pm{j}]alphamerge,format=yuva420p,fade=t=in:st={dl}:d={fi}:alpha=1,fade=t=out:st={max(dl + fi, dur - fo):.4f}:d={fo}:alpha=1,setpts=PTS+{T0 - 1 / FPS:.5f}/TB[pv{j}]")   # -1 frame: ffmpeg's overlay otherwise shows the panel one frame late
    fc.append(f"[{last}][pv{j}]overlay={r['x']}:{r['y']}:format=auto:eof_action=pass:enable='between(t,{T0:.4f},{T0 + dur:.4f})'[vo{j}]")
    last = f'vo{j}'
fc.append(f'[{last}]format=yuv420p[v]')
vo = 'out/video_only.mp4'
cmd = [ffmpeg_path(), '-hide_banner', '-y'] + inputs + mask_inputs + ['-filter_complex', ';'.join(fc), '-map', '[v]', '-an',
       '-c:v', 'libx264', '-preset', 'slow', '-crf', CRF, '-maxrate', '20M', '-bufsize', '40M', '-profile:v', 'high', '-level', '4.2',
       '-pix_fmt', 'yuv420p', '-r', str(FPS), '-g', str(FPS * 2), '-bf', '2', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', vo]
print('encoding video ...'); subprocess.run(cmd, check=True)

# ---------------------------------------------------------------- 3. audio + 4. mux
if NO_AUDIO: print('wrote', vo); sys.exit(0)
subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build_audio.py')], check=True)
mux = [ffmpeg_path(), '-hide_banner', '-loglevel', 'error', '-y', '-i', vo, '-i', 'out/audio_final.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
       '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-movflags', '+faststart']
if plan.get('title'): mux += ['-metadata', 'title=' + plan['title']]
subprocess.run(mux + [OUT], check=True)
print('wrote', OUT)
