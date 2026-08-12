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
  const location = { href: 'https://logan.loans/contact', pathname: '/contact', search: '' };
  const localStorage = createStorage({ ll_consent: consent });
  const window = {
    location,
    dataLayer: [],
    localStorage,
    sessionStorage: createStorage(),
    matchMedia: () => ({ matches: false }),
  };
  const document = {
    body: { classList: { add() {}, remove() {}, contains() { return false; } }, append() {} },
    querySelector: (selector) => forms[selector] || null,
    querySelectorAll: () => [],
    addEventListener() {},
    getElementById: () => null,
    createElement: () => ({ setAttribute() {}, classList: { add() {} } }),
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
    setTimeout: (callback) => {
      callback();
      return 1;
    },
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
    location: { href: 'https://logan.loans/thanks-contact', pathname: '/thanks-contact', search: '' },
    dataLayer: [],
    localStorage,
    sessionStorage: createStorage(),
    matchMedia: () => ({ matches: false }),
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
    location: { href: 'https://logan.loans/', pathname: '/', search: '' },
    dataLayer: [],
    localStorage,
    sessionStorage: createStorage(),
    matchMedia: () => ({ matches: false }),
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
console.log('Analytics harness passed: consent signals, form failure/success/dedupe, and direct-thank-you paths.');
