/* ════════════════════════════════════════════
   script.js — NexusServer
   ════════════════════════════════════════════ */

// ── 1. CUSTOM CURSOR ─────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;  // actual mouse position
let ringX  = 0, ringY  = 0;  // smoothed ring position

// Track mouse movement
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Animate cursor and ring separately for smooth lag effect
function animateCursor() {
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';

  // Ring follows with easing
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';

  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor grows on hover over interactive elements
const interactiveEls = document.querySelectorAll(
  'button, a, .feature-card, .step, .tech-chip'
);
interactiveEls.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '20px';
    cursor.style.height = '20px';
    ring.style.width    = '52px';
    ring.style.height   = '52px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '12px';
    cursor.style.height = '12px';
    ring.style.width    = '36px';
    ring.style.height   = '36px';
  });
});


// ── 2. SCROLL REVEAL ─────────────────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay * 100);
    }
  });
}, { threshold: 0.1 });

// Stagger sibling cards slightly
revealEls.forEach((el, i) => {
  el.dataset.delay = i % 4;
  revealObserver.observe(el);
});


// ── 3. ANIMATED COUNTERS ─────────────────────────────────────────────────────
const counterEls = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const el        = entry.target;
    const target    = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration  = 1800;  // ms
    const steps     = 60;
    let   step      = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const val  = target * ease;

      el.textContent = isDecimal
        ? val.toFixed(1)
        : Math.round(val).toLocaleString();

      if (step >= steps) {
        clearInterval(timer);
        el.textContent = isDecimal
          ? target.toFixed(1)
          : target.toLocaleString();
      }
    }, duration / steps);

    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counterEls.forEach((c) => counterObserver.observe(c));


// ── 4. SMOOTH SCROLL ─────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── 5. FEATURE CARD 3D TILT ──────────────────────────────────────────────────
document.querySelectorAll('.feature-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;

    card.style.transform =
      `translateY(-8px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});