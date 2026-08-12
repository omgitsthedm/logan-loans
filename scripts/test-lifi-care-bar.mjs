import assert from 'node:assert/strict';
import { injectCareBar } from './inject-lifi-care-bar.mjs';

const fixture = '<!doctype html><html><head><title>Fixture</title></head><body><main id="main"><p>Client content</p></main><footer><div class="footerEnd">Designed, Hosted and Cared For By <a href="https://littlefightnyc.com" target="_blank">LittleFightNYC.com</a></div><p>Client disclosures remain.</p></footer></body></html>';
const output = injectCareBar(fixture, 'fixture.html');
assert.equal((output.match(/<main\b/gi) || []).length, 1);
assert.equal((output.match(/<\/main>/gi) || []).length, 1);
assert.equal((output.match(/<footer\b/gi) || []).length, 1);
assert.equal((output.match(/<\/footer>/gi) || []).length, 1);
assert.equal((output.match(/class="lf-care-bar"/g) || []).length, 1);
assert.equal(output.includes('Designed, Hosted and Cared For By'), false);
assert.equal(output.includes('target="_blank"'), false);
console.log('Little Fight care-bar regression test passed');
