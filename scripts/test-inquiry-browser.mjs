// Local-only browser fixtures. Every network request is intercepted; no leads are sent.
// Usage: PLAYWRIGHT_MODULE_PATH=/absolute/path/to/playwright-core node scripts/test-inquiry-browser.mjs [evidence-directory]
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { schemaIdentityIssues } from './schema-identity.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright-core');
const output = resolve(process.argv[2] || '/tmp/logan-inquiry-check');
await mkdir(output, { recursive: true });
const csp = (await readFile(resolve(root, 'netlify.toml'), 'utf8')).match(/Content-Security-Policy = "([^"]+)"/)[1];
const checks = [], errors = [], missing = [], external = [];
function check(name, result) { checks.push({ name, pass: Boolean(result) }); assert.ok(result, name); }
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon' };
const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function fixture({ width = 1440, consent = 'granted', host = 'logan.loans', noindex = false, timeout = false, reducedMotion = 'reduce' } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 960 }, reducedMotion });
  const state = { status: 200, delay: 0, posts: [] };
  await context.addInitScript(({ consent, timeout }) => {
    // Enable consented instrumentation in the fixture, never against a live endpoint.
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    localStorage.setItem('ll_consent', consent);
    if (timeout) {
      const original = window.setTimeout;
      window.setTimeout = (fn, delay, ...args) => original(fn, delay === 15000 ? 50 : delay, ...args);
    }
  }, { consent, timeout });
  await context.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.hostname !== host) {
      external.push({ host: url.hostname, method: request.method(), blocked: true });
      return route.fulfill({ status: 200, body: '', contentType: 'application/javascript' });
    }
    if (request.method() === 'POST') {
      state.posts.push(Object.fromEntries(new URLSearchParams(request.postData() || '')));
      if (state.delay) await new Promise((done) => setTimeout(done, state.delay));
      return route.fulfill({ status: state.status, body: state.status === 200 ? 'Accepted by local fixture' : 'Local failure fixture' }).catch(() => {});
    }
    assert.equal(request.method(), 'GET');
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
const contracts = [
  { name: 'apply', path: '/apply', event: 'loan_form_submit', formId: 'applyForm', destination: '/thanks' },
  { name: 'preapproval', path: '/contact', event: 'preapproval_intake_submit', formId: 'preapprovalForm', destination: '/thanks-contact' },
  { name: 'general-contact', path: '/contact', event: 'general_contact_submit', formId: 'generalContactForm', destination: '/thanks-contact' },
  { name: 'partner-referral', path: '/partners', event: 'partner_referral_submit', formId: 'partnerReferralForm', destination: '/thanks-contact' },
  { name: 'newsletter', path: '/blog', event: 'newsletter_signup', formId: 'newsletterForm', destination: null },
];
async function fill(page, contract) {
  const form = page.locator(`form[name="${contract.name}"]`);
  const values = { name: 'Local Test Visitor', email: 'inquiry-test@example.test', city: 'Phoenix, AZ', message: 'Local fixture question only', brokerage: 'Local Test Agency' };
  for (const [name, value] of Object.entries(values)) {
    const input = form.locator(`[name="${name}"]`);
    if (await input.count() && await input.isVisible()) await input.fill(value);
  }
  const timeline = form.locator('select[name="timeline"]');
  if (await timeline.count() && await timeline.evaluate((el) => el.required)) await timeline.selectOption({ index: 1 });
  return form;
}
const events = (page) => page.evaluate(() => (window.dataLayer || []).filter((entry) => entry[0] === 'event').map((entry) => ({ name: entry[1], params: entry[2] })));

