// Local-only browser checks for the 2026-10-27 Forward Loans handoff. Every request is intercepted;
// nothing reaches Netlify or forward.loans, and no lead is sent.
// Usage: PLAYWRIGHT_MODULE_PATH=/absolute/path/to/playwright-core node scripts/test-handoff-browser.mjs [evidence-directory]
// Requires `bash scripts/build-site.sh` first (serves dist/) and installed Google Chrome.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { schemaIdentityIssues } from './schema-identity.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright-core');
const output = resolve(process.argv[2] || '/tmp/logan-handoff-check');
await mkdir(output, { recursive: true });
const FORWARD = 'https://forward.loans/loan-officer/logan-sullivan/';
const csp = (await readFile(resolve(root, '_headers'), 'utf8')).match(/Content-Security-Policy: ([^\n]+)/)[1].trim();
const checks = [], errors = [], missing = [], external = [];
function check(name, result) { checks.push({ name, pass: Boolean(result) }); assert.ok(result, name); }
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon' };
const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function fixture({ width = 1440, consent = 'granted', host = 'logan.loans', noindex = false } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
  const state = { status: 200, delay: 0, posts: [] };
  await context.addInitScript(({ consent }) => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    localStorage.setItem('ll_consent', consent);
  }, { consent });
  await context.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname !== host) {
      external.push({ url: url.href, method: request.method(), navigation: request.isNavigationRequest() });
      return route.fulfill({ status: 200, body: request.isNavigationRequest() ? '<title>external stub</title>' : '', contentType: request.isNavigationRequest() ? 'text/html' : 'application/javascript' });
    }
    if (request.method() === 'POST') {
      state.posts.push(Object.fromEntries(new URLSearchParams(request.postData() || '')));
      if (state.delay) await new Promise((done) => setTimeout(done, state.delay));
      return route.fulfill({ status: state.status, body: 'Local fixture' }).catch(() => {});
    }
    let path = decodeURIComponent(url.pathname);
    if (path === '/') path = '/index.html';
    else if (!extname(path)) path += '.html';
    const file = resolve(root, 'dist', '.' + path);
    assert.ok(file.startsWith(resolve(root, 'dist') + '/'));
    try {
      let body = await readFile(file);
      if (noindex && path.endsWith('.html')) body = Buffer.from(body.toString().replace(/<meta name="robots"[^>]+>/, '<meta name="robots" content="noindex,follow">'));
      return route.fulfill({ status: 200, body, contentType: types[extname(path)] || 'application/octet-stream', headers: { 'content-security-policy': csp } });
    } catch {
      missing.push(path);
      return route.fulfill({ status: 404, body: 'Missing local fixture' });
    }
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  return { context, page, state, base: `https://${host}` };
}
const events = (page) => page.evaluate(() => (window.dataLayer || []).filter((entry) => entry[0] === 'event').map((entry) => ({ name: entry[1], params: entry[2] })));
const banned = /11201|85028|Tatum Blvd|same[-\s]day|same business day|within hours|\b24h\b|24 hours|linkedin|tiktok/i;
const ctaLabel = /pre-?approv|pre-?approve|pre-?qualif|apply|application|start the form|ask a question|send a message|work with logan/i;

