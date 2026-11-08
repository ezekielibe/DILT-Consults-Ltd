const { PAGES, GROUPS } = require('./pages');

const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';

const byGroup = g => PAGES.filter(p => p.group === g);

function header(currentPath) {
  const menus = GROUPS.map(g => {
    const items = byGroup(g);
    const active = items.some(p => p.path === currentPath);
    return `
        <div class="dd${active ? ' dd--active' : ''}">
          <button class="dd__btn" type="button" aria-haspopup="true" aria-expanded="false">${g}</button>
          <div class="dd__menu">
            ${items.map(p => `<a href="${p.path}"${p.path === currentPath ? ' aria-current="page"' : ''}><span class="dd__icon">${p.icon}</span><span><strong>${p.label}</strong><small>${p.desc}</small></span></a>`).join('')}
          </div>
        </div>`;
  }).join('');

  return `
  <a class="skip" href="#top">Skip to content</a>
  <div class="progress" id="progress" aria-hidden="true"></div>
  <div class="topbar">
    <div class="container topbar__inner">
      <span class="topbar__tag">Driving Innovation through Leveraged Technology</span>
      <button class="theme" id="themeToggle" type="button" aria-label="Toggle light and dark mode">Dark mode</button>
    </div>
  </div>
  <header class="nav" id="nav">
    <div class="container nav__inner">
      <a href="/" class="logo" aria-label="DILT Consults Ltd home"><svg class="logo__mark" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b8cff"/><stop offset="1" stop-color="#1b3a9c"/></linearGradient></defs><path fill="url(#lg)" fill-rule="evenodd" d="M8 6H30C47 6 58 17 58 32S47 58 30 58H8Z M21 19V45H30C39 45 45 40 45 32S39 19 30 19Z"/><path d="M27 40L33 33L37 37L43 28" fill="none" stroke="#22d3ee" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="43" cy="28" r="3.6" fill="#22d3ee"/></svg><span class="logo__text">DILT <small>Consults Ltd</small></span></a>
      <button class="nav__toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">&#9776;</button>
      <nav class="nav__links" id="navLinks" aria-label="Main">${menus}
        <a href="/#contact" class="btn btn--small">Get in touch</a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  const col = g => `
      <div>
        <h5>${g}</h5>
        ${byGroup(g).map(p => `<a href="${p.path}">${p.label}</a>`).join('')}
      </div>`;
  return `
  <footer class="footer">
    <div class="container footer__grid">
      <div>
        <strong>DILT Consults Ltd</strong>
        <p>Driving Innovation through Leveraged Technology</p>
        <a href="mailto:hello@diltconsults.com">hello@diltconsults.com</a>
      </div>${GROUPS.map(col).join('')}
    </div>
    <div class="container footer__base">&copy; <span id="year"></span> DILT Consults Ltd. All rights reserved.</div>
  </footer>

  <a href="https://wa.me/2348036614100?text=Hello%20DILT%20Consults%2C%20I%27d%20like%20to%20make%20an%20enquiry." class="fab fab--wa" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="${WA_PATH}"/></svg>
  </a>
  <a href="mailto:hello@diltconsults.com?subject=Enquiry%20for%20DILT%20Consults" class="fab" aria-label="Email hello@diltconsults.com">&#9993;</a>
  <script src="/app.js"></script>`;
}

function head(title, description) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | DILT Consults Ltd</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#4169e1">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title} | DILT Consults Ltd">
  <meta property="og:description" content="${description}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="/logo-mark.svg">
  <link rel="stylesheet" href="/styles.css">
</head>`;
}

function renderPage(page) {
  const siblings = byGroup(page.group).filter(p => p.path !== page.path);
  const related = siblings.length ? `
    <section class="section section--alt">
      <div class="container">
        <p class="eyebrow">Keep exploring</p>
        <h2>More in ${page.group}</h2>
        <div class="grid grid--${Math.min(siblings.length, 3)} grid--spaced">
          ${siblings.map(p => `<a class="card link-card" href="${p.path}"><div class="card__icon">${p.icon}</div><h3>${p.label}</h3><p class="muted">${p.desc}</p><span class="card__link">Learn more &rarr;</span></a>`).join('')}
        </div>
      </div>
    </section>` : '';

  return `${head(page.title, page.lead)}
<body>${header(page.path)}
  <main id="top">
    <section class="page-hero">
      <div class="hero__glow hero__glow--a"></div>
      <div class="container page-hero__inner">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>${page.group}</span><span>/</span><span aria-current="page">${page.label}</span></nav>
        <p class="eyebrow">${page.eyebrow}</p>
        <h1>${page.title}</h1>
        <p class="lead">${page.lead}</p>
      </div>
    </section>
    ${page.body()}
    ${related}
    <section class="cta" aria-label="Call to action">
      <div class="container cta__inner reveal">
        <h2>Ready to turn technology into measurable results?</h2>
        <p>Start with a discovery and AI readiness assessment.</p>
        <a href="/#contact" class="btn btn--light">Book an assessment &rsaquo;</a>
      </div>
    </section>
  </main>
  ${footer()}
</body>
</html>`;
}

function renderNotFound() {
  return `${head('Page not found', 'The page you requested could not be found.')}
<body>${header('')}
  <main id="top">
    <section class="page-hero"><div class="container page-hero__inner">
      <p class="eyebrow">404</p><h1>Page not found</h1>
      <p class="lead">The page you are looking for does not exist.</p>
      <a href="/" class="btn">Back to home</a>
    </div></section>
  </main>
  ${footer()}
</body>
</html>`;
}

module.exports = { header, footer, renderPage, renderNotFound };
