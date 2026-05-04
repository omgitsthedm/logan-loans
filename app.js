// Logan Loans — app.js
// Replace TRACKING_GA4_ID and TRACKING_GTM_ID with real values when Logan provides them.

// ─── Tracking Config ───────────────────────────────────────────────────────
const TRACKING = {
  ga4: '',        // e.g. 'G-XXXXXXXXXX' — replace when Logan provides
  gtm: '',        // e.g. 'GTM-XXXXXXX'  — replace when Logan provides
  adsApply: '',   // Google Ads conversion ID for apply form submit
  adsContact: '', // Google Ads conversion ID for contact form submit
};

// ─── UTM Capture ───────────────────────────────────────────────────────────
// Capture UTM params + click IDs on landing, persist to sessionStorage,
// then auto-fill hidden inputs on any form with data-utm-form attribute.
(function captureUTM() {
  const params = new URLSearchParams(window.location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'];
  keys.forEach(k => {
    const v = params.get(k);
    if (v) sessionStorage.setItem('ll_' + k, v);
  });
})();

function fillUTMInputs(form) {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid'];
  keys.forEach(k => {
    const val = sessionStorage.getItem('ll_' + k) || '';
    const el = form.querySelector(`[name="${k}"]`);
    if (el) el.value = val;
  });
}

// ─── Consent Banner ────────────────────────────────────────────────────────
// GDPR-compliant: deny by default, grant on accept, persist to localStorage.
const CONSENT_KEY = 'll_consent';

function getConsent() {
  return localStorage.getItem(CONSENT_KEY);
}

function setConsent(granted) {
  localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
  const banner = document.getElementById('consentBanner');
  if (banner) {
    banner.setAttribute('aria-hidden', 'true');
    banner.style.transform = 'translateY(120%)';
    setTimeout(() => banner.remove(), 400);
  }
  if (granted) loadTracking();
}

function loadTracking() {
  if (!TRACKING.ga4 || typeof window.__trackingLoaded !== 'undefined') return;
  window.__trackingLoaded = true;

  if (TRACKING.gtm) {
    (function(w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l !== 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', TRACKING.gtm);
  } else if (TRACKING.ga4) {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + TRACKING.ga4;
    document.head.appendChild(s);
    s.onload = function() {
      gtag('js', new Date());
      gtag('config', TRACKING.ga4, { anonymize_ip: true });
    };
  }
}

function buildConsentBanner() {
  if (navigator.webdriver) return; // skip in Lighthouse
  if (getConsent() !== null) {
    if (getConsent() === 'granted') loadTracking();
    return;
  }

  const banner = document.createElement('div');
  banner.id = 'consentBanner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie preferences');
  banner.innerHTML = `
    <div class="consentInner">
      <p class="consentText">We use cookies to understand how visitors use our site and improve your experience. <a href="./privacy.html" class="uLink">Privacy Policy</a></p>
      <div class="consentActions">
        <button type="button" class="btn btnSecondary consentBtn" id="consentDeny" style="padding:10px 20px;font-size:15px;">Decline</button>
        <button type="button" class="btn btnPrimary consentBtn" id="consentAccept" style="padding:10px 20px;font-size:15px;">Accept</button>
      </div>
    </div>
  `;
  Object.assign(banner.style, {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    zIndex: '1000',
    background: 'rgba(251,247,239,0.98)',
    borderTop: '1px solid var(--border)',
    padding: '16px 20px',
    boxShadow: '0 -8px 32px rgba(22,90,63,0.12)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transform: 'translateY(0)',
    transition: 'transform 400ms cubic-bezier(0.2,0.8,0.2,1)',
  });

  const style = document.createElement('style');
  style.textContent = `.consentInner{max-width:1120px;margin:0 auto;display:flex;align-items:center;gap:16px;flex-wrap:wrap;justify-content:space-between}.consentText{margin:0;font-size:15px;color:var(--muted);flex:1;min-width:200px}.consentActions{display:flex;gap:10px;flex-shrink:0}`;
  document.head.appendChild(style);

  document.body.appendChild(banner);

  document.getElementById('consentAccept').addEventListener('click', () => setConsent(true));
  document.getElementById('consentDeny').addEventListener('click', () => setConsent(false));
}

document.addEventListener('DOMContentLoaded', buildConsentBanner);

// ─── Drawer Navigation ─────────────────────────────────────────────────────
const navToggle = document.querySelector('[data-nav-toggle]');
const drawer = document.querySelector('[data-drawer]');
const drawerClose = document.querySelector('[data-drawer-close]');

function openDrawer() {
  if (!drawer) return;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  drawer.removeAttribute('inert');
  navToggle?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  drawerClose?.focus();
}

function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('inert', '');
  navToggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  navToggle?.focus();
}

if (drawer) drawer.setAttribute('inert', '');

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  expanded ? closeDrawer() : openDrawer();
});
drawerClose?.addEventListener('click', closeDrawer);
drawer?.addEventListener('click', (e) => {
  if (e.target === drawer) closeDrawer();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});

