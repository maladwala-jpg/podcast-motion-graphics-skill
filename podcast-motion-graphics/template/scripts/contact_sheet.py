#!/usr/bin/env python3
"""contact_sheet.py "<glob of images>" out.jpg [cols=3] [tile_width=640]  — label-stamped contact sheet for quick visual QA."""
import glob, math, sys
from PIL import Image, ImageDraw
files = sorted(glob.glob(sys.argv[1])); out = sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
w = int(sys.argv[4]) if len(sys.argv) > 4 else 640
first = Image.open(files[0]); h = round(w * first.height / first.width)
rows = math.ceil(len(files) / cols); sheet = Image.new('RGB', (cols * w, rows * h)); d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB').resize((w, h), Image.LANCZOS); x, y = (i % cols) * w, (i // cols) * h; sheet.paste(im, (x, y))
    d.rectangle([x, y, x + 150, y + 16], fill=(0, 0, 0)); d.text((x + 3, y + 2), f.split('/')[-1][:-4], fill=(255, 255, 0))
sheet.save(out, quality=88); print(len(files), '->', out)
