# Lessons learned (from building the 262-second "AI Bias Auditor" episode)

Contents: finding the replaceable scenes · transcript · rendering and engine pitfalls · encoding and delivery · workflow habits that saved time

## Finding the scenes to replace

* **Trust your eyes, not a classifier.** Colour/edge statistics mislabelled a presenter shot as "graphics" because the set had a dark panel at the frame edge. Build 1-fps contact sheets (`analyze_video.py sheets`) and read them; use `cuts` only to get frame-exact boundaries (hard cuts show as a single-frame jump > 12 in mean abs difference).
* **Frame-verify every boundary.** Extract frames `n-1` and `n` around each cut and look at both before writing `plan.json`; end frames are *exclusive*.
* **Dissolves are not detected as cuts.** If a boundary looks soft on the sheet, step through frames.
* **Look for short hidden shots** (a 3-second presenter cutaway inside a graphics stretch). Cuts + sheets together catch them; sampling every 5 s does not.
* **Which file is which.** Users attach several files in no fixed order. A 56 s vertical reel with a watermark was the *style reference*; the long landscape file was the podcast. Open frames of every file before assuming.
* The old graphics scenes carry **burned-in captions**. They vanish with the old scene, so the new scenes must recreate captions (the engine does, from the transcript) — otherwise captions disappear mid-video.

## Transcript

* Whisper (small.en) timings were accurate to ~0.1 s — enough to pin animations. But it **mishears names and jargon** ("Alaina" for "Elena", "data sets" vs "datasets"). Proofread `data/transcript.json`; use `caption_fixes` for caption wording and keep `at()` phrases consistent with what the transcript actually contains (the engine throws and lists available words when they differ).
* A word that *starts* as the presenter returns belongs to the presenter's own burned-in caption; `build_data.py` drops those from the last scene so no stray word shows.
* Hyphenated words arrive as separate tokens ("entry", "-level"); the caption builder re-joins them.

## Rendering / engine pitfalls (all fixed in the template; know them when writing scenes)

* **Elements built with `mk('', css)` are not absolutely positioned** unless you say so → `left/top` ignored → things pile in a corner. `add()/put()` force `position:absolute`.
* **Multi-word `*accent phrase*` markup renders the asterisks.** Mark each word: `*vary* *widely*`. Put trailing punctuation inside the same token so it animates with the word.
* **Diagonal wipe left a wedge at the screen edge** when its off-screen start position was too small. Travel distance must exceed the band width + stage width (now computed).
* **The first 0.5 s and last 0.5 s of every scene are under the wipe.** A "hiring" card timed at the last word of a scene was nearly invisible. Keep the final beat ≥ 0.6 s before the end.
* **Empty openings**: scenes whose first spoken words are a reaction/transition looked dead for 2 s. Use a reaction word or `hero()`.
* **Collisions**: an exclamation chip clipped a header; a ratio pill sat across two cards; labels under chips overlapped connector lines; an essay strip overlapped the document card. Always read the 9-still sheet at full size.
* **`gsap.to` and `immediateRender`**: use `fromTo`; for repeating yoyo shakes use `immediateRender:false` on the second tween so it does not overwrite the first at time 0.
* **Callbacks** (`counter`, `typeIn`) rely on `tl.time(t, false)` (events enabled) — the engine seeks that way; don't change it.
* `mix-blend-mode: multiply` gives realistic overlaps (Venn) but is slowish; fine at 4 workers.
* Pixel-exact fonts require the fonts to be loaded before building (the engine awaits `document.fonts.load`).
* The tool's page is opened from `file://`, so Chrome needs `--allow-file-access-from-files` (set in `render.mjs`).

## More pitfalls found on the second job (SOC episode, 18 scenes, ~2 h end-to-end)

