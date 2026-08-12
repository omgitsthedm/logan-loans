// Logan Loans — app.js
// Tracking is active. GA4 is direct-loaded after consent; GTM container is prepared for a later switch if needed.

// ─── Tracking Config ───────────────────────────────────────────────────────
const TRACKING = {
  ga4: 'G-VP8CWM9B50', // Little Fight-managed Logan Loans GA4
  gtm: '',             // GTM-MTWF64T2 is ready, but direct GA4 is active to avoid duplicate firing
  adsApply: '',        // Google Ads conversion ID for apply form submit
  adsContact: '',      // Google Ads conversion ID for contact form submit
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

function ensureGoogleConsentLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  return window.gtag;
}

function updateGoogleConsent(granted) {
  const gtag = ensureGoogleConsentLayer();
  const analyticsState = granted ? 'granted' : 'denied';
  gtag('consent', 'update', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: analyticsState,
  });
}

function setConsent(granted) {
  localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
  const banner = document.getElementById('consentBanner');
  if (banner) {
    banner.setAttribute('aria-hidden', 'true');
    banner.classList.add('is-leaving');
    document.body.classList.remove('has-consent-banner');
    setTimeout(() => banner.remove(), 240);
  }
  updateGoogleConsent(granted);
  if (granted) loadTracking();
}

function trackEvent(eventName, params = {}) {
  if (getConsent() !== 'granted') return false;
  const safeParams = Object.assign({
    page_path: window.location.pathname,
    event_category: 'lead_engagement',
  }, params);
  const gtag = ensureGoogleConsentLayer();
  gtag('event', eventName, safeParams);
  return true;
}

function loadTracking() {
  if (!TRACKING.ga4 || typeof window.__trackingLoaded !== 'undefined') return;
  updateGoogleConsent(true);
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
    const gtag = ensureGoogleConsentLayer();
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
  const storedConsent = getConsent();
  if (storedConsent !== null) {
    updateGoogleConsent(storedConsent === 'granted');
    if (storedConsent === 'granted') loadTracking();
    return;
  }

  const banner = document.createElement('div');
  banner.id = 'consentBanner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie preferences');
  banner.innerHTML = `
    <div class="consentInner">
      <p class="consentText">We use cookies to understand how visitors use our site and improve your experience. <a href="./privacy" class="uLink">Privacy Policy</a></p>
      <div class="consentActions">
        <button type="button" class="btn btnSecondary consentBtn" id="consentDeny">Decline</button>
        <button type="button" class="btn btnPrimary consentBtn" id="consentAccept">Accept</button>
      </div>
    </div>
  `;
  document.body.classList.add('has-consent-banner');
  document.body.appendChild(banner);

  document.getElementById('consentAccept').addEventListener('click', () => setConsent(true));
  document.getElementById('consentDeny').addEventListener('click', () => setConsent(false));
}

document.addEventListener('DOMContentLoaded', buildConsentBanner);

function setupConversionClickTracking() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    const label = (link.innerText || link.getAttribute('aria-label') || '').trim().slice(0, 80);
    const combined = (href + ' ' + label).toLowerCase();

    if (href.startsWith('tel:')) return trackEvent('phone_click', { link_url: href });
    if (href.startsWith('mailto:')) return trackEvent('email_click', { link_url: href });
    if (/\/apply|pre.?approved|pre.?approval|loan application/.test(combined)) {
      return trackEvent('loan_apply_start', { link_url: href });
    }
    if (/contact|consult|quote|question|talk to logan/.test(combined)) {
      return trackEvent('contact_click', { link_url: href });
    }
  }, true);
}

document.addEventListener('DOMContentLoaded', setupConversionClickTracking);

