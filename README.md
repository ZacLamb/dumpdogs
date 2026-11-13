# Dumpster Dawgs LLC — website

Node/Express + EJS. 56 pages: home, sizes & pricing (+2 size pages), 7 service pages, service area + 39 town pages, about, gallery, FAQ, contact. Auto sitemap.xml + robots.txt.

## Deploy (GitHub web UI + Railway)
1. Create a new GitHub repo (e.g. `dumpsterdawgs`) → **Add file → Upload files** → drag in everything from this folder (not `node_modules`).
2. Railway → New Project → Deploy from GitHub repo → pick it. Start command is `npm start` (auto-detected).
3. Variables:
   - `SITE_URL` = `https://www.dumpsterdawgsllc.net` (canonical URLs + sitemap)
   - `LEAD_WEBHOOK_URL` = GHL inbound webhook URL (optional — form leads POST JSON here; without it leads only log to Railway)
4. Settings → Networking → add custom domain `www.dumpsterdawgsllc.net`, point DNS CNAME at the Railway target, then move the domain off Wix.

## Edit content
Everything (prices, sizes, extras, services, towns, FAQs) is in `data/site.js`. Add a town = add one line to `towns`.

## Images
Currently hotlinked from the old Wix media library. Before cancelling Wix, download them into `public/img/` and swap the URLs in the `img` block of `data/site.js`.

## Lead payload
`first_name, last_name, phone, email, town, dumpster_size, message, page, source, submitted_at`

## Visitor dashboard & alerts
- `/dashboard` — password-protected owner dashboard (visits, sources, top pages/towns, live feed, leads).
- Emails the owner when a past lead comes back to the site (max once per 6h per lead), plus a daily digest at 7am.
- First-party only: random-ID cookie, no IPs stored, bots filtered, owner's own visits excluded. See `/privacy`.

Railway variables:
| Variable | Purpose |
|---|---|
| `DASHBOARD_PASSWORD` | Required to open /dashboard (user is `owner`, or set `DASHBOARD_USER`) |
| `DATABASE_URL` | Postgres — keeps history across redeploys (without it, data resets on each deploy) |
| `ALERT_WEBHOOK_URL` | GHL inbound webhook for the "Website Visitor Alerts" workflow (emails subject/body_html) |
| `SITE_TZ`, `DIGEST_HOUR` | Default `America/New_York`, `7` |
| `ALERT_COOLDOWN_HOURS`, `ALERT_DELAY_MINUTES`, `DIGEST_ENABLED` | Optional tuning (6, 3, true) |
