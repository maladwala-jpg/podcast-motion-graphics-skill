# Engine API (js/lib.js) + config schemas

Contents: recipes (fast path) · polish features (inserts, holds, upscaling, sound) · split-screen host panel · scene anatomy · coordinate model · timing helpers · building blocks · animation helpers · lines & paths · captions · transitions · theme & CSS variables · plan.json · theme.json · data flow

## Recipes — the fast path (js/recipes.js)

Nine ready-made, layout-adaptive building blocks. **Reach for these first**: they produce a polished, on-brand scene in one call, time every element to the spoken word, and adapt to 16:9 and 9:16 (text, spacing, stacking). Compose one or two per scene, and add custom elements around them with the helpers below when the idea needs something special. Working demo of all nine: `examples/recipes-demo/scenes_recipes.js`.

Time spec (`at`): a spoken phrase (`'finance'` → appears just before that word is heard) or a number of seconds. All recipes accept `box:{x,y,w,h}` to move/resize them and `heading`/`headingAt` where a title is useful.

| recipe | use it for | key options |
|---|---|---|
| `rTitle({kicker,title,sub,icon,at})` | chapter / topic title card | big icon with rotating ring, serif title |
| `rSteps({heading,items:[{icon,label,sub,at}],goal:{icon,label,at}})` | steps, process, "first / then / finally" | numbered cards + arrows (row on 16:9, column on 9:16) + optional goal pill |
| `rFlow({heading,nodes:[{icon,label,at,color}],pulse})` | how something moves through stages | icon nodes joined by arrows, a pulse runs through |
| `rGrid({heading,items:[{icon,label,at}],cols})` | lists of examples/categories | icon cards popping on their words |
| `rCompare({heading,left:{label,icon,value,at},right:{…},unit,vs,gap})` | two things / groups side by side | numbers count up with bars, "vs" pill, gap pill |
| `rBars({title,bars:[{label,value,at,flag}],max,unit,ref:{value,label,at},illustrative})` | a chart | bars grow on their words; `flag` marks the odd one; dashed reference line; shows an "illustrative data" tag unless `illustrative:false` |
| `rChecklist({title,items:[{label,at}]})` | requirements, to-dos, criteria | rows tick on their words |
| `rStat({value,unit,prefix,label,icon,at})` | one big number | counts up with a glow |
| `rMythFact({myth:{label,at,stampAt},fact:{label,at},mythStamp,factStamp})` | myth vs reality | myth stamped and dimmed, fact confirmed |

Example (one scene, three beats pinned to words):
```js
scene('B3', sd => rSteps({
  heading: 'Three simple steps',
  items: [ { icon: 'download',  label: 'Download a dataset',   at: 'download' },
           { icon: 'table-2',   label: 'Compare two groups',   at: 'pick' },
           { icon: 'file-text', label: 'Write a one-page brief', at: 'draft' } ],
  goal: { label: 'A portfolio piece', icon: 'award', at: 'portfolio' } }));
```
Numbers inside `rBars`/`rCompare` are labelled *illustrative* automatically unless the speakers actually said them — set `illustrative:false` only then.

## Polish features: title inserts, holds, upscaled presenters, sound (plan.json)

These were added on the SOC episode after the first review. All are optional; each is a few lines of plan.json.

**1. Title card / bumper inserted between two source frames** (e.g. the cut from a hook to the main body). Consumes no source frames, so the presenter shot pauses and resumes; the title scene is an ordinary scene file.
```jsonc
{ "id": "T", "insert_at_frame": 1392, "duration": 3.0,                // choose a frame inside a PAUSE in the speech (transcript gap), mouth closed. 3.0 s = ~1.8 s fully readable
  "scenes": [ { "id": "T1", "theme": "dark", "wipe_speed": 0.6 } ] }   // wipe_speed < 1 = faster wood-slat wipes (the wipes eat ~1.2 s of the duration: total = readable time + 1.2 s)
```
Wipes in and out use stills of the presenter frames either side of the insert. No transcript words fall inside, so time every beat in plain seconds (no `at()`). The soundtrack gets a soft synthesized sting (see sound).

