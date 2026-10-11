# Workflow, step by step

Contents: 0 intake · 1 scaffold & setup · 2 analyse · 3 map the scenes · 4 theme · 5 storyboard & approval · 6 plan · 7 author scenes · 8 render · 9 assemble & verify · 10 deliver · timing budget

`SK` = the skill folder, `P` = your project folder. Run all `scripts/…` commands from `P`; use `P/.tools/venv/bin/python` (or put `P/.tools/venv/bin` first on PATH).

## 0. Intake (ask only what you cannot find out)

* Look at **every attached file** (extract a few frames) to learn which is the video, which is a style reference, which is audio/script.
* Decide the mode: *replace* (a finished video with segments to improve — keep presenter shots + audio) or *standalone* (build a video from a voiceover/script).
* Output format: 16:9 (YouTube) unless they say Shorts/Reels/TikTok (9:16).
* Ask before building if genuinely ambiguous: who/what is the audience, whether captions should be recreated, brand colours. Otherwise decide, and state the decision in the plan the user approves (step 5).

## 1. Scaffold & setup

```bash
python3 SK/scripts/new_project.py P --source /path/video.mp4 --title "Episode title"      # replace mode
python3 SK/scripts/new_project.py P --audio /path/voiceover.mp3 --size 1080x1920            # standalone, vertical
cd P && bash scripts/setup.sh            # once: venv (opencv, whisper, pillow, ffmpeg if missing), npm deps, 2,000+ icons, finds Chrome
```
Run `bash scripts/doctor.sh` first: it checks Node, Python, Chrome, internet and disk space and prints plain-language fixes for anything missing. `setup.sh` needs Node 18+, Python 3, and either Chrome/Chromium or network access to download Chromium. It writes `.tools/env.json` (ffmpeg/python/chrome paths used by every script). If setup fails read the message; common fixes are in lessons-learned.md → Environment pitfalls.

## 2. Analyse

```bash
.tools/venv/bin/python scripts/analyze_video.py all /path/video.mp4 [--model small.en | --model small --language fr]
```
Produces `analysis/sheets/sheet_N.jpg` (1-fps contact sheets, 80 s each), `analysis/shots.jpg|json` (hard cuts + face hints), `data/transcript.json`, `theme.suggested.json`, `analysis/palette.png`. For long videos (> 20 min) run `sheets --step 2`.
**Read every sheet** (view the images). Proofread the transcript printout.

## 2b. Review the presenter footage for problems (do this on the first pass — it saves a revision round)

Build per-frame **face contact sheets** around (a) every cut back to a presenter, (b) the last 2 seconds of every presenter run, (c) the last second of the video, and look at them: AI avatars commonly **keep mouthing words after the audio has ended** (an "odd expression" before a cut), **blink or close their eyes on the final frame**, or hold a half-open mouth. Note the last clean frame (eyes open, mouth closed/smiling) → that becomes a `hold` anchor (engine-api.md → Polish features). Also look for natural pauses where a **title card** could go (hook → main body). Measure speaker loudness per turn (`build_audio.py` prints it): AI voices differ by 20 dB or more between hosts, which is the most common "audio problem" complaint — plan the `sound.level` block from the start.
If the source is below 1080p (e.g. 640×360 avatar exports) plan the **AI upscale** now and start it early: it takes about 1.5 s per frame on the GPU, so start `upscale_hosts.py` in the background as soon as the segments are mapped, and author scenes while it runs.

## 3. Map the replaceable scenes

From the sheets + `shots.json`, list every stretch where the presenter/avatar is **not** on screen (old graphics, stills, stock b-roll). For each boundary find the exact frame: shots.json gives hard-cut frames; verify by extracting frames `n-1` and `n` (e.g. `ffmpeg -i video -vf "select=eq(n\,3285)" -vframes 1 f.png`) and looking.
Write the map for the user as a table (start–end time, length, keep/replace). Segments: `[start_frame, end_frame)` with the *first graphics frame* as start and the *first presenter frame after it* as end. Also note whether the first/last stretch of the video is graphics (then that side has no host shot).
Note the captions on the host shots (screenshot crop): near-black pill, white bold sans, bottom-centre → the engine's default; adjust `plan.captions` if different.

## 4. Theme

