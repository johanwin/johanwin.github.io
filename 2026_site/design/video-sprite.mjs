/**
 * Builds the galloping-horse sprite sheet for the About video card
 * (src/components/hud/VideoBriefing.astro) from the 10 Muybridge frames in
 * design/youtube-thumbnail.png.
 *
 *   node design/video-sprite.mjs
 *
 * Every frame is cut with the same box (the horse is registered in place
 * across the series), the cell's maroon is keyed out to transparency, and the
 * frames are laid side by side: 10 × 182 px wide, 114 px tall.
 */
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sharp = createRequire(import.meta.url)('sharp');

const SRC = join(root, 'design/youtube-thumbnail.png');
const OUT = join(root, 'public/images/profile/video-gallop.webp');

// Film cells in the 1280×720 thumbnail: 244×152 at x = 10 + 254·i, rows y = 62 / 506.
const CELL_X = (i) => 10 + 254 * i;
const ROWS = [62, 506];
// Union of the horse's bounds inside a cell, plus a few px of margin.
const BOX = { left: 28, top: 16, width: 182, height: 114 };
// Silhouette ink and cell background, keyed on the green channel (16 vs 238).
const INK = [239, 238, 231];
const BG_G = 16;
const INK_G = 238;

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = BOX.width * 10;
const H = BOX.height;
const out = Buffer.alloc(W * H * 4);

for (let f = 0; f < 10; f++) {
  const x0 = CELL_X(f % 5) + BOX.left;
  const y0 = ROWS[Math.floor(f / 5)] + BOX.top;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < BOX.width; x++) {
      const g = data[((y0 + y) * info.width + (x0 + x)) * info.channels + 1];
      const a = Math.round(Math.min(1, Math.max(0, (g - BG_G - 20) / (INK_G - BG_G - 40))) * 255);
      const o = (y * W + f * BOX.width + x) * 4;
      out.set([...INK, a], o);
    }
  }
}

await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .webp({ lossless: true, effort: 6 })
  .toFile(OUT);
console.log(`wrote ${OUT} (${W}×${H})`);
