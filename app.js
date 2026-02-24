// Logan Loans - Welcome Mat Prototype (no framework)

// Drawer navigation (mobile)
const navToggle = document.querySelector('[data-nav-toggle]');
const drawer = document.querySelector('[data-drawer]');
const drawerClose = document.querySelector('[data-drawer-close]');

function openDrawer(){
  if (!drawer) return;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  drawer.removeAttribute('inert');
  navToggle?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  // Move focus into drawer for accessibility
  drawerClose?.focus();
}
function closeDrawer(){
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('inert', '');
  navToggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  // Return focus to toggle button
  navToggle?.focus();
}

// Initialize drawer as inert on page load (closed state)
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

// 1) Threshold line reveal
const sections = document.querySelectorAll('[data-observe]');
if (sections.length) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) e.target.classList.add('is-visible');
    }
  }, { threshold: 0.18 });
  sections.forEach(s => io.observe(s));
}

// 2) Translator toggle (optional per page)
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

function setText(newMode){
  mode = newMode;
  if (!toggle || !tLeft || !tRight) return;

  const pair = PAIRS[idx % PAIRS.length];
  const nextLeft = (mode === "plain") ? pair.plainL : pair.termsL;
  const nextRight = (mode === "plain") ? pair.plainR : pair.termsR;

  [tLeft, tRight].forEach(el => el.classList.add('fadeOut'));
  setTimeout(() => {
    tLeft.textContent = nextLeft;
    tRight.textContent = nextRight;
    [tLeft, tRight].forEach(el => {
      el.classList.remove('fadeOut');
      el.classList.add('fadeIn');
    });
  }, 190);
}

function setMode(newMode){
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

// 3) FAQ accordion
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

// 4) Form comfort micro-interactions (optional per page)
const form = document.querySelector('#contactForm');
const statusEl = document.querySelector('#formStatus');
const nameEl = document.querySelector('#name');
const emailEl = document.querySelector('#email');
const phoneEl = document.querySelector('#phone');
const intentEl = document.querySelector('#intent');

function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v||"").trim()); }
function isPhone(v){ return (v||"").trim().length === 0 || /^[0-9\-\+\(\)\s\.]{7,}$/.test((v||"").trim()); }

function updateStatus(ok, msg){
  if (!statusEl) return;
  statusEl.classList.toggle('ok', !!ok);
  const msgEl = statusEl.querySelector('[data-msg]');
  if (msgEl) msgEl.textContent = msg;
}

function fieldHints(){
  if (!nameEl || !emailEl || !phoneEl) return;
  const nameOk = nameEl.value.trim().length >= 2;
  const emailOk = isEmail(emailEl.value);
  const phoneOk = isPhone(phoneEl.value);

  if (nameOk && emailOk && phoneOk) {
    updateStatus(true, "Looks good. When you’re ready, hit send.");
  } else {
    updateStatus(false, "No stress. Ballpark info is fine. We’ll fill the gaps together.");
  }
}

[nameEl, emailEl, phoneEl, intentEl].forEach(el => el?.addEventListener('input', fieldHints));

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const nameOk = nameEl?.value.trim().length >= 2;
  const emailOk = isEmail(emailEl?.value || "");
  const phoneOk = isPhone(phoneEl?.value || "");

  if (!nameOk) { nameEl?.focus(); updateStatus(false, "What should Logan call you?"); return; }
  if (!emailOk) { emailEl?.focus(); updateStatus(false, "That email looks a bit off. Try again?"); return; }
  if (!phoneOk) { phoneEl?.focus(); updateStatus(false, "Phone can be blank, or a standard number format."); return; }

  const btn = form.querySelector('button[type="submit"]');
  const old = btn?.textContent || "Send";
  if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

  updateStatus(true, "Sent. Logan will reach out soon.");

  setTimeout(() => {
    if (btn) { btn.disabled = false; btn.textContent = old; }
    form.reset();
    fieldHints();
  }, 900);
});

fieldHints();


// Local Instagram preview (no third-party widget)
// Update /data/instagram.json with your latest image URLs and post links.
async function renderInstagram(){
  const root = document.getElementById('instagram');
  if(!root) return;
  try{
    const res = await fetch('./data/instagram.json', { cache: 'no-store' });
    if(!res.ok) throw new Error('instagram.json not found');
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items.slice(0, 6) : [];
    root.innerHTML = items.map((it) => {
      const href = it.url || (data.profile_url || 'https://www.instagram.com/logan.loans');
      const img = it.image || '';
      const alt = it.alt || 'Instagram post';
      return `
        <a class="instaCard" href="${href}" target="_blank" rel="noopener" aria-label="${alt}">
          <img src="${img}" alt="${alt}" loading="lazy" decoding="async"/>
        </a>
      `;
    }).join('');
  } catch(e){
    root.innerHTML = `<div class="card"><p class="cardText">Instagram preview is not configured yet. Update <code>data/instagram.json</code> and add images to <code>assets/</code>.</p></div>`;
  }
}
document.addEventListener('DOMContentLoaded', renderInstagram);
