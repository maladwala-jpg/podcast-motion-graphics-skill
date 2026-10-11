# Podcast Motion Graphics — a Claude skill

Turn a podcast, AI-avatar video or voiceover into a polished, YouTube-ready video with **speech-synced motion graphics**.
Claude analyses your video, finds the stretches where no presenter is on screen, designs animated scenes whose every beat lands on the spoken word,
renders them, and splices them in — keeping the presenter shots and the original audio.

## What it does
- **Replace mode** – replaces no-presenter scenes (static AI images, weak b-roll) with motion graphics; **standalone mode** – builds a video from a voiceover. 16:9 or 9:16.
- Word-synced HTML/GSAP scenes, nine ready-made layout-adaptive recipes (title, steps, flow, grid, compare, bars, checklist, stat, myth-vs-fact), brand palette sampled from the video.
- Captions in the presenter's caption style, wood-slat / iris / bars / diagonal / tile wipes, **split-screen host panel**, 2-3 s **title-card inserts**.
- Presenter polish: **AI upscaling** of soft footage (Real-ESRGAN, GPU), **holds** that let an avatar finish on a smile / open eyes, **speaker-level audio leveling** (BS.1770 LUFS).
- Automatic verification: frame counts, presenter fidelity, panel match, audio evenness and peak, seam contact sheets.

## Install
- **Claude app (recommended):** upload `podcast-motion-graphics.skill` (Settings → Capabilities → Skills), or open it in the Claude desktop app and click *Save skill*.
- **Claude Code:** copy the `podcast-motion-graphics/` folder into `~/.claude/skills/`.

The skill runs programs on your computer, so use it where Claude has a terminal (Claude desktop app → Code tab, Claude Code, Cowork).
Requirements: Node 18+, Python 3.9+, Chrome/Chromium, internet for the one-time setup (about 1 GB). `scripts/setup.sh` installs everything else into the project folder.
Developed and tested on macOS (Apple silicon). The AI upscaler is optional and needs a Vulkan/Metal-capable GPU.

## Use it
Start with `podcast-motion-graphics/START-HERE.md` (plain-English guide). Example prompt:

> Use the podcast-motion-graphics skill. Here is my finished episode. Replace every scene where a host is not on screen with motion graphics in the studio's colours, keep the hosts and audio as they are, and show me the storyboard first.

## What is in here
| Path | Contents |
|---|---|
| `podcast-motion-graphics/SKILL.md` | the skill (workflow + rules) |
| `podcast-motion-graphics/references/` | workflow, design playbook, engine API, lessons learned |
| `podcast-motion-graphics/template/` | the engine and pipeline scripts copied into every project |
| `podcast-motion-graphics/examples/` | two complete worked episodes (25 and 22 scenes) + a recipes demo |
| `podcast-motion-graphics.skill` | the packaged skill, ready to upload |

The example folders contain the scene scripts and word timings of two Career Moonshots episodes (AI Bias Auditor; Autonomous SOC Orchestrator).