try {
  for (const width of [390, 1440]) {
    const f = await fixture({ width });
    for (const path of ['/', '/contact', '/apply', '/programs', '/investor-loans', '/partners', '/disclosures', '/terms']) {
      await f.page.goto(f.base + path, { waitUntil: 'networkidle' });
      const tag = `${path} @${width}px`;
      check(`${tag} fits viewport`, await f.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      check(`${tag} has one h1`, await f.page.locator('h1').count() === 1);
      const schemas = await f.page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((el) => JSON.parse(el.textContent)));
      check(`${tag} schema identity valid`, schemaIdentityIssues(schemas, f.base + path).length === 0);
      const html = await f.page.content();
      const text = await f.page.evaluate(() => document.body.innerText);
      check(`${tag} has no address, speed promise, or non-Instagram social`, !banned.test(text) && !banned.test(html.replace(/<style[\s\S]*?<\/style>/g, '')));
      const links = await f.page.locator('a[href]').evaluateAll((els) => els.map((el) => ({ href: el.getAttribute('href'), label: (el.innerText || el.getAttribute('aria-label') || '').trim(), rel: el.getAttribute('rel') || '' })));
      check(`${tag} has no on-site apply or topic-prefill links`, !links.some((l) => /^(?:\.\/|\/)?apply(?:[?#]|$)|contact\?topic=/.test(l.href)));
      const ctas = links.filter((l) => ctaLabel.test(l.label) && !/^tel:|^mailto:/.test(l.href) && !/blog-preapproval-guide/.test(l.href));
      check(`${tag} every apply/pre-approval CTA goes to Forward with noopener`, ctas.length > 0 && ctas.every((l) => l.href === FORWARD && /noopener/.test(l.rel)));
      check(`${tag} has no on-site application/contact forms`, await f.page.locator('form[name="apply"], form[name="preapproval"], form[name="general-contact"]').count() === 0);
      if (['/', '/contact', '/apply', '/programs', '/investor-loans'].includes(path)) {
        await f.page.screenshot({ path: resolve(output, `${path === '/' ? 'home' : path.slice(1)}-${width}.png`), fullPage: true });
      }
    }
    const footer = await f.page.locator('footer .ftrFine').innerText();
    check(`Footer licensing line exact @${width}px`, footer.includes('Logan Sullivan NMLS #2466872 · Forward Loans NMLS #2006640 · Arizona Mortgage Broker License #MB-1012025 · Equal Housing Lender'));
    await f.context.close();
  }

  // The real visible primary CTA leaves for Forward in the same tab and is measured as an application start.
  for (const width of [390, 1440]) {
    const f = await fixture({ width });
    await f.page.goto(f.base + '/investor-loans', { waitUntil: 'networkidle' });
    const cta = width === 390 ? f.page.locator(`main a.btn[href="${FORWARD}"]`).first() : f.page.locator('.navCta a.btnPrimary');
    await cta.click();
    await f.page.waitForURL(FORWARD);
    check(`Primary CTA navigates same tab to Forward @${width}px`, f.page.url() === FORWARD && f.context.pages().length === 1);
    await f.context.close();
  }
  const measured = await fixture();
  await measured.page.goto(measured.base + '/programs', { waitUntil: 'networkidle' });
  await measured.page.evaluate(() => document.addEventListener('click', (e) => e.preventDefault()));
  await measured.page.locator('.navCta a.btnPrimary').click();
  check('Forward CTA click emits PII-free loan_apply_start', (await events(measured.page)).some((e) => e.name === 'loan_apply_start' && e.params.lead_channel === 'application'));
  await measured.context.close();

  // Remaining on-site forms (not applications) keep their provider contracts.
  const contracts = [
    { name: 'partner-referral', path: '/partners', event: 'partner_referral_submit', formId: 'partnerReferralForm', destination: '/thanks-contact' },
    { name: 'newsletter', path: '/blog', event: 'newsletter_signup', formId: 'newsletterForm', destination: null },
  ];
  async function fill(page, contract) {
    const form = page.locator(`form[name="${contract.name}"]`);
    for (const [name, value] of Object.entries({ name: 'Local Test Visitor', email: 'handoff-test@example.test', brokerage: 'Local Test Agency' })) {
      const input = form.locator(`[name="${name}"]`);
      if (await input.count() && await input.isVisible()) await input.fill(value);
    }
    return form;
  }
  for (const contract of contracts) {
    const f = await fixture();
    await f.page.goto(f.base + contract.path);
    const form = await fill(f.page, contract);
    const button = form.locator('button[type="submit"]');
    f.state.status = 500;
    f.state.delay = 200;
    await button.click();
    await form.evaluate((el) => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    await form.locator('.formStatus.error').waitFor();
    check(`${contract.name} deduplicates pending submit`, f.state.posts.length === 1);
    check(`${contract.name} retains input after failure`, await form.locator('[name="email"]').inputValue() === 'handoff-test@example.test');
    check(`${contract.name} preserves exact form-name`, f.state.posts[0]['form-name'] === contract.name);
    f.state.status = 200;
    f.state.delay = 0;
    await button.click();
    await form.locator('.formStatus.ok').waitFor();
    const recorded = await events(f.page);
    check(`${contract.name} success exactly once`, recorded.filter((e) => e.name === contract.event).length === 1);
    check(`${contract.name} telemetry excludes entered values`, !/handoff-test|Local Test/.test(JSON.stringify(recorded)));
    check(`${contract.name} fixed form identity`, recorded.every((e) => !e.name.startsWith('form_') || e.params.form_id === contract.formId));
    if (contract.destination) await f.page.waitForURL(f.base + contract.destination);
    await f.context.close();
  }

  for (const settings of [{ host: 'localhost' }, { host: 'loganloans.netlify.app' }, { noindex: true }]) {
    const f = await fixture(settings);
    await f.page.goto(f.base + '/partners');
    const form = await fill(f.page, contracts[0]);
    await form.locator('button[type="submit"]').click();
    check(`Preview guard ${JSON.stringify(settings)}`, (await form.locator('.formStatus').innerText()).includes('Nothing was sent') && f.state.posts.length === 0);
    await f.context.close();
  }

  // Back/forward restore: silent when nothing was sent; recovers when a send was interrupted.
  const back = await fixture();
  await back.page.goto(back.base + '/partners');
  const backForm = await fill(back.page, contracts[0]);
  const before = await backForm.locator('.formStatus').innerText();
  await back.page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  check('Restore of an unsent form shows no "ready" message', (await backForm.locator('.formStatus').innerText()) === before);
  back.state.delay = 300;
  await backForm.locator('button[type="submit"]').click();
  await back.page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  check('Restore of an interrupted send unlocks and says so', await backForm.locator('[name="email"]').isEditable() && (await backForm.locator('.formStatus').innerText()).includes('ready'));
  await back.page.waitForTimeout(400);
  check('Abandoned response cannot redirect', back.page.url().endsWith('/partners'));
  await back.context.close();

  check('No browser exceptions', errors.length === 0);
  check('No missing local assets', missing.length === 0);
  check('No external writes (forward.loans only navigated, never posted)', external.every((entry) => entry.method === 'GET'));
} finally {
  await browser.close();
  await writeFile(resolve(output, 'browser-results.json'), JSON.stringify({ at: new Date().toISOString(), checks, errors, missing, external: external.filter((e) => e.navigation), productionRequests: 0 }, null, 2) + '\n');
}
console.log(JSON.stringify({ passed: checks.length, errors, missing, productionRequests: 0 }));
