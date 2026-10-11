#!/usr/bin/env python3
"""Turn plan.json + data/transcript.json (+ theme.json) into everything the renderer needs.

  python3 scripts/build_data.py [--no-stills]

Writes
  data/scenes.json   {"project": {...}, "scenes": [ {id, seg, f0, f1, n, t0, D, theme, words[], cues[], in{}, out{}} ]}
  data/scenes.js     same data for the browser (window.PROJECT / PAL / SCENE_DATA / SCENE_FILES)
  css/theme.css      CSS variables from theme.json
  assets/host_<seg>_in.png / _out.png   the host frames next to each replaced segment (for crossfades)
Prints a scene table + warnings. Re-run after any change to plan.json, theme.json or the transcript.
"""
import glob, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import theme_util
from toolenv import ffmpeg_path

def load(p):
    with open(p) as f:
        return json.load(f)

def audio_duration(path):
    r = subprocess.run([ffmpeg_path(), '-hide_banner', '-i', path], capture_output=True, text=True)
    m = re.search(r'Duration:\s*(\d+):(\d+):([\d.]+)', r.stderr)
    if not m:
        raise SystemExit(f'cannot read duration of {path}')
    return int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])

def main():
    no_stills = '--no-stills' in sys.argv
    plan = load('plan.json')
    mode = plan.get('mode', 'replace')
    W, H = plan.get('width', 1920), plan.get('height', 1080)
    # --- source facts -------------------------------------------------
    src = plan.get('source')
    fps = plan.get('fps')
    total = plan.get('total_frames')
    if mode == 'replace':
        import cv2
        cap = cv2.VideoCapture(src)
        if not cap.isOpened():
            raise SystemExit(f'cannot open source video "{src}" (set "source" in plan.json)')
        sfps = cap.get(cv2.CAP_PROP_FPS)
        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        sw, sh = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        if fps and abs(fps - sfps) > 0.01:
            print(f'WARNING plan fps {fps} != source fps {sfps:.3f}; using the source fps')
        fps = round(sfps, 3)
        if abs(sw / sh - W / H) > 0.01:
            print(f'NOTE source is {sw}x{sh} but output is {W}x{H}: host shots will be cover-cropped to fit')
    else:
        fps = fps or 30
        if not total:
            total = round(audio_duration(plan['audio']) * fps)
    fps = int(fps) if float(fps).is_integer() else fps
    project = {'width': W, 'height': H, 'fps': fps, 'mode': mode, 'total_frames': total, 'captions': plan.get('captions', {})}

    # --- theme --------------------------------------------------------
    theme = theme_util.complete(load(plan.get('theme', 'theme.json')))
    os.makedirs('css', exist_ok=True)
    open('css/theme.css', 'w').write(theme_util.to_css(theme))

    # --- transcript ---------------------------------------------------
    tr = load(plan.get('transcript', 'data/transcript.json'))
    words = [{'w': w['w'].strip(), 's': w['s'], 'e': w['e']} for seg in tr for w in seg['words']]
    capcfg = plan.get('captions', {})
    enabled = capcfg.get('enabled', True)
    max_chars = capcfg.get('max_chars', 52)
    fixes = plan.get('caption_fixes', [])

    def clean(t):
        for a, b in fixes:
            t = re.sub(a, b, t, flags=re.I)
        return t

    def J(lst):
        s = ''
        for x in lst:
            s += x['w'] if (not s or x['w'].startswith('-')) else ' ' + x['w']
        return s

    def cues_for(ws, t0, max_chars=max_chars):
        cues, cur = [], []
        def flush():
            if cur:
                cues.append({'t0': cur[0]['s'] - t0 - 0.06, 't1': cur[-1]['e'] - t0 + 0.28, 'text': clean(J(cur))})
        for w in ws:
            cur.append(w)
            txt = J(cur)
            if re.search(r'[.?!:]$', w['w']) or (re.search(r'[,;]$', w['w']) and len(txt) >= round(max_chars * 0.58)) or len(txt) >= max_chars:
                flush(); cur[:] = []
        flush()
        merged = []
        for c in cues:  # merge orphan fragments into the previous cue
            if merged and len(c['text']) < 18 and len(merged[-1]['text']) + 1 + len(c['text']) <= max_chars + 20:
                merged[-1]['text'] += ' ' + c['text']; merged[-1]['t1'] = c['t1']
            else:
                merged.append(c)
        for i in range(len(merged) - 1):
            merged[i]['t1'] = min(merged[i]['t1'], merged[i + 1]['t0'] - 0.02)
        for c in merged:
            c['t0'] = round(max(c['t0'], 0), 3); c['t1'] = round(c['t1'], 3)
        return merged

    # --- segments & scenes -------------------------------------------
    tcfg = plan.get('transitions', {})
    host_style = tcfg.get('host', 'slats')
    styles = tcfg.get('styles', ['iris', 'bars', 'diag', 'tiles', 'slats'])
    colors = tcfg.get('colors', ['primary', 'dark', 'secondary', 'primary', 'dark'])
    col = lambda c: theme.get(c, c)
    out, warn = [], []
    # --- overlays: a host-video panel composited on top of graphics scenes (split-screen) ---------------
    overlays = plan.get('overlays', [])
    ov_of = {}
    for ov in overlays:
        r = ov['rect']
        ov.setdefault('radius', 36); ov.setdefault('fade_in', 0.35); ov.setdefault('fade_out', 0.35); ov.setdefault('delay', 0.45); ov.setdefault('ring', True)
        side = ov.get('side', 'right' if r['x'] > W / 2 else 'left')
        margin = ov.get('content_margin', 60)
        if side == 'right':
            cb = {'x': margin, 'w': r['x'] - 2 * margin}
        else:
            cb = {'x': r['x'] + r['w'] + margin, 'w': W - (r['x'] + r['w']) - 2 * margin}
        cb['cx'] = cb['x'] + cb['w'] / 2
        ov['_content_box'] = cb
        ov['_caption'] = {'region': ({'x': 0, 'w': r['x']} if side == 'right' else {'x': r['x'] + r['w'], 'w': W - r['x'] - r['w']}), 'max_chars': ov.get('caption_max_chars', 44)}
        for sid_ in ov['scenes']:
            ov_of[sid_] = ov
    segs = plan['segments']
    if mode == 'standalone' and not segs:
        raise SystemExit('standalone mode needs at least one segment')
    for seg in segs:
        sid = seg['id']
        is_insert = 'insert_at_frame' in seg      # a short NEW clip (title card, bumper) inserted between two source frames; consumes no source frames
        if is_insert:
            F0 = F1 = seg['insert_at_frame']; ins_n = round(seg.get('duration', 2.0) * fps)
        else:
            F0 = seg.get('start_frame', 0)
            F1 = total if seg.get('end_frame') in (None, 'end') else seg['end_frame']
        scs = seg['scenes']
        if is_insert and len(scs) != 1: raise SystemExit(f'insert segment {sid} must contain exactly one scene')
        for i, sc in enumerate(scs):
            first, last = i == 0, i == len(scs) - 1
            f0 = F0 if first else (sc['start_frame'] if 'start_frame' in sc else round(sc['start'] * fps))
            f1 = F1 if last else (scs[i + 1]['start_frame'] if 'start_frame' in scs[i + 1] else round(scs[i + 1]['start'] * fps))
            if f1 <= f0 and not is_insert:
                raise SystemExit(f'scene {sc["id"]}: end frame {f1} <= start frame {f0} (scene starts must increase)')
            T0, T1 = f0 / fps, f1 / fps
            n_out = ins_n if is_insert else f1 - f0
            # words that start as a host shot returns belong to the host's own burned-in caption
            slack = sc.get('word_slack', 0.02)          # include words that START just before the scene (a word cut mid-way by the scene boundary)
            ws = [] if is_insert else [w for w in words if w['s'] >= T0 - slack and w['s'] < (T1 - 0.30 if last else T1 - sc.get('end_slack', 0.02))]   # end_slack: drop words that START in the last N s (they belong to the next scene's caption)
            rel = [{'w': w['w'], 's': round(w['s'] - T0, 3), 'e': round(w['e'] - T0, 3)} for w in ws]
            theme_name = sc.get('theme', 'light' if (len(out) % 2 == 0) else 'dark')
            if first:
                tin = ({'kind': 'host', 'still': f'assets/host_{sid}_in.png', 'style': host_style} if (mode == 'replace' and (F0 > 0 or 'in_still_frame' in seg)) else {'kind': 'none'})
            else:
                k = (i - 1) % len(styles)
                tin = {'kind': 'wipe', 'style': styles[k], 'color': col(colors[k % len(colors)])}
            if last:
                tout = ({'kind': 'host', 'still': f'assets/host_{sid}_out.png', 'style': host_style} if (mode == 'replace' and (F1 < total or 'out_still_frame' in seg)) else {'kind': 'none'})
            else:
                k = i % len(styles)
                tout = {'kind': 'wipe', 'style': styles[k], 'color': col(colors[k % len(colors)])}
            D = n_out / fps
            ov = ov_of.get(sc['id'])
            if sc.get('wipe_speed'):   # faster wipes for short scenes (1 = normal)
                for tr in (tin, tout):
                    if tr.get('kind') in ('host', 'wipe'): tr['speed'] = sc['wipe_speed']
            if 'transition_in' in sc and sc['transition_in'] == 'dissolve' and tin.get('kind') == 'host': tin['style'] = 'dissolve'
            if sc.get('transition_out') == 'dissolve' and tout.get('kind') == 'host': tout['style'] = 'dissolve'
            if D < 2.0 and not is_insert:
                warn.append(f'{sc["id"]}: only {D:.2f}s long — covers eat ~0.9s of every scene, keep it very simple')
            if not rel and not is_insert:
                warn.append(f'{sc["id"]}: no transcript words fall inside this scene')
            scene_rec = {'id': sc['id'], 'seg': sid, 'f0': f0, 'f1': f1, 'n': n_out, 'insert': is_insert, 't0': round(T0, 4), 'D': round(D, 4), 'theme': theme_name,
                         'words': rel, 'cues': cues_for(ws, T0, (ov['_caption']['max_chars'] if ov else max_chars)) if enabled else [], 'in': tin, 'out': tout}
            if ov:
                scene_rec['panel'] = {'rect': ov['rect'], 'radius': ov['radius'], 'ring': ov['ring']}
                scene_rec['content_box'] = ov['_content_box']
                scene_rec['caption_box'] = ov['_caption']['region']
            out.append(scene_rec)

    by_id = {s['id']: s for s in out}
    # --- edits: holds that lengthen a presenter shot (e.g. let a smile settle before a cut) -----------------------------
    project['edits'] = []
    for ed in plan.get('edits', []):
        if ed.get('type', 'hold') != 'hold': raise SystemExit(f'unknown edit type {ed.get("type")}')
        an = ed['anchor_frame']; dt = ed.get('drop_to_frame', an + 1)
        if dt <= an: raise SystemExit(f'edit {ed["id"]}: drop_to_frame must be > anchor_frame')
        n = (dt - an - 1) + round(ed.get('extra_seconds', 5.0) * fps)
        project['edits'].append({**ed, 'type': 'hold', 'drop_to_frame': dt, 'n_frames': n, 'window': ed.get('window', 8), 'zoom': ed.get('zoom', 0.025), 'net_frames': n - (dt - an - 1)})
    hs = plan.get('host_source')
    project['host_source'] = hs if (hs and os.path.exists(hs)) else None
    if hs and not project['host_source']: warn.append(f'host_source "{hs}" does not exist yet (run scripts/upscale_hosts.py); using the soft source for host frames')
    project['overlays'] = []
    for ov in overlays:
        ss = [by_id[i] for i in ov['scenes']]
        if any(b['f0'] != a['f1'] for a, b in zip(ss, ss[1:])): raise SystemExit(f'overlay {ov.get("id")}: its scenes must be consecutive')
        rec = {k: v for k, v in ov.items() if not k.startswith('_')}; rec.update({'f0': ss[0]['f0'], 'f1': ss[-1]['f1']})
        project['overlays'].append(rec)
    os.makedirs('data', exist_ok=True)
    scene_files = sorted(glob.glob('scenes/*.js'))
    json.dump({'project': project, 'scenes': out}, open('data/scenes.json', 'w'), indent=1)
    pal = {k: v for k, v in theme.items()}
    with open('data/scenes.js', 'w') as f:
        f.write('window.PROJECT = %s;\nwindow.PAL = %s;\nwindow.SCENE_FILES = %s;\nwindow.SCENE_DATA = %s;\n' % (
            json.dumps(project), json.dumps(pal), json.dumps(scene_files), json.dumps({s['id']: s for s in out})))

    # --- host stills for the crossfades -------------------------------
    if mode == 'replace' and not no_stills:
        import cv2
        os.makedirs('assets', exist_ok=True)
        if project['host_source']: cap = cv2.VideoCapture(project['host_source'])   # sharp upscaled master: same frame indices as the source
        def still(idx, name):
            cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            ok, f = cap.read()
            if not ok:
                raise SystemExit(f'cannot read source frame {idx}')
            fh, fw = f.shape[:2]
            if abs(fw / fh - W / H) > 0.01:  # cover-crop to the output aspect
                scale = max(W / fw, H / fh); f = cv2.resize(f, (round(fw * scale), round(fh * scale)), interpolation=cv2.INTER_LANCZOS4)
                y0, x0 = (f.shape[0] - H) // 2, (f.shape[1] - W) // 2; f = f[y0:y0 + H, x0:x0 + W]
            else:
                f = cv2.resize(f, (W, H), interpolation=cv2.INTER_LANCZOS4)
            cv2.imwrite(name, f)
        for seg in segs:
            if 'insert_at_frame' in seg: F0 = F1 = seg['insert_at_frame']
            else:
                F0 = seg.get('start_frame', 0); F1 = total if seg.get('end_frame') in (None, 'end') else seg['end_frame']
            if F0 > 0 or 'in_still_frame' in seg: still(seg.get('in_still_frame', F0 - 1), f'assets/host_{seg["id"]}_in.png')       # in_still_frame: the LAST presenter frame actually shown before this segment (e.g. a hold's anchor)
            if F1 < total or 'out_still_frame' in seg: still(seg.get('out_still_frame', F1), f'assets/host_{seg["id"]}_out.png')

    # --- report -------------------------------------------------------
    tot = sum(s['n'] for s in out)
    for ed in project['edits']: print(f'  edit {ed["id"]}: hold after frame {ed["anchor_frame"]} ({ed["n_frames"]} frames = {ed["n_frames"] / fps:.2f}s, drops source frames {ed["anchor_frame"] + 1}-{ed["drop_to_frame"] - 1}, net +{ed["net_frames"] / fps:.2f}s)')
    print(f'{len(out)} scenes, {tot} frames = {tot / fps:.2f}s  (project {W}x{H} @ {fps}fps, mode={mode}, total {total} frames)')
    for s in out:
        print(f'  {s["id"]:6s} f{s["f0"]}-{s["f1"]}  {s["D"]:6.2f}s  words={len(s["words"]):3d} cues={len(s["cues"]):2d}  {s["theme"]:5s} in={s["in"].get("style", s["in"]["kind"]):6s} out={s["out"].get("style", s["out"]["kind"])}')
    for w in warn:
        print('WARNING', w)
    print('scene files:', scene_files or 'NONE yet (create scenes/*.js)')

if __name__ == '__main__':
    main()
