// Sends form submissions by email.
// Option A (recommended): Google Workspace SMTP — set SMTP_USER + SMTP_PASS (an app password).
// Option B: Resend HTTP API — set RESEND_API_KEY (+ MAIL_FROM on a verified domain).
// Recipient defaults to info@dumpsterdawgsllc.net; override with MAIL_TO (comma-separated ok).
const nodemailer = require('nodemailer');

const MAIL_TO = process.env.MAIL_TO || 'info@dumpsterdawgsllc.net';

const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function build(lead) {
  const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ');
  const rows = [
    ['Name', name],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['Town', lead.town],
    ['Dumpster size', lead.dumpster_size || 'Not sure'],
    ['Message', lead.message],
    ['Submitted from', lead.page || '/'],
    ['Time', new Date(lead.submitted_at).toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' ET'],
  ];
  const subject = `New dumpster request: ${name}${lead.town ? ' — ' + lead.town : ''}${lead.dumpster_size ? ' (' + lead.dumpster_size + ')' : ''}`;
  const text = rows.map(([k, v]) => `${k}: ${v || '-'}`).join('\n');
  const html =
    `<h2 style="font-family:Arial,sans-serif;margin:0 0 12px">New website request</h2>` +
    `<table cellpadding="8" style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">` +
    rows
      .map(([k, v]) => {
        let val = esc(v) || '—';
        if (k === 'Phone' && v) val = `<a href="tel:${esc(v)}">${esc(v)}</a>`;
        if (k === 'Email' && v) val = `<a href="mailto:${esc(v)}">${esc(v)}</a>`;
        return `<tr><td style="border-bottom:1px solid #eee;color:#666;white-space:nowrap"><b>${k}</b></td><td style="border-bottom:1px solid #eee">${val.replace(/\n/g, '<br>')}</td></tr>`;
      })
      .join('') +
    `</table>`;
  return { subject, text, html, replyTo: lead.email || undefined };
}

let transport = null;
function smtp() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  if (!transport) {
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transport;
}

async function sendLeadEmail(lead) {
  const msg = build(lead);
  const t = smtp();
  if (t) {
    await t.sendMail({
      from: process.env.MAIL_FROM || `"Website Request" <${process.env.SMTP_USER}>`,
      to: MAIL_TO,
      replyTo: msg.replyTo,
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
    });
    return 'smtp';
  }
  if (process.env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || 'Website Request <onboarding@resend.dev>',
        to: MAIL_TO.split(',').map((s) => s.trim()),
        reply_to: msg.replyTo,
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
      }),
    });
    if (!r.ok) throw new Error('Resend ' + r.status + ': ' + (await r.text()));
    return 'resend';
  }
  console.warn('[lead] email not configured — set SMTP_USER/SMTP_PASS or RESEND_API_KEY');
  return null;
}

module.exports = { sendLeadEmail, MAIL_TO };
