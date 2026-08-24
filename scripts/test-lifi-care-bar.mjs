import assert from 'node:assert/strict';
import { injectCareBar } from './inject-lifi-care-bar.mjs';

const fixture = '<!doctype html><html><head><title>Fixture</title><link rel="stylesheet" href="/lifi-care.css"></head><body><main id="main"><p>Client content</p></main><footer><div class="footerEnd">Designed, Hosted and Cared For By <a href="https://littlefightnyc.com" target="_blank">LittleFightNYC.com</a></div><p>Client disclosures remain.</p><div class="ftrBase" data-lfc></div></footer></body></html>';
const output = injectCareBar(fixture, 'fixture.html');
assert.equal((output.match(/<main\b/gi) || []).length, 1);
assert.equal((output.match(/<\/main>/gi) || []).length, 1);
assert.equal((output.match(/<footer\b/gi) || []).length, 1);
assert.equal((output.match(/<\/footer>/gi) || []).length, 1);
assert.equal((output.match(/class="lfc"/g) || []).length, 1);
assert.equal((output.match(/lfc-beacon/g) || []).length, 1);
assert.equal(output.includes('Made by'), true);
assert.equal(output.includes('Little Fight NYC'), true);
assert.equal(output.includes('Designed, Hosted and Cared For By'), false);
assert.equal(output.includes('/lifi-care.css'), false);
assert.equal(output.includes('data-lfc'), false);
assert.equal(output.includes('Client disclosures remain.'), true);
console.log('Little Fight credit-mark regression test passed');
