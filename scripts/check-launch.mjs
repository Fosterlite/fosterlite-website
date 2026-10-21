// Fails if any built page still contains placeholder copy. Run after `npm run build`.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const hits = [];

for (const entry of await readdir(dist, { recursive: true })) {
  if (!entry.endsWith('.html')) continue;
  const html = await readFile(join(dist, entry), 'utf8');
  const count = html.match(/TODO/g)?.length ?? 0;
  if (count) hits.push(`${entry}: ${count}`);
}

if (hits.length) {
  console.error(`Placeholder copy found (TODO) on ${hits.length} page(s):\n  ${hits.join('\n  ')}`);
  process.exit(1);
}
console.log('No placeholder copy found.');
