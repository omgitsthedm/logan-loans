#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_ORIGIN = 'https://logan.loans';
const HOST = 'logan.loans';
const KEY = '4cea1175e9f654a2703625f426315ee2';
const KEY_FILE = `${KEY}.txt`;
const KEY_LOCATION = `${SITE_ORIGIN}/${KEY_FILE}`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS = 1000;

if (!/^[A-Za-z0-9-]{8,128}$/.test(KEY)) throw new Error('IndexNow key must contain 8–128 letters, numbers, or dashes');

const usage = `Usage:
  node scripts/indexnow.mjs                          # dry-run all canonical URLs in dist/sitemap.xml
  node scripts/indexnow.mjs --changed <url>          # dry-run an added, changed or removed URL (repeatable)
  node scripts/indexnow.mjs --submit                 # submit the whole sitemap (first submission only)
  node scripts/indexnow.mjs --submit --changed <url> # every later release: only added, changed or removed URLs

Run bash scripts/build-site.sh first. Submit only after the production deploy is live.
Never resubmit unchanged URLs; after the first submission, send only what a release changed.
The command never submits without --submit. URLs must use ${SITE_ORIGIN}, have no query
or hash, and use the extensionless canonical form (no .html, no trailing slash except /).`;

const fail = (message) => {
  console.error(`IndexNow: ${message}`);
  process.exitCode = 1;
};

const parseArgs = (args) => {
  const changed = [];
  let submit = false;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--submit') {
      submit = true;
      continue;
    }
    if (arg === '--changed') {
      const url = args[index + 1];
      if (!url || url.startsWith('--')) throw new Error('--changed requires one URL');
      changed.push(url);
      index += 1;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      console.log(usage);
      process.exit(0);
    }
    throw new Error(`Unknown option: ${arg}`);
  }
  return { changed, submit };
};

const validateCanonicalUrl = (value) => {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('A supplied URL is not valid');
  }
  if (url.origin !== SITE_ORIGIN || url.protocol !== 'https:' || url.username || url.password || url.port) {
    throw new Error(`URLs must belong to ${SITE_ORIGIN}`);
  }
  if (url.search || url.hash) throw new Error('URLs must not include a query string or hash');
  if (url.pathname.endsWith('.html')) throw new Error('URLs must use the extensionless canonical form');
  if (url.pathname !== '/' && url.pathname.endsWith('/')) throw new Error('URLs must not use a trailing slash (except the home page)');
  return url.href;
};

const readSitemapUrls = async () => {
  let xml;
  let robots;
  try {
    [xml, robots] = await Promise.all([
      readFile(path.join(repositoryRoot, 'dist', 'sitemap.xml'), 'utf8'),
      readFile(path.join(repositoryRoot, 'dist', 'robots.txt'), 'utf8'),
    ]);
  } catch {
    throw new Error('Missing dist/sitemap.xml or dist/robots.txt. Run bash scripts/build-site.sh before using sitemap mode.');
  }
  if (/^Disallow: \/$/m.test(robots)) throw new Error('The built robots.txt blocks the whole site. Refusing sitemap mode.');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => validateCanonicalUrl(match[1].trim()));
  if (!urls.length) throw new Error('The built sitemap contains no URLs. Run bash scripts/build-site.sh first.');
  return { source: 'sitemap', urls };
};

const verifyKeyFiles = async () => {
  for (const relative of [KEY_FILE, path.join('dist', KEY_FILE)]) {
    let contents;
    try {
      contents = await readFile(path.join(repositoryRoot, relative), 'utf8');
    } catch {
      throw new Error(`Missing ${relative}${relative.startsWith('dist') ? ' (run bash scripts/build-site.sh)' : ''}`);
    }
    if (contents.trim() !== KEY) throw new Error(`${relative} must contain only its matching key`);
  }
};

const verifyLiveKey = async () => {
  let response;
  try {
    response = await fetch(KEY_LOCATION, { redirect: 'error', signal: AbortSignal.timeout(20_000) });
  } catch {
    throw new Error(`Could not fetch ${KEY_LOCATION}; deploy the key file before submitting.`);
  }
  if (!response.ok || (await response.text()).trim() !== KEY) {
    throw new Error(`${KEY_LOCATION} is not live with the matching key (HTTP ${response.status}); deploy it before submitting.`);
  }
};

const responseMeaning = (status) => ({
  200: 'received',
  202: 'accepted_pending_key_validation',
  400: 'invalid_request',
  403: 'key_verification_failed',
  422: 'host_or_key_schema_rejected',
  429: 'rate_limited',
}[status] || 'unexpected_response');

try {
  const { changed, submit } = parseArgs(process.argv.slice(2));
  await verifyKeyFiles();
  const selected = changed.length
    ? { source: 'changed', urls: changed.map(validateCanonicalUrl) }
    : await readSitemapUrls();
  const urls = [...new Set(selected.urls)];
  if (urls.length > MAX_URLS) throw new Error(`Refusing ${urls.length} URLs; submit changed URLs in batches of ${MAX_URLS} or fewer.`);

  const summary = {
    mode: submit ? 'submit' : 'dry-run',
    source: selected.source,
    host: HOST,
    keyLocation: KEY_LOCATION,
    urlCount: urls.length,
    paths: urls.map((url) => new URL(url).pathname),
  };

  if (!submit) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    await verifyLiveKey();
    let response;
    try {
      response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
      });
    } catch {
      throw new Error('IndexNow request failed before a response was received');
    }
    const result = { ...summary, status: response.status, outcome: responseMeaning(response.status) };
    console.log(JSON.stringify(result, null, 2));
    if (!response.ok) process.exitCode = 1;
  }
} catch (error) {
  fail(error instanceof Error ? error.message : 'Unexpected failure');
}
