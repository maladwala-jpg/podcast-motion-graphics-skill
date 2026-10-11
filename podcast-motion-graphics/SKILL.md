---
name: podcast-motion-graphics
description: Create speech-synced motion graphics for podcasts, AI-avatar or talking-head videos, explainers and Shorts, and composite them into a finished YouTube-ready MP4. Use whenever the user wants animated scenes, b-roll, title cards or explainer visuals added to or replacing parts of a video, or wants a finished video polished (sharper presenter footage, even speaker volume, fixing an odd avatar expression or eyes closed on the last frame). Examples - "replace the scenes where the host isn't on screen", "add a title card", "animate my podcast", "turn this voiceover into an animated explainer", "make the hosts sharper and the sound even" - even if they never say motion graphics. It analyses the source, builds HTML/GSAP scenes timed to the spoken word, renders them in headless Chrome, keeps presenter shots, adds captions, wipes, split-screen panels, inserts and holds, AI-upscales presenters, levels audio and verifies the result. Replace mode (source video) or standalone mode (voiceover); 16:9 or 9:16.
---

# Podcast motion graphics

Turn a transcript into designed, word-synced animated scenes and splice them into a video — or build a whole video from a voiceover. Proven on a 6:48 podcast with three AI-avatar hosts: 25 scenes / 262 s of graphics replaced, presenter shots bit-identical, audio sample-aligned.

## Where this runs (check this first)

This skill **runs programs on the user's computer** (Node, Python, headless Chrome, ffmpeg). It works where Claude has a working terminal on the user's machine — the Claude desktop app's **Code** tab, Claude Code, or Cowork — on macOS or Linux (Windows via WSL). In a plain chat that cannot run commands it cannot render video: say so in one friendly sentence, then offer what you *can* do there — analyse a transcript, write the storyboard, theme and scene code into files — and tell them to continue in the Code tab.
Run `bash scripts/doctor.sh` (in the project) to check Node, Python, Chrome, internet and disk; it prints plain-language fixes.

## Working with a non-technical user (the default assumption)