* **`card(…, {solid:true})` inverts on dark scenes** (it becomes a light card), so light code/text inside it vanishes. For a code editor or anything that must stay dark, pass explicit `bg:'#17110D', col:'#F6ECDF'`.
* **`pop()` resets x/y/scale** — a `gsap.set(el,{x:…})` before it is overwritten. To start an element somewhere else, build a separate big element and `gone()` it, or tween it afterwards.
* **`reveal(h, 0, {times:[…]})` needs one time per word token** (`*Judgment*` is one token; `a b c` is three). `reveal` now trails missing ones after the last time, but count anyway — a short list looked like a stray word on screen at t=0.
* **Hero headline + diagram overlap:** `hero()` parks the big headline at `yc` (screen middle). If the diagram also lives mid-screen, set `yc≈300–330, yTop≈150, big≈1.1–1.3` so the two never share space, or glide the hero away (`move`) before the diagram pops.
* **A `svgLayer()` made inside a card is stage-sized**, not card-sized, so a line drawn "in the card" lands at the stage corner. For small graphs create a small `<svg>` yourself (see SOC scene B3).
* **Opening 1–2 s of a scene is empty when the first words are a lead-in** ("That brings us to…", "Under the guidance of…"). Add a lead-in beat (a `UP NEXT` tag, a struck-out "what it is NOT" headline) rather than waiting for the first noun.
* **Whisper split "Beginner Safe"/"entry -level"/"data set"** and a clipped first word ("beginner" for "A beginner") — fix in `caption_fixes` (regex) and keep `at()` words matching the transcript, not the intended spelling.
* A `scenes/00_helpers.js` file (loaded first alphabetically) is a good home for tiny shared helpers (`LBL`, `NUM`, `BAR`).
* Typical effort: setup+analysis 4 min, storyboard 10 min, authoring 18 scenes ≈ 60–75 min including 2 QA rounds, render 2 min, assemble+verify 3 min.

## Split-screen lessons (SOC episode, 5:08–5:27)

* **ffmpeg overlay shows the overlay one frame late** when the overlay stream is trimmed and re-timed with `setpts`; measured by decoding with ffmpeg and comparing against source frames (OpenCV seeking made the test misleading — decode both sides the same way). `assemble.py` compensates (−1 frame) and `verify.py` checks the panel at ≥30 dB.
* **Crop above the burned-in captions**, otherwise the speaker's old caption appears inside the panel while the new caption pill is under the graphics.
* **Check that a face box is stable** before choosing a crop (here the face centre moved only ±8 px over 19 s, so a fixed crop is safe; for a presenter who moves a lot, widen the crop).
* **First word of the section is spoken during the wipe** ("Write" at −0.26 s) → use `word_slack`; **last words of the previous scene leak into the next cue** → `end_slack`.
* The 9:16 crop of a 640×360 source is only ~173×308 px, upscaled ~3.3× to the panel — fine for a short insert, but tell the user it is soft.

## Third job: polish pass (title insert, holds, audio leveling, AI upscale) — what worked, what did not

**AI upscaling of a 640×360 avatar video**
* Tested Real-ESRGAN models from the `realesrgan-ncnn-py` wheel on Elena/Jules/Rohan frames. `animevideov3` (0.05 s/frame) and `x4plus-anime` (0.46 s) turn skin plastic/cartoonish — rejected. **`x4plus` (1.5 s/frame) keeps natural skin, hair and the microphone lettering** — chosen. Running copies in parallel does not help (GPU-bound).
* Raw per-frame super-resolution makes static backgrounds **shimmer** (frame-to-frame change 0.247 vs 0.041 for a plain resize). Fix = static-region recursive blend: where the *source* did not change, blend the new sharp frame with the previous output (β 0.8); moving regions (face, hands) take the fresh frame → flicker 0.071, nearly as steady as a resize, with the sharpness kept.
* `pip install realesrgan-ncnn-py` pulls in `opencv-python`, which overwrites `opencv-python-headless` and breaks the pinned build → install with `--no-deps` (setup.sh does).
* Budget ≈ 2 h for ~4,900 frames: run in the background in resumable chunks, author scenes meanwhile, and re-render the scenes afterwards (their wipes use host stills).
**Avatar glitches and holds**
* A "weird expression before the cut" was the avatar **mouthing words silently for 0.7 s after the audio ended**; at the end of the video the avatar **closed its eyes** on the last frames. There is no extra footage to extend (the Filmora project only references the exported mp4), so the answer is a *hold*: keep up to the last clean frame (closed-mouth smile, eyes open), drop the glitchy frames, and build the extra seconds from a slow sweep back through the last few frames (smile softly broadens and relaxes) with frame blending and a slow zoom. Per-frame face sheets (10 columns, ~190 px tiles) found the exact frames in one look.
* Source captions are burned into the frames and the **last caption lingers on the held frame**. Tried and rejected: inpainting the caption pill (Telea leaves a smeared band), a clean plate from another shot of the same host (lighting/pose differ). Worked: a slow push-in (zoom 1.2 about the top-centre) slides the bottom 15 % of the frame — and the caption — out of view in about a second.
* The hold's audio must start with the source audio of the frames it replaces: the avatar's lips finish ~0.1 s before the voice, so cutting audio at the anchor frame clips the last syllable.
* **Hold window = only frames you would be happy to see in slow motion.** The sweep passes through every frame in the window, so a window that includes a wide open-mouth smile plays as a *silent laugh*. On the closing hold the first window (5 frames) reached a toothy laugh; 3 frames still reached an open-mouth smile; **2 closed-mouth frames + the slow push-in** looked right. Check the hold preview sheet at 1-second spacing before rendering.
* **A long job must never write back the plan it loaded at the start.** `upscale_hosts.py` (2 hours) originally saved its stale copy of plan.json at the end and silently erased the title insert, the holds and the sound settings that had been added meanwhile. It now re-reads plan.json just before saving. General rule for any long background step: re-read, change one key, write.
**Title insert**: choose a frame inside a pause (transcript gap) with the mouth closed; the presenter shot just pauses and resumes. **Readable time = duration − ~1.2 s of wipes.** A 2.0 s card (`wipe_speed 0.6`) left only ~1.2 s on screen and the user asked for one more second; **3.0 s (≈1.8 s readable) is the right default for a title** — plan duration = 1.2 s + the time needed to read it comfortably (about 0.35 s per word plus a beat). A faint synthesized whoosh+chime (≈ −26 LUFS vs −15 speech) keeps the cut from feeling like dead air.
**Audio leveling**: AI voices on the three hosts ranged −33…−10.6 LUFS per turn (std 4.8 dB; one host 20 dB quieter than another). Energy-gate speech turns (the voices sit on digital silence), measure each turn with BS.1770, move each to −15 LUFS with gain ramps inside the pauses, then a look-ahead peak limiter → std 0.4 dB, integrated −15.4 LUFS, true peak −1.0 dBTP. Add any room-tone bed **after** leveling or the leveler amplifies it into hiss. A vectorised limiter is required: a per-sample Python loop over 15 M samples takes minutes.
**Process**
* Insertions and holds break the "output frame == source frame" assumption the first version relied on → `assemble.py` now writes `out/timeline.json` and `verify.py`/`build_audio.py` read it. Keep the old checks for unedited videos.
* **Never overwrite a delivered file** when the user asks for a revision: save the earlier cut under its own name (I overwrote a version once and had to restore it).
* Comparing against source frames: seek with ffmpeg decoding on both sides (OpenCV `set(POS_FRAMES)` can be a frame off), and mind that ffmpeg's `overlay` shows a trimmed+re-timed overlay one frame late (compensated in assemble.py).

