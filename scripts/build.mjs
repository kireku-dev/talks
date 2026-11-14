// Compila cada deck de decks/<slug>/slides.md en dist/<slug>/, exporta su portada como
// miniatura y genera la portada del sitio (dist/index.html) a partir de los metadatos
// `talk:` de cada deck más las charlas externas de talks.json.
//
//   npm run build                       todos los decks
//   npm run build -- <slug>             solo uno
//   SKIP_COVERS=1 npm run build         sin miniaturas (no necesita Chromium)

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const decksDir = join(root, 'decks');
const only = process.argv[2];
const skipCovers = process.env.SKIP_COVERS === '1';

const slidev = (args) => execFileSync('npx', ['slidev', ...args], { stdio: 'inherit', cwd: root });

function readHeadmatter(file) {
  const match = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? parse(match[1]) : {};
}

rmSync(dist, { recursive: true, force: true });

const slugs = readdirSync(decksDir).filter(
  (slug) => existsSync(join(decksDir, slug, 'slides.md')) && (!only || slug === only),
);

const talks = [];

for (const slug of slugs) {
  const entry = join(decksDir, slug, 'slides.md');
  const meta = readHeadmatter(entry);
  const talk = meta.talk ?? {};
  if (!talk.date) throw new Error(`${slug}: falta talk.date en el headmatter de slides.md`);

  console.log(`\n▶ ${slug}`);
  const out = join(dist, slug);
  slidev(['build', entry, '--base', `/${slug}/`, '--out', out]);

  let cover = null;
  if (!skipCovers) {
    const tmp = join(dist, `.cover-${slug}`);
    slidev(['export', entry, '--format', 'png', '--range', '1', '--scale', '0.5', '--output', tmp, '--timeout', '60000']);
    const png = readdirSync(tmp).find((f) => f.endsWith('.png'));
    if (png) {
      renameSync(join(tmp, png), join(out, 'cover.png'));
      cover = `/${slug}/cover.png`;
    }
    rmSync(tmp, { recursive: true, force: true });
  }

  talks.push({
    title: meta.title ?? slug,
    date: String(talk.date),
    kind: talk.kind ?? 'Charla',
    place: talk.place,
    summary: talk.summary ?? '',
    url: `/${slug}/`,
    cta: 'Ver slides',
    cover,
    external: false,
  });
}

const externalFile = join(root, 'talks.json');
if (existsSync(externalFile) && !only) {
  for (const t of JSON.parse(readFileSync(externalFile, 'utf8'))) {
    talks.push({ cta: 'Ver material', ...t, cover: t.cover ?? null, external: true });
  }
}

// ---------- Portada ----------

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const fmtDate = (iso) =>
  new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  );

const today = new Date().toISOString().slice(0, 10);

const card = (t) => {
  const meta = [fmtDate(t.date), t.kind, t.place].filter(Boolean).map(esc).join(' · ');
  const upcoming = t.date >= today ? `<span class="upcoming" data-until="${t.date}">PRÓXIMO</span>` : '';
  const ext = t.external ? ' target="_blank" rel="noopener"' : '';
  const arrow = t.external ? '↗' : '→';
  const img = t.cover
    ? `<img class="cover" src="${esc(t.cover)}" alt="" width="960" height="540" loading="lazy" />`
    : '';
  return `
        <li>
          <a class="talk${t.cover ? ' has-cover' : ''}" href="${esc(t.url)}"${ext}>
            ${img}
            <div class="body">
              <span class="meta">${meta}${upcoming}</span>
              <h3>${esc(t.title)}</h3>
              ${t.summary ? `<p class="desc">${esc(t.summary)}</p>` : ''}
              <span class="cta">${esc(t.cta)} ${arrow}</span>
            </div>
          </a>
        </li>`;
};

talks.sort((a, b) => b.date.localeCompare(a.date));
const years = [...new Set(talks.map((t) => t.date.slice(0, 4)))];
const html = years
  .map(
    (year) => `
      <section aria-labelledby="y${year}">
        <h2 id="y${year}">${year}</h2>
        <ul>${talks.filter((t) => t.date.startsWith(year)).map(card).join('')}
        </ul>
      </section>`,
  )
  .join('');

mkdirSync(dist, { recursive: true });
const template = readFileSync(join(root, 'site', 'index.template.html'), 'utf8');
writeFileSync(join(dist, 'index.html'), template.replace('<!--TALKS-->', html.trim()));

console.log(`\n✓ ${slugs.length} deck(s) + ${talks.length - slugs.length} externa(s) → dist/`);
