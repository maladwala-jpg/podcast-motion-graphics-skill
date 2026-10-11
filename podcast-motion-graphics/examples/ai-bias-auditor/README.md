# Worked example — Career Moonshots "AI Bias Auditor" (25 scenes, 262.6 s of graphics)

Source: a 6:48 podcast with three AI-avatar hosts. Three stretches without a host were replaced (see `plan.json`):
1:49.50-3:28.17 (A1-A7), 3:35.53-5:16.93 (B1-B10), 5:27.77-6:30.27 (C1-C7). Presenter shots and audio untouched.

Files
- `plan.json`, `theme.json` — the exact inputs used (copy as a starting point; the six theme colours were sampled from the studio sets)
- `transcript.json` — the Whisper word timings (`data/transcript.json` in a project)
- `scenes_A.js`, `scenes_B.js`, `scenes_C.js` — all 25 scene scripts (`scenes/*.js` in a project). They use hard-coded 1920x1080 coordinates and some hex colours from this palette; for new projects prefer `SW/SH` and `var(--primary)` etc.
- Use it to see how a storyboard sentence becomes code. The recipe-to-scene table is in `references/design-playbook.md`.

To reproduce: `new_project.py demo --source <the podcast mp4>`, copy these files into place (`plan.json`, `theme.json`, `transcript.json -> data/`, `scenes_*.js -> scenes/`), `build_data.py`, `render.mjs all --par 4`, `assemble.py`, `verify.py`.
