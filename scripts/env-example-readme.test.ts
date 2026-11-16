import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dir, '..');

test('every .env.example variable is documented in README.md', () => {
  const env = readFileSync(join(root, '.env.example'), 'utf8');
  const readme = readFileSync(join(root, 'README.md'), 'utf8');
  const names = [...env.matchAll(/^([A-Z][A-Z0-9_]*)=/gm)].map((m) => m[1]);
  expect(names.length).toBeGreaterThan(0);
  const missing = names.filter((name) => !readme.includes(name));
  expect(missing).toEqual([]);
});
