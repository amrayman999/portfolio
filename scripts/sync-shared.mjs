/**
 * Copies shared/i18n.js into frontend/src/i18n.js and dashboard/src/i18n.js.
 *
 * Why: Vercel builds each app using ONLY that app's root directory, so a
 * `../../shared/i18n` import cannot be resolved at deploy time. We therefore
 * keep a committed copy inside each app. Run this after editing shared/i18n.js.
 *
 *   node scripts/sync-shared.mjs
 */
import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const targets = [
  join(root, 'frontend', 'src', 'i18n.js'),
  join(root, 'dashboard', 'src', 'i18n.js'),
];

for (const target of targets) {
  mkdirSync(dirname(target), { recursive: true });
  cpSync(join(root, 'shared', 'i18n.js'), target);
  console.log('synced ->', target);
}

console.log('Shared i18n copies are up to date.');