**2. Hold — lengthen a presenter moment so an expression can settle** (e.g. the avatar mouths words silently after the audio ended, or blinks on the last frame).
```jsonc
"edits": [ { "id": "hold1", "type": "hold",
   "anchor_frame": 7905,      // LAST source frame kept: eyes open, mouth closed/smiling (find it with a per-frame face contact sheet)
   "drop_to_frame": 7926,     // source resumes here; frames 7906..7925 are DROPPED (the glitchy ones). For the end of the video: the total frame count
   "extra_seconds": 5.0,      // NET lengthening of the video
   "window": 8,               // the hold sweeps back through this many frames before the anchor and returns. ONLY include frames you would accept in slow motion: a window that reaches an open-mouth smile plays as a silent laugh (use 2-3 closed-mouth frames; the push-in supplies the life)
   "zoom": 0.02,
   "push_in": { "to": 1.2, "seconds": 1.1, "center": [0.5, 0.03] },    // slow camera push-in: carries a LINGERING burned-in caption out of the bottom of the frame
   "room_tone_db": -62 } ]
// and on the segment that follows the hold:   "in_still_from_edit": "hold1"     (its wipe starts from the last hold frame)
```
`python3 scripts/make_holds.py --preview` builds `out/clips/<id>.mp4` and a preview sheet. Hold audio = the source audio of the replaced frames (a final syllable finishes) + a faint room tone. Choose the anchor with: closed-mouth smile, eyes OPEN, not mid-blink. Why not freeze-frame: a pure freeze looks like a photo; the sweep + slow zoom keeps a live face.

**3. Upscaled presenter footage** (`"host_source": "out/host_master.mp4"`). `python3 scripts/upscale_hosts.py` AI-upscales every presenter frame (Real-ESRGAN x4plus on the GPU, ~1.5 s per 640×360 frame on an Apple M-series chip; run it in the background — it is resumable in 300-frame chunks) into a full-length 1080p master with one frame per source frame; static regions are stabilised so walls do not shimmer. Everything that shows presenter footage (host runs, holds, transition stills, split-screen panels, `verify.py`) then reads the master instead of the soft source. Run `--test 40` first to see timing and the flicker report. Re-run `build_data.py` and re-render the scenes after the master exists (their wipes use host stills).

**4. Sound** (`"sound"`, used by `build_audio.py`):
```jsonc
"sound": { "level": { "target_lufs": -15, "max_gain_db": 20, "min_gain_db": -15, "true_peak_db": -1.5, "gate_db": -45 },
           "sting": { "gain_db": -8 } }      // sting: false = no title-card sound
```
Each speech turn is measured (BS.1770 LUFS) and moved to the target with smooth gain changes inside the pauses, then peak-limited. On the SOC episode the turns ranged from −33 to −10.6 LUFS (std 4.8 dB, three AI voices); after leveling −16.5…−15 LUFS (std 0.4 dB), integrated −15.4 LUFS, true peak −1.0 dBTP. Without a `sound` key the source audio is copied unchanged along the edit timeline.

**Assembly order:** `build_data.py → make_holds.py → render.mjs all → assemble.py` (video encoded once → `build_audio.py` → mux) `→ verify.py`. `assemble.py` writes `out/timeline.json` (every piece, with source and output frame numbers); `verify.py` uses it, so edited videos are checked frame-for-frame against the right source frames, and the audio check becomes an evenness/peak check.

## Split-screen host panel (plan.json → overlays)

Use when a presenter should stay visible *beside* graphics — e.g. a host gives step-by-step instructions and you want the viewer to see both the speaker and supporting visuals. Proven on the SOC episode (host in a 9:16 panel on the right third, graphics on the left two-thirds, 5:08–5:27).

