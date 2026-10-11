#!/usr/bin/env python3
"""Create a motion-graphics project folder from the skill template.

  python3 <skill>/scripts/new_project.py <project_dir> [--source video.mp4 | --audio voiceover.mp3] [--size 1920x1080] [--title "..."]

--source  replace mode: the finished video whose no-presenter scenes will be replaced (its audio + presenter shots are kept)
--audio   standalone mode: build a pure motion-graphics video from a voiceover / audio file
"""
import argparse, json, os, shutil, sys
here = os.path.dirname(os.path.abspath(__file__)); tpl = os.path.join(here, '..', 'template')
ap = argparse.ArgumentParser(); ap.add_argument('dir'); ap.add_argument('--source'); ap.add_argument('--audio'); ap.add_argument('--size', default='1920x1080'); ap.add_argument('--title', default='')
a = ap.parse_args()
if os.path.exists(a.dir) and os.listdir(a.dir): sys.exit(f'{a.dir} exists and is not empty')
shutil.copytree(tpl, a.dir, dirs_exist_ok=True)
for d in ('data', 'assets', 'out', 'analysis'): os.makedirs(os.path.join(a.dir, d), exist_ok=True)
p = json.load(open(os.path.join(a.dir, 'plan.json')))
w, h = [int(x) for x in a.size.lower().split('x')]; p['width'], p['height'] = w, h
if a.title: p['title'] = a.title
if a.audio:
    p['mode'] = 'standalone'; p['audio'] = os.path.abspath(a.audio); p['source'] = None
    p['segments'][0]['start_frame'] = 0; p['segments'][0]['end_frame'] = 'end'
else:
    p['source'] = os.path.abspath(a.source) if a.source else 'source.mp4'
if w < h: p['captions'].update({'bottom': 300, 'size': 46, 'max_chars': 34, 'wrap': 30, 'max_width': 940})
json.dump(p, open(os.path.join(a.dir, 'plan.json'), 'w'), indent=2)
print(f'created {a.dir}\nnext:\n  cd {a.dir} && bash scripts/setup.sh\n  .tools/venv/bin/python scripts/analyze_video.py all <video>   # sheets, cuts, transcript, palette')
