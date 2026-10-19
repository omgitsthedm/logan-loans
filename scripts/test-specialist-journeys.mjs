#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(process.argv[2] || path.join(root, 'dist'));
const read = file => readFile(path.join(target, file), 'utf8');
const programs = await read('programs.html');
const routes = ['hard-money', 'non-qm', 'bank-statement-loans', 'dscr-loans', 'fix-and-flip', 'bridge-loans', 'construction-loans', 'home-equity', 'jumbo-loans'];
const schemas = [...programs.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
const catalog = schemas.flatMap(schema => schema['@graph'] || []).find(node => node.hasOfferCatalog)?.hasOfferCatalog.itemListElement;
assert.ok(catalog?.length, 'Programs need a catalog matching visible destinations.');
for (const route of routes) {
  const page = await read(route + '.html');
  assert.ok(programs.includes(`href="./${route}"`), `${route} needs a visible program link.`);
  assert.ok(catalog.some(offer => offer.itemOffered.url === `https://logan.loans/${route}`), `${route} needs matching structured data.`);
  assert.match(page, /href="\.\/contact(?:\?scenario=[a-z-]+)?#intake"/, `${route} needs a direct inquiry.`);
  assert.doesNotMatch(page, /LOGAN_VIDEOS|LOGAN_STORY_ANCHOR/, `${route} contains an unrendered content slot.`);
}
const investor = await read('investor-loans.html');
assert.ok(investor.indexOf('>Review My Deal</a>') < investor.indexOf('data-ll-story='), 'Investor inquiry must precede the narrative image.');
assert.ok(investor.indexOf('>Review My Deal</a>') > 0);
for (const file of ['investor-loans.html', 'blog-dscr-loans-arizona.html']) {
  assert.doesNotMatch(await read(file), /<a\b[^>]*href="\.\/apply"/, `${file}: persistent inquiry actions must preserve investor context.`);
}
const home = await read('index.html');
assert.match(home, /href="\.\/contact\?scenario=investor#intake">Review My Scenario/);
assert.doesNotMatch(programs, /no tax returns required|700\+ credit|10-year draw period|12-24 months/);
const examples = await read('loan-scenarios.html');
assert.match(examples, /hypothetical scenarios/);
assert.doesNotMatch(examples, /funded in \d+ days|actual client|real client/);
for (const file of ['la-jolla-del-mar.html', 'malibu.html', 'newport-corona.html', 'palisades-brentwood.html', 'santa-monica.html']) {
  const source = await read(file);
  assert.equal((source.match(/<meta name="robots"/g) || []).length, 1);
  assert.match(source, /<meta name="robots" content="noindex,follow"/);
}
const contact = await read('contact.html');
assert.match(contact, /id="intake"/);
const social = JSON.parse(await readFile(path.join(root, 'data/instagram.json'), 'utf8'));
assert.deepEqual(social.posts, [], 'Unverified profile cards must not be presented as real posts.');
console.log('Specialist journeys passed: visible/schema routes, direct inquiries, action-before-image, intentional indexing, and clearly illustrative examples.');
