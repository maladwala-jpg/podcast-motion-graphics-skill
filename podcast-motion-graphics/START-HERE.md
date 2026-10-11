# Your Motion Graphics Skill — Start Here

## What it does
Give Claude a finished video (for example a podcast with AI hosts) and it will replace every scene where no host is on screen with animated motion graphics — in your studio colours, with captions, timed to each spoken word — while keeping the hosts and the audio exactly as they were. It can also turn a voiceover into a brand-new animated video, in landscape (YouTube) or vertical (Shorts / Reels / TikTok).

## Where it works
The skill runs programs on **your computer**, so use it in the **Claude desktop app → Code tab** (or Claude Code / Cowork). It will not work in an ordinary chat that cannot run programs there — Claude will tell you if that happens. A Mac is ideal.

## Install (once)
1. Open the file **podcast-motion-graphics.skill** (Claude shows it as a card with a **Save skill** button) and click **Save skill**. Or go to Claude **Settings → Capabilities → Skills → Upload skill** and choose the file.
2. Using the Code tab? Just tell Claude: *"Install the skill file podcast-motion-graphics.skill from my Skills folder so I can use it here."*
3. The first time you use it Claude sets up a few free tools (needs internet, about 1 GB, 3–6 minutes). You may see permission prompts — approving them is expected.

## What to say (copy, paste, fill in)
**Replace the no-host scenes in an episode**
> Use the podcast-motion-graphics skill. Here is my finished episode: *[attach the video or give its location]*. Replace every scene where an AI host is not on screen with motion graphics in the same warm studio colours as the last episode. Keep the hosts and the audio exactly as they are. Show me the storyboard before you build.

**Turn a voiceover into a video**
> Use the podcast-motion-graphics skill. Here is my voiceover *[file]*. Build a motion-graphics explainer video for it, vertical (Shorts), with captions. Show me the storyboard first.

**Make a YouTube version and a Shorts version**
> Use the podcast-motion-graphics skill on *[video]*, as a vertical 9:16 Short of the best 45 seconds.

**Use my brand colours**
> Use these colours: main *#______*, accent *#______*, dark *#______*, light *#______*.

**Polish a finished video (all of these are built into the skill)**
> Use the podcast-motion-graphics skill on my finished episode. Add a 2-second title card with the career pathway's name at the cut from the hook to the main body, make the AI hosts sharper, and even out the volume between the hosts.

> Before the cut at *[time]* the host's expression looks odd. Hold on her last smile for 5 seconds so she finishes on a smile, then continue.

> The video ends with the host's eyes closed. Extend the ending by 5 seconds so it finishes with her eyes open and smiling.

> From *[time]* to *[time]* show the host in a vertical panel on the right and put matching graphics on the left.

**Change something afterwards**
> In scene B4, make the bars blue and show the numbers bigger.  /  Scene A2 feels crowded — simplify it.  /  Replace the icon in C3 with a lock.

## What to expect
1. **Claude studies your video** (a few minutes) and shows you which stretches have no host.
2. **You get a storyboard**: a simple table — what's said, what we'll show. Say *"Looks good, build it"* or tell it what to change. *(This is your one approval step.)*
3. **Claude builds and checks every scene** (about 10–30 minutes for a 7-minute episode).
4. **It renders and double-checks the video** (about 5–15 minutes), then gives you the finished MP4, ready for YouTube, plus a project folder so scenes can be tweaked later.

## Tips for the best results
- Give the **best-quality** version of the video — if the AI avatar tool can export a higher resolution, use that (low-resolution hosts look soft next to sharp graphics).
- Say up front whether it's **YouTube (landscape)** or **Shorts/Reels (vertical)**.
- If you have a **script**, attach it — names and special terms will be spelled correctly in captions.
- Tell Claude your **audience** (e.g. "high-school students") so the examples and tone fit.
- Example numbers in charts are labelled "illustrative" unless the hosts actually said them — you stay in control of facts.

## Good to know about the polish tools
- **Sharper hosts** uses an AI upscaler that runs on your Mac's graphics chip. It takes about 1.5 seconds per frame, so a 6-minute episode needs roughly 2 hours — Claude runs it in the background and builds the graphics at the same time. It cannot invent detail that was never there, but faces, hair and lettering get visibly clearer.
- **Holding a smile** is made from the footage that already exists (a slow, gentle sweep through the last few frames), because there is no extra footage to extend. A very long hold can feel like a pause in the conversation — ask for 2–3 seconds if 5 feels slow.
- **Even volume** measures every speaker turn and brings them to the same loudness (about -15 LUFS, the level most podcasts use). Your original file is never changed.
- Claude always **keeps the earlier version** of your video when you ask for changes.

## If something goes wrong
- *"Claude says it can't run programs here"* → switch to the **Code tab** (or Cowork) in the Claude desktop app.
- *"Claude says Node.js or Python is missing"* → it will give you a download link and exact steps; install, then say "done".
- *"It's slow"* → the first run downloads tools; later runs are much faster.
- *"A scene looks wrong"* → tell Claude the scene number and what to change; it re-renders just that scene.
- *Captions have a misspelt name* → tell Claude the correct spelling.

## What's inside (for the curious)
A workflow guide, a design playbook (how to turn a sentence into a visual), nine ready-made scene recipes, the full engine, and the complete 25-scene example from the "AI Bias Auditor" episode. You never need to open any of it — Claude reads it for you.
