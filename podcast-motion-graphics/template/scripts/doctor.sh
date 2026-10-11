#!/usr/bin/env bash
# Plain-language "is this computer ready?" check. Safe to run any time:  bash scripts/doctor.sh
# Prints a tick/cross per requirement and tells you exactly what to do about anything missing.
cd "$(dirname "$0")/.."
ok=0; bad=0
good() { echo "  ✔ $1"; ok=$((ok+1)); }
miss() { echo "  ✘ $1"; echo "      → $2"; bad=$((bad+1)); }
note() { echo "  • $1"; }
echo "Checking this computer for motion-graphics video work..."
OS="$(uname -s)"
case "$OS" in
  Darwin) good "Mac detected" ;;
  Linux)  good "Linux detected" ;;
  *)      miss "Windows detected" "Use the Windows Subsystem for Linux (WSL) or a Mac; the tools here need a Unix-style terminal." ;;
esac
# Node.js
if command -v node >/dev/null 2>&1; then
  NV="$(node -v | sed 's/v//' | cut -d. -f1)"
  if [ "$NV" -ge 18 ]; then good "Node.js $(node -v) (runs the animation engine)"; else miss "Node.js $(node -v) is too old" "Install the current LTS version from https://nodejs.org (big green button), then run this check again."; fi
else miss "Node.js is not installed" "Install it from https://nodejs.org (big green button, accept the defaults), then run this check again."; fi
# Python
if command -v python3 >/dev/null 2>&1; then good "Python $(python3 -V 2>&1 | cut -d' ' -f2) (runs analysis and assembly)"; else miss "Python 3 is not installed" "Install it from https://www.python.org/downloads/ then run this check again."; fi
# Chrome (optional: setup can download one)
CH=""
for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" "/Applications/Chromium.app/Contents/MacOS/Chromium" "$(command -v google-chrome 2>/dev/null)" "$(command -v chromium 2>/dev/null)" "$(command -v chromium-browser 2>/dev/null)"; do
  if [ -n "$c" ] && [ -x "$c" ]; then CH="$c"; break; fi
done
if [ -n "$CH" ]; then good "Google Chrome found (draws the animation frames)"; else note "Google Chrome not found — setup will download a private copy (about 150 MB, one time). Or install Chrome from https://google.com/chrome"; fi
# Internet
if curl -sI -m 8 https://registry.npmjs.org >/dev/null 2>&1; then good "Internet connection works"; else miss "No internet connection (or it is blocked)" "Setup needs to download some tools once (about 1 GB incl. the speech-recognition model). Connect and try again."; fi
# Disk space (needs ~3 GB free)
FREE_KB="$(df -k . | awk 'NR==2{print $4}')"
if [ "${FREE_KB:-0}" -ge 3000000 ]; then good "Enough free disk space ($((FREE_KB/1024/1024)) GB free)"; else miss "Low disk space ($((FREE_KB/1024/1024)) GB free)" "Free up at least 3 GB, then run this check again."; fi
# Project set-up state
if [ -f .tools/env.json ]; then good "Project tools are already set up"; else note "Project tools not set up yet — the next step (bash scripts/setup.sh) does this automatically (about 3-6 minutes the first time)."; fi
echo
if [ "$bad" -eq 0 ]; then echo "All good — ready to go."; else echo "$bad thing(s) need attention (see the arrows above)."; fi
exit $([ "$bad" -eq 0 ] && echo 0 || echo 1)
