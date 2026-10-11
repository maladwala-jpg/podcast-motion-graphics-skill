// Bundles every lucide icon (2000+) into js/icons.js so scenes can use any icon name: ico('shield-check')
import fs from 'fs';
const dir = 'node_modules/lucide-static/icons';
const out = {};
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.svg')) continue;
  const s = fs.readFileSync(`${dir}/${f}`, 'utf8');
  out[f.slice(0, -4)] = s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '').trim();
}
fs.mkdirSync('js', { recursive: true });
fs.writeFileSync('js/icons.js', 'window.ICONS = ' + JSON.stringify(out) + ';\n');
console.log(Object.keys(out).length, 'icons bundled');
