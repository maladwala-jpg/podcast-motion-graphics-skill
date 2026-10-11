#!/usr/bin/env python3
"""Render evenly-spaced stills of one or more scenes and tile them into a contact sheet.

  python3 scripts/qa.py A2            9 stills (3 columns) -> out/qa/A2.jpg
  python3 scripts/qa.py A2,A3 12 4    12 stills per scene, 4 columns
Look at the sheet: overlaps, clipped text, empty stretches, content in the last 0.5s (hidden by the wipe)."""
import json, os, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
ids = sys.argv[1].split(','); k = int(sys.argv[2]) if len(sys.argv) > 2 else 9; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
scenes = {s['id']: s for s in json.load(open('data/scenes.json'))['scenes']}
for sid in ids:
    N = scenes[sid]['n']
    fr = [int(N * 0.06 + (N * 0.90 - N * 0.06) * i / (k - 1)) for i in range(k)]
    d = f'out/qa/{sid}'; os.makedirs(d, exist_ok=True)
    for f in os.listdir(d): os.remove(os.path.join(d, f))
    subprocess.run(['node', os.path.join(here, 'render.mjs'), sid, '--frames', ','.join(map(str, fr)), '--out', d], check=True, stdout=subprocess.DEVNULL)
    subprocess.run([sys.executable, os.path.join(here, 'contact_sheet.py'), f'{d}/{sid}_*.png', f'out/qa/{sid}.jpg', str(cols), '640'], check=True)
    print('frames', fr)