## Environment pitfalls

* macOS system Python is 3.9 and has no Pillow; the skill uses a project venv (`.tools/venv`, created by `setup.sh`).
* `opencv-python-headless` **5.x removed the cascade classifier and 4.13+/4.14 had a broken macOS wheel** (missing dylib). `setup.sh` pins `>=4.8,<4.12` (4.11 verified).
* No Homebrew/ffmpeg? `imageio-ffmpeg` ships a static ffmpeg with libx264 — `setup.sh` uses it automatically.
* Parallel rendering: ~10 fps per Chrome page, ~40 fps with `--par 4` on an Apple-silicon laptop (262 s of 1080p30 graphics = 7,877 frames ≈ 4 min). Disk: clips are CRF 10 intermediates (~1–3 MB per scene).

## Encoding & delivery

* **One final encode only** (clips are intermediate): libx264 high, yuv420p, bt709 tags, `-crf 14`, `maxrate 20M`, `-g 2×fps`, `+faststart`. CRF 16 gave 2.6 Mbps and CRF 14 gave 3.3 Mbps on flat graphics + soft host footage; both look clean — 14 leaves headroom for YouTube's re-encode.
* **Never `-shortest` and never trim audio.** Re-encode the source's audio to AAC-LC 192k (HE-AAC 48 kbps sources are fine); verify lag 0 and equal sample counts (`verify.py`).
* Output frame count must equal the source frame count exactly (replace mode) — that is what keeps audio sync trivially perfect.
* Host footage gets upscaled with Lanczos (3× from 640×360); tell the user it will look soft next to crisp graphics and ask for a higher-res export if they have one.
* Verify with data, then look: PSNR of host frames vs upscaled source (≥ 38 dB), replaced frames differ, audio correlation, then open `out/seams.jpg` and a 2-second contact sheet of the finished video.

## Workflow habits that saved time

* Write all scenes of a segment, then render QA stills for each (`qa.py`), fix in one pass, then render everything — don't render full clips until the stills look right.
* Keep each scene self-contained (own `L = svgLayer()`, own helpers) so a fix to one never breaks another.
* Edit scene code with small, targeted replacements and re-run only that scene's `qa.py`.
* Save the project folder next to the final MP4 so the user can tweak and re-render a single scene later.
