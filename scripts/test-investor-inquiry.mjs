#!/usr/bin/env node

// Offline tests: the published script runs in a VM with a small DOM and a fetch
// stub. No request can reach Netlify or create a lead. Fixtures come from the
// static form so a field omitted from Netlify's HTML cannot silently pass.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [source, contact, apply, css] = await Promise.all([
  'app.js', 'contact.html', 'apply.html', 'scenario.css',
].map((name) => readFile(path.join(repo, name), 'utf8')));

function attrs(markup) {
  return Object.fromEntries(Array.from(markup.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g),
    (match) => [match[1], match[2] ?? match[3] ?? match[4] ?? '']));
}

function formMarkup(html, name) {
  for (const match of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/g)) {
    const attributes = attrs(match[1]);
    if (attributes.name === name) return { attributes, body: match[2] };
  }
  throw new Error(`Missing static form: ${name}`);
}

function emitter(target = {}) {
  const listeners = new Map();
  target.addEventListener = (type, callback) => {
    if (!listeners.has(type)) listeners.set(type, []);
    listeners.get(type).push(callback);
  };
  target.dispatch = (type) => listeners.get(type)?.forEach((callback) => callback({ preventDefault() {}, target }));
  return target;
}

function controls(markup) {
  const fields = new Map();
  for (const match of markup.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
    const a = attrs(match[2]);
    if (!a.name) continue;
    assert(!fields.has(a.name), `Duplicate static field: ${a.name}`);
    const body = match[1] === 'input' ? '' : markup.slice(match.index + match[0].length).split(`</${match[1]}>`)[0];
    const options = Array.from(body.matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/g), (option) => {
      const attributes = attrs(option[1]);
      return { value: attributes.value ?? option[2].trim(), selected: 'selected' in attributes };
    });
    fields.set(a.name, emitter({
      name: a.name,
      type: a.type || match[1],
      value: match[1] === 'select' ? (options.find((option) => option.selected) || options[0])?.value || '' : a.value ?? body,
      required: 'required' in a,
      disabled: 'disabled' in a,
      attributes: a,
      options,
      focus() { this.focused = true; },
    }));
  }
  return fields;
}

function classList() {
  const values = new Set();
  return {
    add: (...keys) => keys.forEach((key) => values.add(key)),
    remove: (...keys) => keys.forEach((key) => values.delete(key)),
    contains: (key) => values.has(key),
    toggle(key, on) { if (on) values.add(key); else values.delete(key); },
  };
}

class OfflineFormData {
  constructor(form) { this.fields = form.fields; }
  *[Symbol.iterator]() {
    for (const field of this.fields.values()) {
      if (!field.disabled) yield [field.name, field.value];
    }
  }
}

function storage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, String(value)), removeItem: (key) => data.delete(key) };
}

function fixture({ search = '', restored = {}, response = 'success', enhance = true } = {}) {
  const markup = formMarkup(contact, 'preapproval');
  const fields = controls(markup.body);
  for (const [name, value] of Object.entries(restored)) fields.get(name).value = value;
  const panels = Array.from(markup.body.matchAll(/<details\b([^>]*\bdata-scenario-panel\b[^>]*)>([\s\S]*?)<\/details>/g), (match) => {
    const attributes = attrs(match[1]);
    const names = Array.from(controls(match[2]).keys());
    return {
      dataset: { scenarios: attributes['data-scenarios'] },
      hidden: 'hidden' in attributes,
      open: 'open' in attributes,
      querySelectorAll: () => names.map((name) => fields.get(name)),
    };
  });
  const heading = { textContent: 'Start with a question.' };
  const help = { textContent: '' };
  const message = { textContent: '' };
  const status = { dataset: {}, classList: classList(), querySelector: () => message };
  const button = { disabled: false, dataset: {}, textContent: 'Send My Request', setAttribute() {}, removeAttribute() {} };
  const form = emitter({
    id: 'preapprovalForm', fields, dataset: {},
    querySelector(selector) {
      if (selector === 'button[type="submit"]' || selector === '[data-scenario-submit]') return button;
      if (selector === '[data-scenario-help]') return help;
      return fields.get(selector.match(/^\[name="([^"]+)"\]$/)?.[1]) || null;
    },
    querySelectorAll: (selector) => selector === '[data-scenario-panel]' ? panels : [],
  });
  const timers = new Map();
  let timerId = 0;
  const schedule = (callback, delay = 0) => { timers.set(++timerId, { callback, delay }); return timerId; };
  const window = emitter({
    location: { href: `https://logan.loans/contact${search}`, protocol: 'https:', hostname: 'logan.loans', pathname: '/contact', search },
    dataLayer: [], localStorage: storage({ ll_consent: 'granted' }), sessionStorage: storage(),
    matchMedia: () => ({ matches: false }), setTimeout: schedule, clearTimeout: (id) => timers.delete(id),
  });
  const document = emitter({
    body: { classList: classList(), append() {} },
    querySelector(selector) {
      if (selector === '#preapprovalForm' || selector === '[data-scenario-inquiry]') return form;
      if (selector === '#preapprovalStatus') return status;
      if (selector === '[data-scenario-heading]') return heading;
      return null;
    },
    querySelectorAll: () => [], getElementById: () => null,
    createElement: () => ({ setAttribute() {}, classList: classList() }),
    getElementsByTagName: () => [{ parentNode: { insertBefore() {} } }], head: { appendChild() {} },
  });
  const requests = [];
  const context = {
    window, document, navigator: { webdriver: false }, URLSearchParams, FormData: OfflineFormData, AbortController,
    Element: class {}, console, setTimeout: schedule, clearTimeout: window.clearTimeout,
    fetch: (url, options) => {
      assert.equal(url, '/', 'Only the unchanged relative form endpoint may be used');
      assert.equal(options.method, 'POST');
      requests.push({ url, options });
      if (response === 'timeout') return new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(Object.assign(new Error('offline timeout'), { name: 'AbortError' }))));
      if (response === 'network') return Promise.reject(new Error('offline network failure'));
      return Promise.resolve({ ok: response === 'success' });
    },
  };
  if (enhance) {
    vm.runInNewContext(source, context, { filename: 'app.js' });
    context.setupScenarioInquiry();
  }
  return {
    form, fields, panels, heading, help, message, status, button, window, context, requests,
    body: () => new URLSearchParams(new OfflineFormData(form)),
    choose(value) { fields.get('loan_type').value = value; fields.get('loan_type').dispatch('change'); },
    runTimer(delay) {
      for (const [id, timer] of timers) if (timer.delay === delay) { timers.delete(id); timer.callback(); }
    },
  };
}