// ─── Section Reveal ────────────────────────────────────────────────────────
const sections = document.querySelectorAll('[data-observe]');
if (sections.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  sections.forEach(s => io.observe(s));
}

// ─── Animated Counters ─────────────────────────────────────────────────────
// Reads data-to attribute — never parses textContent.
function animateCounters(root) {
  root.querySelectorAll('[data-to]').forEach(el => {
    const target = parseFloat(el.getAttribute('data-to'));
    if (isNaN(target)) return;
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (elapsed < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

if ('IntersectionObserver' in window) {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounters(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-counter-group]').forEach(el => counterObs.observe(el));
}

// ─── Translator Toggle ─────────────────────────────────────────────────────
const toggle = document.querySelector('[data-toggle]');
const btnPlain = document.querySelector('#mode-plain');
const btnTerms = document.querySelector('#mode-terms');
const tLeft = document.querySelector('[data-left]');
const tRight = document.querySelector('[data-right]');

const PAIRS = [
  { plainL: "Cash to close", termsL: "Cash to close (down payment + closing costs)", plainR: "What you actually bring to the table", termsR: "Down payment, prepaids, escrows, lender fees" },
  { plainL: "Pre-approval", termsL: "Automated underwriting + document validation", plainR: "A strong offer signal", termsR: "Credit, income, assets reviewed for an approval range" },
  { plainL: "Rate talk", termsL: "Rate, APR, points, and pricing", plainR: "The real cost of the loan", termsR: "APR includes fees, points change pricing" },
  { plainL: "Timeline", termsL: "Clear-to-close milestones", plainR: "What happens next", termsR: "Docs, appraisal, underwriting, final approval" }
];

let idx = 0;
let mode = "plain";

function setText(newMode) {
  mode = newMode;
  if (!toggle || !tLeft || !tRight) return;
  const pair = PAIRS[idx % PAIRS.length];
  const nextLeft = mode === "plain" ? pair.plainL : pair.termsL;
  const nextRight = mode === "plain" ? pair.plainR : pair.termsR;
  [tLeft, tRight].forEach(el => el.classList.add('fadeOut'));
  setTimeout(() => {
    tLeft.textContent = nextLeft;
    tRight.textContent = nextRight;
    [tLeft, tRight].forEach(el => { el.classList.remove('fadeOut'); el.classList.add('fadeIn'); });
  }, 190);
}

function setMode(newMode) {
  if (!toggle) return;
  toggle.dataset.mode = newMode === "terms" ? "terms" : "plain";
  btnPlain?.setAttribute('aria-selected', newMode === "plain" ? "true" : "false");
  btnTerms?.setAttribute('aria-selected', newMode === "terms" ? "true" : "false");
  setText(newMode);
}

btnPlain?.addEventListener('click', () => setMode("plain"));
btnTerms?.addEventListener('click', () => setMode("terms"));
document.querySelector('[data-next-pair]')?.addEventListener('click', () => { idx++; setText(mode); });
setMode("plain");

// ─── FAQ Accordion ─────────────────────────────────────────────────────────
document.querySelectorAll('[data-faq-btn]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faqItem');
    const panel = item.querySelector('.faqPanel');
    const icon = item.querySelector('.faqIcon');
    const expanded = btn.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faqItem').forEach((other) => {
      if (other !== item) {
        other.querySelector('[data-faq-btn]')?.setAttribute('aria-expanded', 'false');
        const p = other.querySelector('.faqPanel');
        const i = other.querySelector('.faqIcon');
        if (p) p.style.maxHeight = '0px';
        if (i) i.textContent = '+';
      }
    });

    btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    if (!expanded) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
      if (icon) icon.textContent = '–';
    } else {
      panel.style.maxHeight = '0px';
      if (icon) icon.textContent = '+';
    }
  });
});

