// Compila cada deck de decks/<slug>/slides.md en dist/<slug>/ y copia la portada (site/).
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const decksDir = join(root, 'decks');

rmSync(dist, { recursive: true, force: true });

const only = process.argv[2];
const slugs = readdirSync(decksDir).filter(
  (slug) => existsSync(join(decksDir, slug, 'slides.md')) && (!only || slug === only),
);

for (const slug of slugs) {
  console.log(`\n▶ ${slug}`);
  execFileSync(
    'npx',
    ['slidev', 'build', join(decksDir, slug, 'slides.md'), '--base', `/${slug}/`, '--out', join(dist, slug)],
    { stdio: 'inherit', cwd: root },
  );
}

cpSync(join(root, 'site'), dist, { recursive: true });
console.log(`\n✓ ${slugs.length} deck(s) en dist/`);
