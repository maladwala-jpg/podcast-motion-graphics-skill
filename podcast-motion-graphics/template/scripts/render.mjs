// Render scenes frame-by-frame in headless Chrome and pipe them into ffmpeg.
//   node scripts/render.mjs all --par 4                 every scene -> out/clips/<id>.mp4
//   node scripts/render.mjs A1,A2 --par 2               specific scenes
//   node scripts/render.mjs seg:A                       every scene of segment A
//   node scripts/render.mjs A1 --frames 30,90,2.5s      PNG stills instead (frame numbers or seconds) -> out/stills (override with --out)
// Run from the project root, after `python3 scripts/build_data.py`.
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const root = process.cwd();
const args = process.argv.slice(2);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
let env = {};
try { env = JSON.parse(fs.readFileSync(path.join(root, '.tools/env.json'), 'utf8')); } catch (e) { /* optional */ }
const FF = process.env.FFMPEG || env.ffmpeg || 'ffmpeg';
const CHROME = process.env.CHROME_PATH || env.chrome;
const meta = JSON.parse(fs.readFileSync(path.join(root, 'data/scenes.json'), 'utf8'));
const { width: W, height: H, fps: FPS } = meta.project;
const byId = Object.fromEntries(meta.scenes.map(s => [s.id, s]));

let ids;
const sel = args[0] || 'all';
if (sel === 'all') ids = meta.scenes.map(s => s.id);
else if (sel.startsWith('seg:')) ids = meta.scenes.filter(s => s.seg === sel.slice(4)).map(s => s.id);
else ids = sel.split(',');
for (const id of ids) if (!byId[id]) { console.error('unknown scene', id); process.exit(1); }

const browser = await chromium.launch({
  executablePath: CHROME || undefined, headless: true,
  args: ['--force-color-profile=srgb', '--hide-scrollbars', '--disable-lcd-text', '--font-render-hinting=none', '--allow-file-access-from-files'],
});

async function open(id) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('[pageerror]', id, String(e)));
  page.on('console', m => { if (m.type() === 'error') console.error('[console]', id, m.text()); });
  await page.goto('file://' + path.join(root, 'player.html') + '?s=' + id + (val('--query') ? '&' + val('--query') : ''));
  await page.waitForFunction('window.__ready===true||window.__err', null, { timeout: 90000 });
  const err = await page.evaluate('window.__err');
  if (err) throw new Error(id + ': ' + err);
  return { ctx, page, cdp: await ctx.newCDPSession(page) };
}
const shot = async (cdp) => Buffer.from((await cdp.send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true, fromSurface: true })).data, 'base64');

async function doScene(id) {
  const sd = byId[id]; const { ctx, page, cdp } = await open(id); const t0 = Date.now();
  if (val('--frames')) {
    const dir = val('--out') || path.join(root, 'out/stills'); fs.mkdirSync(dir, { recursive: true });
    for (const f of val('--frames').split(',')) {
      const fr = f.endsWith('s') ? Math.round(parseFloat(f) * FPS) : parseInt(f);
      await page.evaluate(`window.__seek(${fr})`); await page.waitForTimeout(30);
      fs.writeFileSync(path.join(dir, `${id}_${String(fr).padStart(4, '0')}.png`), await shot(cdp));
    }
  } else {
    const out = path.join(root, 'out/clips'); fs.mkdirSync(out, { recursive: true });
    const file = path.join(out, `${id}.mp4`);
    const ff = spawn(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
      '-vf', 'scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '10', '-g', String(FPS),
      '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise(r => ff.on('close', r));
    for (let f = 0; f < sd.n; f++) {
      await page.evaluate(`window.__seek(${f})`);
      if (!ff.stdin.write(await shot(cdp))) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 150 === 0) process.stdout.write(`${id} ${f}/${sd.n}\r`);
    }
    ff.stdin.end(); await done;
  }
  console.log(`${id} done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  await ctx.close();
}
const par = parseInt(val('--par') || '1'); let i = 0;
await Promise.all(Array.from({ length: Math.min(par, ids.length) }, async () => { while (i < ids.length) { await doScene(ids[i++]); } }));
await browser.close();
