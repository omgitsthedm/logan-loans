#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = await readFile(path.join(root, 'app.js'), 'utf8');

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function createInput(value, required = false) {
  return { value, required, focus() {}, addEventListener() {} };
}

function createForm(id, fields) {
  const listeners = new Map();
  const button = {
    disabled: false,
    textContent: 'Send',
    setAttribute() {},
    removeAttribute() {},
  };
  return {
    id,
    dataset: {},
    querySelector(selector) {
      if (selector === 'button[type="submit"]') return button;
      const name = selector.match(/^\[name="(.+)"\]$/)?.[1];
      return name ? fields[name] || null : null;
    },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    setAttribute() {},
    removeAttribute() {},
    submit() {
      return listeners.get('submit')?.({ preventDefault() {} });
    },
  };
}

class MockFormData {
  constructor(form) {
    this.form = form;
  }

  *[Symbol.iterator]() {}
}

async function runFormScenario({ consent = 'granted', status = 200, formName }) {
  const preapprovalForm = createForm('preapprovalForm', {
    name: createInput('Test Visitor', true),
    email: createInput('test@example.com', true),
    phone: createInput('480 555 0100', true),
  });
  const generalContactForm = createForm('generalContactForm', {
    name: createInput('Test Visitor', true),
    email: createInput('test@example.com', true),
  });
  const forms = { '#preapprovalForm': preapprovalForm, '#generalContactForm': generalContactForm };
  const location = { href: 'https://logan.loans/contact', protocol: 'https:', hostname: 'logan.loans', pathname: '/contact', search: '' };
  const localStorage = createStorage({ ll_consent: consent });
  const schedule = (callback, delay = 0) => {
    if (delay < 1000) callback();
    return 1;
  };
  const window = {
    location,
    dataLayer: [],
    localStorage,
    sessionStorage: createStorage(),
    matchMedia: () => ({ matches: false }),
    setTimeout: schedule,
    clearTimeout() {},
  };
  const document = {
    body: { classList: { add() {}, remove() {}, contains() { return false; } }, append() {} },
    querySelector: (selector) => forms[selector] || null,
    querySelectorAll: () => [],
    addEventListener() {},
    getElementById: () => null,
    createElement: () => ({ setAttribute() {}, classList: { add() {} } }),
    getElementsByTagName: () => [{ parentNode: { insertBefore() {} } }],
    head: { appendChild() {} },
  };
  const context = {
    window,
    document,
    localStorage,
    sessionStorage: window.sessionStorage,
    navigator: { webdriver: false },
    URLSearchParams,
    FormData: MockFormData,
    Element: class {},
    fetch: async () => ({ ok: status >= 200 && status < 300 }),
    setTimeout: schedule,
    clearTimeout() {},
    console,
  };
  vm.runInNewContext(source, context, { filename: 'app.js' });
  const form = formName === 'preapproval' ? preapprovalForm : generalContactForm;
  await form.submit();
  await Promise.resolve();
  await Promise.resolve();
  await form.submit();
  await Promise.resolve();
  return {
    events: window.dataLayer
      .map((entry) => Array.from(entry || []))
      .filter(([command]) => command === 'event')
      .map(([, eventName, payload]) => ({ eventName, payload })),
    href: location.href,
  };
}

function runDirectThankYouScenario() {
  const localStorage = createStorage({ ll_consent: 'granted' });
  const window = {
    location: { href: 'https://logan.loans/thanks-contact', protocol: 'https:', hostname: 'logan.loans', pathname: '/thanks-contact', search: '' },
    dataLayer: [],
    localStorage,
    sessionStorage: createStorage(),
    matchMedia: () => ({ matches: false }),
    setTimeout: (callback) => { callback(); return 1; },
    clearTimeout() {},
  };
  const context = {
    window,
    document: {
      body: { classList: { add() {}, remove() {}, contains() { return false; } }, append() {} },
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener() {},
      getElementById: () => null,
      createElement: () => ({ setAttribute() {}, classList: { add() {} } }),
      getElementsByTagName: () => [{ parentNode: { insertBefore() {} } }],
      head: { appendChild() {} },
    },
    localStorage,
    sessionStorage: window.sessionStorage,
    navigator: { webdriver: false },
    URLSearchParams,
    FormData: MockFormData,
    Element: class {},
    fetch: async () => ({ ok: true }),
    setTimeout: (callback) => {
      callback();
      return 1;
    },
    clearTimeout() {},
    console,
  };
  vm.runInNewContext(source, context, { filename: 'app.js' });
  return window.dataLayer
    .map((entry) => Array.from(entry || []))
    .filter(([command]) => command === 'event');
}

