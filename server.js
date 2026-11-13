const express = require('express');
const path = require('path');
const compression = require('compression');
const site = require('./data/site');
const { sendLeadEmail } = require('./lib/mailer');
const analytics = require('./lib/analytics');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE = site.business.url.replace(/\/$/, '');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', true);
app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Shared locals for every view
app.use((req, res, next) => {
  Object.assign(res.locals, site, {
    path: req.path,
    canonical: BASE + (req.path === '/' ? '' : req.path.replace(/\/$/, '')),
    year: new Date().getFullYear(),
  });
  next();
});

// Visitor tracking + owner dashboard (/dashboard) + returning-lead alerts + daily digest
analytics.mount(app, site);

app.get('/privacy', (req, res) =>
  res.render('privacy', { title: `Privacy | ${site.business.short}`, description: `How ${site.business.name} handles website data.` })
);

const sizeBySlug = Object.fromEntries(site.sizes.map((s) => [s.slug, s]));
const serviceBySlug = Object.fromEntries(site.services.map((s) => [s.slug, s]));
const townBySlug = Object.fromEntries(site.towns.map((t) => [t.slug, t]));

// Pick nearby towns: same region first, then others
function nearby(town, n = 8) {
  const same = site.towns.filter((t) => t.region === town.region && t.slug !== town.slug);
  const other = site.towns.filter((t) => t.region !== town.region);
  return same.concat(other).slice(0, n);
}

app.get('/', (req, res) =>
  res.render('home', {
    title: 'Dumpster Rentals Wareham MA | Cape Cod, South Shore & South Coast | Dumpster Dawgs',
    description: '10 & 15 yard dumpster rentals from $495. Veteran owned in Wareham, MA. Same or next day delivery across Cape Cod, the South Shore & South Coast. Call or text 774-297-3341.',
  })
);

app.get('/dumpster-sizes', (req, res) =>
  res.render('sizes', {
    title: 'Dumpster Sizes & Pricing | 10 & 15 Yard Dumpsters | Dumpster Dawgs',
    description: '10 yard dumpster $495, 15 yard dumpster $595 — 7 days included, no hidden fees. See dimensions, weight limits and what fits.',
  })
);

app.get('/dumpster-sizes/:slug', (req, res, next) => {
  const size = sizeBySlug[req.params.slug];
  if (!size) return next();
  res.render('size', {
    size,
    title: `${size.yards} Yard Dumpster Rental — $${size.price} | Dumpster Dawgs Wareham MA`,
    description: `${size.yards} yard dumpster rental for $${size.price}: ${size.days} days, ${size.tons} included, holds about ${size.pickups} pickup loads. Serving Wareham, Cape Cod, South Shore & South Coast.`,
  });
});

app.get('/services', (req, res) =>
  res.render('services', {
    title: 'Dumpster Rental Services | Cleanouts, Roofing, Renovation | Dumpster Dawgs',
    description: 'Dumpsters for home cleanouts, renovations, roofing, yard waste, estate cleanouts and contractors. Local and veteran owned in Wareham, MA.',
  })
);

app.get('/services/:slug', (req, res, next) => {
  const service = serviceBySlug[req.params.slug];
  if (!service) return next();
  res.render('service', {
    service,
    title: `${service.name} Dumpster Rental | Wareham, Cape Cod & South Shore | Dumpster Dawgs`,
    description: `${service.short} 10 & 15 yard dumpsters from $495 with same or next day delivery. Call or text ${site.business.phone}.`,
  });
});

app.get('/service-area', (req, res) =>
  res.render('areas', {
    title: 'Service Area | Dumpster Rentals Across Cape Cod, South Shore & South Coast',
    description: 'Dumpster Dawgs delivers from Wareham to Cape Cod, the South Shore and the South Coast. Find your town.',
  })
);

app.get('/service-area/:slug', (req, res, next) => {
  const town = townBySlug[req.params.slug];
  if (!town) return next();
  res.render('town', {
    town,
    region: site.regions[town.region],
    near: nearby(town),
    title: `Dumpster Rental ${town.name}, MA | 10 & 15 Yard from $495 | Dumpster Dawgs`,
    description: `Need a dumpster in ${town.name}, MA? 10 & 15 yard roll-offs from $495, 7 days included, same or next day delivery. Veteran owned. Call or text ${site.business.phone}.`,
  });
});

