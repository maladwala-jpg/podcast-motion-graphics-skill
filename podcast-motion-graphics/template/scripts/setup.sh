#!/usr/bin/env bash
# One-time toolchain setup for a motion-graphics project (run from the project root: bash scripts/setup.sh)
# Creates .tools/ with a Python venv (opencv, whisper, pillow, ffmpeg binary if the system has none),
# installs node deps (playwright-core, gsap, fonts, lucide icons), builds js/icons.js, finds Chrome.
set -e
cd "$(dirname "$0")/.."
mkdir -p .tools
echo "[1/4] Preparing the Python tools (video analysis, speech recognition, audio levelling, AI upscaler)..."
PKGS=(imageio-ffmpeg "opencv-python-headless>=4.8,<4.12" numpy pillow faster-whisper scipy pyloudnorm)
if [ ! -x .tools/venv/bin/python ]; then
  if command -v uv >/dev/null 2>&1; then
    uv venv --python 3.11 .tools/venv >/dev/null 2>&1 || uv venv .tools/venv >/dev/null
    uv pip install --python .tools/venv/bin/python "${PKGS[@]}" >/dev/null
  else
    python3 -m venv .tools/venv
    .tools/venv/bin/pip install --quiet "${PKGS[@]}"
  fi
fi
PY="$(pwd)/.tools/venv/bin/python"
# Optional: AI upscaler for low-resolution presenter footage (models are bundled in the wheel). --no-deps matters: the package depends on
# "opencv-python", which would overwrite the pinned opencv-python-headless and break face detection / video reading.
if command -v uv >/dev/null 2>&1; then uv pip install --python "$PY" --no-deps realesrgan-ncnn-py >/dev/null 2>&1 || echo "  (note) AI upscaler not installed on this platform - presenter footage will use a plain resize"; \
else .tools/venv/bin/pip install --quiet --no-deps realesrgan-ncnn-py >/dev/null 2>&1 || echo "  (note) AI upscaler not installed on this platform - presenter footage will use a plain resize"; fi
echo "[2/4] Finding the video encoder (ffmpeg)..."
# ffmpeg with libx264: prefer system, else the static binary bundled with imageio-ffmpeg
FF="$(command -v ffmpeg || true)"
if [ -n "$FF" ] && ! "$FF" -hide_banner -encoders 2>/dev/null | grep -q libx264; then FF=""; fi
if [ -z "$FF" ]; then FF="$($PY -c 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())')"; fi
# node deps + icon bundle
echo "[3/4] Installing the animation engine and icon library..."
command -v node >/dev/null || { echo "Node.js is required (https://nodejs.org)"; exit 1; }
npm install --silent --no-audit --no-fund
node scripts/make_icons.mjs
echo "[4/4] Finding Chrome (draws the frames)..."
# Chrome / Chromium
CHROME=""
for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "/Applications/Chromium.app/Contents/MacOS/Chromium" "$(command -v google-chrome || true)" "$(command -v chromium || true)" "$(command -v chromium-browser || true)" "/c/Program Files/Google/Chrome/Application/chrome.exe"; do
  if [ -n "$c" ] && [ -x "$c" ]; then CHROME="$c"; break; fi
done
if [ -z "$CHROME" ]; then
  echo "No Chrome found - downloading Chromium via playwright-core (one-time, ~150MB)..."
  npx --yes playwright-core install chromium
  CHROME="$(node -e "console.log(require('playwright-core').chromium.executablePath())")"
fi
"$PY" - <<PYEOF
import json
json.dump({"ffmpeg": "$FF", "python": "$PY", "chrome": "$CHROME"}, open(".tools/env.json", "w"), indent=2)
print(open(".tools/env.json").read())
PYEOF
echo "setup complete. (The speech-recognition model, ~0.5 GB, downloads the first time you analyse a video.)"