try {
  for (const width of [320, 390, 1440]) {
    const f = await fixture({ width });
    for (const path of ['/', '/investor-loans', '/first-time-buyer', '/refinance', '/relocation', '/contact', '/apply', '/partners', '/blog', '/affordability-calculator', '/meet-logan']) {
      await f.page.goto(f.base + path, { waitUntil: 'networkidle' });
      check(`${path} fits ${width}px`, await f.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      check(`${path} has one main heading ${width}px`, await f.page.locator('h1').count() === 1);
      const schemas = await f.page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((el) => JSON.parse(el.textContent)));
      check(`${path} rendered schema valid ${width}px`, schemaIdentityIssues(schemas, f.base + path).length === 0);
      if (width !== 320 && ['/investor-loans', '/apply', '/partners'].includes(path)) await f.page.screenshot({ path: resolve(output, `${path.slice(1)}-${width}.png`), fullPage: true });
    }
    await f.context.close();
  }

  const intent = await fixture();
  for (const [path, goal, topic] of [['investor-loans', 'purchase-investment', 'investor'], ['first-time-buyer', 'purchase-primary', 'first-time-buyer'], ['refinance', 'refinance', 'refinance'], ['relocation', 'relocation', 'relocation']]) {
    await intent.page.goto(intent.base + '/' + path);
    const graph = await intent.page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.flatMap((el) => JSON.parse(el.textContent)['@graph'] || []));
    check(`${path} declares its service`, graph.some((node) => node['@type'] === 'Service' && node.url.endsWith('/' + path)));
    const link = intent.page.locator(`a[href="./apply?goal=${goal}"]`).first();
    await link.click();
    check(`${path} preserves intent`, await intent.page.locator('#applyForm [name="goal"]').inputValue() === goal);
    await intent.page.goto(intent.base + `/contact?topic=${topic}#question`);
    check(`${path} pre-fills editable question`, (await intent.page.locator('[name="message"]').inputValue()).length > 10 && await intent.page.locator('[name="message"]').isEditable());
    await intent.page.locator('[name="message"]').fill('My existing draft');
    await intent.page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
    check(`${path} preserves a draft on restore`, await intent.page.locator('[name="message"]').inputValue() === 'My existing draft');
  }
  await intent.page.goto(intent.base + '/apply?goal=private-untrusted-value');
  check('Unknown goal ignored', await intent.page.locator('[name="goal"]').inputValue() === '');
  await intent.page.goto(intent.base + '/contact?topic=%3Cscript%3Ebad%3C/script%3E');
  check('Unknown topic ignored', await intent.page.locator('[name="message"]').inputValue() === '');
  await intent.context.close();

  for (const contract of contracts) {
    const f = await fixture();
    await f.page.goto(f.base + contract.path);
    let form = await fill(f.page, contract);
    const button = form.locator('button[type="submit"]');
    f.state.status = 500;
    f.state.delay = 200;
    await button.click();
    check(`${contract.name} locks pending fields`, await form.locator('[name="email"]').isDisabled());
    await form.evaluate((el) => el.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    await form.locator('.formStatus.error').waitFor();
    check(`${contract.name} deduplicates pending submit`, f.state.posts.length === 1);
    check(`${contract.name} retains failed input`, await form.locator('[name="email"]').inputValue() === 'inquiry-test@example.test');
    check(`${contract.name} unlocks for retry`, await button.isEnabled() && await form.locator('[name="email"]').isEditable());
    check(`${contract.name} has no false success`, !(await events(f.page)).some((event) => event.name === contract.event));
    check(`${contract.name} preserves provider contract`, f.state.posts[0]['form-name'] === contract.name && f.state.posts[0].email === 'inquiry-test@example.test');
    if (contract.name !== 'newsletter' && contract.name !== 'general-contact') check(`${contract.name} accepts blank optional phone`, f.state.posts[0].phone === '');
    f.state.status = 200;
    f.state.delay = 0;
    await button.click();
    await form.locator('.formStatus.ok').waitFor();
    const recorded = await events(f.page);
    check(`${contract.name} success exactly once`, recorded.filter((event) => event.name === contract.event).length === 1);
    check(`${contract.name} start and error separated`, recorded.filter((event) => event.name === 'form_start').length === 1 && recorded.filter((event) => event.name === 'form_submit_error').length === 1);
    check(`${contract.name} telemetry excludes applicant values`, !/inquiry-test|Local Test|Phoenix|fixture question/.test(JSON.stringify(recorded)));
    check(`${contract.name} includes fixed form identity`, recorded.every((event) => !event.name.startsWith('form_') || event.params.form_id === contract.formId));
    if (contract.destination) await f.page.waitForURL(f.base + contract.destination);
    else check('Newsletter gets signup confirmation without a promised reply', f.page.url() === f.base + '/blog' && (await form.locator('.formStatus').innerText()).includes('signup request was received'));
    check(`${contract.name} sends only failed attempt plus retry`, f.state.posts.length === 2);
    await f.context.close();
  }

  for (const settings of [{ host: 'localhost' }, { host: 'loganloans.netlify.app' }, { noindex: true }]) {
    const f = await fixture(settings);
    await f.page.goto(f.base + '/contact');
    const form = await fill(f.page, contracts[2]);
    await form.locator('button[type="submit"]').click();
    check(`Preview guard ${JSON.stringify(settings)}`, (await form.locator('.formStatus').innerText()).includes('Nothing was sent') && f.state.posts.length === 0);
    check(`Preview has no success events ${JSON.stringify(settings)}`, (await events(f.page)).length === 0);
    await f.context.close();
  }

  const denied = await fixture({ consent: 'denied' });
  await denied.page.goto(denied.base + '/contact');
  const deniedForm = await fill(denied.page, contracts[2]);
  await deniedForm.locator('button[type="submit"]').click();
  await deniedForm.locator('.formStatus.ok').waitFor();
  check('Essential inquiry works with analytics denied', denied.state.posts.length === 1 && (await events(denied.page)).length === 0);
  await denied.context.close();

  const slow = await fixture({ timeout: true });
  await slow.page.goto(slow.base + '/partners');
  const slowForm = await fill(slow.page, contracts[3]);
  slow.state.delay = 200;
  await slowForm.locator('button[type="submit"]').click();
  await slowForm.locator('.formStatus.error').waitFor();
  check('Timeout preserves request for retry', (await slowForm.locator('.formStatus').innerText()).includes('too long') && await slowForm.locator('[name="email"]').isEditable());
  slow.state.delay = 0;
  await slowForm.locator('button[type="submit"]').click();
  await slowForm.locator('.formStatus.ok').waitFor();
  check('Timeout retry accepted once', (await events(slow.page)).filter((event) => event.name === 'partner_referral_submit').length === 1);
  await slow.context.close();

  const back = await fixture();
  await back.page.goto(back.base + '/contact');
  const backForm = await fill(back.page, contracts[2]);
  back.state.delay = 300;
  await backForm.locator('button[type="submit"]').click();
  await back.page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  check('Restored pending form unlocked with draft preserved', await backForm.locator('[name="email"]').isEditable() && await backForm.locator('[name="email"]').inputValue() === 'inquiry-test@example.test');
  await back.page.waitForTimeout(400);
  check('Abandoned response cannot redirect or report success', back.page.url().endsWith('/contact') && !(await events(back.page)).some((event) => event.name === 'general_contact_submit'));
  back.state.delay = 0;
  await backForm.locator('button[type="submit"]').click();
  await backForm.locator('.formStatus.ok').waitFor();
  await back.page.evaluate(() => {
    window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  check('Restored accepted form resets applicant data', await backForm.locator('[name="email"]').inputValue() === '' && await backForm.locator('button[type="submit"]').isEnabled());
  await back.page.waitForTimeout(800);
  check('Restoration cancels stale success redirect', back.page.url().endsWith('/contact'));
  await back.context.close();
  check('No browser exceptions', errors.length === 0);
  check('No missing local assets', missing.length === 0);
  check('No attempted external writes', external.every((entry) => entry.method === 'GET'));
} finally {
  await browser.close();
  await writeFile(resolve(output, 'browser-results.json'), JSON.stringify({ at: new Date().toISOString(), checks, errors, missing, external, lifecycle: 'PageTransitionEvent fixtures; real back navigation covered separately', productionRequests: 0 }, null, 2) + '\n');
}
console.log(JSON.stringify({ passed: checks.length, errors, missing, productionRequests: 0 }));
