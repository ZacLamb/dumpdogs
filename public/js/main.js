(function () {
  // Mobile nav
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Lead forms: submit via fetch, fall back to normal POST
  document.querySelectorAll('form[data-lead]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!window.fetch) return;
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var ok = form.querySelector('.qform__ok');
      var err = form.querySelector('.qform__err');
      err.hidden = true;
      btn.disabled = true;
      var label = btn.textContent;
      btn.textContent = 'Sending…';
      var body = new URLSearchParams(new FormData(form));
      fetch(form.action, { method: 'POST', body: body, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok || !res.j.ok) throw new Error(res.j.error || 'Something went wrong.');
          form.querySelectorAll('label, .qform__row, button').forEach(function (el) { el.style.display = 'none'; });
          ok.hidden = false;
          if (window.gtag) window.gtag('event', 'generate_lead');
          if (window.fbq) window.fbq('track', 'Lead');
        })
        .catch(function (ex) {
          err.textContent = ex.message + ' You can also call or text 774-297-3341.';
          err.hidden = false;
          btn.disabled = false;
          btn.textContent = label;
        });
    });
  });
})();