function runConsentUpdateScenario(granted) {
  const localStorage = createStorage();
  const window = {
    location: { href: 'https://logan.loans/', protocol: 'https:', hostname: 'logan.loans', pathname: '/', search: '' },
    dataLayer: [],
    localStorage,
    sessionStorage: createStorage(),
    matchMedia: () => ({ matches: false }),
    setTimeout: (callback) => { callback(); return 1; },
    clearTimeout() {},
  };
  const context = {
    window,
    document: {
      body: { classList: { add() {}, remove() {}, contains() { return false; } }, append() {} },
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener() {},
      getElementById: () => null,
      createElement: () => ({ setAttribute() {}, classList: { add() {} } }),
      getElementsByTagName: () => [{ parentNode: { insertBefore() {} } }],
      head: { appendChild() {} },
    },
    localStorage,
    sessionStorage: window.sessionStorage,
    navigator: { webdriver: false },
    URLSearchParams,
    FormData: MockFormData,
    Element: class {},
    fetch: async () => ({ ok: true }),
    setTimeout: (callback) => {
      callback();
      return 1;
    },
    clearTimeout() {},
    console,
  };
  vm.runInNewContext(source, context, { filename: 'app.js' });
  context.updateGoogleConsent(granted);
  return JSON.parse(JSON.stringify(Array.from(window.dataLayer.at(-1) || [])));
}

function runRevocationScenario() {
  const localStorage = createStorage();
  const window = {
    location: { href: 'https://logan.loans/', protocol: 'https:', hostname: 'logan.loans', pathname: '/', search: '' },
    dataLayer: [],
    localStorage,
    sessionStorage: createStorage(),
    matchMedia: () => ({ matches: false }),
    setTimeout: (callback) => { callback(); return 1; },
    clearTimeout() {},
  };
  const context = {
    window,
    document: {
      body: { classList: { add() {}, remove() {}, contains() { return false; } }, append() {} },
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener() {},
      getElementById: () => null,
      createElement: () => ({ setAttribute() {}, classList: { add() {} } }),
      getElementsByTagName: () => [{ parentNode: { insertBefore() {} } }],
      head: { appendChild() {} },
    },
    localStorage,
    sessionStorage: window.sessionStorage,
    navigator: { webdriver: false },
    URLSearchParams,
    FormData: MockFormData,
    Element: class {},
    fetch: async () => ({ ok: true }),
    setTimeout: window.setTimeout,
    clearTimeout() {},
    console,
  };
  vm.runInNewContext(source, context, { filename: 'app.js' });
  context.setConsent(true);
  const enabled = window['ga-disable-G-VP8CWM9B50'];
  context.setConsent(false);
  const revoked = window['ga-disable-G-VP8CWM9B50'];
  context.setConsent(true);
  const regranted = window['ga-disable-G-VP8CWM9B50'];
  return { enabled, revoked, regranted };
}

