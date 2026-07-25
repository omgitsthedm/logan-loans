#!/usr/bin/env node

import { readFile, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requestedDirectory = path.resolve(process.argv[2] || 'dist');
const publishDirectory = await realpath(requestedDirectory);
const expectedPublishDirectory = await realpath(path.join(repositoryRoot, 'dist'));

if (publishDirectory !== expectedPublishDirectory) {
  throw new Error(`Refusing to render narratives outside dist: ${publishDirectory}`);
}

const manifest = JSON.parse(
  await readFile(path.join(repositoryRoot, 'content', 'image-narratives.json'), 'utf8'),
);
const narrativeEntries = Object.entries(manifest.pages);

if (narrativeEntries.length !== manifest.expectedPageCount) {
  throw new Error(
    `Narrative manifest contains ${narrativeEntries.length} pages; expected ${manifest.expectedPageCount}.`,
  );
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderFigure(key, asset) {
  const base = `./assets/img/${asset.base}`;
  return `
        <figure class="storyFrame" data-ll-story="${escapeHtml(key)}">
          <picture>
            <source
              type="image/webp"
              srcset="${base}-640.webp 640w, ${base}-960.webp 960w, ${base}-1440.webp 1440w"
              sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1180px) calc(100vw - 80px), 1080px"
            >
            <img
              class="storyImage"
              src="${base}-960.webp"
              alt="${escapeHtml(asset.alt)}"
              width="1440"
              height="960"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            >
          </picture>
          <figcaption class="storyCaption">
            <strong>${escapeHtml(asset.title)}</strong>
            <span>${escapeHtml(asset.caption)}</span>
          </figcaption>
        </figure>`;
}

let rendered = 0;

for (const [file, key] of narrativeEntries) {
  const asset = manifest.assets[key];
  if (!asset) throw new Error(`${file}: unknown narrative asset "${key}".`);

  const filePath = path.resolve(publishDirectory, file);
  const publishPrefix = `${publishDirectory}${path.sep}`;
  if (!filePath.startsWith(publishPrefix) || path.extname(filePath) !== '.html') {
    throw new Error(`${file}: narrative target must remain an HTML file inside dist.`);
  }
  const source = await readFile(filePath, 'utf8');
  if (source.includes('data-ll-story=')) {
    throw new Error(`${file}: narrative already rendered.`);
  }

  const h1Close = source.indexOf('</h1>');
  if (h1Close === -1) throw new Error(`${file}: cannot render narrative without an h1.`);

  const leadStart = source.indexOf('<p', h1Close);
  const leadClose = leadStart === -1 ? -1 : source.indexOf('</p>', leadStart);
  const insertionPoint = leadClose === -1
    ? h1Close + '</h1>'.length
    : leadClose + '</p>'.length;
  const output = `${source.slice(0, insertionPoint)}${renderFigure(key, asset)}${source.slice(insertionPoint)}`;
  await writeFile(filePath, output);
  rendered += 1;
}

console.log(`Rendered ${rendered} static page narratives.`);
