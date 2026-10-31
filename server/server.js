const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'enquiries.json');

const SERVICES = [
  'AI and Copilot Solutions',
  'Digital Transformation and Automation',
  'Technology Consulting, Licensing and Implementation',
  'Not sure yet'
];

app.disable('x-powered-by');
app.set('trust proxy', 1); // Azure front end sets X-Forwarded-For
app.get('/healthz', (req, res) => res.send('ok'));
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy':
      "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; script-src 'self'; frame-ancestors 'none'"
  });
  next();
});
app.use(express.json({ limit: '10kb' }));

// Simple in-memory rate limit: 5 submissions per IP per 15 minutes.
const hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const recent = (hits.get(req.ip) || []).filter(t => now - t < windowMs);
  if (recent.length >= 5) return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  recent.push(now);
  hits.set(req.ip, recent);
  next();
}

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_TO } = process.env;
const mailer = SMTP_HOST && SMTP_USER && SMTP_PASS && NOTIFY_TO
  ? nodemailer.createTransport({ host: SMTP_HOST, port: +(SMTP_PORT || 587), secure: false, requireTLS: true, auth: { user: SMTP_USER, pass: SMTP_PASS } })
  : null;

function notify(entry) {
  if (!mailer) return;
  // Plain-text body avoids HTML injection from user input.
  const text = Object.entries(entry).map(([k, v]) => `${k}: ${v}`).join('\n');
  mailer.sendMail({
    from: SMTP_USER,
    to: NOTIFY_TO,
    replyTo: entry.email,
    subject: `New DILT enquiry from ${entry.name.replace(/[\r\n]/g, ' ')}`,
    text
  }).catch(err => console.error('Email notification failed:', err.message));
}

async function readAll() {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

app.get('/api/services', (req, res) => res.json(SERVICES));

app.post('/api/enquiries', rateLimit, async (req, res) => {
  const { name, email, company, service, message, website } = req.body || {};
  if (website) return res.status(201).json({ ok: true }); // honeypot

  const clean = v => (typeof v === 'string' ? v.trim() : '');
  const entry = {
    name: clean(name),
    email: clean(email),
    company: clean(company),
    service: clean(service),
    message: clean(message)
  };

  const errors = {};
  if (entry.name.length < 2 || entry.name.length > 100) errors.name = 'Enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email) || entry.email.length > 200) errors.email = 'Enter a valid email.';
  if (entry.company.length > 150) errors.company = 'Company name is too long.';
  if (!SERVICES.includes(entry.service)) errors.service = 'Choose a service.';
  if (entry.message.length < 10 || entry.message.length > 2000) errors.message = 'Message must be 10-2000 characters.';
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const all = await readAll();
    all.push({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...entry });
    await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2));
    notify(entry);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save your enquiry.' });
  }
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => console.log(`DILT Consults site running at http://localhost:${PORT}`));