// ─── Context-aware Mobile Actions ─────────────────────────────────────────
// Keep the global action bar available between tasks, but move it out of the
// way while someone is completing a form or working inside a calculator.
function setupMobileBarSuppression() {
  const bar = document.querySelector('.mobileBar');
  const zones = Array.from(document.querySelectorAll('[data-mobile-bar-suppress]'));
  const intro = document.querySelector(
    '.home-page .hero, .storyFrame, .calcHero, .toolsHero',
  );
  if (!bar || (!zones.length && !intro)) return;

  const focusIsInsideZone = () => (
    document.activeElement instanceof Element
    && Boolean(document.activeElement.closest('[data-mobile-bar-suppress]'))
  );
  const zoneIsVisible = (zone) => {
    const rect = zone.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight - 88;
  };
  const syncBar = () => {
    const introHasNotPassed = Boolean(
      intro && intro.getBoundingClientRect().bottom > 0,
    );
    const shouldHide = (
      introHasNotPassed
      || zones.some(zoneIsVisible)
      || focusIsInsideZone()
    );
    bar.classList.toggle('is-context-hidden', shouldHide);
    bar.toggleAttribute('inert', shouldHide);
  };
  let syncQueued = false;
  const queueSync = () => {
    if (syncQueued) return;
    syncQueued = true;
    window.requestAnimationFrame(() => {
      syncQueued = false;
      syncBar();
    });
  };

  syncBar();
  window.addEventListener('scroll', queueSync, { passive: true });
  window.addEventListener('resize', queueSync);
  document.addEventListener('focusin', syncBar);
  document.addEventListener('focusout', () => {
    window.setTimeout(queueSync, 0);
  });
}

document.addEventListener('DOMContentLoaded', setupMobileBarSuppression);

// ─── Drawer Navigation ─────────────────────────────────────────────────────
const navToggle = document.querySelector('[data-nav-toggle]');
const drawer = document.querySelector('[data-drawer]');
const drawerClose = document.querySelector('[data-drawer-close]');
let drawerReturnFocus = null;

function getDrawerFocusables() {
  if (!drawer) return [];
  return Array.from(drawer.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter((element) => !element.hidden && element.getClientRects().length);
}

function openDrawer() {
  if (!drawer) return;
  drawerReturnFocus = document.activeElement;
  drawer.classList.add('is-open');
  drawer.removeAttribute('inert');
  navToggle?.setAttribute('aria-expanded', 'true');
  document.body.classList.add('drawer-open');
  document.body.style.overflow = 'hidden';
  drawerClose?.focus();
}

function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('inert', '');
  navToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('drawer-open');
  document.body.style.overflow = '';
  const returnTarget = drawerReturnFocus instanceof HTMLElement ? drawerReturnFocus : navToggle;
  returnTarget?.focus();
  drawerReturnFocus = null;
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
  if (!drawer?.classList.contains('is-open')) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeDrawer();
    return;
  }
  if (e.key !== 'Tab') return;
  const focusables = getDrawerFocusables();
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
drawer?.querySelectorAll('a[href]').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('drawer-open');
    document.body.style.overflow = '';
  });
});

// ─── Section Reveal ────────────────────────────────────────────────────────
const sections = document.querySelectorAll('[data-observe]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (sections.length && 'IntersectionObserver' in window && !reducedMotion) {
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top < window.innerHeight * 1.15) {
      section.classList.add('is-visible');
    }
  });
  document.documentElement.classList.add('motion-ready');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  sections.forEach((section) => {
    if (!section.classList.contains('is-visible')) io.observe(section);
  });
} else {
  sections.forEach((section) => section.classList.add('is-visible'));
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
    if (reducedMotion) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }
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

// ─── FAQ Accordion + Find-an-Answer ────────────────────────────────────────
const faqItems = Array.from(document.querySelectorAll('.faqItem'));
const isFAQAnswerLibrary = document.body.classList.contains('faq-page');

function closeFAQ(item) {
  const button = item?.querySelector('[data-faq-btn]');
  const panel = item?.querySelector('.faqPanel');
  const icon = item?.querySelector('.faqIcon');
  button?.setAttribute('aria-expanded', 'false');
  if (panel) {
    panel.style.maxHeight = '0px';
    panel.setAttribute('aria-hidden', 'true');
  }
  if (icon) icon.textContent = '+';
}

