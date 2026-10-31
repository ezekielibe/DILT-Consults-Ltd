const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');

document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle (dark default, persisted)
const themeBtn = document.getElementById('themeToggle');
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  themeBtn.textContent = t === 'light' ? 'Dark mode' : 'Light mode';
}
applyTheme(localStorage.getItem('theme') || 'light');
themeBtn.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', next);
  applyTheme(next);
});

// Service tabs
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', t === tab));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === tab.dataset.panel));
}));

// Duplicate marquee content for a seamless loop
const track = document.getElementById('marquee');
track.innerHTML += track.innerHTML;

// Hero slideshow
(() => {
  const slider = document.getElementById('slider');
  const slides = [...slider.querySelectorAll('.slide')];
  const dotsEl = document.getElementById('sliderDots');
  let i = 0, timer;
  const dots = slides.map((_, n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Go to slide ${n + 1}`);
    b.addEventListener('click', () => { show(n); restart(); });
    dotsEl.append(b);
    return b;
  });
  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
  }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function restart() {
    clearInterval(timer);
    if (!reduce) timer = setInterval(() => show(i + 1), 5000);
  }
  slider.querySelector('.slider__btn--prev').addEventListener('click', () => { show(i - 1); restart(); });
  slider.querySelector('.slider__btn--next').addEventListener('click', () => { show(i + 1); restart(); });
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', restart);
  show(0);
  restart();
})();
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.addEventListener('click', e => { if (e.target.tagName === 'A') links.classList.remove('open'); });

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Count-up stats
const counter = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / 1200, 1);
      el.textContent = Math.round(target * p) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counter.unobserve(el);
  });
});
document.querySelectorAll('[data-count]').forEach(el => counter.observe(el));

// Contact form
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

fetch('/api/services').then(r => r.json()).then(list => {
  const select = form.elements.service;
  select.append(new Option('Select a service', ''));
  list.forEach(s => select.append(new Option(s, s)));
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  form.querySelectorAll('[data-err]').forEach(n => (n.textContent = ''));
  status.className = 'form__status';
  status.textContent = 'Sending...';
  const btn = form.querySelector('button');
  btn.disabled = true;
  try {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const data = await res.json();
    if (res.ok) {
      form.reset();
      status.classList.add('ok');
      status.textContent = 'Thank you. We will be in touch shortly.';
    } else {
      Object.entries(data.errors || {}).forEach(([k, msg]) => {
        const n = form.querySelector(`[data-err="${k}"]`);
        if (n) n.textContent = msg;
      });
      status.classList.add('fail');
      status.textContent = data.error || 'Please fix the highlighted fields.';
    }
  } catch {
    status.classList.add('fail');
    status.textContent = 'Network error. Please try again.';
  } finally {
    btn.disabled = false;
  }
});
