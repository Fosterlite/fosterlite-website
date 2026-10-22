// Renders design/og/*.html to PNGs in public/ with headless Chrome (macOS; uses `sips` to downscale).
// Run manually after changing the sources: `node scripts/render-brand-images.mjs`.
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const root = resolve(import.meta.dirname, '..');

async function screenshot(source, out, width, height) {
  const profile = mkdtempSync(join(tmpdir(), 'brand-render-'));
  rmSync(out, { force: true });
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--user-data-dir=${profile}`,
    `--window-size=${width},${height}`,
    '--virtual-time-budget=2000',
    `--screenshot=${out}`,
    `file://${join(root, source)}`,
  ]);
  // Chrome sometimes lingers after writing the file; stop it once the screenshot exists.
  for (let i = 0; i < 60 && !(existsSync(out) && statSync(out).size > 0); i++) {
    await new Promise((r) => setTimeout(r, 500));
  }
  chrome.kill();
  rmSync(profile, { recursive: true, force: true });
  if (!existsSync(out)) throw new Error(`Failed to render ${source}`);
}

await screenshot('design/og/og-default.html', join(root, 'public/og-default.png'), 1200, 630);
await screenshot('design/og/icon.html', join(root, 'public/logo-512.png'), 512, 512);
execFileSync(
  'sips',
  ['-z', '180', '180', 'public/logo-512.png', '--out', 'public/apple-touch-icon.png'],
  {
    cwd: root,
    stdio: 'ignore',
  },
);
for (const file of ['og-default.png', 'logo-512.png', 'apple-touch-icon.png']) {
  console.log(
    execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', `public/${file}`], { cwd: root })
      .toString()
      .trim()
      .replace(/\n\s*/g, ' '),
  );
}
