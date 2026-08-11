#!/usr/bin/env node

import { access, readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targetRoot = path.resolve(process.argv[2] || repositoryRoot);
const errors = [];
const warnings = [];
const htmlFiles = (await readdir(targetRoot)).filter((file) => file.endsWith('.html')).sort();
const excludedFromIndex = new Set([
  '404.html',
  'funded-deals.html',
  'la-jolla-del-mar.html',
  'malibu.html',
  'newport-corona.html',
  'palisades-brentwood.html',
  'press.html',
  'santa-monica.html',
  'thanks.html',
  'thanks-contact.html',
]);
const canonicalHost = 'https://logan.loans';
const narrativeManifest = JSON.parse(
  await readFile(path.join(repositoryRoot, 'content', 'image-narratives.json'), 'utf8'),
);
const narrativePageCount = Object.keys(narrativeManifest.pages).length;
const isPublishArtifact = path.basename(targetRoot) === 'dist';

const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const occurrences = (source, pattern) => Array.from(source.matchAll(pattern));
const stripMarkup = (value) => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function expectedCanonical(file) {
  return file === 'index.html' ? `${canonicalHost}/` : `${canonicalHost}/${file.replace(/\.html$/, '')}`;
}

function resolveInternalReference(file, reference) {
  const withoutQuery = reference.split(/[?#]/, 1)[0];
  if (!withoutQuery) return null;
  const decoded = decodeURIComponent(withoutQuery);
  const absolute = decoded.startsWith('/')
    ? path.join(targetRoot, decoded.slice(1))
    : path.resolve(targetRoot, path.dirname(file), decoded);

  if (path.extname(absolute)) return absolute;
  if (decoded.endsWith('/')) return path.join(absolute, 'index.html');
  return `${absolute}.html`;
}

if (htmlFiles.length !== 58) fail(`Expected 58 HTML pages, found ${htmlFiles.length}.`);
if (narrativePageCount !== narrativeManifest.expectedPageCount) {
  fail(
    `Narrative manifest contains ${narrativePageCount} pages; expected ${narrativeManifest.expectedPageCount}.`,
  );
}

const indexableFiles = [];
const allIdsByFile = new Map();
const schemasByFile = new Map();
const sharedPages = [];

for (const file of htmlFiles) {
  const source = await readFile(path.join(targetRoot, file), 'utf8');
  const isIndexable = !excludedFromIndex.has(file);
  if (isIndexable) indexableFiles.push(file);

  if (source.includes('https://www.logan.loans')) fail(`${file}: legacy www canonical host remains.`);
  if (source.includes('grandfundingllc.com')) fail(`${file}: unrelated Grand Funding entity remains in Logan schema.`);

  const titleCount = occurrences(source, /<title>[\s\S]*?<\/title>/gi).length;
  const h1Count = occurrences(source, /<h1\b/gi).length;
  if (titleCount !== 1) fail(`${file}: expected one title, found ${titleCount}.`);
  if (h1Count !== 1) fail(`${file}: expected one h1, found ${h1Count}.`);

  if (isIndexable) {
    if (!/<meta\s+name=["']description["']\s+content=["'][^"']+/i.test(source)) {
      fail(`${file}: missing meta description.`);
    }
    const canonical = source.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
    if (canonical !== expectedCanonical(file)) {
      fail(`${file}: canonical is ${canonical || 'missing'}; expected ${expectedCanonical(file)}.`);
    }
  } else if (!/noindex/i.test(source)) {
    fail(`${file}: non-indexable outcome page must declare noindex.`);
  }

  const ids = occurrences(source, /\sid=["']([^"']+)["']/gi).map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) fail(`${file}: duplicate ids: ${[...new Set(duplicateIds)].join(', ')}.`);
  allIdsByFile.set(file, new Set(ids));

  const schemaBlocks = occurrences(source, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const parsedSchemas = [];
  schemaBlocks.forEach((match, index) => {
    try {
      parsedSchemas.push(JSON.parse(match[1]));
    } catch (error) {
      fail(`${file}: JSON-LD block ${index + 1} does not parse (${error.message}).`);
    }
  });
  schemasByFile.set(file, parsedSchemas);

  const cssReferences = occurrences(source, /href=["'](?:\.\/|\/)?styles\.css(?:\?[^"']*)?["']/g).length;
  const jsReferences = occurrences(source, /src=["'](?:\.\/|\/)?app\.js(?:\?[^"']*)?["']/g).length;
  if (cssReferences || jsReferences) {
    sharedPages.push(file);
    if (cssReferences !== 2 || jsReferences !== 1) {
      fail(`${file}: expected two shared CSS refs and one shared JS ref; found ${cssReferences}/${jsReferences}.`);
    }
    const footer = source.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] || '';
    for (const legalTarget of ['./privacy', './disclosures', './terms']) {
      if (!footer.includes(`href="${legalTarget}"`)) {
        fail(`${file}: shared footer is missing ${legalTarget}.`);
      }
    }
    if (!footer.includes('2466872') || !footer.includes('2006640')) {
      fail(`${file}: shared footer must retain both protected NMLS identifiers.`);
    }
  }

  if (/\.card[^{}]*\{opacity:0;transform:translateY\(/.test(source)) {
    fail(`${file}: critical inline CSS still hides card content before shared assets load.`);
  }
  if (/\.mobileBar\{opacity:0;transform:translateY\(100px\)\}/.test(source)) {
    fail(`${file}: critical inline CSS still hides the mobile action bar.`);
  }

  const localReferences = occurrences(source, /\s(?:href|src|action)=["']([^"']+)["']/gi)
    .map((match) => match[1])
    .filter((reference) => (
      !/^(?:https?:|mailto:|tel:|data:|blob:|javascript:)/i.test(reference) &&
      !reference.startsWith('#')
    ));

  for (const reference of localReferences) {
    const resolved = resolveInternalReference(file, reference);
    if (resolved && !(await exists(resolved))) {
      fail(`${file}: missing local target ${reference}.`);
    }
  }

  const srcsetReferences = occurrences(source, /\ssrcset=["']([^"']+)["']/gi)
    .flatMap((match) => match[1].split(','))
    .map((candidate) => candidate.trim().split(/\s+/, 1)[0])
    .filter((reference) => (
      reference &&
      !/^(?:https?:|data:|blob:)/i.test(reference)
    ));

  for (const reference of srcsetReferences) {
    const resolved = resolveInternalReference(file, reference);
    if (resolved && !(await exists(resolved))) {
      fail(`${file}: missing srcset candidate ${reference}.`);
    }
  }

  if (isPublishArtifact && narrativeManifest.pages[file]) {
    const expectedStory = narrativeManifest.pages[file];
    if (!source.includes(`data-ll-story="${expectedStory}"`)) {
      fail(`${file}: expected rendered "${expectedStory}" narrative.`);
    }
    const storyImage = source.match(/<img\b[^>]*class=["'][^"']*\bstoryImage\b[^"']*["'][^>]*>/i)?.[0] || '';
    if (!storyImage) {
      fail(`${file}: rendered narrative is missing its story image.`);
    } else {
      if (!/\balt=["'][^"']+["']/i.test(storyImage)) fail(`${file}: story image needs objective alt text.`);
      if (!/\bwidth=["']\d+["']/i.test(storyImage) || !/\bheight=["']\d+["']/i.test(storyImage)) {
        fail(`${file}: story image needs intrinsic width and height.`);
      }
      if (!/\bloading=["']eager["']/i.test(storyImage)) fail(`${file}: above-fold story image must load eagerly.`);
      if (!/\bdecoding=["']async["']/i.test(storyImage)) fail(`${file}: story image must decode asynchronously.`);
      if (!/\bfetchpriority=["']high["']/i.test(storyImage)) fail(`${file}: above-fold story image needs high fetch priority.`);
    }
    const storyPicture = source.match(/<picture>[\s\S]*?<img\b[^>]*class=["'][^"']*\bstoryImage\b[^"']*["'][^>]*>[\s\S]*?<\/picture>/i)?.[0] || '';
    if (!/\bsrcset=["'][^"']+["']/i.test(storyPicture) || !/\bsizes=["'][^"']+["']/i.test(storyPicture)) {
      fail(`${file}: story picture needs responsive srcset and sizes.`);
    }
  }

  if (isPublishArtifact && /data-ll-narrative=/.test(source)) {
    fail(`${file}: unresolved narrative placeholder remains in the publish artifact.`);
  }

  const samePageAnchors = occurrences(source, /\shref=["']#([^"']+)["']/gi).map((match) => match[1]);
  samePageAnchors.forEach((id) => {
    if (!allIdsByFile.get(file).has(id)) fail(`${file}: missing same-page anchor #${id}.`);
  });
}

if (sharedPages.length !== 57) fail(`Expected 57 shared-shell pages, found ${sharedPages.length}.`);

if (isPublishArtifact) {
  for (const file of Object.keys(narrativeManifest.pages)) {
    if (!htmlFiles.includes(file)) fail(`Narrative manifest references missing page ${file}.`);
  }
}

const indexSource = await readFile(path.join(targetRoot, 'index.html'), 'utf8');
if (/"aggregateRating"\s*:/.test(indexSource) || /"review"\s*:/.test(indexSource)) {
  fail('index.html: self-serving review schema must not be published.');
}
if (!/SearchAction/.test(indexSource) || !/faq\?q=\{search_term_string\}/.test(indexSource)) {
  fail('index.html: WebSite SearchAction is missing or does not point to the FAQ query UI.');
}

const faqSource = await readFile(path.join(targetRoot, 'faq.html'), 'utf8');
if (!/data-faq-search/.test(faqSource) || !/class=["'][^"']*faq-page/.test(faqSource)) {
  fail('faq.html: searchable, answer-first FAQ library is missing.');
}

const expectedForms = new Map([
  ['apply', ['bot-field', 'email', 'form-name', 'gbraid', 'gclid', 'goal', 'location', 'message', 'name', 'phone', 'price_range', 'timeline', 'utm_campaign', 'utm_content', 'utm_medium', 'utm_source', 'utm_term', 'wbraid']],
  ['preapproval', ['bot-field', 'city', 'email', 'expected_home_price', 'form-name', 'loan_type', 'name', 'notes', 'phone', 'timeline']],
  ['general-contact', ['bot-field-2', 'email', 'form-name', 'message', 'name']],
  ['partner-referral', ['bot-field', 'brokerage', 'client_types', 'email', 'form-name', 'gbraid', 'gclid', 'name', 'phone', 'utm_campaign', 'utm_content', 'utm_medium', 'utm_source', 'utm_term', 'wbraid']],
  ['newsletter', ['email', 'form-name']],
]);
const expectedFormFingerprints = new Map([
  ['apply', 'a595d8201a6a68ca21853e24ea86e434d01bbdbd0f58cf341be92dd0e24e9726'],
  ['preapproval', 'cb923f813c42bf554d535899a65cf0c7e64ffce6e6bdb807d6ca504586f182d7'],
  ['general-contact', 'c6d5d977c1a940e9f15771162bb08789bc9505b0242473179fc22c1d27faddbc'],
  ['partner-referral', 'fab26bb28ecd421aa2c10bbc7b641f42687d6f57651788202749a360626a898c'],
  ['newsletter', 'a5998f0d121ca2360ac82414f3a60937ee52464dba0470dd9416c5468f092aa6'],
]);
const discoveredForms = new Map();
const discoveredFormFingerprints = new Map();
const discoveredFormCounts = new Map();

for (const file of htmlFiles) {
  const source = await readFile(path.join(targetRoot, file), 'utf8');
  const forms = occurrences(source, /<form\b([^>]*)>([\s\S]*?)<\/form>/gi);
  forms.forEach((match) => {
    const formName = match[1].match(/\bname=["']([^"']+)["']/i)?.[1];
    if (!formName || !expectedForms.has(formName)) return;
    const fieldNames = occurrences(match[2], /<(?:input|select|textarea)\b[^>]*\bname=["']([^"']+)["']/gi)
      .map((field) => field[1])
      .sort();
    discoveredForms.set(formName, fieldNames);
    const protectedMarkup = [
      `<form${match[1]}>`,
      ...occurrences(match[2], /<(?:input|select|textarea)\b[^>]*>|<option\b[^>]*>[\s\S]*?<\/option>/gi)
        .map((field) => field[0]),
    ]
      .map((fragment) => fragment.replace(/\s+/g, ' ').trim())
      .join('\n');
    discoveredFormFingerprints.set(
      formName,
      createHash('sha256').update(protectedMarkup).digest('hex'),
    );
    discoveredFormCounts.set(formName, (discoveredFormCounts.get(formName) || 0) + 1);
  });
}

for (const [formName, expectedFields] of expectedForms) {
  const actualFields = discoveredForms.get(formName);
  if (!actualFields) {
    fail(`Missing protected Netlify form contract: ${formName}.`);
  } else if (JSON.stringify(actualFields) !== JSON.stringify(expectedFields)) {
    fail(`Form ${formName} fields changed. Expected ${expectedFields.join(', ')}; found ${actualFields.join(', ')}.`);
  }
  if (discoveredFormCounts.get(formName) !== 1) {
    fail(`Form ${formName} must appear exactly once; found ${discoveredFormCounts.get(formName) || 0}.`);
  }
  const actualFingerprint = discoveredFormFingerprints.get(formName);
  if (actualFingerprint && actualFingerprint !== expectedFormFingerprints.get(formName)) {
    fail(`Form ${formName} protected attributes, field types, requiredness, values, or options changed.`);
  }
}

const sitemap = await readFile(path.join(targetRoot, 'sitemap.xml'), 'utf8');
const sitemapLocations = occurrences(sitemap, /<loc>([^<]+)<\/loc>/g).map((match) => match[1]);
const expectedLocations = indexableFiles.map(expectedCanonical).sort();
if (JSON.stringify([...sitemapLocations].sort()) !== JSON.stringify(expectedLocations)) {
  fail(`Sitemap URLs do not exactly match the ${expectedLocations.length} indexable pages.`);
}
if (!sitemapLocations.every((location) => location.startsWith(canonicalHost))) {
  fail('sitemap.xml: every location must use the apex canonical host.');
}

const robots = await readFile(path.join(targetRoot, 'robots.txt'), 'utf8');
if (!/User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//i.test(robots)) fail('robots.txt: OAI-SearchBot policy is missing.');
if (!/User-agent:\s*Google-Extended[\s\S]*?Allow:\s*\//i.test(robots)) fail('robots.txt: Google-Extended token is missing.');
if (!robots.includes(`Sitemap: ${canonicalHost}/sitemap.xml`)) fail('robots.txt: sitemap host is inconsistent.');

const appSource = await readFile(path.join(targetRoot, 'app.js'), 'utf8');
if (/addEventListener\(\s*['"]scroll['"]/.test(appSource)) {
  const hasPassiveFunctionalListener = (
    /addEventListener\(\s*['"]scroll['"]\s*,\s*queueSync\s*,\s*\{\s*passive:\s*true\s*\}\s*\)/.test(appSource)
    && /requestAnimationFrame\(/.test(appSource)
  );
  if (!hasPassiveFunctionalListener) {
    fail('app.js: scroll listeners must be passive, frame-throttled, and reserved for functional state.');
  }
}

if (await exists(path.join(targetRoot, 'netlify.toml'))) {
  const netlify = await readFile(path.join(targetRoot, 'netlify.toml'), 'utf8');
  if (!netlify.includes('https://loganloans.netlify.app/*') || !netlify.includes('https://logan.loans/:splat')) {
    fail('netlify.toml: Netlify subdomain host redirect is missing.');
  }
}

if (faqSource.includes('$806,500') || faqSource.includes('$1,209,750')) {
  warn('Regulated 2026 loan-limit figures remain on compliance hold; owner approval is required before correction.');
}
const disclosures = await readFile(path.join(targetRoot, 'disclosures.html'), 'utf8');
if (/Placeholder:\s*(?:AZ|CA-DFPI)/.test(disclosures)) {
  warn('Public AZ and CA license placeholders remain on compliance hold; approved license values are still required.');
}

warnings.forEach((message) => console.warn(`WARN: ${message}`));
if (errors.length) {
  errors.forEach((message) => console.error(`ERROR: ${message}`));
  console.error(`Site audit failed with ${errors.length} error${errors.length === 1 ? '' : 's'}.`);
  process.exit(1);
}

console.log(`Site audit passed: ${htmlFiles.length} pages, ${indexableFiles.length} indexable URLs, ${sharedPages.length} shared-shell pages.`);
