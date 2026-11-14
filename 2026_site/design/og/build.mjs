/**
 * Social preview cards (Open Graph, 1200×630) — rebuild with:  npm run og
 *
 *   public/og/home.png          site card (homepage + any page without its own)
 *   public/og/<slug>.jpg        one per project: title + lead screenshot
 *   public/apple-touch-icon.png 180×180 icon iMessage/iOS show next to links
 *
 * Each card is an HTML page in the site's fonts/colours, screenshotted by
 * headless Chrome. Reads projects straight from src/data/projects.ts (Node
 * strips the TypeScript types), so new projects get a card automatically.
 * macOS Chrome path by default; override with CHROME=/path/to/chrome.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '../..');
const require = createRequire(join(root, 'package.json'));
const sharp = require('sharp');
const { projects } = await import(pathToFileURL(join(root, 'src/data/projects.ts')).href);

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const fonts = `${pathToFileURL(join(root, 'node_modules/@fontsource-variable')).href}`;
const tmp = mkdtempSync(join(tmpdir(), 'og-'));
mkdirSync(join(root, 'public/og'), { recursive: true });

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const base = (bg, body) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Archivo;src:url(${fonts}/archivo/files/archivo-latin-wdth-normal.woff2) format("woff2");font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Mono;src:url(${fonts}/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2) format("woff2");font-weight:100 800}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden}
body{position:relative;color:#efeee7;font-family:Mono;background-color:${bg};
 background-image:linear-gradient(rgba(239,238,231,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(239,238,231,.055) 1px,transparent 1px);background-size:40px 40px}
.chip{display:inline-flex;font:700 20px Mono;letter-spacing:.16em;text-transform:uppercase}
.chip b{background:#ff6b1a;color:#0a0a0b;padding:9px 14px}
.chip span{padding:9px 14px;border:2px solid rgba(239,238,231,.35);border-left:0;color:#c9c8bf}
.wide{font-family:Archivo;font-weight:900;font-stretch:125%;text-transform:uppercase;line-height:.9;letter-spacing:-.015em}
.stripe{position:absolute;background:linear-gradient(-45deg,#ffd60a 0 25%,#0a0a0b 25% 50%,#ffd60a 50% 75%,#0a0a0b 75%);background-size:40px 40px}
.meta{font:700 21px Mono;letter-spacing:.16em;text-transform:uppercase;color:#c9c8bf}
.meta em{font-style:normal;color:#ff6b1a}
</style></head><body>${body}</body></html>`;

const shoot = async (html, name, out, { jpeg = false } = {}) => {
  const page = join(tmp, `${name}.html`);
  const png = join(tmp, `${name}.png`);
  writeFileSync(page, html);
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    '--force-device-scale-factor=1', '--window-size=1200,630', '--virtual-time-budget=4000',
    `--screenshot=${png}`, pathToFileURL(page).href,
  ], { stdio: 'ignore' });
  const img = sharp(png);
  await (jpeg ? img.jpeg({ quality: 86, mozjpeg: true }) : img.png({ compressionLevel: 9, palette: true })).toFile(out);
  console.log('wrote', out.replace(root + '/', ''));
};

/* ── Home card ─────────────────────────────────────────────────────────── */
await shoot(base('#0a0a0b', `
  <div style="position:absolute;left:72px;top:64px"><span class="chip"><b>JW-01</b><span>johnnguyen.net</span></span></div>
  <h1 class="wide" style="position:absolute;left:68px;top:178px;font-size:150px">John<br><span style="color:#ff6b1a">Nguyen<span style="color:#efeee7">.</span></span></h1>
  <p class="meta" style="position:absolute;left:72px;bottom:70px">Senior Software Engineer <em>//</em> Front-End Systems &amp; Accessibility</p>
  <div class="stripe" style="right:0;top:0;bottom:0;width:56px"></div>
`), 'home', join(root, 'public/og/home.png'));

/* ── Project cards ─────────────────────────────────────────────────────── */
for (const p of projects) {
  // Lead with the first screenshot that fills the frame (skip letterboxed ones).
  const shot = p.images.find((i) => i.fit !== 'contain') ?? p.images[0];
  const src = pathToFileURL(join(root, 'public', shot.src)).href;
  const fit = shot.fit === 'contain' ? 'contain' : 'cover';
  const title = p.title;
  // Long titles step down so they stay within ~3 lines of the left column.
  const byLength = title.length > 26 ? 52 : title.length > 16 ? 62 : 70;
  // A single long word can't wrap, so it must fit the 510px column on its own
  // (Archivo extra-wide caps ≈ 0.84em per letter, plus a safety margin).
  const longestWord = Math.max(...title.split(/\s+/).map((w) => w.length));
  const size = Math.min(byLength, Math.floor(500 / (longestWord * 0.88)));
  const client = p.telemetry.find((t) => t.k === 'CLIENT')?.v ?? '';
  const role = p.telemetry.find((t) => t.k === 'ROLE')?.v;
  await shoot(base('#0b1a33', `
    <div style="position:absolute;left:64px;top:60px"><span class="chip"><b>${esc(p.code)}</b><span>${esc(p.era ?? '')}</span></span></div>
    <h1 class="wide" style="position:absolute;left:62px;top:150px;width:520px;font-size:${size}px;line-height:.95">${esc(title)}</h1>
    <p class="meta" style="position:absolute;left:64px;bottom:118px;width:520px;font-size:19px;line-height:1.5">${esc(client)}${role ? ` <em>·</em> ${esc(role)}` : ''}</p>
    <p class="meta" style="position:absolute;left:64px;bottom:62px;font-size:19px;color:#ff6b1a">johnnguyen.net</p>
    <div style="position:absolute;right:56px;top:56px;width:520px;height:470px;border:3px solid #ff6b1a;background:#050506;overflow:hidden">
      <img src="${src}" style="width:100%;height:100%;object-fit:${fit};object-position:top">
    </div>
    <div class="stripe" style="left:0;right:0;bottom:0;height:22px"></div>
  `), p.slug, join(root, `public/og/${p.slug}.jpg`), { jpeg: true });
}

/* ── Apple touch icon (iMessage / iOS) ─────────────────────────────────── */
await sharp(join(root, 'public/logo.svg'), { density: 300 })
  .resize(180, 180, { fit: 'contain', background: '#0a0a0b' })
  .flatten({ background: '#0a0a0b' })
  .png()
  .toFile(join(root, 'public/apple-touch-icon.png'));
console.log('wrote public/apple-touch-icon.png');

rmSync(tmp, { recursive: true, force: true });
