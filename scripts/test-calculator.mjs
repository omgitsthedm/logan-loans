import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';

// Exercise the actual page script with synthetic inputs; no browser, network,
// application submission, or provider calls. These verify model behavior, not
// whether its illustrative insurance assumptions match a lender's offer.
const html = readFileSync(resolve(process.argv[2] || '.', 'calculator.html'), 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .find((match) => match[1].includes('function calc(homePrice'))?.[1];
assert.ok(script, 'calculator script exists');

function element(dataset = {}) {
  return {
    dataset, style: {}, value: '', textContent: '', innerHTML: '', listeners: {},
    classList: { add() {}, remove() {}, toggle() { return true; } },
    addEventListener(name, callback) { this.listeners[name] = callback; },
    appendChild() {},
  };
}
const elements = new Map();
const get = (id) => {
  if (!elements.has(id)) elements.set(id, element());
  return elements.get(id);
};
const choices = Object.fromEntries(['conv', 'fha', 'va', 'jumbo'].map((type) => [type, element({ type })]));
const document = {
  getElementById: get,
  createElement: () => element(),
  querySelectorAll: (selector) => selector === '[data-type]' ? Object.values(choices) : [],
};
runInNewContext(script, { document });

assert.equal(get('outTotal').textContent, '$3,057');
assert.equal(get('sumLoan').textContent, '$400,000');
assert.match(get('cmp5Desc').textContent, /Mortgage insurance included/);
assert.match(get('cmp20Desc').textContent, /No monthly mortgage insurance/);
choices.fha.listeners.click();
assert.match(get('cmp20Desc').textContent, /Mortgage insurance included/);
assert.match(get('cmp25Desc').textContent, /Mortgage insurance included/);
choices.va.listeners.click();
for (const pct of [5, 20, 25]) assert.match(get(`cmp${pct}Desc`).textContent, /No monthly mortgage insurance/);
choices.jumbo.listeners.click();
assert.match(get('cmp5Desc').textContent, /Mortgage insurance included/);
assert.match(get('cmp20Desc').textContent, /No monthly mortgage insurance/);
get('numHomePrice').listeners.input({ target: { value: '800000' } });
assert.match(get('cmp5Desc').textContent, /^\$40,000 down/);
assert.match(get('cmp20Desc').textContent, /^\$160,000 down/);
assert.match(get('cmp25Desc').textContent, /^\$200,000 down/);
console.log('Calculator regression passed: default payment, four loan modes, and changing down-payment descriptions.');