async function settle() { for (let i = 0; i < 8; i++) await Promise.resolve(); }

const protectedNames = ['form-name', 'bot-field', 'name', 'email', 'phone', 'city', 'timeline', 'expected_home_price', 'loan_type', 'notes'];
const optionalNames = [
  'inquiry_scenario', 'source_intent', 'property_type', 'ownership_type', 'estimated_monthly_rent', 'estimated_monthly_pitia',
  'reserve_months', 'rehab_budget', 'after_repair_value', 'exit_strategy', 'estimated_property_value', 'existing_mortgage_balance',
  'self_employment_history', 'income_documents', 'land_status', 'construction_budget', 'builder_status', 'home_equity_goal',
];

// Static detection and the no-JS fallback are separate from the enhanced DOM.
const noJS = fixture({ enhance: false });
assert.deepEqual(Array.from(noJS.fields.keys()).sort(), [...protectedNames, ...optionalNames].sort());
assert.equal(noJS.fields.get('form-name').value, 'preapproval');
assert.equal(formMarkup(contact, 'preapproval').attributes['netlify-honeypot'], 'bot-field');
assert.equal(formMarkup(contact, 'general-contact').attributes['netlify-honeypot'], 'bot-field-2');
for (const [html, name] of [[contact, 'preapproval'], [contact, 'general-contact'], [apply, 'apply']]) {
  const parsed = formMarkup(html, name);
  assert.equal(parsed.attributes.method, 'POST');
  assert.equal(parsed.attributes['data-netlify'], 'true');
  assert.deepEqual(Array.from(controls(parsed.body).values()).filter((field) => field.required).map((field) => field.name).sort(), ['email', 'name']);
}
assert.equal(noJS.fields.get('loan_type').value, '', 'An undecided visitor must not be categorized as a first-time buyer');
for (const value of ['first-time', 'buying-again', 'refinance', 'investor', 'other']) {
  assert(noJS.fields.get('loan_type').options.some((option) => option.value === value), `Historical loan type lost: ${value}`);
}
assert(noJS.panels.length >= 6);
assert(noJS.panels.every((panel) => !panel.hidden));
assert(Array.from(noJS.fields.values()).every((field) => !field.disabled));
noJS.fields.get('rehab_budget').value = '75000';
assert.equal(noJS.body().get('rehab_budget'), '75000', 'Collapsed native details must not discard no-JS values');
assert(css.includes('[data-scenario-panel][hidden]'), 'Hiding is opt-in after enhancement');

const neutral = fixture();
assert.equal(neutral.fields.get('loan_type').value, '');
assert(neutral.panels.every((panel) => panel.hidden));
assert.equal(neutral.body().has('rehab_budget'), false);