```jsonc
"segments": [ { "id": "C", "start_frame": 7926, "end_frame": 9818,       // include the split-screen frames in the segment
  "scenes": [ …,
    { "id": "C6", "start_frame": 9240, "theme": "dark", "word_slack": 0.4 },   // first scene of the panel section
    { "id": "C7", "start": 316.06, "theme": "light" },
    { "id": "C8", "start": 322.9, "theme": "dark", "transition_out": "dissolve" } ] } ],  // dissolve into the next host shot
"overlays": [ { "id": "hostpanel", "scenes": ["C6","C7","C8"],           // consecutive scenes that sit beside the panel
   "crop": { "x":250, "y":0, "w":173, "h":308 },                          // SOURCE-pixel region around the presenter (9:16: h = w*16/9), above the burned-in captions
   "rect": { "x":1317, "y":36, "w":567, "h":1008 },                       // where the panel sits in the OUTPUT frame (about one third wide)
   "radius":36, "delay":0.5, "fade_in":0.4, "fade_out":0.35, "ring":true, "content_margin":60, "caption_max_chars":64 } ]
```
* **Choosing `crop`:** extract a few source frames, measure the presenter's face box (analyze_video.py or a Haar cascade), centre the crop on it, keep the 9:16 aspect and stay above the source's burned-in captions (they would otherwise appear twice). The new caption pill replaces them under the graphics.
* **Content area:** inside these scenes `CX` (centre x), `CW` (width) and `CL` (left edge) describe the free area beside the panel (here CL=60, CW=1197, CX≈658). Recipes use them automatically; hand-built scenes should position with `CX/CW` instead of `SW`. The caption pill is centred under that area and wraps wider (`caption_max_chars`).
* **How it is built:** `render.mjs` draws the left graphics and an empty rounded panel frame (ring + shadow); `assemble.py` crops the presenter from the *source video* each frame, rounds it with a mask, fades it in/out and overlays it on the finished clips, then `verify.py` checks the panel against the source (≥30 dB). The presenter stays in the original audio — sync is untouched. `assemble.py` shifts the overlay one frame earlier because ffmpeg's overlay otherwise shows it one frame late.
* **Entry/exit:** the section can open with the usual wipe from the previous scene, then the panel fades in after `delay`; at the end `transition_out:"dissolve"` cross-dissolves the whole split screen into the following full-screen host shot (no wipe).
* **Scene options for edges:** `word_slack` (include a word that starts just before the scene — e.g. the first word spoken during the transition) and `end_slack` (drop words that start in the last N s because they belong to the next scene's caption).
* Because the panel scenes sit on a narrower stage, design them for ≈1200 px width: 3 columns of ≈250 px cards, or 2 columns of ≈430–610 px.

## Scene anatomy

```js
scene('A1', sd => {            // sd = {id, D, words[], cues[], theme, in{}, out{}, ...}  (D = scene length in seconds)
  const L = svgLayer();        // optional SVG layer for lines/arrows (sits UNDER everything added after it)
  const c = add(card(520, 300), SW/2, SH/2);              // add(element, x, y [, parent]) — x,y is the element CENTRE
  pop(c, at('finance') - 0.1);                             // schedule an entrance on the scene timeline `tl`
});
```
* One file per segment in `scenes/*.js` (auto-discovered). Scene ids must match `plan.json`.
* Globals available in scene files: everything below plus `tl` (the GSAP timeline), `D`, `W` (words), `R` (content root), `THEME` ('light'|'dark'), `SW`, `SH`, `FPS`, `PAL` (theme colours), `gsap`.
* The page is *seeked*, never played: frame f shows `tl.time(f/FPS)`. Build the whole timeline up front with absolute times. Never use `setTimeout`, `requestAnimationFrame`, `Math.random()` (use deterministic values), or CSS animations/transitions.
* GSAP rules that keep seeking deterministic: use `fromTo` (the `pop`/`reveal` helpers already do), set initial hidden states via `fromTo` or `gsap.set`, and never `gsap.to` a property that another tween already animates with a different start value unless the second tween starts after the first ends.

## Coordinate model

Absolute pixels in a `SW × SH` stage (default 1920×1080). `put/add` position an element by its **centre** (`xPercent/yPercent -50` are applied), relative to its parent — inside a card, `(0,0)` is the card's top-left corner. Any element given to `put/add` is forced to `position:absolute`; elements you build with `mk('', css)` and append yourself must set `position:'absolute'` explicitly (forgetting this makes left/top silently ignored).

## Timing helpers

| call | meaning |
|---|---|
| `at('phrase')` | start time (s, scene-relative) of the first occurrence of the spoken phrase; `at('phrase', 2)` = second occurrence. **Throws** with the list of available words if the phrase is not in this scene — that is the typo / mis-transcription guard. Matching ignores case and punctuation; whisper splits "-" words ("entry -level" → `at('entry level')`). |
| `endAt('phrase')` | end time of the phrase |
| `clamp(t)` | keeps a time inside `[0, D-0.05]` (all helpers apply it) |
| `sd.words` / `W` | `[{w, s, e}]` for custom logic |

Land a visual ~0.1 s *before* the word starts (`at('x') - 0.1`) so it is fully formed when the word is heard.

## Building blocks (return DOM elements; place them with `add`)

| call | notes |
|---|---|
| `T(str, {s, w, f, i, c, a, ls, lh, mw, uc})` | text. `f`: `'serif'` (default, Fraunces) \| `'sans'` (Inter) \| `'hand'`. `s` px size, `w` weight, `i` italic, `c` colour, `a` align, `mw` max width (wraps), `\n` = line break. Markup per **single word**: `*accent*`, `_italic_`, `==highlight==`, `~strike~`. Trailing punctuation after the closing mark is fine (`*word*?`). **Multi-word markup (`*two words*`) does not work** — mark each word. Result has `.words` (one span per word) for `reveal`. |
| `card(w, h, {r, solid, bg, col, ov})` | rounded card with theme shadow. `solid` = inverted (dark card on light scene). `ov` clips children. |
| `chip(iconName, {size, bg, c, sq, k, sw, r, shadow})` | round (or `sq`: rounded-square) icon badge. `k` = icon size ratio. `chip(null, …)` gives an empty badge you can put text in. |
| `ico(name, size, color, strokeWidth)` | bare lucide SVG (2,000+ names in `js/icons.js`, e.g. `'shield-check'`, `'brain'`, `'landmark'`). Throws if the name is missing; browse `node_modules/lucide-static/icons/`. |
| `tag(text, {icon, bg, c, s, pad, sh})` | pill label with optional icon |
| `stamp(text, {c, s, rot, bw})` + `slam(el, t, {rot})` | rubber-stamp text; `slam` drops it in with a shake |
| `dots(cols, rows, gap, r, fill)` | grid of dots, returns group with `.dots[]` (animate with a stagger) |
| `person(kind, size)` | avatar chip (`'you'`, `'senior'`, other) |
| `mk(cls, css, html)` | raw `div`; use `'abs'` as `cls` for absolute |

Colours: prefer CSS variables so a palette change restyles everything: `var(--primary) --secondary --tertiary --quaternary --dark --light --danger --highlight --ink --paper --muted --hair --fg --card`. (`--fg`, `--card`, `--muted`, `--hair` flip automatically between light and dark scenes.) Legacy aliases `--terra --amber --teal --walnut --espresso --cream --red` still work.

## Animation helpers (all take scene-relative seconds)

| call | effect |
|---|---|
| `pop(el, t, {s0, dx, dy, r0, r, a, sc, d, ease, blur})` | scale/slide/fade in with overshoot. `a` = final opacity (e.g. `0.45` for a "ghost" that you light up later) |
| `gone(el, t, {s, dx, dy, d})` | fade/shrink out |
| `reveal(textEl, t, {times, st, d, dy, blur, hlAt})` | word-by-word reveal. `times:[..]` pins each word to a moment (use `at()`); otherwise staggers `st` seconds apart. `==hl==` words get a marker sweep. |
| `hero(str, {move, big, yTop, yc, s, x})` | headline that appears large at the vertical middle (`yc`) and glides to the top (`yTop`) at time `move`. Fills the dead air at the start of a scene. Then call `reveal(h, 0, {times})`. |
| `strike(textEl, t, {c, h, top})` | animated strike-through line across a text element |
| `counter(el, t, dur, from, to, fmt)` | count-up; `el` must be a plain element (`mk('abs t serif')` + `.textContent`), not a `T()` |
| `typeIn(el, text, t, dur)` | typewriter |
| `drift(el, t, dur, props)` | slow linear tween (e.g. rotate a gear) |
| `slam(el, t)` | see `stamp` |
| raw GSAP | `tl.to(el, {x: 100, duration: .5, ease: 'power2.out'}, t)` / `tl.fromTo(...)` — fine for anything custom |

## Lines & paths

`svgLayer(parent?)` → SVG overlay (full stage size; z-order = DOM order, so create it *before* the cards it should sit under).
* `drawOn(layer, 'M x y L …', t, dur, {c, w, dash})` — stroke draws on. `dash:'3 12'` gives a dotted line that fades in instead.
* `arrow(layer, x1, y1, x2, y2, t, dur, {c, w, hs, bend})` — line with arrowhead (head appears when the line ends). `bend` curves it.
* `road(layer, d, t, dur, {c, w})` — thick "road" with dashed centre line revealed along the path (route maps, journeys).
* `path(layer, d, {c, w, fill, dash})` — static path (call `drawOn`-style tweens yourself).

## Captions

Built automatically from the transcript (`cues` in `data/scenes.json`) as a near-black rounded pill with bold white Inter — the style of the host shots' burned-in captions. Tune in `plan.json → captions` (`bottom`, `size`, `max_chars`, `wrap`, `max_width`, `enabled`). Pills sit *below* the transition layer, so wipes cover them. Keep scene content out of the caption zone: roughly `y > SH - bottom - 2·pill height` (≈ y>880 on 1080p; ≈ y>1450 on a 1080×1920 Short).

## Transitions (automatic — scenes never draw their own)

Every clip starts and ends fully covered by a wipe, so **the first and last ~0.5 s of a scene are hidden or partly hidden**. Hold nothing important there.
| boundary | in | out |
|---|---|---|
| host → graphics | host still (frame before the segment) cross-fades into terracotta wood-slat wall which drops away | slats close, cross-fade into the next host shot's first frame |
| graphics → graphics | the same wipe style/colour as the previous scene's exit (full-cover on both sides ⇒ seamless) | styles cycle through `plan.transitions.styles`: `iris` (circle from a corner/centre), `bars` (horizontal), `diag` (angled band), `tiles` (squares), `slats` (vertical) |
| segment edge with no neighbouring shot (video starts/ends with graphics, standalone mode) | `kind:'none'`: 0.4 s fade from/to background | same |

## Theme & CSS variables

`theme.json` needs six colours; `scripts/theme_util.py` derives the rest (see `complete()`): `primary` main accent · `secondary` second accent · `tertiary` contrasting accent · `quaternary` deep shade for text/shadows · `dark` dark-scene base · `light` light-scene base. Optional overrides: `danger, highlight` (accent word colour on dark), `accent_light` (on light), `ink, paper` (light card), `card_dark, bg_light[2], bg_dark[2], road, slats[12]`. `scripts/build_data.py` writes `css/theme.css` and `window.PAL`.
Fonts: Fraunces (display serif), Inter (UI sans), Caveat (hand). To add a font, `npm i @fontsource/<name>` and add an `@font-face` in `css/base.css`.

## plan.json

```jsonc
{
  "title": "…",                       // MP4 title tag
  "mode": "replace",                  // "replace" = keep presenter shots + audio of `source`; "standalone" = voiceover-only video
  "source": "episode.mp4",            // replace mode
  "audio": null,                      // standalone mode: path to voiceover
  "transcript": "data/transcript.json",
  "theme": "theme.json",
  "width": 1920, "height": 1080,      // output size (1080x1920 for Shorts/Reels)
  "captions": { "enabled": true, "bottom": 45, "size": 37, "max_chars": 52, "wrap": 90, "max_width": 1640 },
  "caption_fixes": [["data set", "dataset"], ["Alaina", "Elena"]],   // regex → replacement applied to caption text only
  "transitions": { "host": "slats", "styles": ["iris","bars","diag","tiles","slats"], "colors": ["primary","dark","secondary","primary","dark"] },
  "segments": [                       // frame ranges to REPLACE (end exclusive). "end_frame": "end" = to the last frame
    { "id": "A", "start_frame": 3285, "end_frame": 6245,
      "scenes": [                     // contiguous scenes; each runs until the next one's start; the last runs to end_frame
        { "id": "A1", "start": 109.5, "theme": "light" },    // start = absolute seconds in the source (or "start_frame")
        { "id": "A2", "start": 120.1, "theme": "dark" } ] }
  ]
}
```
Segment boundaries are **frames** found by inspection (hard cuts). Scene starts are placed in the pauses between sentences. Alternate `light`/`dark` for rhythm.

## Data flow

`analyze_video.py` → `data/transcript.json`, `analysis/*`, `theme.suggested.json`
`plan.json + theme.json + transcript` → `build_data.py` → `data/scenes.json|js`, `css/theme.css`, `assets/host_*.png`
`scenes/*.js` + `player.html` → `render.mjs` → `out/clips/<id>.mp4` (1 per scene, exact frame counts)
clips + source → `assemble.py` → `out/final.mp4` → `verify.py` (+ `out/seams.jpg`)
