#!/usr/bin/env node
/**
 * Saves Hugging Face Daily Papers, the community-picked list of new AI papers,
 * into library/hugging-face/, one Markdown file per day.
 *
 * Used by workflows/scan.md and workflows/research.md. The API is public, so no key
 * is needed. The library is what the Agent searches when answering questions.
 *
 *   node workflows/scripts/hf-papers.mjs sync 7        save the last 7 days
 *   node workflows/scripts/hf-papers.mjs list 7        one line per paper, read from the library
 *   node workflows/scripts/hf-papers.mjs show <id>...  full entries, read from the library
 *
 * Sync skips days already saved, except the 3 latest days with papers, whose
 * upvotes are still changing. Days with no papers (usually weekends) get no file.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

const API = 'https://huggingface.co/api';
const LIBRARY = new URL('../../library/hugging-face/', import.meta.url);
const REFRESH_DAYS = 3;
const NO_LAB = 'Lab not listed';

function recentDates(n) {
  return Array.from({ length: n }, (_, i) =>
    new Date(Date.now() - i * 86400 * 1000).toISOString().slice(0, 10),
  );
}

function fileFor(date) {
  return new URL(`${date}.md`, LIBRARY);
}

function toMarkdown(date, entries) {
  const lines = [`# Hugging Face Daily Papers · ${date}`, ''];
  for (const { paper } of entries) {
    const links = [`[Paper](https://huggingface.co/papers/${paper.id})`];
    if (paper.githubRepo) links.push(`[Code](${paper.githubRepo})`);
    const authors = paper.authors.map((a) => a.name);
    const byline = authors.length > 5 ? `${authors.slice(0, 5).join(', ')}, et al.` : authors.join(', ');
    lines.push(
      `## ${paper.title}`,
      '',
      `${paper.organization?.fullname ?? NO_LAB} · ${paper.upvotes ?? 0} upvotes · arXiv ${paper.id} · ${links.join(' · ')}`,
      '',
      `Authors: ${byline}`,
      '',
      paper.summary.trim(),
      '',
    );
  }
  return lines.join('\n');
}

// Splits a day file into entries. The lab name can itself contain " · ", so the
// metadata line is matched from the upvotes onward.
function entriesIn(date) {
  const text = readFileSync(fileFor(date), 'utf8');
  return text.split(/^(?=## )/m).slice(1).map((block) => {
    const [, title, lab, upvotes, id] = block.match(/^## (.+)\n\n(.+) · (\d+) upvotes · arXiv (\S+) · /);
    return { date, title, lab, upvotes: Number(upvotes), id, block: block.trim() };
  });
}

async function sync(days) {
  mkdirSync(LIBRARY, { recursive: true });
  let refreshed = 0;
  let saved = 0;
  let papers = 0;
  for (const date of recentDates(days)) {
    if (refreshed >= REFRESH_DAYS && existsSync(fileFor(date))) continue;
    // The API rejects limit above 100. A day rarely has more.
    const res = await fetch(`${API}/daily_papers?date=${date}&limit=100`);
    if (!res.ok) throw new Error(`Hugging Face API error ${res.status} for ${date}`);
    const entries = await res.json();
    if (entries.length === 0) continue;
    writeFileSync(fileFor(date), toMarkdown(date, entries));
    refreshed += 1;
    saved += 1;
    papers += entries.length;
  }
  console.error(`Saved ${papers} papers across ${saved} days to library/hugging-face/`);
}

function list(days) {
  for (const date of recentDates(days).reverse()) {
    if (!existsSync(fileFor(date))) continue;
    for (const e of entriesIn(date)) {
      console.log(`${date} · ${e.upvotes} upvotes · ${e.lab} · ${e.id} · ${e.title}`);
    }
  }
}

function show(ids) {
  const wanted = new Set(ids);
  const files = existsSync(LIBRARY) ? readdirSync(LIBRARY).filter((f) => f.endsWith('.md')) : [];
  for (const file of files.sort().reverse()) {
    for (const e of entriesIn(file.slice(0, -3))) {
      if (!wanted.delete(e.id)) continue;
      console.log(`${e.block}\n\nSaved on: ${e.date}\n`);
    }
  }
  if (wanted.size > 0) console.error(`Not in the library: ${[...wanted].join(', ')}`);
}

const [command, ...args] = process.argv.slice(2);
const days = Number(args[0]);
if ((command === 'sync' || command === 'list') && Number.isInteger(days) && days > 0) {
  if (command === 'sync') await sync(days);
  else list(days);
} else if (command === 'show' && args.length > 0) {
  show(args);
} else {
  console.error('Usage: node workflows/scripts/hf-papers.mjs sync <days> | list <days> | show <id>...');
  process.exit(1);
}
