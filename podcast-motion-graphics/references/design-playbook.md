# Design playbook — how to turn a spoken sentence into a good scene

Contents: the look · designing from the transcript · scene anatomy and pacing · visual metaphor table · layout rules (16:9 and 9:16) · recipes (with example files) · honesty rules · per-scene QA checklist

## The look (Greg Isenberg–style explainer motion graphics, re-coloured)

What makes the reference style work, and how to reproduce it:
* **One idea per scene, one visual metaphor.** Text is a label for the picture, never a paragraph. The voice carries the sentence; the screen shows its shape.
* **Soft rounded cards with real shadows** floating on a faint grid background, icon chips with a colour per concept, a serif display face (Fraunces) for headlines with **one accent-coloured word**, Inter for labels.
* **Everything arrives on the word.** Elements spring in (`pop`, slight overshoot) exactly when the thing is spoken; headlines reveal word by word. This is what makes it feel hand-made rather than templated.
* **Camera life:** the engine adds a slow scale drift and floating confetti shapes so held frames are never dead.
* **Alternate light and dark scenes** for rhythm (`plan.json → scenes[].theme`). Light = cream paper look, dark = deep brand colour with glowing accents.
* **Palette comes from the video's own world** (studio set, brand). Sample it (`analyze_video.py palette`), then keep to 3 accents + 2 neutrals. Never mix two looks in one video.
* Sizes (1080p): headline 74–110 px, card titles 30–42 px, labels ≥ 26 px, nothing smaller than 22 px. Phone-screen viewers read small text badly.

## Designing from the transcript

1. Read the transcript of the segments you are replacing end to end, then split it into **scenes at sentence pauses** (a gap > 0.4 s in the word timings). Target 6–18 s per scene; under ~4 s is only OK for a title card. Covers consume ~0.9 s per scene, so a 4 s scene has ~3 s of readable screen time.
2. For each scene write one line: *what is said → the visual metaphor → the 3–5 beats* (a beat = something that appears or changes on a specific word). Show this storyboard to the user and get a yes before building (it is their video; the metaphors are creative choices).
3. Beats: pick the words that carry meaning (nouns, verbs of change, numbers, "not", "but", "instead"). Pin each beat to `at('word')`. A scene with 3–6 beats feels alive; 10+ feels frantic.
4. Questions in the script ("what are the hard facts?") deserve a visual question (big serif phrase, `?` badges) — and *not* an answer you invented. Show the answer only when the speaker gives it.
5. Replace, don't illustrate literally: "slice the numbers across geographic brackets" → a map cut into bands with a bar per band, not a picture of a knife.

## Start with the recipes

`js/recipes.js` (see engine-api.md → Recipes) covers the most common scene shapes: title, steps, flow, grid, compare, bars, checklist, big number, myth-vs-fact. Pick the recipe whose *shape* matches the sentence, fill in the words, then add one custom touch (a stamp, an arrow, a highlighted word, an extra chip) if the idea needs it. Only build a scene from scratch when no recipe fits (a map, a balance scale, a document, an illustration) — the 25 scenes in `examples/ai-bias-auditor/` show how.

## Scene anatomy and pacing

```
0.0 ─ 0.5  covered by the wipe (reveals the scene) — nothing important
0.5 ─ ~1.8 OPENING BEAT: hero headline big in the middle, or a reaction word ("Exactly.") — never empty air
1.8 ─ D-0.7 the word-pinned beats; hero glides to the top when the diagram needs the middle
D-0.5 ─ D   wipe closes — last important element must have landed by D-0.6
```
* If the first spoken words are a reaction ("Exactly, Elena.", "Instead,") give them a big italic word in the accent colour; it buys time and gives the scene a voice.
* If a sentence runs long (15+ s) build the diagram in stages and let earlier elements dim (`gone`/`opacity`) rather than letting the screen fill up.
* Use `pop(..., {a: 0.45})` "ghost" elements to pre-announce a list, then light each item on its word (see A1 destinations).

## Visual metaphor table

| idea in the script | visual |
|---|---|
| process / pipeline / "moves into" | source card → gear/sorter card → destination cards, tokens flowing along curves |
| definition of a role/term | big serif name + tag; container (dashed org outline) with 3 small panels inside; badge on the border |
| comparison of two groups | two cards with dot grids or bars side-by-side + a ratio pill between |
| steps ("Step 2…", first/then/finally) | numbered cards in a row with arrows; a "who reviews" pill underneath |
| "not X" / "no Y" / "cannot" | red ban/× over the thing, or a barrier wall the arrow bounces off |
| myth vs reality | illustration + rubber `stamp('Myth')`, dim it, slide the real thing in with ✓ rows |
| balance / trade-off | balance scale tilting then levelling; supports (pillars) underneath |
| many routes to a goal | `road()` map with two lanes ending at a flag |
| journey / entry barrier | student chip, road, gate cards with `?` badges |
| data / dataset / table | table card with rows popping in; spreadsheet with formula bar typing; dots grid |
| change over time / versions | cards whose icon+label swap (`v1→v2`) over a constant "core" slab |
| difference / gap / anomaly | bars with a bracket + delta pill; red outline pulse on the odd one; magnifier sweep |
| privacy / safety | shield chip + big "0"; crossed-out personal-data icons; wifi-off chip |
| document / report | page card building section by section; "1 page" ribbon |
| achievement / payoff | folder + badge + star chips + confetti burst (`C7`) |