app.get('/about', (req, res) =>
  res.render('about', {
    title: 'About Dumpster Dawgs | Local, Veteran Owned Dumpster Rental in Wareham MA',
    description: 'Dumpster Dawgs LLC is a local, veteran owned and operated dumpster rental company in Wareham, MA. Meet Bernie and Pete.',
  })
);

app.get('/gallery', (req, res) =>
  res.render('gallery', { title: 'Gallery | Dumpster Dawgs', description: 'Dumpster Dawgs on the job around Wareham, Cape Cod and the South Shore.' })
);

app.get('/faq', (req, res) =>
  res.render('faq', { title: 'Dumpster Rental FAQ | Dumpster Dawgs', description: 'Answers on delivery, rental length, weight limits, sizes, extra items and what can’t go in the dumpster.' })
);

app.get('/contact', (req, res) =>
  res.render('contact', {
    title: 'Book a Dumpster | Contact Dumpster Dawgs | 774-297-3341',
    description: 'Call or text 774-297-3341 or send a request to book a 10 or 15 yard dumpster in Wareham, Cape Cod, the South Shore or South Coast.',
    sent: req.query.sent === '1',
    formSize: parseInt(req.query.size, 10) || '',
  })
);

// Lead form -> forwards to a CRM webhook (e.g. a GHL inbound webhook) if LEAD_WEBHOOK_URL is set
app.post('/api/lead', async (req, res) => {
  const b = req.body || {};
  if (b.company) return res.redirect('/contact?sent=1'); // honeypot
  const lead = {
    first_name: (b.first_name || '').trim(),
    last_name: (b.last_name || '').trim(),
    phone: (b.phone || '').trim(),
    email: (b.email || '').trim(),
    town: (b.town || '').trim(),
    dumpster_size: (b.size || '').trim(),
    message: (b.message || '').trim(),
    page: (b.page || '').trim(),
    source: 'dumpsterdawgsllc.net',
    submitted_at: new Date().toISOString(),
  };
  const wantsJson = (req.get('accept') || '').includes('application/json');
  if (!lead.first_name || (!lead.phone && !lead.email)) {
    if (wantsJson) return res.status(400).json({ ok: false, error: 'Name and a phone or email are required.' });
    return res.redirect('/contact');
  }
  try {
    const linked = await analytics.linkLead(req, lead); // ties this browser to the lead for return alerts
    if (linked) lead.traffic_source = linked.first_source;
  } catch (e) {
    console.error('[lead] analytics link failed', e.message);
  }
  console.log('[lead]', JSON.stringify(lead));
  const tasks = [
    sendLeadEmail(lead)
      .then((via) => via && console.log('[lead] emailed via', via))
      .catch((e) => console.error('[lead] email failed', e.message)),
  ];
  if (process.env.LEAD_WEBHOOK_URL) {
    tasks.push(
      fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      }).catch((e) => console.error('[lead] webhook failed', e.message))
    );
  }
  await Promise.all(tasks);
  if (wantsJson) return res.json({ ok: true });
  res.redirect('/contact?sent=1');
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${BASE}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const urls = ['/', '/dumpster-sizes', '/services', '/service-area', '/about', '/gallery', '/faq', '/contact']
    .concat(site.sizes.map((s) => '/dumpster-sizes/' + s.slug))
    .concat(site.services.map((s) => '/services/' + s.slug))
    .concat(site.towns.map((t) => '/service-area/' + t.slug));
  const today = new Date().toISOString().slice(0, 10);
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls.map((u) => `  <url><loc>${BASE}${u === '/' ? '' : u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
      `\n</urlset>\n`
  );
});

app.get('/healthz', (req, res) => res.send('ok'));

app.use((req, res) => res.status(404).render('404', { title: 'Page Not Found | Dumpster Dawgs', description: 'Page not found.' }));

app.listen(PORT, () => console.log(`Dumpster Dawgs running on :${PORT}`));