// ─── Form Handling ─────────────────────────────────────────────────────────
// Safe submit handler — scoped to a specific form, never uses global click handlers.
function setupForm(formId, statusId, opts = {}) {
  const form = document.querySelector(formId);
  const statusEl = document.querySelector(statusId);
  if (!form) return;

  fillUTMInputs(form);

  const nameEl = form.querySelector('[name="name"]');
  const emailEl = form.querySelector('[name="email"]');
  const phoneEl = form.querySelector('[name="phone"]');

  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim()); }
  function isPhone(v) { return (v || '').trim().length === 0 || /^[0-9\-\+\(\)\s\.]{7,}$/.test((v || '').trim()); }

  function updateStatus(ok, msg) {
    if (!statusEl) return;
    statusEl.classList.toggle('ok', !!ok);
    const msgEl = statusEl.querySelector('[data-msg]');
    if (msgEl) msgEl.textContent = msg;
  }

  function fieldHints() {
    if (!nameEl || !emailEl) return;
    const nameOk = nameEl.value.trim().length >= 2;
    const emailOk = isEmail(emailEl.value);
    const phoneOk = phoneEl ? isPhone(phoneEl.value) : true;
    if (nameOk && emailOk && phoneOk) {
      updateStatus(true, "Looks good. When you're ready, hit send.");
    } else {
      updateStatus(false, "No stress. Ballpark info is fine. We'll fill the gaps together.");
    }
  }

  [nameEl, emailEl, phoneEl].forEach(el => el?.addEventListener('input', fieldHints));
  fieldHints();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameOk = nameEl?.value.trim().length >= 2;
    const emailOk = isEmail(emailEl?.value || '');
    const phoneOk = phoneEl ? isPhone(phoneEl.value) : true;

    if (!nameOk) { nameEl?.focus(); updateStatus(false, "What should Logan call you?"); return; }
    if (!emailOk) { emailEl?.focus(); updateStatus(false, "That email looks a bit off. Try again?"); return; }
    if (phoneEl && !phoneOk) { phoneEl?.focus(); updateStatus(false, "Phone can be blank, or a standard number format."); return; }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent || "Send";
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

    const formData = new FormData(form);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString(),
    }).then(response => {
      if (response.ok) {
        const redirect = opts.redirect || './thanks-contact.html';
        window.location.href = redirect;
      } else {
        throw new Error('Network response was not ok');
      }
    }).catch(() => {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
      updateStatus(false, "Something went wrong. Please try calling (480) 803-7763 directly.");
    });
  });
}

setupForm('#contactForm', '#formStatus', { redirect: './thanks-contact.html' });
setupForm('#applyForm', '#applyStatus', { redirect: './thanks.html' });

// ─── Instagram Feed ─────────────────────────────────────────────────────────
async function renderInstagram() {
  const root = document.getElementById('instagram');
  if (!root) return;
  try {
    const res = await fetch('./data/instagram.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('not found');
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items.slice(0, 6) : [];
    if (!items.length) throw new Error('empty');
    root.innerHTML = items.map((it) => {
      const href = it.url || data.profile_url || 'https://www.instagram.com/logan.loans';
      return `<a class="instaCard" href="${href}" target="_blank" rel="noopener" aria-label="${it.alt || 'Instagram post'}"><img src="${it.image}" alt="${it.alt || 'Logan Loans Instagram'}" loading="lazy" decoding="async"/></a>`;
    }).join('');
  } catch {
    root.innerHTML = `<div class="card" style="grid-column:1/-1"><p class="cardText">Follow <a class="uLink" href="https://www.instagram.com/logan.loans" target="_blank" rel="noopener">@logan.loans</a> on Instagram for deal updates and Arizona market insights.</p></div>`;
  }
}

document.addEventListener('DOMContentLoaded', renderInstagram);
