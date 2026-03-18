/* ═══════════════════════════════════════════════════════════════════
   CHEF OBY ROSA — Main JavaScript
   Bilingual toggle · Nav scroll · Form validation · Reveal animations
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── Language System ────────────────────────────────────────────── */
let currentLang = localStorage.getItem('chefoby-lang') || 'en';

const langLabel = document.getElementById('lang-label');

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('chefoby-lang', lang);
  document.documentElement.lang = lang;

  if (langLabel) {
    langLabel.textContent = lang === 'en' ? 'ES' : 'EN';
  }

  // Text content nodes (data-en / data-es)
  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text !== null) {
      // Use innerHTML for nodes containing HTML entities / tags
      el.innerHTML = text;
    }
  });

  // Placeholder attributes
  document.querySelectorAll('[data-placeholder-en]').forEach(el => {
    const ph = el.getAttribute(`data-placeholder-${lang}`);
    if (ph !== null) el.placeholder = ph;
  });

  // Select option text
  document.querySelectorAll('select option[data-en]').forEach(opt => {
    const text = opt.getAttribute(`data-${lang}`);
    if (text !== null) opt.textContent = text;
  });
}

document.getElementById('lang-toggle')?.addEventListener('click', () => {
  applyLanguage(currentLang === 'en' ? 'es' : 'en');
});

// Init language on load
applyLanguage(currentLang);

/* ── Navbar scroll effect ───────────────────────────────────────── */
const navbar = document.getElementById('navbar');

function onScroll() {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Mobile hamburger menu ──────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on nav link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (
    navLinks?.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger?.contains(e.target)
  ) {
    navLinks.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ── Intersection Observer — reveal animations ──────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

// Add reveal class to animatable elements
const revealSelectors = [
  '.service-card',
  '.gallery-item',
  '.about-text > *',
  '.about-image-wrap',
  '.sidebar-card',
  '.section-header',
  '.testimonial-inner blockquote',
];

revealSelectors.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    if (i === 1) el.classList.add('reveal-delay-1');
    if (i === 2) el.classList.add('reveal-delay-2');
    if (i === 3) el.classList.add('reveal-delay-3');
    revealObserver.observe(el);
  });
});

/* ── Quote Form Validation ──────────────────────────────────────── */
const form        = document.getElementById('quote-form');
const formSuccess = document.getElementById('form-success');

function showFieldError(input, show) {
  const errorEl = input.closest('.form-group')?.querySelector('.field-error');
  if (errorEl) errorEl.classList.toggle('visible', show);
  input.classList.toggle('error', show);
}

function validateEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function validateField(input) {
  const val = input.value.trim();
  if (input.required && !val) {
    showFieldError(input, true);
    return false;
  }
  if (input.type === 'email' && val && !validateEmail(val)) {
    showFieldError(input, true);
    return false;
  }
  showFieldError(input, false);
  return true;
}

// Live validation on blur
form?.querySelectorAll('input, textarea, select').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.classList.contains('error')) validateField(field);
  });
});

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
  let valid = true;

  fields.forEach(field => {
    if (!validateField(field)) valid = false;
  });

  if (!valid) return;

  // Simulate successful submission (replace with real backend/email service)
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = currentLang === 'en' ? 'Sending…' : 'Enviando…';

  setTimeout(() => {
    form.style.display = 'none';
    formSuccess?.classList.add('visible');
    // Re-apply language to success message
    applyLanguage(currentLang);
  }, 900);
});

/* ── Smooth scroll offset for fixed nav ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Active nav link on scroll ──────────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--gold)'
            : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -50% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));
