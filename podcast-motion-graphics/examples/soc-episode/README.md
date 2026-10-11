# Worked example 2 — Career Moonshots "Autonomous SOC Orchestrator" (5:39 source, 22 scenes + 2 holds + 1 title insert)

What this job added over example 1 (see `plan.json`):
* `T` segment — a 2 s **title card inserted** at frame 1392 (a pause in the speech) with a synthesized sting (`scenes_T.js`).
* `C` segment ends with three **split-screen** scenes (`scenes_C_panel.js`): host in a 9:16 panel on the right third, graphics on the left (`overlays`).
* `edits` — two **holds**: the 4:23 hold (drops the frames where the avatar mouths silently, slow push-in carries the lingering caption away) and the closing hold (eyes open, smiling), each +5 s net.
* `host_source` — presenters **AI-upscaled** from 640x360 to 1080p (`scripts/upscale_hosts.py`).
* `sound` — speaker turns **leveled** (std 4.8 dB -> 0.4 dB), sting at -8 dB peak.
* 18 content scenes in the same warm studio look as example 1 (`scenes_A/B/C.js`); `00_helpers.js` holds three tiny shared helpers.

To reproduce: `new_project.py demo --source "CM - SOC.mp4"`; copy `plan.json`, `theme.json`, `transcript.json` (to `data/`) and the scene files (to `scenes/`); then
`setup.sh`, `upscale_hosts.py` (background, ~2 h), `build_data.py`, `make_holds.py`, `render.mjs all --par 4`, `assemble.py out/final.mp4 14`, `verify.py`.