The people using this are usually creators, not engineers. So:
* **Do the technical work yourself.** Run setup, analysis and rendering; never hand them terminal commands unless something truly cannot be done for them. Approval prompts may appear when you run commands — tell them once, in a sentence, that approving them is expected.
* **Speak in plain words.** Not "venv", "GSAP", "frames", "CRF". Say "setting up the tools (one time, about 5 minutes)", "checking each scene", "rendering the video". Keep jargon in the files, not in the chat.
* **Ask very little.** You need: the video (or voiceover), whether it is for YouTube (landscape) or Shorts/Reels (vertical), and any brand colours (default: match the video's own colours). Decide everything else and say what you decided.
* **Show, then confirm.** Present the storyboard as a simple table (time · what is said · what we'll show) plus the colour palette, then ask "Shall I build it?". That is the one approval gate; the metaphors are their creative product.
* **Short progress notes** at each phase (analysing → storyboard → building scenes → rendering → checking) with a rough time. Rendering a 4-minute video takes minutes, not hours.
* **If something fails**, fix it yourself and explain in one plain sentence what happened; never paste logs. If they must act (e.g. install Node.js), give exact click-by-click steps with the download link and re-check afterwards.
* **Hand over simply:** where the finished MP4 is, what changed (a small keep/replace table), the caveats (low-resolution source, example numbers), and how to ask for changes ("tell me the scene number and what to change").

## What you get and why it is built this way

* **Replace mode** — a finished video has stretches with no presenter (old AI images, static stills, weak b-roll). Those frame ranges are replaced; every presenter frame and the original audio stay untouched, and the output has exactly the source's frame count. That is what makes audio sync trivially safe, so never retime or trim audio.
* **Standalone mode** — a voiceover (or any audio) becomes a full motion-graphics video; same engine, no host footage. (Script only, no audio? You can storyboard from it, but timing needs the spoken audio — ask for the voiceover.)
* **Word-synced** — scenes are HTML/GSAP pages seeked frame-by-frame. `at('word')` returns the moment a word is spoken (Whisper word timestamps), so a card appears *as* it is named. This precision is the difference between "templated" and "hand-made".
* **Ready-made recipes** — `rTitle, rSteps, rFlow, rGrid, rCompare, rBars, rChecklist, rStat, rMythFact` build a polished scene in one call and adapt to landscape and vertical. Start from them; hand-build only unusual ideas.
* **Split-screen panel** — keep a presenter beside the graphics (e.g. a 9:16 host panel on the right third) for instruction-heavy stretches; the engine crops the presenter from the source, composites it with rounded corners and fades, and narrows the graphics area. Details: `references/engine-api.md`.
* **Polish tools (from the second review round)** — title-card **inserts**, presenter **holds** (let an avatar's smile settle before a cut or finish on open eyes), **AI upscaling** of soft 640×360 presenter footage, and **speaker-level audio leveling** (AI voices can differ by 20 dB). These are reviewed on the *first* pass, not after the user complains: see `references/workflow.md` step 2b and `references/engine-api.md` → Polish features.
* **Studio-matched** — palette sampled from the video, light/dark scene rhythm, caption pill in the host shots' own caption style, wood-slat/iris/bars/diagonal/tiles wipes that dissolve into and out of presenter shots.

## Workflow (details and commands: `references/workflow.md`)

Use the skill's base directory (shown when the skill loads) as `<skill>`.
1. **Intake.** Look at every attached file (extract frames) to learn which is the video and which is a style reference. Choose mode and format (16:9 unless Shorts/Reels).
2. **Scaffold + setup.** `python3 <skill>/scripts/new_project.py <proj> --source video.mp4` (or `--audio vo.mp3 --size 1080x1920`) → `cd <proj> && bash scripts/doctor.sh && bash scripts/setup.sh`. Put the project beside the user's video (e.g. `<video name>-motion-graphics/`).
3. **Analyse.** `scripts/analyze_video.py all <video>` → contact sheets, hard cuts + face hints, word-level transcript, palette. **View the sheets.** Proofread the transcript (names/jargon). Then **review the presenter footage** (step 2b in the workflow): face sheets around cuts and at the end for silent mouthing / closed eyes, loudness per speaker, resolution — and start `upscale_hosts.py` in the background if the source is soft.
4. **Map** the no-presenter stretches, frame-exact (`[start, end)`; verify both frames at each cut). Show the keep/replace table.
5. **Theme + storyboard** → user's go-ahead (see above).
6. **Plan.** Fill `plan.json`, run `scripts/build_data.py` (scene table, warnings, host stills).
7. **Author scenes** in `scenes/*.js` — recipes first (`references/engine-api.md`), custom elements where needed; render stills with `scripts/qa.py <ids>` and fix until the checklist in `references/design-playbook.md` passes.
8. **Render** `node scripts/render.mjs all --par 4` → **assemble** `scripts/assemble.py out/final.mp4 14` (video encoded once, soundtrack built + leveled + muxed) → **verify** `scripts/verify.py out/final.mp4` (all PASS) → look at `out/seams.jpg` and a contact sheet of the final video.
9. **Deliver** the MP4 (attach it if you can) + the project folder (minus `node_modules`, `.tools`, `out`) + the plain-language summary.

## Rules that matter (and why)

* **Presenter frames and audio are sacred.** Only frames inside `plan.segments` are replaced. If the output frame count differs from the source, something is wrong — `verify.py` fails the run.
* **Boundaries come from your eyes plus hard-cut detection.** A colour/edge classifier mislabelled a presenter shot; contact sheets are ground truth. Check the frames either side of every cut.
* **Pin every beat to a word** (`at('word') - 0.1`; recipes do it for you). `at()` throws and lists the real words if the transcript differs from what you typed — that is a feature.
* **The first and last ~0.5 s of each scene sit under the wipe.** Give every scene an opening beat (reaction word, `hero()`, a recipe heading); land the final beat ≥ 0.6 s before the end.
* **One idea, one metaphor per scene; text labels the picture.** Captions already carry the words.
* **Don't invent facts.** Use only what the speakers said; example numbers must be visibly "illustrative"; no real brands, logos or people.
* **Recreate captions.** Old graphics scenes usually have captions baked into the images; they vanish with them, so the engine rebuilds captions from the transcript in the host shots' style. Fix mis-hearings via `caption_fixes`.
* **Look at output at full size.** Collisions, clipped labels and empty openings only show in the stills; read each `qa.py` sheet before rendering everything.
* **One final encode** (CRF 14, bt709, faststart, AAC-LC 192k, never `-shortest`). Tell the user when the source is low-res (e.g. 640×360): presenter shots will look softer than the new graphics.
* **Never overwrite a delivered video** when revising — save the new cut under the final name and keep the earlier one under its own (e.g. `…_v1_…`).
* **Keep each scene self-contained** and edit with small targeted changes so a fix never ripples.

## Reference files (read when you reach that step)

* `references/workflow.md` — every step with commands, decision points, timing budget. Read first on any new job.
* `references/design-playbook.md` — visual language, storyboarding from a transcript, pacing, metaphor table, layout rules for 16:9 and 9:16, recipes → example map, honesty rules, per-scene QA checklist. Read before authoring scenes.
* `references/engine-api.md` — the recipes, every helper (`T, card, chip, tag, pop, reveal, hero, drawOn, arrow, road, counter …`), coordinate model, transitions, captions, theme variables, `plan.json`/`theme.json` schema. Read when writing scene code.
* `references/lessons-learned.md` — pitfalls from the real build (detection mistakes, markup gotchas, collisions, environment/version problems, encoding). Skim before starting; re-read when something misbehaves.
* `examples/ai-bias-auditor/` — the complete first job: `plan.json`, `theme.json`, `transcript.json`, all 25 scene scripts. `examples/soc-episode/` — the second job with every polish feature in its `plan.json` (title insert, split-screen panel, two holds, upscaled presenters, leveled sound) and its 22 scene scripts. `examples/recipes-demo/` — all nine recipes in use.
* `START-HERE.md` — the plain-English guide for the user (what to say, what to expect). Point them to it if they ask how to use the skill.

## Files in the project (created by `new_project.py`)

`plan.json` (what to replace + scene starts) · `theme.json` (6 colours) · `scenes/*.js` (your scenes) · `data/` (transcript, generated scene data) · `scripts/` (`doctor.sh setup.sh analyze_video.py build_data.py render.mjs qa.py assemble.py verify.py contact_sheet.py` — each has a usage docstring) · `js/lib.js`, `js/recipes.js`, `css/base.css`, `player.html` (the engine; don't edit unless extending it) · `out/` (clips, stills, final).

## Quick reference

```bash
bash scripts/doctor.sh && bash scripts/setup.sh
.tools/venv/bin/python scripts/upscale_hosts.py          # optional, background, ~1.5 s per frame
.tools/venv/bin/python scripts/make_holds.py --preview   # only if the plan has edits
.tools/venv/bin/python scripts/analyze_video.py all video.mp4
.tools/venv/bin/python scripts/build_data.py
.tools/venv/bin/python scripts/qa.py A1,A2 9 3
node scripts/render.mjs all --par 4
.tools/venv/bin/python scripts/assemble.py out/final.mp4 14
.tools/venv/bin/python scripts/verify.py out/final.mp4
```
Requirements: Node 18+, Python 3.9+ (uv optional), Chrome/Chromium (setup downloads Chromium if absent), ~3 GB free disk, internet for the one-time setup.