function openFAQ(item, { exclusive = true } = {}) {
  if (!item) return;
  if (exclusive) faqItems.forEach((other) => {
    if (other !== item) closeFAQ(other);
  });
  const button = item.querySelector('[data-faq-btn]');
  const panel = item.querySelector('.faqPanel');
  const icon = item.querySelector('.faqIcon');
  button?.setAttribute('aria-expanded', 'true');
  if (panel) {
    panel.setAttribute('aria-hidden', 'false');
    panel.style.maxHeight = isFAQAnswerLibrary ? 'none' : panel.scrollHeight + 'px';
  }
  if (icon) icon.textContent = '−';
}

faqItems.forEach((item) => {
  const button = item.querySelector('[data-faq-btn]');
  const panel = item.querySelector('.faqPanel');
  if (button && panel) {
    const panelId = panel.id || `faq-answer-${faqItems.indexOf(item) + 1}`;
    panel.id = panelId;
    button.setAttribute('aria-controls', panelId);
  }
  if (isFAQAnswerLibrary) {
    openFAQ(item, { exclusive: false });
  } else {
    closeFAQ(item);
  }
  button?.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    expanded ? closeFAQ(item) : openFAQ(item);
  });
});

function setupFAQSearch() {
  const search = document.querySelector('[data-faq-search]');
  if (!search || !faqItems.length) return;
  const result = document.querySelector('[data-faq-result]');
  const clear = document.querySelector('[data-faq-clear]');
  const categoryNav = document.querySelector('[data-faq-categories]');
  const groups = Array.from(document.querySelectorAll('.faq'));
  const normalise = (value) => String(value || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

  function filterFAQ(value, { openFirst = false } = {}) {
    const query = normalise(value);
    const terms = query.split(' ').filter(Boolean);
    let matches = 0;
    let firstMatch = null;

    faqItems.forEach((item) => {
      const haystack = normalise(item.textContent);
      const matched = !terms.length || terms.every((term) => haystack.includes(term));
      item.hidden = !matched;
      if (matched) {
        matches += 1;
        if (!firstMatch) firstMatch = item;
        if (isFAQAnswerLibrary) openFAQ(item, { exclusive: false });
      } else {
        closeFAQ(item);
      }
    });

    groups.forEach((group) => {
      const visibleItems = Array.from(group.querySelectorAll('.faqItem')).some((item) => !item.hidden);
      group.hidden = !visibleItems;
      const heading = group.previousElementSibling;
      if (heading?.matches('h2')) heading.hidden = !visibleItems;
    });

    if (categoryNav) categoryNav.hidden = Boolean(terms.length);
    if (clear) clear.hidden = !terms.length;
    if (result) {
      result.textContent = terms.length
        ? (matches === 1 ? '1 answer found.' : `${matches} answers found.`)
        : `${faqItems.length} plain-English answers.`;
    }
    if (openFirst && firstMatch) openFAQ(firstMatch, { exclusive: !isFAQAnswerLibrary });
  }

  search.addEventListener('input', () => filterFAQ(search.value));
  clear?.addEventListener('click', () => {
    search.value = '';
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    filterFAQ('');
    search.focus();
  });

  const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
  search.value = initialQuery;
  filterFAQ(initialQuery, { openFirst: Boolean(initialQuery) });
}

document.addEventListener('DOMContentLoaded', setupFAQSearch);

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
  function isPhone(v, required = false) {
    const value = (v || '').trim();
    return required ? /^[0-9\-\+\(\)\s\.]{7,}$/.test(value) : value.length === 0 || /^[0-9\-\+\(\)\s\.]{7,}$/.test(value);
  }

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
    const phoneOk = phoneEl ? isPhone(phoneEl.value, phoneEl.required) : true;
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
    if (form.dataset.submitting === 'true') return;
    const nameOk = nameEl?.value.trim().length >= 2;
    const emailOk = isEmail(emailEl?.value || '');
    const phoneOk = phoneEl ? isPhone(phoneEl.value, phoneEl.required) : true;

    if (!nameOk) { nameEl?.focus(); updateStatus(false, "What should Logan call you?"); return; }
    if (!emailOk) { emailEl?.focus(); updateStatus(false, "That email looks a bit off. Try again?"); return; }
    if (phoneEl && !phoneOk) { phoneEl?.focus(); updateStatus(false, "Phone can be blank, or a standard number format."); return; }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent || "Send";
    form.dataset.submitting = 'true';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.textContent = "Sending...";
    }

    const formData = new FormData(form);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString(),
    }).then(response => {
      if (response.ok) {
        const redirect = opts.redirect || './thanks-contact';
        let didRedirect = false;
        const go = () => {
          if (didRedirect) return;
          didRedirect = true;
          window.location.href = redirect;
        };
        trackEvent(opts.eventName || 'form_submit', {
          form_id: form.id || 'form',
          event_callback: go,
          event_timeout: 600,
        });
        setTimeout(go, 700);
      } else {
        throw new Error('Network response was not ok');
      }
    }).catch(() => {
      delete form.dataset.submitting;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('aria-busy');
        submitBtn.textContent = originalText;
      }
      updateStatus(false, "Something went wrong. Please try calling (480) 803-7763 directly.");
    });
  });
}

