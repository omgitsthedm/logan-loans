#!/usr/bin/env node
import assert from 'node:assert/strict';
import { validateVideoManifest, renderVideoLibrary, hasCaptionCue } from './render-videos.mjs';

const video = { id: 'rental-review', approved: true, permissionConfirmed: true, reviewedBy: 'Test reviewer', title: 'Rent & costs <explained>', summary: 'Illustrative test content.', publishedAt: '2026-10-01', reviewedAt: '2026-10-17', sourceUrl: 'https://www.instagram.com/reel/test123/', src: 'assets/video/rental-review.mp4', captions: 'assets/video/rental-review.vtt', poster: 'assets/video/rental-review.webp', relatedRoute: '/dscr-loans' };
const manifest = entry => ({ version: 1, videos: [entry] });
assert.equal(renderVideoLibrary(await validateVideoManifest({version: 1, videos: []})), '');
await validateVideoManifest(manifest(video));
for (const change of [{approved: false}, {permissionConfirmed: false}, {captions: ''}, {sourceUrl: 'https://www.instagram.com/logan.loans/'}, {src: '../clip.mp4'}, {relatedRoute: '//external.test'}, {publishedAt: '2026-02-31'}, {reviewedAt: '2999-01-01'}]) await assert.rejects(() => validateVideoManifest(manifest({...video, ...change})));
await assert.rejects(() => validateVideoManifest({version: 1, videos: [video, video]}));
await assert.rejects(() => validateVideoManifest(manifest(video), async () => false));
for (const sourceUrl of ['https://www.instagram.com/reel/test123/?email=private%40example.test', 'https://www.instagram.com/reel/test123/#private', 'https://www.instagram.com:8443/reel/test123/']) await assert.rejects(() => validateVideoManifest(manifest({...video, sourceUrl})));
await assert.rejects(() => validateVideoManifest(manifest({...video, relatedRoute: '/privacy'})));
const output = renderVideoLibrary([video]);
assert.match(output, /preload="none"/);
assert.match(output, /<track kind="captions"/);
assert.match(output, /Rent &amp; costs &lt;explained&gt;/);
assert.doesNotMatch(output, /autoplay|<iframe|<script/);
assert.equal(hasCaptionCue('WEBVTT\n\n00:00:00.000 --> 00:00:01.000\n\n'), false);
assert.equal(hasCaptionCue('WEBVTT\n\n00:00:02.000 --> 00:00:01.000\nWrong timing.\n'), false);
assert.equal(hasCaptionCue('WEBVTT\n\nNOTE\n00:00:00.000 --> 00:00:01.000\nNot a cue.\n'), false);
assert.equal(hasCaptionCue('WEBVTT\n\n00:00:00.000 --> 00:00:01.000\nA real caption.\n'), true);
assert.equal(hasCaptionCue('WEBVTT\r\n\r\nintro\r\n00:00.000 --> 00:01.500 align:start\r\nA real caption.\r\n'), true);
console.log('Video publishing checks passed: approved sources, permissions, captions, safe paths, escaped text, and no empty library.');
