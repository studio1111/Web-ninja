import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');
const html = read('index.html');
const css = read('styles.css');
const js = read('app.js');
const failures = [];

const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((m) => m[1]));
for (const [, target] of html.matchAll(/\bhref=["']#([^"'\s]+)["']/g)) {
  if (!ids.has(target)) failures.push(`Missing in-page link target: #${target}`);
}
for (const [, target] of html.matchAll(/\baria-controls=["']([^"']+)["']/g)) {
  if (!ids.has(target)) failures.push(`Missing aria-controls target: #${target}`);
}
for (const asset of ['styles.css', 'app.js']) {
  if (!existsSync(join(root, asset))) failures.push(`Missing required asset: ${asset}`);
}
for (const [label, ok] of [
  ['stylesheet is linked', /href=["']styles\.css["']/.test(html)],
  ['application script is linked', /src=["']app\.js["']/.test(html)],
  ['mobile navigation has an accessible expanded state', /aria-expanded=["']false["']/.test(html)],
  ['scroll-controlled video exists', /class=["'][^"']*scroll-film/.test(html)],
  ['hero video is muted and inline', /class=["'][^"']*hero-film[^"']*["'][^>]*muted[^>]*playsinline/.test(html)],
  ['reduced-motion CSS fallback exists', /prefers-reduced-motion:\s*reduce/.test(css)],
  ['keyboard Escape support exists', /event\.key\s*===\s*['"]Escape['"]/.test(js)],
  ['remote-media fallback exists', /hero-film-unavailable/.test(js) && /film-unavailable/.test(js)],
  ['failed photos reveal built-in artwork', /photo-unavailable/.test(js) && /photo-unavailable \\.mask-photo/.test(css) && /photo-unavailable \\.card-art svg/.test(css)],
  ['scroll progress indicator is updated', /progress\.style\.width/.test(js)],
]) {
  if (!ok) failures.push(`Validation failed: ${label}`);
}

if (failures.length) {
  console.error('KAGE site validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`KAGE site validation passed: ${ids.size} HTML IDs checked; internal links and accessibility/motion hooks are present.`);
}