const routes = {
  rental: ['investor', 'estimated_monthly_rent'], investor: ['investor', 'estimated_monthly_rent'],
  rehab: ['rehab', 'rehab_budget'], bridge: ['bridge', 'exit_strategy'],
  'self-employed': ['self-employed', 'income_documents'], construction: ['construction', 'land_status'],
  'home-equity': ['home-equity', 'home_equity_goal'],
};
for (const [scenario, [loanType, fieldName]] of Object.entries(routes)) {
  const current = fixture({ search: `?scenario=${scenario}` });
  assert.equal(current.fields.get('loan_type').value, loanType);
  assert.equal(current.fields.get('source_intent').value, scenario === 'investor' ? 'rental' : scenario);
  assert.equal(current.fields.get(fieldName).disabled, false);
  assert(current.panels.some((panel) => !panel.hidden && panel.open));
  assert.notEqual(current.heading.textContent, 'Start with a question.');
}
for (const [topic, expected] of [['home-equity', 'home-equity'], ['construction', 'construction'], ['move-up', 'buying-again']]) {
  assert.equal(fixture({ search: `?topic=${topic}` }).fields.get('loan_type').value, expected);
}

for (const value of ['__proto__', 'constructor', '<script>personal</script>', 'someone@example.test']) {
  const bad = fixture({ search: `?scenario=${encodeURIComponent(value)}&name=Private+Name&email=private%40example.test` });
  assert.equal(bad.fields.get('source_intent').value, '');
  assert.equal(bad.fields.get('name').value, '');
  assert.equal(bad.fields.get('email').value, '');
  assert.equal(bad.fields.get('loan_type').value, '');
}

const restored = fixture({ search: '?scenario=rental', restored: { loan_type: 'rehab', notes: 'Keep this project note' } });
assert.equal(restored.fields.get('loan_type').value, 'rehab');
assert.equal(restored.fields.get('inquiry_scenario').value, 'rehab');
assert.equal(restored.fields.get('source_intent').value, 'rental');
assert.equal(restored.fields.get('notes').value, 'Keep this project note');

const switching = fixture({ search: '?scenario=rental' });
switching.fields.get('estimated_monthly_rent').value = '2900';
switching.choose('rehab');
switching.fields.get('rehab_budget').value = '85000';
assert.equal(switching.body().has('estimated_monthly_rent'), false, 'Inactive fields must not be serialized');
assert.equal(switching.fields.get('estimated_monthly_rent').value, '2900', 'Changing goals must not clear a previous answer');
assert.equal(switching.body().get('rehab_budget'), '85000');
switching.choose('investor');
assert.equal(switching.body().get('estimated_monthly_rent'), '2900');
assert.equal(switching.body().has('rehab_budget'), false);
assert.equal(switching.body().get('form-name'), 'preapproval');

for (const response of ['server', 'network', 'timeout']) {
  const failure = fixture({ search: '?scenario=rehab', response, restored: { name: 'Offline Visitor', email: 'visitor@example.test', notes: 'Keep my note', rehab_budget: '90000' } });
  const before = Array.from(failure.fields.values()).map((field) => [field.name, field.value]);
  failure.form.dispatch('submit');
  failure.form.dispatch('submit');
  assert.equal(failure.requests.length, 1, 'A double click must not create duplicate requests');
  if (response === 'timeout') failure.runTimer(15000);
  await settle();
  assert.deepEqual(Array.from(failure.fields.values()).map((field) => [field.name, field.value]), before);
  assert.equal(failure.button.disabled, false);
  assert.equal(failure.form.dataset.submitting, undefined);
  assert(failure.status.classList.contains('error'));
  assert.match(failure.message.textContent, /details are still here/);
  assert.match(failure.message.textContent, /480\) 803-7763/);
  assert.equal(failure.window.location.href, 'https://logan.loans/contact?scenario=rehab');
  assert.equal(failure.window.dataLayer.length, 0, 'Failed requests must not be recorded as successful leads');
}

const success = fixture({
  search: '?scenario=rental&email=do-not-copy%40example.test',
  restored: { name: 'Offline Visitor', email: 'visitor@example.test', notes: 'PRIVATE note', estimated_monthly_rent: '3100' },
});
success.form.dispatch('submit');
await settle();
const post = success.requests[0];
assert.equal(post.options.headers['Content-Type'], 'application/x-www-form-urlencoded');
const payload = new URLSearchParams(post.options.body);
assert.equal(payload.get('loan_type'), 'investor');
assert.equal(payload.get('inquiry_scenario'), 'rental');
assert.equal(payload.get('source_intent'), 'rental');
assert.equal(payload.get('estimated_monthly_rent'), '3100');
assert.equal(payload.has('rehab_budget'), false);
const analytics = JSON.stringify(success.window.dataLayer);
assert.match(analytics, /preapproval_intake_submit/);
for (const privateValue of ['visitor@example.test', 'do-not-copy', 'PRIVATE', '3100', 'scenario=', 'source_intent', 'estimated_monthly_rent']) {
  assert.equal(analytics.includes(privateValue), false, `Private or scenario data leaked to analytics: ${privateValue}`);
}
success.runTimer(700);
assert.equal(success.window.location.href, './thanks-contact');

console.log('Investor inquiry checks passed: static Netlify fields, two-field entry, no-JS access, source allowlist, scenario routing, safe serialization, restoration, failure/timeout recovery, and analytics privacy. No network requests were made.');