function runLeadClickScenario({
  consent = 'granted', href, label, hostname = 'logan.loans', search = '', robots = '', pathname = '/',
  sessionStorage = createStorage(), returnStorage = false, localStorageFault = false, sessionStorageFault = false,
  triggerClick = true, eventParams = null,
}) {
  const listeners = new Map();
  const localStorage = createStorage({ ll_consent: consent });
  const window = {
    location: { href: `https://${hostname}${pathname}${search}`, protocol: 'https:', hostname, pathname, search },
    dataLayer: [],
    localStorage,
    sessionStorage,
    matchMedia: () => ({ matches: false }),
    setTimeout: () => 1,
    clearTimeout() {},
  };
  if (localStorageFault) {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('storage unavailable'); } });
  }
  if (sessionStorageFault) {
    Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('session storage unavailable'); } });
  }
  const consentControls = {
    consentAccept: { addEventListener() {} },
    consentDeny: { addEventListener() {} },
  };
  const document = {
    body: { classList: { add() {}, remove() {}, contains() { return false; } }, append() {}, appendChild() {} },
    querySelector: (selector) => selector === 'meta[name="robots"]' && robots
      ? { getAttribute: () => robots }
      : null,
    querySelectorAll: () => [],
    addEventListener(type, listener) {
      listeners.set(type, [...(listeners.get(type) || []), listener]);
    },
    getElementById: (id) => consentControls[id] || null,
    createElement: () => ({ setAttribute() {}, classList: { add() {} } }),
    getElementsByTagName: () => [{ parentNode: { insertBefore() {} } }],
    head: { appendChild() {} },
  };
  const context = {
    window,
    document,
    localStorage,
    sessionStorage,
    navigator: { webdriver: false },
    URLSearchParams,
    FormData: MockFormData,
    Element: class {},
    fetch: async () => ({ ok: true }),
    setTimeout: () => 1,
    clearTimeout() {},
    console,
  };
  vm.runInNewContext(source, context, { filename: 'app.js' });
  const link = {
    innerText: label,
    getAttribute(name) { return name === 'href' ? href : ''; },
  };
  for (const listener of listeners.get('DOMContentLoaded') || []) {
    listener();
  }
  if (triggerClick) {
    for (const listener of listeners.get('click') || []) {
      listener({ target: { closest: () => link } });
    }
  }
  if (eventParams) context.trackEvent('test_event', eventParams);
  const events = window.dataLayer
    .map((entry) => Array.from(entry || []))
    .filter(([command]) => command === 'event')
    .map(([, eventName, payload]) => ({ eventName, payload }));
  const result = JSON.parse(JSON.stringify(events));
  return returnStorage ? { events: result, sessionStorage } : result;
}

for (const formName of ['preapproval', 'general-contact']) {
  const denied = await runFormScenario({ consent: 'denied', formName });
  assert.deepEqual(denied.events, [], `${formName}: no event before consent`);

  const failed = await runFormScenario({ status: 500, formName });
  assert.deepEqual(failed.events, [], `${formName}: no event on failed response`);
  assert.equal(failed.href, 'https://logan.loans/contact', `${formName}: failed response does not redirect`);

  const succeeded = await runFormScenario({ status: 200, formName });
  const eventName = formName === 'preapproval' ? 'preapproval_intake_submit' : 'general_contact_submit';
  assert.deepEqual(succeeded.events.map((event) => event.eventName), [eventName], `${formName}: exactly one success event`);
  assert.equal(succeeded.events[0].payload.form_id, formName === 'preapproval' ? 'preapprovalForm' : 'generalContactForm');
  assert.equal(succeeded.href, './thanks-contact', `${formName}: successful response keeps the confirmation redirect`);
}

assert.deepEqual(runDirectThankYouScenario(), [], 'direct thank-you visit emits no form-success event');
assert.deepEqual(runConsentUpdateScenario(true), ['consent', 'update', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted',
}], 'analytics acceptance leaves every advertising signal denied');
assert.deepEqual(runConsentUpdateScenario(false), ['consent', 'update', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
}], 'analytics decline denies analytics and every advertising signal');
assert.deepEqual(runRevocationScenario(), {
  enabled: false,
  revoked: true,
  regranted: false,
}, 'consent withdrawal and regrant toggle the verified GA disable flag');

