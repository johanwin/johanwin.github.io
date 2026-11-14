/**
 * Lighthouse gate for pull requests (and handy locally):  npm run lighthouse
 *
 * Runs Lighthouse 13.6 (the version with the Agentic Browsing category) on the
 * pages below, mobile and desktop, against a site that's already being served
 * (LH_BASE_URL, default http://localhost:4321). Mobile scores are the median of
 * 3 runs to smooth out noise. Fails (exit 1) if any category drops below its
 * threshold, and writes a results table to the GitHub job summary.
 */
import { execFileSync } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = (process.env.LH_BASE_URL ?? 'http://localhost:4321').replace(/\/$/, '');
const OUT = process.env.LH_OUT_DIR ?? 'lighthouse-reports';
const LIGHTHOUSE = 'lighthouse@13.6.0';

const PAGES = ['/', '/projects/capital-one-home-lending/'];
const RUNS = { mobile: 3, desktop: 1 };
const THRESHOLDS = {
  mobile: { performance: 90, accessibility: 100, 'best-practices': 95, seo: 100, 'agentic-browsing': 100 },
  desktop: { performance: 95, accessibility: 100, 'best-practices': 95, seo: 100, 'agentic-browsing': 100 },
};

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

mkdirSync(OUT, { recursive: true });
const rows = [];
let failed = false;

for (const preset of Object.keys(RUNS)) {
  for (const page of PAGES) {
    const scores = {}; // category id -> [scores]
    for (let run = 1; run <= RUNS[preset]; run++) {
      const name = `${preset}${page.replace(/\W+/g, '_')}run${run}`;
      const base = join(OUT, name);
      execFileSync('npx', [
        '-y', LIGHTHOUSE, `${BASE}${page}`,
        ...(preset === 'desktop' ? ['--preset=desktop'] : []),
        '--quiet', '--output=json', '--output=html', `--output-path=${base}`,
        '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage',
      ], { stdio: ['ignore', 'ignore', 'inherit'] });
      const report = JSON.parse(readFileSync(`${base}.report.json`, 'utf8'));
      for (const [id, cat] of Object.entries(report.categories)) {
        if (cat.score != null) (scores[id] ??= []).push(Math.round(cat.score * 100));
      }
    }
    const row = { preset, page };
    for (const [id, min] of Object.entries(THRESHOLDS[preset])) {
      if (!scores[id]) { row[id] = '—'; continue; } // category not in this Lighthouse version
      const score = median(scores[id]);
      const ok = score >= min;
      if (!ok) failed = true;
      row[id] = `${ok ? '✅' : '❌'} ${score}${ok ? '' : ` (min ${min})`}`;
    }
    rows.push(row);
    console.log(`${preset.padEnd(7)} ${page.padEnd(40)} ${Object.keys(THRESHOLDS[preset]).map((k) => `${k}: ${row[k]}`).join(' | ')}`);
  }
}

const cats = Object.keys(THRESHOLDS.mobile);
const table = [
  `## Lighthouse (${LIGHTHOUSE})`,
  '',
  `| Device | Page | ${cats.join(' | ')} |`,
  `| --- | --- | ${cats.map(() => '---').join(' | ')} |`,
  ...rows.map((r) => `| ${r.preset} | \`${r.page}\` | ${cats.map((c) => r[c]).join(' | ')} |`),
  '',
  `Mobile scores are the median of ${RUNS.mobile} runs. Full HTML reports are in the "lighthouse-reports" artifact.`,
].join('\n');
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, table + '\n');

if (failed) {
  console.error('\nLighthouse thresholds not met — see the table above.');
  process.exit(1);
}
console.log('\nAll Lighthouse thresholds met.');
