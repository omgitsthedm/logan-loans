#!/usr/bin/env node
// Build only real, approved clips. No profile cards or invented transcripts.
import { readFile, writeFile, readdir, realpath, access, copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const videoRoutes = new Set(['/hard-money', '/non-qm', '/bank-statement-loans', '/dscr-loans', '/fix-and-flip', '/bridge-loans', '/construction-loans', '/home-equity', '/jumbo-loans']);
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

export function hasCaptionCue(contents) {
  const text = contents.replace(/^\uFEFF/, '').replaceAll('\r\n', '\n');
  if (!/^WEBVTT(?:[ \t].*)?\n/.test(text)) return false;
  const seconds = value => {
    const pieces = value.split(':').map(Number);
    return pieces.length === 3 ? pieces[0] * 3600 + pieces[1] * 60 + pieces[2] : pieces[0] * 60 + pieces[1];
  };
  return text.split(/\n{2,}/).slice(1).some(block => {
    if (/^(?:NOTE|STYLE|REGION)\b/.test(block)) return false;
    const match = block.match(/^(?:[^\n]+\n)?((?:\d{2,}:)?[0-5]\d:[0-5]\d\.\d{3})[ \t]+-->[ \t]+((?:\d{2,}:)?[0-5]\d:[0-5]\d\.\d{3})[^\n]*\n([\s\S]+)$/);
    return !!match && seconds(match[2]) > seconds(match[1]) && !!match[3].replace(/<[^>]*>/g, '').trim();
  });
}

export async function validateVideoManifest(manifest, exists = async () => true) {
  if (manifest.version !== 1 || !Array.isArray(manifest.videos)) throw new Error('Invalid video manifest.');
  const ids = new Set();
  for (const video of manifest.videos) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(video.id || '') || ids.has(video.id)) throw new Error('Video IDs must be unique slugs.');
    ids.add(video.id);
    if (video.approved !== true || video.permissionConfirmed !== true || !video.reviewedBy?.trim()) throw new Error(`${video.id}: approval and permission are required.`);
    for (const key of ['title', 'summary']) if (typeof video[key] !== 'string' || !video[key].trim()) throw new Error(`${video.id}: ${key} is required.`);
    for (const key of ['publishedAt', 'reviewedAt']) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(video[key] || '') || Number.isNaN(Date.parse(video[key])) || new Date(video[key]).toISOString().slice(0, 10) !== video[key]) throw new Error(`${video.id}: valid ${key} is required.`);
    }
    if (Date.parse(video.publishedAt) > Date.now() || Date.parse(video.reviewedAt) > Date.now()) throw new Error(`${video.id}: future dates cannot be published.`);
    const source = new URL(video.sourceUrl);
    if (source.protocol !== 'https:' || !['www.instagram.com', 'instagram.com'].includes(source.hostname) || !/^\/(?:reel|p)\/[A-Za-z0-9_-]+\/?$/.test(source.pathname) || source.username || source.password || source.search || source.hash || source.port) throw new Error(`${video.id}: a canonical original Instagram post URL without query, fragment, or port is required.`);
    for (const [key, extension] of [['src', 'mp4'], ['captions', 'vtt'], ['poster', '(?:webp|jpg|png)']]) {
      if (!(new RegExp(`^assets/video/[a-z0-9-]+\\.${extension}$`)).test(video[key] || '') || !(await exists(video[key]))) throw new Error(`${video.id}: valid local ${key} file is required.`);
    }
    if (!videoRoutes.has(video.relatedRoute) || !(await exists(video.relatedRoute.slice(1) + '.html'))) throw new Error(`${video.id}: a supported related service page is required.`);
  }
  return manifest.videos;
}

export function renderVideoLibrary(videos) {
  if (!videos.length) return '';
  return `<section class="videoLibrary" aria-labelledby="video-heading"><p class="kicker">From Logan</p><h2 class="h2" id="video-heading">Loan questions, explained on video.</h2><div class="specialistGrid">${videos.map(video => `<article class="specialistCard"><video controls preload="none" playsinline poster="./${escape(video.poster)}" aria-label="${escape(video.title)}"><source src="./${escape(video.src)}" type="video/mp4"><track kind="captions" src="./${escape(video.captions)}" srclang="en" label="English" default><a href="./${escape(video.src)}">Download this video</a></video><h3>${escape(video.title)}</h3><time datetime="${escape(video.publishedAt)}">Published ${escape(video.publishedAt)}</time><p>${escape(video.summary)}</p><p><a class="uLink" href="${escape(video.sourceUrl)}" target="_blank" rel="noopener">Original Instagram post</a> · <a class="uLink" href=".${escape(video.relatedRoute)}">Explore the loan option</a></p></article>`).join('')}</div></section>`;
}

async function main() {
  const target = await realpath(path.resolve(process.argv[2] || 'dist'));
  if (target !== await realpath(path.join(root, 'dist'))) throw new Error('Video renderer only writes to this repository’s dist directory.');
  const manifest = JSON.parse(await readFile(path.join(root, 'content/videos.json'), 'utf8'));
  const videos = await validateVideoManifest(manifest, async file => { try { await access(path.join(root, file)); return true; } catch { return false; } });
  for (const video of videos) {
    const service = await readFile(path.join(target, video.relatedRoute.slice(1) + '.html'), 'utf8');
    if (service.split('<!-- LOGAN_VIDEOS -->').length !== 2) throw new Error(`${video.id}: related service page needs exactly one video slot.`);
    for (const file of [video.src, video.captions, video.poster]) {
      const original = await realpath(path.join(root, file));
      if (!original.startsWith(path.join(root, 'assets/video') + path.sep)) throw new Error(`${video.id}: media cannot resolve outside assets/video.`);
    }
    const captions = await readFile(path.join(root, video.captions), 'utf8');
    if (!hasCaptionCue(captions)) throw new Error(`${video.id}: captions must contain a valid timed cue with text.`);
  }
  if (videos.length) await mkdir(path.join(target, 'assets/video'), {recursive: true});
  for (const file of new Set(videos.flatMap(video => [video.src, video.captions, video.poster]))) {
    await copyFile(path.join(root, file), path.join(target, file));
  }
  for (const file of await readdir(target)) {
    if (!file.endsWith('.html')) continue;
    const location = path.join(target, file);
    const source = await readFile(location, 'utf8');
    const slot = '<!-- LOGAN_VIDEOS -->';
    if (!source.includes(slot)) continue;
    if (source.split(slot).length !== 2) throw new Error(`${file}: duplicate video slot.`);
    const related = file === 'index.html' ? videos.slice(0, 4) : videos.filter(video => video.relatedRoute === '/' + file.replace(/\.html$/, ''));
    let output = source.replace(slot, renderVideoLibrary(related));
    if (related.length && !output.includes('href="./specialist.css')) output = output.replace('</head>', '<link rel="stylesheet" href="./specialist.css">\n</head>');
    await writeFile(location, output);
  }
  console.log(`Prepared ${videos.length} approved, captioned videos; empty sections omitted.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