const leadClickCases = [
  ['tel:+14808037763', 'Call Logan', 'phone_click', 'phone'],
  ['mailto:logan@forward.loans', 'Email Logan', 'email_click', 'email'],
  ['./apply', 'Get Pre-Approved', 'loan_apply_start', 'application'],
  ['./contact', 'Talk to Logan', 'contact_click', 'contact'],
];
for (const [href, label, eventName, leadChannel] of leadClickCases) {
  const events = runLeadClickScenario({ href, label });
  assert.deepEqual(events, [{
    eventName,
      payload: {
        page_path: '/',
        page_location: 'https://logan.loans/',
        page_referrer: '',
        event_category: 'lead_engagement',
      lead_channel: leadChannel,
    },
  }], `${eventName}: consented lead CTA has a fixed, PII-free payload`);
}
assert.deepEqual(
  runLeadClickScenario({ consent: 'denied', href: 'tel:+14808037763', label: 'Call Logan' }),
  [],
  'lead CTA clicks do not emit analytics before consent',
);
assert.deepEqual(
  runLeadClickScenario({ href: 'tel:+14808037763', label: 'Call Logan', hostname: 'loganloans.netlify.app' }),
  [],
  'preview-host CTA clicks do not emit analytics',
);
assert.deepEqual(
  runLeadClickScenario({ href: 'tel:+14808037763', label: 'Call Logan', search: '?qa=1' }),
  [],
  'QA-session CTA clicks do not emit analytics',
);
assert.deepEqual(
  runLeadClickScenario({ href: 'tel:+14808037763', label: 'Call Logan', robots: 'noindex,nofollow' }),
  [],
  'noindex CTA clicks do not emit analytics',
);
assert.deepEqual(
  runLeadClickScenario({ href: 'tel:+14808037763', label: 'Call Logan', pathname: '/not-a-public-route' }),
  [],
  'unsitemapped canonical-host routes do not emit analytics',
);
assert.deepEqual(
  runLeadClickScenario({ href: 'tel:+14808037763', label: 'Call Logan', localStorageFault: true }),
  [],
  'a throwing storage getter fails closed without emitting analytics',
);
assert.deepEqual(
  runLeadClickScenario({ href: 'tel:+14808037763', label: 'Call Logan', sessionStorageFault: true }),
  [],
  'an unavailable session-storage getter fails closed without emitting analytics',
);
assert.deepEqual(
  runLeadClickScenario({
    href: '', label: '', triggerClick: false,
    eventParams: {
      lead_channel: 'phone',
      page_path: '/apply?email=visitor@example.test',
      page_location: 'https://example.test/?message=private',
      page_referrer: 'https://referrer.test/?phone=4805550100',
      form_value: 'private message',
      email: 'visitor@example.test',
    },
  }),
  [{
    eventName: 'test_event',
    payload: {
      lead_channel: 'phone',
      page_path: '/',
      page_location: 'https://logan.loans/',
      page_referrer: '',
      event_category: 'lead_engagement',
    },
  }],
  'custom event payloads drop caller-supplied URLs, query values, and form data',
);
const qaStorage = createStorage();
const qaLanding = runLeadClickScenario({
  href: 'tel:+14808037763', label: 'Call Logan', search: '?qa=1', sessionStorage: qaStorage, returnStorage: true,
});
assert.deepEqual(qaLanding.events, [], 'QA landing stays analytics-off');
assert.deepEqual(
  runLeadClickScenario({ href: 'tel:+14808037763', label: 'Call Logan', sessionStorage: qaLanding.sessionStorage }),
  [],
  'a QA session remains analytics-off after a same-tab navigation',
);
const policyBlock = source.match(/const PUBLIC_ANALYTICS_PATHS = new Set\(\[([\s\S]*?)\]\);/);
assert.ok(policyBlock, 'public analytics route policy is present');
const policyPaths = [...policyBlock[1].matchAll(/'([^']+)'/g)].map((match) => match[1]).sort();
const sitemapPaths = [...(await readFile(path.join(root, 'sitemap.xml'), 'utf8')).matchAll(/<loc>https:\/\/logan\.loans([^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .sort();
assert.deepEqual(policyPaths, sitemapPaths, 'public analytics route policy exactly matches sitemap.xml');
console.log('Analytics harness passed: consent signals, form failure/success/dedupe, and direct-thank-you paths.');