## Layout rules

**16:9 (1920×1080)** — content region y≈170–880 (below the headline, above the caption pill that occupies y≈905–1035). Headline top at y≈118. Keep ≥ 60 px from the left/right edges. Three-column rows: x≈ 420/960/1500. Card text ≥ 27 px.
**9:16 (1080×1920)** — express positions with `SW`/`SH`. Stack vertically, one element per row, bigger type (headline 100–130 px). Avoid the platform UI zones: top ~250 px, bottom ~450 px, right ~140 px. Captions default to `bottom:300`, so content must end above y≈1450. `scripts/new_project.py --size 1080x1920` sets the caption defaults.
General:
* Centre-align; align things on the grid you picked (equal gaps). Check `qa.py` sheets for elements touching.
* Labels that sit under chips/cards need ≥ 20 px clearance from the thing above them; stacked two-line labels collide with neighbouring lines more often than you expect.
* Any element rotated or scaled in a tween (`pop` overshoot) grows ~8 % at its peak — leave margin.

## Recipes (open the example to copy structure; all in `examples/ai-bias-auditor/`)

| recipe | scene |
|---|---|
| reaction word → hero headline → flow diagram with tokens | A1 |
| definition: org container + 3 panels + supervision badge | A2 |
| road with gate cards and student chip | A3 |
| two-lane route map (`road`) | A4 |
| Venn of three skills with multiply blend (`mixBlendMode`) | A5a |
| dot-grid group comparison + counting percentages + ratio pill | A5b |
| hand-built illustration (tower from divs) + stamp + checklist | A6 |
| document with ticking boxes + SVG gauge with needle + strike-through | A7 |
| calendar flip, skyline, network graph + ban | B1 |
| table whose cells morph (names → IDs) | B2 |
| map clipped into bands that separate | B3 |
| animated bar chart with dashed "expected" line | B4 |
| link between a code card and a patch map with highlights | B5 |
| 3 step cards + connector curves + badge | B6 |
| icon/label swap across a row; foundation slab | B7 |
| barrier wall an arrow cannot cross; people network | B8 |
| balance scale (beam + pans tween together) | B9 |
| version row + shared core + transfer pulses | B10 |
| title badge with rotating dashed ring | C1 |
| repo → file → table | C2 |
| two safety cards with crossed icons | C3 |
| spreadsheet with typed formula | C4 |
| bars + bracket + dashed ring + flag | C5 |
| document building in three columns | C6 |
| folder + badge + confetti burst | C7 |

## Title cards and chapter inserts

A 3-second title between sections (about 1.8 s fully readable once the fast wipes are subtracted — 2 s felt too short) (hook → main body, topic → topic): dark theme scene; small amber kicker pill ("TODAY'S CAREER PATHWAY"), one icon chip with expanding pulse rings, the title in the serif face at 120+ px with the key word in the accent colour, a one-line sans subtitle, a faint radar/sweep or other topical motif behind. Everything lands within 0.8 s, then holds for a comfortable read. See examples/soc-episode/scenes_T.js.

## Honesty and safety rules

* **Never invent facts.** If a chart needs numbers the script does not give, make them clearly illustrative and say so on screen (`tag('illustrative data')` / small caption). Never state a statistic the speakers did not.
* No real people, no real company logos or brand names, no screenshots of real products unless the user supplies them. Fictional names/IDs in tables are fine.
* Don't put a "wrong" answer on screen while the speaker is still asking the question.
* Keep the user's meaning: the graphics illustrate the sentence, they don't editorialise.

## Per-scene QA checklist (look at `qa.py` sheets)

- [ ] Something meaningful on screen by 0.6–1 s (not empty air)
- [ ] Every beat lands on its word (compare caption text to what has appeared)
- [ ] No element overlaps another or clips the frame edge; text fully legible
- [ ] Nothing important in the first/last 0.5 s; final beat landed ≥ 0.6 s before the end
- [ ] Nothing intrudes on the caption zone
- [ ] Accent word present in the headline; palette consistent; no stray colours
- [ ] Numbers/claims are either from the script or labelled illustrative
