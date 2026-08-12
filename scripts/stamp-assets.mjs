#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readdir, readFile, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requestedDirectory = path.resolve(process.argv[2] || 'dist');
const publishDirectory = await realpath(requestedDirectory);
const expectedPublishDirectory = await realpath(path.join(repositoryRoot, 'dist'));

if (publishDirectory !== expectedPublishDirectory) {
  throw new Error(`Refusing to stamp unexpected directory: ${publishDirectory}`);
}

const digest = (contents) => createHash('sha256').update(contents).digest('hex').slice(0, 12);
const cssVersion = digest(await readFile(path.join(publishDirectory, 'styles.css')));
const jsVersion = digest(await readFile(path.join(publishDirectory, 'app.js')));
const siteVerificationFiles = new Set(['google9dd9990931be8b22.html']);
const htmlFiles = (await readdir(publishDirectory))
  .filter((file) => file.endsWith('.html') && !siteVerificationFiles.has(file))
  .sort();

let cssReferences = 0;
let jsReferences = 0;
let sharedPages = 0;

for (const file of htmlFiles) {
  const filePath = path.join(publishDirectory, file);
  const source = await readFile(filePath, 'utf8');
  let pageCssReferences = 0;
  let pageJsReferences = 0;

  const stamped = source
    .replace(/(href=["'](?:\.\/|\/)?styles\.css)(?:\?[^"']*)?(["'])/g, (_match, prefix, quote) => {
      pageCssReferences += 1;
      cssReferences += 1;
      return `${prefix}?v=${cssVersion}${quote}`;
    })
    .replace(/(src=["'](?:\.\/|\/)?app\.js)(?:\?[^"']*)?(["'])/g, (_match, prefix, quote) => {
      pageJsReferences += 1;
      jsReferences += 1;
      return `${prefix}?v=${jsVersion}${quote}`;
    });

  if (pageCssReferences || pageJsReferences) {
    sharedPages += 1;
    if (pageCssReferences !== 2 || pageJsReferences !== 1) {
      throw new Error(`${file} must contain two shared CSS references and one shared JS reference; found ${pageCssReferences}/${pageJsReferences}`);
    }
  }

  if (stamped !== source) await writeFile(filePath, stamped);
}

if (htmlFiles.length !== 58 || sharedPages !== 57 || cssReferences !== 114 || jsReferences !== 57) {
  throw new Error(
    `Unexpected asset surface: ${htmlFiles.length} HTML, ${sharedPages} shared pages, ${cssReferences} CSS refs, ${jsReferences} JS refs`
  );
}

console.log(`Stamped ${sharedPages} pages with CSS ${cssVersion} and JS ${jsVersion}.`);