Open `analysis/palette.png`, take `theme.suggested.json` as a starting point and edit by eye into `theme.json` (6 colours; see engine-api.md). Check: `primary` reads as the brand/set accent, `dark` is a deep tone of the same family, `light` a soft paper colour, `tertiary` contrasts with `primary`. If the user gave brand colours, use those.

## 5. Storyboard and approval

For each segment, split into scenes (design-playbook.md → *Designing from the transcript*), then present one table: `# | time | what is said | visual metaphor | key beats`, plus: palette, captions decision, output size, any "illustrative numbers" caveat, source-resolution caveat. Ask for a go-ahead (the user may say "build it"). Do not skip this on a first job: the metaphors are the creative product.

## 6. plan.json

Fill `plan.json` (schema in engine-api.md): segments with frame ranges, scenes with absolute `start` seconds at sentence pauses, per-scene `theme` alternating light/dark, `caption_fixes`. Then:
```bash
.tools/venv/bin/python scripts/build_data.py     # prints a scene table; fix any WARNING (short scene, no words)
```
Re-run it whenever plan.json / theme.json / transcript.json changes. It also extracts the host stills used by the crossfades.
Print the words of each scene before authoring it, so every `at()` phrase exists:
`python3 -c "import json;d=json.load(open('data/scenes.json'))['scenes'];[print(s['id'],s['D'],' '.join(f\"{w['w']}[{w['s']}]\" for w in s['words'])) for s in d]"`

## 7. Author scenes

Create `scenes/scenes_A.js` (one file per segment). **Start from the recipes** (engine-api.md → Recipes) and add custom elements only where needed. Follow design-playbook.md and engine-api.md; copy structure from `SK/examples/ai-bias-auditor/`. Then for each scene:
```bash
.tools/venv/bin/python scripts/qa.py A1,A2 9 3      # renders 9 stills per scene -> out/qa/<id>.jpg
```
View each sheet, fix, repeat until clean (the checklist is at the end of design-playbook.md). Typical: 1–2 fix rounds per scene. A scene that throws shows the error with the list of available words.

**Split screen:** if the user wants the presenter to stay on screen beside graphics for a stretch (instructions, step-by-step, a long explanation), add an `overlays` entry — see engine-api.md → *Split-screen host panel*. Those frames then belong to a segment and get scenes designed for the narrower area.

## 7b. Edits, inserts, sound (only if the plan uses them)

```bash
.tools/venv/bin/python scripts/make_holds.py --preview     # hold clips + preview sheets (look at them: smile, no jump, caption leaves the frame)
.tools/venv/bin/python scripts/upscale_hosts.py            # background job; resumable; writes out/host_master.mp4 and sets plan.host_source
```
When the master exists: `build_data.py` again (stills now come from the sharp master) → render ALL scenes again → assemble.

## 8. Render

```bash
node scripts/render.mjs all --par 4         # or A1,A2 / seg:A ; add --par 2 on small machines
```
Check the log shows `done in …` for every scene and no `[pageerror]`/`[console]` lines.

## 9. Assemble & verify (now timeline-aware: video encoded once, then soundtrack built along out/timeline.json, leveled and muxed)

```bash
.tools/venv/bin/python scripts/assemble.py out/final.mp4 14
.tools/venv/bin/python scripts/verify.py out/final.mp4
```
All checks must PASS. Then **look**: open `out/seams.jpg` (every host↔graphics seam), and make a 2-second contact sheet of each replaced stretch from the final file (see lessons-learned.md → Encoding & delivery); spot-check 2–3 full-resolution frames.

## 10. Deliver

* Copy `out/final.mp4` to the user's folder with a descriptive name; attach it (SendUserFile) if available.
* Copy the project (without `node_modules/`, `.tools/`, `out/`, `analysis/`) next to it so scenes can be tweaked later.
* Report: the keep/replace map, what each scene shows (short), verification results, and caveats (source resolution, illustrative numbers, any transcript fixes). Offer revisions per scene.

## Timing budget (Apple-silicon laptop)

Analyse ~1 min per 10 min of video (whisper dominates) · authoring is the real work (≈ 10–15 min per segment of 8–10 scenes, mostly thinking) · render ≈ 1 min per minute of graphics at `--par 4` · assemble ≈ 1 min · verify ≈ 1–2 min.
