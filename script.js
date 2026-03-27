/* ══════════════════════════════════════════════════════════════
   PREPWAY GROUP — script.js
══════════════════════════════════════════════════════════════ */

'use strict';

/* ── NAV SCROLL ─────────────────────────────────────────────── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

/* ── MOBILE MENU ─────────────────────────────────────────────── */
const mbtn    = document.getElementById('mbtn');
const mobNav  = document.getElementById('mobileNav');
let menuOpen  = false;

function toggleMenu() {
  menuOpen = !menuOpen;
  mobNav.style.display = menuOpen ? 'block' : 'none';
  requestAnimationFrame(() => { mobNav.classList.toggle('open', menuOpen); });
  mbtn.setAttribute('aria-expanded', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
}
function closeMenu() {
  menuOpen = false;
  mobNav.classList.remove('open');
  setTimeout(() => { if (!menuOpen) mobNav.style.display = 'none'; }, 300);
  mbtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
if (mbtn) mbtn.addEventListener('click', toggleMenu);
document.querySelectorAll('.mob-nav a').forEach(a => a.addEventListener('click', closeMenu));

/* ── SCROLL REVEAL ───────────────────────────────────────────── */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: 0.08 });
document.querySelectorAll('.rev').forEach(el => ro.observe(el));

/* ── ANIMATED COUNTER ────────────────────────────────────────── */
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const dur    = 1800;
  const start  = performance.now();
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';

  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(ease * target).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = 'true';
      animateCount(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-n[data-target]').forEach(el => counterObs.observe(el));

/* ── PARALLAX HERO BG TEXT ───────────────────────────────────── */
const heroBg = document.querySelector('.hero-bg-text span');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.35}px)`;
  }, { passive: true });
}

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 66;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ── CURSOR DOT (desktop only) ───────────────────────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position:fixed;width:8px;height:8px;border-radius:50%;
    background:#0D0D0D;pointer-events:none;z-index:10000;
    transform:translate(-50%,-50%);transition:transform .12s ease,opacity .2s;
    mix-blend-mode:difference;
  `;
  document.body.appendChild(dot);

  const ring = document.createElement('div');
  ring.style.cssText = `
    position:fixed;width:34px;height:34px;border-radius:50%;
    border:1px solid rgba(13,13,13,.35);pointer-events:none;z-index:9999;
    transform:translate(-50%,-50%);transition:transform .25s ease,width .25s ease,height .25s ease,opacity .2s;
  `;
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animCursor() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  document.querySelectorAll('a, button, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '52px'; ring.style.height = '52px';
      ring.style.borderColor = 'rgba(13,13,13,.5)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '34px'; ring.style.height = '34px';
      ring.style.borderColor = 'rgba(13,13,13,.35)';
    });
  });
}
