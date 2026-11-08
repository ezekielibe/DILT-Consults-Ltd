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
if (track) track.innerHTML += track.innerHTML;

// Scroll progress bar
const bar = document.getElementById('progress');
addEventListener('scroll', () => {
  const h = document.documentElement;
  bar.style.transform = `scaleX(${h.scrollTop / Math.max(h.scrollHeight - h.clientHeight, 1)})`;
  nav.classList.toggle('scrolled', h.scrollTop > 20);
}, { passive: true });

// Cursor spotlight on cards
document.querySelectorAll('.card, .mini, .kpi').forEach(el => el.addEventListener('pointermove', e => {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}));

// Overview explainer
(() => {
  const root = document.getElementById('explainer');
  if (!root) return;
  const scenes = [...root.querySelectorAll('.scene')];
  const SCENE_MS = 8000, TOTAL = scenes.length * SCENE_MS;
  const fill = document.getElementById('exFill');
  const track = document.getElementById('exTrack');
  const time = document.getElementById('exTime');
  const caption = document.getElementById('exCaption');
  const playBtn = document.getElementById('exPlay');
  const fmt = ms => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;
  let elapsed = 0, last = 0, playing = false, current = -1, raf;

  function render() {
    const idx = Math.min(Math.floor(elapsed / SCENE_MS), scenes.length - 1);
    if (idx !== current) {
      current = idx;
      scenes.forEach((s, k) => s.classList.toggle('active', k === idx));
      caption.textContent = scenes[idx].dataset.text;
    }
    const pct = elapsed / TOTAL * 100;
    fill.style.width = `${pct}%`;
    track.setAttribute('aria-valuenow', Math.round(pct));
    time.textContent = `${fmt(elapsed)} / ${fmt(TOTAL)}`;
  }
  function tick(now) {
    elapsed = Math.min(elapsed + (now - last), TOTAL);
    last = now;
    render();
    if (elapsed >= TOTAL) return pause(true);
    raf = requestAnimationFrame(tick);
  }
  function play() {
    if (elapsed >= TOTAL) { elapsed = 0; current = -1; }
    playing = true;
    root.classList.add('playing', 'started');
    playBtn.innerHTML = '&#10074;&#10074;';
    playBtn.setAttribute('aria-label', 'Pause');
    last = performance.now();
    render();
    raf = requestAnimationFrame(tick);
  }
  function pause(ended) {
    playing = false;
    cancelAnimationFrame(raf);
    playBtn.innerHTML = '&#9654;';
    playBtn.setAttribute('aria-label', 'Play');
    if (ended === true) root.classList.remove('playing');
  }
  const toggle = () => (playing ? pause() : play());
  function seek(frac) {
    elapsed = Math.max(0, Math.min(frac, .999)) * TOTAL;
    current = -1;
    render();
    root.classList.add('started');
  }

  document.getElementById('explainerBig').addEventListener('click', play);
  playBtn.addEventListener('click', toggle);
  track.addEventListener('click', e => { const r = track.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); });
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') seek(elapsed / TOTAL + .1);
    if (e.key === 'ArrowLeft') seek(elapsed / TOTAL - .1);
  });
  // Pause when scrolled out of view
  new IntersectionObserver(([e]) => { if (!e.isIntersecting && playing) pause(); }, { threshold: .2 }).observe(root);
  caption.textContent = scenes[0].dataset.text;
})();

// Hero slideshow
(() => {
  const slider = document.getElementById('slider');
  if (!slider) return;
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
links.addEventListener('click', e => { if (e.target.closest('a')) links.classList.remove('open'); });

// Navigation dropdowns
const dds = [...document.querySelectorAll('.dd')];
const closeDd = except => dds.forEach(d => { if (d !== except) { d.classList.remove('open'); d.querySelector('.dd__btn').setAttribute('aria-expanded', 'false'); } });
dds.forEach(d => d.querySelector('.dd__btn').addEventListener('click', () => {
  const open = d.classList.toggle('open');
  d.querySelector('.dd__btn').setAttribute('aria-expanded', open);
  closeDd(d);
}));
document.addEventListener('click', e => { if (!e.target.closest('.dd')) closeDd(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDd(); });

// Scroll reveal
document.querySelectorAll('.card, .mini, .kpi, .case').forEach(el => el.classList.add('reveal'));
document.querySelectorAll('.section .eyebrow, .section h2, .section__intro, .tabs, .split > :first-child').forEach(el => el.classList.add('reveal'));
document.querySelectorAll('.split > :last-child, .form, .checks li').forEach((el, n) => el.classList.add('reveal', 'from-right'));
document.querySelectorAll('.kpi, .mini').forEach(el => el.classList.add('zoom-in'));
document.querySelectorAll('.grid--3 > .card:nth-child(1)').forEach(el => el.classList.add('from-left'));
document.querySelectorAll('.grid--3 > .card:nth-child(3)').forEach(el => el.classList.add('from-right'));
document.querySelectorAll('.checks li').forEach((el, n) => { el.style.transitionDelay = `${n * 0.08}s`; });
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); setTimeout(() => { e.target.style.transitionDelay = ''; e.target.classList.add('settled'); }, 1400); } });
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

if (form) {
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
}