setupForm('#contactForm', '#formStatus', { redirect: './thanks-contact', eventName: 'contact_form_submit' });
setupForm('#applyForm', '#applyStatus', { redirect: './thanks', eventName: 'loan_form_submit' });
setupForm('#preapprovalForm', null, { redirect: './thanks-contact', eventName: 'preapproval_intake_submit' });
setupForm('#generalContactForm', null, { redirect: './thanks-contact', eventName: 'general_contact_submit' });
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form').forEach(fillUTMInputs);
});

function setupContactTopic() {
  const topic = new URLSearchParams(window.location.search).get('topic');
  const topicCopy = {
    'home-equity': {
      heading: 'Ask about home equity.',
      message: 'I want to ask about a HELOC or home equity option.',
    },
    construction: {
      heading: 'Ask about construction financing.',
      message: 'I want to ask about a construction loan.',
    },
    'move-up': {
      heading: 'Plan the move before the dates get tight.',
      message: 'I am buying again and want to coordinate my current home, next purchase, and closing timeline.',
    },
  }[topic];
  if (!topicCopy) return;

  const form = document.querySelector('form[name="general-contact"]');
  const message = form?.querySelector('[name="message"]');
  const heading = document.querySelector('[data-topic-heading]');
  if (message && !message.value.trim()) message.value = topicCopy.message;
  if (heading) heading.textContent = topicCopy.heading;
}

document.addEventListener('DOMContentLoaded', setupContactTopic);

// ─── Instagram Feed ─────────────────────────────────────────────────────────
function escapeHTML(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}

const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/logan.loans';

function renderInstagramItems(items, profileUrl = INSTAGRAM_PROFILE_URL) {
  return items.map((it) => {
    const href = it.url || profileUrl;
    return `
      <a class="instaCard instaPreview" href="${escapeHTML(href)}" target="_blank" rel="noopener">
        <span class="instaKicker">${escapeHTML(it.kicker || 'Logan Loans')}</span>
        <span class="instaTitle">${escapeHTML(it.title || '@logan.loans')}</span>
        <span class="instaText">${escapeHTML(it.body || 'Mortgage tips, Arizona market notes, and deal momentum from Logan Sullivan.')}</span>
        <span class="instaHandle">@logan.loans</span>
      </a>
    `;
  }).join('');
}

function markInstagramReady(root, state) {
  root.classList.add('is-ready');
  root.dataset.feedState = state;
}

async function renderInstagram() {
  const root = document.getElementById('instagram');
  if (!root) return;
  markInstagramReady(root, root.children.length ? 'static' : 'loading');
  try {
    const res = await fetch('./data/instagram.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('not found');
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items.slice(0, 6) : [];
    if (!items.length) throw new Error('empty');
    root.innerHTML = renderInstagramItems(items, data.profile_url || INSTAGRAM_PROFILE_URL);
    markInstagramReady(root, 'json');
  } catch {
    if (!root.children.length) {
      root.innerHTML = renderInstagramItems([{
        url: INSTAGRAM_PROFILE_URL,
        kicker: 'Follow along',
        title: '@logan.loans',
        body: 'Mortgage tips, Arizona market notes, and deal momentum from Logan Sullivan.',
        alt: 'Follow Logan Loans on Instagram',
      }]);
    }
    markInstagramReady(root, 'fallback');
  }
}

document.addEventListener('DOMContentLoaded', renderInstagram);
