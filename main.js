/* Refined Detailing
   Every price, time and rule lives in DATA below. Edit prices there and
   nowhere else: the booking page, the price labels on the other pages and
   the SMS summary all read from it. No backend, nothing is stored. */
(function () {
  'use strict';

  const PHONE = '0444546092';

  /* ------------------------------------------------------------------ */
  /* DATA                                                               */
  /* ------------------------------------------------------------------ */
  const DATA = {
    sizes: [
      { id: 's', name: 'Hatch, sedan or coupe', eg: 'Mazda3, Corolla, Golf', mult: 1, time: 1 },
      { id: 'm', name: 'SUV, wagon or dual-cab ute', eg: 'CX-5, RAV4, HiLux', mult: 1.15, time: 1.15 },
      { id: 'l', name: 'Large 4WD, 7-seater or van', eg: 'Prado, LandCruiser, Kluger', mult: 1.3, time: 1.3 },
      { id: 'b', name: 'Motorbike', eg: 'Road, cruiser, adventure', mult: 0.55, time: 0.6 },
      { id: 'c', name: 'Caravan, boat, truck or fleet', eg: "We'll quote it individually", mult: null, time: 1 }
    ],

    groups: [
      { id: 'clean', name: 'Clean it up' },
      { id: 'full', name: 'Full detail' },
      { id: 'sell', name: 'Selling or trading in' },
      { id: 'paint', name: 'Correct the paint' },
      { id: 'ceramic', name: 'Ceramic coating' },
      { id: 'bike', name: 'Motorbike' }
    ],

    levels: ['', 'Fresh', 'Glossy', 'Protected', 'Locked in'],

    /* base = small-vehicle price. sizes = which vehicle ids can have it.
       fixed = flat price for a size (no multiplier). timeText = shown when
       there are no extras. club = Gloss Club base price. */
    packages: [
      {
        id: 'express', group: 'clean', name: 'Express Wash', base: 79, sizes: 'smlb', hours: 1, level: 1, club: 55,
        blurb: 'A quick hand wash and vacuum to keep a clean car clean.',
        items: ['Foam pre-wash and hand wash', 'Wheels, tyres and arches cleaned', 'Windows inside and out', 'Quick interior vacuum and wipe-down', 'Tyre dressing', 'Spray sealant boost, about 6 weeks'],
        up: { to: 'refresh', adds: 'a clay bar decontamination and a 3-month paint sealant' }
      },
      {
        id: 'refresh', group: 'clean', name: 'Exterior Refresh', base: 129, sizes: 'smlb', hours: 2, level: 2,
        blurb: 'Deep clean and decontamination for the outside of the car.',
        items: ['Foam pre-wash and hand wash', 'Wheels, tyres and arches deep-cleaned', 'Bug, tar and sap removal', 'Clay bar decontamination', 'Hand-applied paint sealant, about 3 months', 'Door jambs wiped', 'Windows and tyre dressing'],
        up: { to: 'signature', adds: 'the full interior, steam-cleaned and protected' }
      },
      {
        id: 'interior', group: 'clean', name: 'Interior Reset', base: 169, sizes: 'sml', hours: 2.5, level: 1,
        blurb: 'Every surface inside cleaned, freshened and protected.',
        items: ['Full vacuum including under seats and the boot', 'Steam clean of vents, cup holders and touch points', 'Dash, console and door cards cleaned and UV protected', 'Seats cleaned (fabric shampooed or leather cleaned)', 'Carpets and mats cleaned', 'Windows and mirrors inside', 'Light deodorise'],
        up: { to: 'signature', adds: 'the full exterior clean, clay bar and a 6-month sealant' }
      },
      {
        id: 'signature', group: 'full', name: 'Signature Detail', base: 299, sizes: 'sml', hours: 4.5, level: 2, tag: 'Best value',
        blurb: 'Inside and out, in one visit. Our most complete everyday detail.',
        items: ['Everything in Exterior Refresh', 'Everything in Interior Reset', 'Leather clean and condition, or fabric shampoo', 'Steam-cleaned touch points', '6-month paint sealant'],
        up: { to: 'showroom', adds: 'a machine polish, engine bay clean, trim restoration and a 12-month sealant' }
      },
      {
        id: 'showroom', group: 'full', name: 'Showroom Detail', base: 449, sizes: 'sml', hours: 6.5, level: 3, tag: 'Full works',
        blurb: 'Signature plus a machine polish for gloss you can see.',
        items: ['Everything in Signature Detail', 'Single-stage machine polish for gloss and light swirl removal', 'Engine bay clean and dress', 'Trim restoration', 'Headlight clean-up', '12-month paint sealant']
      },
      {
        id: 'sellready', group: 'sell', name: 'Sell-Ready Detail', base: 349, sizes: 'sml', hours: 5, level: 2, tag: 'Built to sell',
        blurb: 'Make your car look its best in photos and on inspection.',
        items: ['Everything in Signature Detail', 'Engine bay clean', 'Headlight restoration', 'Odour neutraliser', 'Pet hair and stain touch-up', 'Photo-ready finish inside and out']
      },
      {
        id: 'gloss', group: 'paint', name: 'Gloss Enhancement', base: 390, sizes: 'sml', hours: 5, level: 3,
        blurb: 'One-stage polish that lifts light swirls and brings the shine back.',
        items: ['Wash, clay bar decontamination and panel prep', 'Single-stage machine polish, whole car', 'Removes light swirls and marks, restores gloss', 'Sealant finish, about 6 months'],
        up: { to: 'showroom', adds: 'the whole interior, engine bay and trim as well as the polish' }
      },
      {
        id: 'correction', group: 'paint', name: 'Paint Correction', base: 690, sizes: 'sml', hours: 9, level: 3, from: true, timeText: 'Full day',
        blurb: 'Two-stage correction for cars with noticeable swirls and marks.',
        items: ['Wash, decontamination and panel prep', 'Two-stage machine correction, whole car', 'Removes most swirls and light scratches', 'Paint depth checked before we start', '12-month sealant finish']
      },
      {
        id: 'ceramic2', group: 'ceramic', name: 'Ceramic Coating, 2-year', base: 690, sizes: 'sml', hours: 8, level: 4, timeText: 'Full day',
        blurb: 'Entry-level protection with a proper polish underneath.',
        items: ['Full wash, iron and clay decontamination', 'Single-stage enhancement polish', 'One layer of 2-year ceramic coating', 'Aftercare guide and first-wash tips'],
        up: { to: 'ceramic5', adds: 'two coating layers, a rain-repellent glass coating and a free 6-month check-up' }
      },
      {
        id: 'ceramic5', group: 'ceramic', name: 'Ceramic Coating, 5-year', base: 1090, sizes: 'sml', hours: 12, level: 4, tag: 'Best balance', timeText: '1 to 2 days',
        blurb: 'The sweet spot of durability and price for most owners.',
        items: ['Everything in the 2-year coating', 'Two layers of 5-year ceramic coating', 'Rain-repellent glass coating', 'Free 6-month check-up'],
        up: { to: 'ceramic8', adds: 'a three-layer system, coated wheel faces and two check-ups' }
      },
      {
        id: 'ceramic8', group: 'ceramic', name: 'Ceramic Coating, 8-year', base: 1590, sizes: 'sml', hours: 16, level: 4, timeText: '2 days',
        blurb: 'Our toughest system, for cars you plan to keep.',
        items: ['Everything in the 5-year coating', 'Three-layer 8-year ceramic system', 'Wheel faces and trim coated', 'Rain-repellent glass coating', 'Free 6-month and 12-month check-ups']
      },
      {
        id: 'bikefull', group: 'bike', name: 'Motorbike Full Detail', base: 159, sizes: 'b', fixed: { b: 159 }, hours: 2.5, level: 2,
        blurb: 'Wash, decontaminate, polish and protect your bike.',
        items: ['Hand wash and degrease', 'Wheels, chain area and engine casings cleaned', 'Clay bar decontamination', 'Machine polish on tank and fairings', 'Sealant and trim dressing']
      }
    ],

    /* base = small price. scales = size multiplier and $5 rounding apply,
       otherwise the price is flat. sizes = which vehicle ids offer it.
       incl = packages that already include it free. pairs = packages it
       pairs well with. */
    extras: [
      { id: 'pet', area: 'inside', name: 'Pet hair removal', desc: 'Deep removal from seats, carpets and boot.', base: 49, scales: true, sizes: 'sml', mins: 30 },
      { id: 'mould', area: 'inside', name: 'Mould and mildew treatment', desc: 'Trim, carpets and seats treated, then dried out.', base: 79, sizes: 'sml', mins: 45 },
      { id: 'odour', area: 'inside', name: 'Odour and smoke neutraliser', desc: 'Musty, smoke and pet smells treated at the source.', base: 69, sizes: 'sml', mins: 30, incl: ['sellready'] },
      { id: 'stain', area: 'inside', name: 'Stain extraction', desc: 'Hot-water extraction on stubborn fabric stains.', base: 79, sizes: 'sml', mins: 45 },
      { id: 'leather', area: 'inside', name: 'Leather clean and conditioning', desc: 'Cleaned, then conditioned so it stays soft.', base: 59, scales: true, sizes: 'sml', mins: 30, incl: ['signature', 'showroom', 'sellready'], pairs: ['interior'] },
      { id: 'protect', area: 'inside', name: 'Fabric and leather protectant', desc: 'Spills bead up instead of soaking in.', base: 59, scales: true, sizes: 'sml', mins: 20, pairs: ['signature', 'interior', 'sellready'] },
      { id: 'headlining', area: 'inside', name: 'Headlining stain clean', desc: 'Gentle spot clean on the roof lining.', base: 49, sizes: 'sml', mins: 30 },
      { id: 'childseat', area: 'inside', name: 'Child seat deep clean', desc: 'Price is per seat.', base: 35, sizes: 'sml', mins: 25 },
      { id: 'engine', area: 'outside', name: 'Engine bay clean', desc: 'Degreased, rinsed and dressed.', base: 59, sizes: 'sml', mins: 40, incl: ['showroom', 'sellready'], pairs: ['signature', 'refresh'] },
      { id: 'headlight', area: 'outside', name: 'Headlight restoration', desc: 'Clears yellowing and haze, then UV sealed.', base: 79, sizes: 'smlb', mins: 45, incl: ['sellready'], pairs: ['signature', 'refresh', 'showroom'] },
      { id: 'bugtar', area: 'outside', name: 'Bug and tar removal', desc: 'Baked-on bugs and tar lifted off the paint.', base: 29, sizes: 'smlb', mins: 20, incl: ['refresh', 'signature', 'showroom', 'sellready', 'bikefull'] },
      { id: 'trim', area: 'outside', name: 'Trim restoration', desc: 'Faded black plastics brought back.', base: 69, sizes: 'smlb', mins: 30, incl: ['showroom'], pairs: ['refresh', 'signature'] },
      { id: 'waterspot', area: 'outside', name: 'Water spot removal', desc: 'Glass and paint where possible.', base: 59, scales: true, sizes: 'smlb', mins: 45 },
      { id: 'arches', area: 'outside', name: 'Wheel arch and underbody rinse', desc: 'Mud and grit rinsed out from underneath.', base: 39, sizes: 'sml', mins: 25 },
      { id: 'gloss', area: 'outside', name: 'Gloss enhancement polish', desc: 'Single-stage machine polish.', base: 229, scales: true, sizes: 'sml', mins: 120, incl: ['showroom', 'gloss', 'correction', 'ceramic2', 'ceramic5', 'ceramic8'], pairs: ['refresh', 'signature'] },
      { id: 'wheelcoat', area: 'protection', name: 'Ceramic wheel coating', desc: 'Brake dust washes off far more easily.', base: 149, sizes: 'sml', mins: 45, incl: ['ceramic8'], pairs: ['ceramic2', 'ceramic5', 'showroom'] },
      { id: 'glass', area: 'protection', name: 'Rain-repellent glass coating', desc: 'Rain sheds off the glass.', base: 59, sizes: 'smlb', mins: 25, incl: ['ceramic5', 'ceramic8'], pairs: ['ceramic2', 'signature', 'showroom'] },
      { id: 'sealant12', area: 'protection', name: '12-month paint sealant upgrade', desc: 'Steps up the standard sealant.', base: 99, sizes: 'sml', mins: 30, incl: ['showroom', 'correction', 'ceramic2', 'ceramic5', 'ceramic8'], pairs: ['signature', 'refresh'] }
    ],

    areas: [
      { id: 'inside', name: 'Inside' },
      { id: 'outside', name: 'Outside' },
      { id: 'protection', name: 'Protection' }
    ],

    bundles: [
      { id: 'family', name: 'Family and pet pack', note: 'For muddy paws, spills and school-run crumbs.', ids: ['pet', 'childseat', 'protect', 'odour'] },
      { id: 'storm', name: 'Storm and humidity pack', note: 'Clears mould, water marks and mud after wet weather.', ids: ['mould', 'waterspot', 'arches'] },
      { id: 'shine', name: 'Shine and protect pack', note: 'Sharper gloss, fresh trim and easy-clean wheels.', ids: ['gloss', 'trim', 'wheelcoat', 'glass'] },
      { id: 'buyer', name: 'Buyer-ready pack', note: 'Clear headlights, a clean engine bay and a fresh smell.', ids: ['headlight', 'engine', 'odour'] }
    ],

    goals: [
      { id: 'keep', name: 'Keep it clean', note: 'Regular upkeep', pkgs: ['express', 'refresh', 'signature', 'bikefull'], rec: 'refresh' },
      { id: 'reset', name: 'Deep clean, inside and out', note: 'A full reset', pkgs: ['interior', 'signature', 'showroom'], rec: 'signature' },
      { id: 'sell', name: 'Selling or trading in', note: 'Look great to buyers', pkgs: ['signature', 'sellready', 'showroom'], rec: 'sellready' },
      { id: 'shine', name: 'Bring the shine back', note: 'Dull or swirly paint', pkgs: ['gloss', 'showroom', 'correction'], rec: 'showroom' },
      { id: 'protect', name: 'Protect it long term', note: 'Ceramic coating', pkgs: ['ceramic2', 'ceramic5', 'ceramic8'], rec: 'ceramic5' }
    ],

    discounts: { pair: 0.05, triple: 0.10, newCustomer: 20, newCustomerMin: 100 }
  };

  const SIZE = {};
  DATA.sizes.forEach(function (s) { SIZE[s.id] = s; });
  const PKG = {};
  DATA.packages.forEach(function (p) { PKG[p.id] = p; });
  const EXTRA = {};
  DATA.extras.forEach(function (x) { EXTRA[x.id] = x; });

  /* ------------------------------------------------------------------ */
  /* PURE FUNCTIONS                                                     */
  /* ------------------------------------------------------------------ */
  function scaled(base, mult) {
    return mult === 1 ? base : Math.round(base * mult / 5) * 5;
  }

  /* Package price for a vehicle size, or null when it is not offered. */
  function pkgPrice(pkgId, sizeId, club) {
    const p = PKG[pkgId];
    const s = SIZE[sizeId];
    if (!p || !s || s.mult === null || p.sizes.indexOf(sizeId) === -1) return null;
    if (p.fixed && p.fixed[sizeId] !== undefined) return p.fixed[sizeId];
    return scaled(club && p.club ? p.club : p.base, s.mult);
  }

  /* Add-on price for a vehicle size, or null when it is not offered. */
  function extraPrice(extraId, sizeId) {
    const x = EXTRA[extraId];
    const s = SIZE[sizeId];
    if (!x || !s || s.mult === null || x.sizes.indexOf(sizeId) === -1) return null;
    return x.scales ? scaled(x.base, s.mult) : x.base;
  }

  function isIncluded(extraId, pkgId) {
    const x = EXTRA[extraId];
    return !!(x && x.incl && pkgId && x.incl.indexOf(pkgId) !== -1);
  }

  const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

  function hoursInWords(h) {
    if (h <= 0.5) return 'half an hour';
    const whole = Math.floor(h);
    if (h === whole) return WORDS[whole] + (whole === 1 ? ' hour' : ' hours');
    return WORDS[whole] + ' and a half hours';
  }

  function timeText(pkgId, sizeId, extraIds) {
    const p = PKG[pkgId];
    const s = SIZE[sizeId];
    if (!p || !s) return '';
    const mins = (extraIds || []).reduce(function (t, id) { return t + EXTRA[id].mins; }, 0);
    if (p.timeText && mins === 0) return p.timeText;
    const h = Math.max(0.5, Math.round((p.hours * s.time + mins / 60) * 2) / 2);
    if (h > 16) return '2 days';
    if (h > 12) return '1 to 2 days';
    if (h > 8) return 'Full day';
    return 'About ' + hoursInWords(h);
  }

  /* One function turns the customer's choices into every number shown.
     state: { size, pkg, club, extras: [ids], newCust } */
  function calc(state) {
    const s = SIZE[state.size] || null;
    const out = {
      size: s, pkg: null, club: false, pk: 0, from: false, extras: [], included: [],
      ex: 0, rate: 0, bundle: 0, firstOff: 0, total: 0, time: '', quote: false, ready: false
    };
    if (!s) return out;
    if (s.id === 'c') { out.quote = true; return out; }

    const p = PKG[state.pkg];
    const base = p ? pkgPrice(p.id, s.id, !!state.club && !!p.club) : null;
    if (p && base !== null) {
      out.pkg = p;
      out.club = !!state.club && !!p.club;
      out.pk = base;
      out.from = !!p.from;
    }

    const seen = {};
    (state.extras || []).forEach(function (id) {
      if (seen[id] || !EXTRA[id]) return;
      seen[id] = true;
      const price = extraPrice(id, s.id);
      if (price === null) return;
      if (isIncluded(id, out.pkg && out.pkg.id)) { out.included.push(EXTRA[id]); return; }
      out.extras.push({ id: id, name: EXTRA[id].name, price: price, mins: EXTRA[id].mins });
      out.ex += price;
    });

    const n = out.extras.length;
    out.rate = n >= 3 ? DATA.discounts.triple : (n === 2 ? DATA.discounts.pair : 0);
    out.bundle = Math.round(out.ex * out.rate);
    out.firstOff = (state.newCust && out.pkg && out.pk >= DATA.discounts.newCustomerMin) ? DATA.discounts.newCustomer : 0;
    out.total = Math.max(0, out.pk + out.ex - out.bundle - out.firstOff);
    out.ready = !!out.pkg;
    if (out.pkg) out.time = timeText(out.pkg.id, s.id, out.extras.map(function (x) { return x.id; }));
    return out;
  }

  function money(n) {
    return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function smsHref(body) {
    return 'sms:' + PHONE + '?&body=' + encodeURIComponent(body);
  }

  const api = { DATA: DATA, pkgPrice: pkgPrice, extraPrice: extraPrice, calc: calc, timeText: timeText, isIncluded: isIncluded, money: money };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;

  /* ------------------------------------------------------------------ */
  /* PAGE BEHAVIOUR                                                     */
  /* ------------------------------------------------------------------ */
  document.documentElement.classList.add('js');

  const $ = function (sel, root) { return (root || document).querySelector(sel); };
  const $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  const reduceMotion = function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  /* Prices in the page copy come from DATA, so they cannot drift. */
  function initPriceLabels() {
    $$('[data-price]').forEach(function (el) {
      const v = pkgPrice(el.getAttribute('data-price'), el.getAttribute('data-size') || 's');
      if (v !== null) el.textContent = money(v);
    });
    $$('[data-club]').forEach(function (el) {
      const v = pkgPrice('express', el.getAttribute('data-club'), true);
      if (v !== null) el.textContent = money(v);
    });
  }

  /* Mobile nav: aria-expanded, Escape and outside click close it. */
  function initNav() {
    const btn = $('.nav-toggle');
    const nav = $('#site-nav');
    if (!btn || !nav) return;
    const isOpen = function () { return btn.getAttribute('aria-expanded') === 'true'; };
    const set = function (open) {
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    btn.addEventListener('click', function () { set(!isOpen()); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { set(false); btn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (isOpen() && !nav.contains(e.target) && !btn.contains(e.target)) set(false);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) set(false);
    });
  }

  /* Smooth scroll for links that point at a section on the current page. */
  function initSmoothScroll() {
    const norm = function (p) { return p.replace(/index\.html$/, '').replace(/\/$/, ''); };
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.hash.length < 2 || norm(url.pathname) !== norm(location.pathname)) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
      try { history.pushState(null, '', url.hash); } catch (err) { /* file: URLs can refuse this */ }
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  /* Section reveal. Without JS every section is simply visible. */
  function initReveal() {
    const sections = $$('.is-reveal');
    if (!sections.length) return;
    if (reduceMotion() || !('IntersectionObserver' in window)) {
      sections.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    sections.forEach(function (el) { io.observe(el); });
  }

  /* FAQ accordion. Without JS every answer stays open. */
  function initFaq() {
    $$('[data-faq]').forEach(function (list) {
      const buttons = $$('.faq-q', list);
      buttons.forEach(function (btn, i) {
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (!panel) return;
        panel.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        btn.addEventListener('click', function () {
          const open = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', open ? 'false' : 'true');
          panel.hidden = open;
        });
        btn.addEventListener('keydown', function (e) {
          let to = null;
          if (e.key === 'ArrowDown') to = buttons[(i + 1) % buttons.length];
          if (e.key === 'ArrowUp') to = buttons[(i - 1 + buttons.length) % buttons.length];
          if (e.key === 'Home') to = buttons[0];
          if (e.key === 'End') to = buttons[buttons.length - 1];
          if (to) { e.preventDefault(); to.focus(); }
        });
      });
    });
  }

  /* Before and after slider. Renders only when both image paths are set on
     the section, so there is never a broken image or a fake result. */
  function initSlider() {
    const sec = $('[data-ba]');
    if (!sec) return;
    const before = sec.getAttribute('data-before');
    const after = sec.getAttribute('data-after');
    if (!before || !after) return;

    const pic = function (src, webp, alt, cls) {
      const p = document.createElement('picture');
      if (webp) {
        const s = document.createElement('source');
        s.type = 'image/webp';
        s.srcset = webp;
        p.appendChild(s);
      }
      const img = document.createElement('img');
      img.src = src;
      img.alt = alt;
      img.loading = 'lazy';
      img.className = cls;
      p.appendChild(img);
      return p;
    };

    const stage = $('[data-ba-stage]', sec);
    const range = document.createElement('input');
    range.type = 'range';
    range.min = '0';
    range.max = '100';
    range.value = '50';
    range.className = 'ba-range';
    range.setAttribute('aria-label', 'Drag to compare before and after');
    const grip = document.createElement('span');
    grip.className = 'ba-grip';
    grip.setAttribute('aria-hidden', 'true');

    stage.appendChild(pic(before, sec.getAttribute('data-before-webp'), sec.getAttribute('data-before-alt') || 'Before the detail', 'ba-img'));
    const top = pic(after, sec.getAttribute('data-after-webp'), sec.getAttribute('data-after-alt') || 'After the detail', 'ba-img');
    top.className = 'ba-after';
    stage.appendChild(top);
    stage.appendChild(grip);
    stage.appendChild(range);

    const set = function () { stage.style.setProperty('--pos', range.value + '%'); };
    range.addEventListener('input', set);
    set();
    sec.hidden = false;
  }

  /* Cinematic hero. Scroll position through the tall .hero-cinema track drives
     video.currentTime (smoothed in rAF, never set straight from the scroll
     event) plus the intro and outro text. Narrow screens and reduced motion get
     a static poster and always-visible intro text, matching the CSS. The video
     is videos/hero-orbit.mp4 (short keyframe spacing so scrubbing is smooth). */
  function initHeroCinema() {
    const section = document.getElementById('heroCinema');
    const video = document.getElementById('heroVideo');
    const startEl = document.getElementById('heroContentStart');
    const endEl = document.getElementById('heroContentEnd');
    if (!section || !video || !startEl || !endEl) return;

    const narrowQuery = window.matchMedia('(max-width: 900px)');
    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const EASE = 0.12;
    const SNAP_EPSILON = 0.0006;
    const SEEK_EPSILON = 1 / 48;

    let active = false;
    let observer = null;
    let rafId = null;
    let intersecting = false;
    let progressInitialized = false;
    let current = 0;
    let videoReady = false;

    const clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };
    const lerp = function (a, b, t) { return a + (b - a) * t; };
    const smoothstep = function (t) { return t * t * (3 - 2 * t); };

    function startOpacity(p) {
      if (p <= 0.10) return lerp(1, 0.7, smoothstep(p / 0.10));
      if (p <= 0.20) return lerp(0.7, 0, smoothstep((p - 0.10) / 0.10));
      return 0;
    }
    function startTranslate(p) { return p <= 0.20 ? lerp(0, -14, smoothstep(p / 0.20)) : -14; }
    function endAmount(p) {
      if (p <= 0.75) return 0;
      if (p <= 0.90) return smoothstep((p - 0.75) / 0.15);
      return 1;
    }
    function setVisible(el, visible) {
      el.style.pointerEvents = visible ? 'auto' : 'none';
      if (visible) el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', 'true');
      $$('a, button', el).forEach(function (c) { c.tabIndex = visible ? 0 : -1; });
    }
    function applyText(p) {
      const so = startOpacity(p);
      startEl.style.opacity = so;
      startEl.style.transform = 'translateY(' + startTranslate(p) + 'px)';
      setVisible(startEl, so > 0.05);
      const ea = endAmount(p);
      endEl.style.opacity = ea;
      endEl.style.transform = 'translateY(' + lerp(20, 0, ea) + 'px)';
      setVisible(endEl, ea > 0.5);
    }
    function tick() {
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrollable = section.offsetHeight - window.innerHeight;
      const target = scrollable > 0 ? clamp((window.scrollY - sectionTop) / scrollable, 0, 1) : 0;
      if (!progressInitialized) { current = target; progressInitialized = true; }
      else if (Math.abs(target - current) < SNAP_EPSILON) current = target;
      else current += (target - current) * EASE;

      if (videoReady && video.duration) {
        const desired = clamp(current * video.duration, 0, video.duration - 0.02);
        if (Math.abs(video.currentTime - desired) > SEEK_EPSILON) {
          try { video.currentTime = desired; } catch (err) { /* mid-seek errors are transient */ }
        }
      }
      applyText(current);
      rafId = intersecting ? requestAnimationFrame(tick) : null;
    }
    function startLoop() { if (rafId === null) rafId = requestAnimationFrame(tick); }

    function enableCinema() {
      if (active) return;
      active = true;
      if (!video.hasChildNodes()) {
        const source = document.createElement('source');
        source.src = 'videos/hero-orbit.mp4';
        source.type = 'video/mp4';
        video.preload = 'auto';
        video.appendChild(source);
        video.load();
      }
      video.addEventListener('loadedmetadata', function () { videoReady = true; }, { once: true });
      video.addEventListener('loadeddata', function () { video.classList.add('is-ready'); }, { once: true });
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { intersecting = en.isIntersecting; if (intersecting) startLoop(); });
      }, { threshold: 0 });
      observer.observe(section);
      progressInitialized = false;
      startLoop();
    }

    function disableCinema() {
      if (!active) return;
      active = false;
      if (observer) { observer.disconnect(); observer = null; }
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      intersecting = false;
      videoReady = false;
      video.classList.remove('is-ready');
      video.pause();
      video.removeAttribute('src');
      while (video.firstChild) video.removeChild(video.firstChild);
      video.load();
      [startEl, endEl].forEach(function (el) {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.pointerEvents = '';
        el.removeAttribute('aria-hidden');
        $$('a, button', el).forEach(function (c) { c.removeAttribute('tabindex'); });
      });
    }

    function evaluate() { (narrowQuery.matches || reduceQuery.matches) ? disableCinema() : enableCinema(); }
    narrowQuery.addEventListener('change', evaluate);
    reduceQuery.addEventListener('change', evaluate);
    evaluate();
  }

  /* Small looping clips load and play only while on screen. Never under
     reduced motion: the poster stays. */
  function initAutoplayVideos() {
    const videos = $$('video.autoplay-video[data-autoplay-src]');
    if (!videos.length || reduceMotion()) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        const v = en.target;
        if (en.isIntersecting) {
          if (!v.src) { v.src = v.getAttribute('data-autoplay-src'); v.load(); }
          const p = v.play();
          if (p && p.catch) p.catch(function () { /* autoplay blocked: poster stays */ });
        } else v.pause();
      });
    }, { threshold: 0.35 });
    videos.forEach(function (v) { io.observe(v); });
  }

  /* Page transition. An internal link click plays a short car clip over black,
     the old page navigates at the clip's midpoint and the new page picks the
     clip up where it left off (handed over through sessionStorage). Every path
     has a timeout so the overlay can never get stuck. The clip is 0.8s
     (videos/car-cutscene.mp4 and .webm). */
  const CUT_KEY = 'rd-cutscene';

  function peekCutscene() {
    try {
      const c = JSON.parse(sessionStorage.getItem(CUT_KEY));
      if (c && Date.now() - c.at < 4000 && !reduceMotion()) document.documentElement.classList.add('cutscene-arrive');
    } catch (err) { /* storage unavailable */ }
  }

  function initPageTransition() {
    const NAV_AT = 0.4;
    const NAV_FALLBACK_MS = 600;
    const HARD_LIMIT_MS = 1800;
    const root = document.documentElement;

    let arrival = null;
    try {
      arrival = JSON.parse(sessionStorage.getItem(CUT_KEY));
      sessionStorage.removeItem(CUT_KEY);
    } catch (err) { /* no handover */ }

    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduceMotion() || saveData) { root.classList.remove('cutscene-arrive'); return; }
    const arriving = !!arrival && Date.now() - arrival.at < 2500;

    const overlay = document.createElement('div');
    overlay.className = 'cutscene';
    overlay.setAttribute('aria-hidden', 'true');
    const video = document.createElement('video');
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('disablepictureinpicture', '');
    video.tabIndex = -1;
    video.preload = 'auto';
    video.poster = 'images/car-cutscene-poster.jpg';
    [['videos/car-cutscene.webm', 'video/webm'], ['videos/car-cutscene.mp4', 'video/mp4']].forEach(function (pair) {
      const source = document.createElement('source');
      source.src = pair[0];
      source.type = pair[1];
      video.appendChild(source);
    });
    overlay.appendChild(video);
    document.body.appendChild(overlay);

    let timers = [];
    let running = false;
    let navigated = false;
    const later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
    const clearTimers = function () { timers.forEach(clearTimeout); timers = []; };

    function hide(instant) {
      clearTimers();
      running = false;
      navigated = false;
      video.pause();
      overlay.classList.remove('is-seeking');
      if (instant) overlay.classList.add('is-instant');
      overlay.classList.remove('is-active');
      if (instant) requestAnimationFrame(function () { requestAnimationFrame(function () { overlay.classList.remove('is-instant'); }); });
    }

    if (arriving) {
      running = true;
      overlay.classList.add('is-active', 'is-instant', 'is-seeking');
      root.classList.remove('cutscene-arrive');
      requestAnimationFrame(function () { requestAnimationFrame(function () { overlay.classList.remove('is-instant'); }); });
      const offset = Math.max(0, (arrival.vt || 0) + (Date.now() - arrival.at) / 1000);
      const resume = function () {
        if (offset >= video.duration - 0.05) { hide(); return; }
        video.addEventListener('seeked', function () { overlay.classList.remove('is-seeking'); }, { once: true });
        video.currentTime = offset;
        const p = video.play();
        if (p && p.catch) p.catch(function () { hide(); });
      };
      if (video.readyState >= 1) resume(); else video.addEventListener('loadedmetadata', resume, { once: true });
      video.addEventListener('ended', function () { hide(); }, { once: true });
      video.addEventListener('error', function () { hide(); }, { once: true });
      later(function () { hide(); }, HARD_LIMIT_MS);
    } else {
      root.classList.remove('cutscene-arrive');
      video.load();
    }

    function isCutsceneLink(link) {
      const href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#') return false;
      if (link.target && link.target !== '_self') return false;
      if (link.hasAttribute('download')) return false;
      let url;
      try { url = new URL(link.href, window.location.href); } catch (err) { return false; }
      if (url.protocol !== window.location.protocol || url.origin !== window.location.origin) return false;
      if (!/(\/|\.html?)$/.test(url.pathname)) return false;
      if (url.pathname === window.location.pathname) return false;
      return true;
    }

    function play(href) {
      running = true;
      navigated = false;
      overlay.classList.remove('is-seeking');
      video.currentTime = 0;
      const started = video.play();
      const go = function () {
        if (navigated) return;
        navigated = true;
        try { sessionStorage.setItem(CUT_KEY, JSON.stringify({ at: Date.now(), vt: video.currentTime })); } catch (err) { /* no handover */ }
        window.location.href = href;
      };
      if (started && started.catch) started.catch(function () { hide(); window.location.href = href; });
      overlay.classList.add('is-active');
      const watch = function () {
        if (navigated || !running) return;
        if (video.currentTime >= NAV_AT) go(); else requestAnimationFrame(watch);
      };
      requestAnimationFrame(watch);
      later(go, NAV_FALLBACK_MS);
      later(function () { hide(); }, HARD_LIMIT_MS);
    }

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest && e.target.closest('a[href]');
      if (!link || !isCutsceneLink(link)) return;
      e.preventDefault();
      if (running) return;
      play(link.href);
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) hide(true); });
  }

  /* ---------------------------------------------------------------- */
  /* BOOKING PAGE                                                     */
  /* ---------------------------------------------------------------- */
  function initBuilder() {
    const root = $('#builder');
    if (!root) return;

    const st = {
      size: null, pkg: null, club: false, extras: [], newCust: false, goal: '',
      step: 'vehicle',
      d: { name: '', mobile: '', suburb: '', day: '', key: '', notes: '' }
    };

    const STEP_LABEL = { vehicle: 'Vehicle', service: 'Service', extras: 'Extras', details: 'Your details' };
    const flow = function () { return st.size === 'c' ? ['vehicle', 'details'] : ['vehicle', 'service', 'extras', 'details']; };
    const res = function () { return calc(st); };
    const hasPkg = function () { return !!res().pkg; };
    const canReach = function (step) {
      if (step === 'vehicle') return true;
      if (!st.size) return false;
      if (st.size === 'c') return step === 'details';
      if (step === 'service') return true;
      return hasPkg();
    };

    /* ----- vehicle ----- */
    function renderVehicle() {
      $('#vehicle-options').innerHTML =
        '<fieldset class="opts"><legend class="visually-hidden">Vehicle type</legend>' +
        DATA.sizes.map(function (s) {
          return '<div class="opt"><input type="radio" name="size" id="size-' + s.id + '" value="' + s.id + '">' +
            '<label for="size-' + s.id + '"><span class="opt-name">' + s.name + '</span><span class="opt-eg">' + s.eg + '</span></label></div>';
        }).join('') + '</fieldset>';
    }

    /* ----- service ----- */
    function offeredPkgs() {
      return DATA.packages.filter(function (p) { return pkgPrice(p.id, st.size) !== null; });
    }

    function pkgCard(p, isRec) {
      const price = pkgPrice(p.id, st.size);
      const chips = (p.tag ? '<span class="chip">' + p.tag + '</span>' : '') + (isRec ? '<span class="chip chip-rec">Recommended</span>' : '');
      return '<div class="pkg-opt" data-pkg="' + p.id + '">' +
        '<input type="radio" name="pkg" id="pkg-' + p.id + '" value="' + p.id + '">' +
        '<label for="pkg-' + p.id + '" class="pkg-opt-main">' +
        '<span class="pkg-opt-head"><span class="pkg-opt-name">' + p.name + '</span>' + chips + '</span>' +
        '<span class="pkg-opt-blurb">' + p.blurb + '</span>' +
        '<span class="pkg-opt-time">Est. time: ' + timeText(p.id, st.size, []) + '</span>' +
        '<span class="pkg-opt-price" data-base="' + price + '">' + (p.from ? '<small>from</small> ' : '') + money(price) + '</span>' +
        '</label>' +
        '<details class="pkg-inc"><summary>What\'s included</summary><ul>' +
        p.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul></details>' +
        '<div class="pkg-sel" hidden></div></div>';
    }

    function renderServiceList() {
      const box = $('#service-list');
      const offered = offeredPkgs();
      const goal = DATA.goals.filter(function (g) { return g.id === st.goal; })[0];
      let html = '';
      if (goal) {
        const list = goal.pkgs.filter(function (id) { return offered.some(function (p) { return p.id === id; }); });
        html = '<div class="pkg-list">' + list.map(function (id) { return pkgCard(PKG[id], id === goal.rec); }).join('') + '</div>';
      } else {
        html = DATA.groups.map(function (g) {
          const list = offered.filter(function (p) { return p.group === g.id; });
          if (!list.length) return '';
          return '<div class="pkg-set"><h3 class="pkg-set-title">' + g.name + '</h3><div class="pkg-list">' +
            list.map(function (p) { return pkgCard(p, false); }).join('') + '</div></div>';
        }).join('');
      }
      box.innerHTML = html;
      syncService();
    }

    function renderGoals() {
      $('#goal-options').innerHTML =
        DATA.goals.map(function (g) {
          return '<button type="button" class="goal" data-goal="' + g.id + '" aria-pressed="false"><strong>' + g.name + '</strong><span>' + g.note + '</span></button>';
        }).join('') +
        '<button type="button" class="goal goal-all" data-goal="" aria-pressed="false"><strong>Show everything</strong><span>Every package</span></button>';
    }

    function levelHtml(p) {
      let bars = '';
      for (let i = 1; i <= 4; i++) bars += '<i' + (i <= p.level ? ' class="on"' : '') + '></i>';
      return '<span class="level"><span class="level-bars" aria-hidden="true">' + bars + '</span>' +
        '<span>Level ' + p.level + ' of 4: ' + DATA.levels[p.level] + '</span></span>';
    }

    /* Selected state, upsell nudge, club toggle. Built once per selection so
       the club checkbox keeps focus while the price updates. */
    function syncService() {
      const notice = $('#service-notice');
      const stale = st.pkg && pkgPrice(st.pkg, st.size) === null;
      if (stale) {
        notice.hidden = false;
        notice.textContent = PKG[st.pkg].name + " isn't offered for that vehicle. Pick another package below.";
      } else if (st.pkg && !st.size) {
        notice.hidden = false;
        notice.textContent = PKG[st.pkg].name + ' is selected. Pick your vehicle and we will show your price.';
      } else {
        notice.hidden = true;
      }

      $$('.goal').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-goal') === st.goal ? 'true' : 'false'); });

      $$('.pkg-opt').forEach(function (card) {
        const id = card.getAttribute('data-pkg');
        const on = id === st.pkg && !stale;
        const input = $('input', card);
        const area = $('.pkg-sel', card);
        input.checked = on;
        card.classList.toggle('is-selected', on);
        if (!on) { area.hidden = true; area.innerHTML = ''; area.removeAttribute('data-built'); return; }

        const p = PKG[id];
        if (area.getAttribute('data-built') !== id) {
          let h = levelHtml(p);
          if (p.up && pkgPrice(p.up.to, st.size) !== null) {
            const diff = pkgPrice(p.up.to, st.size) - pkgPrice(id, st.size);
            h += '<p class="nudge">Step up to ' + PKG[p.up.to].name + ' for ' + money(diff) + ' more: it adds ' + p.up.adds + '. ' +
              '<button type="button" class="link-btn" data-upsell="' + p.up.to + '">Switch to ' + PKG[p.up.to].name + '</button></p>';
          }
          if (p.club) {
            h += '<label class="switch"><input type="checkbox" id="club-toggle"><span>Make it monthly (Gloss Club)</span></label>' +
              '<p class="club-note"><span id="club-line"></span></p>';
          }
          area.innerHTML = h;
          area.setAttribute('data-built', id);
          area.hidden = false;
        }
        if (p.club) {
          $('#club-toggle', area).checked = st.club;
          $('#club-line', area).textContent = st.club
            ? money(pkgPrice(id, st.size, true)) + ' a month, per wash. Priority booking, pay after each wash, pause or cancel any time.'
            : 'Same wash, once a month, for ' + money(pkgPrice(id, st.size, true)) + ' with priority booking. Pay after each wash, pause or cancel any time.';
          const label = $('.pkg-opt-price', card);
          label.innerHTML = money(pkgPrice(id, st.size, st.club)) + (st.club ? ' <small>a month</small>' : '');
        }
      });
    }

    /* ----- extras ----- */
    function offeredExtras() {
      return DATA.extras.filter(function (x) { return extraPrice(x.id, st.size) !== null; });
    }

    function renderExtras() {
      const box = $('#extras-list');
      if (!st.size || st.size === 'c') { box.innerHTML = ''; return; }
      const pid = st.pkg && pkgPrice(st.pkg, st.size) !== null ? st.pkg : null;
      const offered = offeredExtras();
      const chargeable = offered.filter(function (x) { return !isIncluded(x.id, pid); });
      const inc = offered.filter(function (x) { return isIncluded(x.id, pid); });

      const bundles = DATA.bundles.map(function (b) {
        const usable = b.ids.filter(function (id) { return chargeable.some(function (x) { return x.id === id; }); });
        if (!usable.length) return '';
        return '<button type="button" class="bundle" data-bundle="' + b.id + '" aria-pressed="false"><strong>' + b.name + '</strong><span>' + b.note + '</span></button>';
      }).join('');

      const groups = DATA.areas.map(function (a) {
        const list = chargeable.filter(function (x) { return x.area === a.id; });
        if (!list.length) return '';
        return '<fieldset class="extras-area"><legend>' + a.name + '</legend>' + list.map(function (x) {
          const pairs = pid && x.pairs && x.pairs.indexOf(pid) !== -1;
          return '<div class="extra"><input type="checkbox" id="x-' + x.id + '" value="' + x.id + '">' +
            '<label for="x-' + x.id + '"><span class="extra-main"><span class="extra-name">' + x.name + '</span>' +
            '<span class="extra-desc">' + x.desc + '</span>' +
            (pairs ? '<span class="extra-pair">Pairs well with ' + PKG[pid].name + '</span>' : '') +
            '</span><span class="extra-price">+' + money(extraPrice(x.id, st.size)) + '</span></label></div>';
        }).join('') + '</fieldset>';
      }).join('');

      box.innerHTML =
        (inc.length ? '<p class="included-note"><strong>Already included in ' + PKG[pid].name + ':</strong> ' +
          inc.map(function (x) { return x.name; }).join(', ') + '.</p>' : '') +
        (bundles ? '<div class="bundles" role="group" aria-label="Add-on packs">' + bundles + '</div>' : '') +
        groups;
      syncExtras();
    }

    function syncExtras() {
      $$('#extras-list .extra input').forEach(function (i) { i.checked = st.extras.indexOf(i.value) !== -1; });
      $$('#extras-list .bundle').forEach(function (b) {
        const ids = usableBundle(b.getAttribute('data-bundle'));
        const all = ids.length > 0 && ids.every(function (id) { return st.extras.indexOf(id) !== -1; });
        b.setAttribute('aria-pressed', all ? 'true' : 'false');
      });
      const n = res().extras.length;
      $('#discount-line').textContent =
        n >= 3 ? '10% off your add-ons is applied.' :
        n === 2 ? '5% off your add-ons is applied. Pick a third for 10%.' :
        'Pick two add-ons for 5% off them, three or more for 10% off.';
      const nc = res();
      const eligible = nc.pkg && nc.pk >= DATA.discounts.newCustomerMin;
      $('#newcust').checked = st.newCust;
      $('#newcust-line').textContent = st.newCust && !eligible
        ? "The $20 comes off packages of $100 or more, so it doesn't apply to this one."
        : '$20 off any package of $100 or more.';
    }

    function usableBundle(id) {
      const b = DATA.bundles.filter(function (x) { return x.id === id; })[0];
      const pid = st.pkg && pkgPrice(st.pkg, st.size) !== null ? st.pkg : null;
      return b.ids.filter(function (x) { return extraPrice(x, st.size) !== null && !isIncluded(x, pid); });
    }

    /* ----- details + summary ----- */
    function detailsProblems() {
      const p = {};
      if (!st.d.name.trim()) p.name = 'Add your name so we know who to text back.';
      if (st.d.mobile.replace(/\D/g, '').length < 8) p.mobile = 'Add a mobile number we can reach you on.';
      if (!st.d.suburb.trim()) p.suburb = 'Add your suburb so we can confirm we cover it.';
      return p;
    }

    function summaryText() {
      const r = res();
      const L = [];
      L.push(r.quote ? "Hi Refined Detailing, I'd like a quote." : "Hi Refined Detailing, I'd like to book.");
      L.push('Vehicle: ' + (r.size ? r.size.name : ''));
      if (!r.quote && r.pkg) {
        L.push('Package: ' + r.pkg.name + (r.club ? ' (Gloss Club, monthly)' : '') + ' (' + (r.from ? 'from ' : '') + money(r.pk) + ')');
        L.push('Extras: ' + (r.extras.length ? r.extras.map(function (x) { return x.name + ' (' + money(x.price) + ')'; }).join(', ') : 'none'));
        if (r.bundle) L.push('Add-on saving: -' + money(r.bundle));
        if (r.firstOff) L.push('New customer saving: -' + money(r.firstOff));
        L.push('Estimated time: ' + r.time);
        L.push('Total: ' + (r.from ? 'from ' : '') + money(r.total) + (r.club ? ' per monthly wash' : '') + ' (includes GST and travel)');
      }
      L.push('Name: ' + st.d.name.trim());
      L.push('Mobile: ' + st.d.mobile.trim());
      L.push('Suburb: ' + st.d.suburb.trim());
      if (st.d.day.trim()) L.push('Preferred day: ' + st.d.day.trim());
      if (st.d.key.trim()) L.push('Key location: ' + st.d.key.trim());
      if (st.d.notes.trim()) L.push('Notes: ' + st.d.notes.trim());
      return L.join('\n');
    }

    function syncDetails() {
      const r = res();
      $('#details-title').textContent = r.quote ? 'Tell us about it' : 'Where and when?';
      $('#details-lede').textContent = r.quote
        ? "We price caravans, boats, trucks and fleets one by one. Send us the details and we'll text you a quote."
        : 'Last step. This builds a text message for you to send us.';
      $('#btn-sms').textContent = r.quote ? 'Text for a quote' : 'Text to book';
      $('#notes-label').textContent = r.quote ? 'What is it, and what does it need?' : 'Notes (optional)';
      const text = summaryText();
      $('#sms-preview').textContent = text;
      $('#btn-sms').setAttribute('href', smsHref(text));
    }

    /* ----- plate ----- */
    let lastTotal = null;
    let lastLive = '';

    function setOdo(el, n) {
      const s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const shape = s.replace(/\d/g, '#');
      if (el.getAttribute('data-shape') !== shape) {
        el.textContent = '';
        el.setAttribute('data-shape', shape);
        s.split('').forEach(function (ch) {
          const node = document.createElement('span');
          if (/\d/.test(ch)) {
            node.className = 'odo-col';
            const strip = document.createElement('span');
            strip.className = 'odo-strip';
            for (let i = 0; i < 10; i++) {
              const d = document.createElement('span');
              d.textContent = i;
              strip.appendChild(d);
            }
            node.appendChild(strip);
          } else {
            node.className = 'odo-sep';
            node.textContent = ch;
          }
          el.appendChild(node);
        });
        void el.offsetWidth;
      }
      const digits = s.replace(/\D/g, '');
      $$('.odo-strip', el).forEach(function (strip, i) {
        strip.style.transform = 'translateY(calc(var(--odo-h) * -' + digits[i] + '))';
      });
    }

    function renderPlate() {
      const r = res();
      const row = function (k, v, cls) { return '<div class="pl' + (cls ? ' ' + cls : '') + '"><dt>' + k + '</dt><dd>' + v + '</dd></div>'; };
      let rows = row('Vehicle', r.size ? r.size.name : 'Not chosen yet', r.size ? '' : 'pl-empty');
      if (r.quote) {
        rows += row('Price', "We'll quote it individually");
      } else {
        rows += row('Package', r.pkg ? r.pkg.name + (r.club ? ' (monthly)' : '') + ' <b>' + (r.from ? 'from ' : '') + money(r.pk) + '</b>' : 'Not chosen yet', r.pkg ? '' : 'pl-empty');
        r.extras.forEach(function (x) { rows += row(x.name, '<b>' + money(x.price) + '</b>', 'pl-sub'); });
        if (r.bundle) rows += row('Add-on saving (' + Math.round(r.rate * 100) + '%)', '<b>-' + money(r.bundle) + '</b>', 'pl-save');
        if (r.firstOff) rows += row('New customer saving', '<b>-' + money(r.firstOff) + '</b>', 'pl-save');
        if (r.pkg) rows += row('Estimated time', r.time);
      }
      $('#plate-lines').innerHTML = rows;

      const figure = $('#plate-figure');
      const quote = $('#plate-quote');
      figure.hidden = r.quote;
      quote.hidden = !r.quote;
      $('#plate-from').hidden = !(r.from && r.ready);
      $('#plate-per').hidden = !(r.club && r.ready);
      figure.classList.toggle('is-empty', !r.ready);
      $('#plate-hint').textContent = r.quote ? 'Send us the details and we will text you a price.' :
        !r.size ? 'Choose your vehicle to start.' :
        !r.pkg ? 'Choose a package to see your price.' :
        r.from ? 'Paint Correction is priced from this figure. We will confirm your fixed price by text before you book it in.' :
        'One fixed price for this exact job.';

      const value = r.ready ? r.total : 0;
      setOdo($('#odo'), value);
      if (r.ready && lastTotal !== null && value !== lastTotal) {
        const streak = $('#plate-streak');
        streak.classList.remove('is-sweeping');
        void streak.offsetWidth;
        streak.classList.add('is-sweeping');
      }
      lastTotal = value;

      const live = r.quote ? "Quote request. We'll price it individually." :
        r.ready ? 'Total ' + (r.from ? 'from ' : '') + money(r.total) + (r.club ? ' per monthly wash' : '') + ', includes GST and travel' :
        'Choose a vehicle and package to see your price.';
      if (live !== lastLive) { $('#plate-live').textContent = live; lastLive = live; }
    }

    /* ----- steps ----- */
    function renderSteps() {
      const order = flow();
      $$('.step-btn').forEach(function (b) {
        const step = b.getAttribute('data-goto');
        const item = b.closest('li');
        const shown = order.indexOf(step) !== -1;
        item.hidden = !shown;
        if (!shown) return;
        const idx = order.indexOf(step);
        const cur = order.indexOf(st.step);
        b.disabled = !canReach(step);
        b.setAttribute('aria-current', step === st.step ? 'step' : 'false');
        item.classList.toggle('is-done', idx < cur && canReach(step));
        $('.step-num', b).textContent = String(idx + 1);
      });
      $$('.panel').forEach(function (p) { p.hidden = p.getAttribute('data-step') !== st.step; });

      const order2 = flow();
      const i = order2.indexOf(st.step);
      const next = order2[i + 1];
      const prev = order2[i - 1];
      $$('.panel').forEach(function (p) {
        const nextBtn = $('.btn-next', p);
        const backBtn = $('.btn-back', p);
        if (backBtn) { backBtn.hidden = !prev; if (prev) backBtn.textContent = 'Back'; }
        if (nextBtn && next) {
          nextBtn.textContent = 'Next: ' + STEP_LABEL[next];
          nextBtn.disabled = !canReach(next);
        }
      });
      const hint = { vehicle: 'Choose a vehicle to carry on.', service: 'Choose a package to carry on.' }[st.step];
      $$('.next-hint').forEach(function (h) {
        const need = next && !canReach(next);
        h.textContent = need && hint ? hint : '';
      });
    }

    function go(step, focus) {
      if (!canReach(step) || flow().indexOf(step) === -1) return;
      st.step = step;
      renderSteps();
      if (step === 'details') syncDetails();
      if (focus) {
        const h = $('#panel-' + step + ' h2');
        h.focus();
        const top = root.getBoundingClientRect().top + window.scrollY - 90;
        if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduceMotion() ? 'auto' : 'smooth' });
      }
    }

    function refresh() {
      /* If the vehicle changed and the step is no longer valid, step back. */
      if (flow().indexOf(st.step) === -1 || !canReach(st.step)) {
        st.step = st.size === 'c' ? 'vehicle' : (st.size ? 'service' : 'vehicle');
      }
      renderSteps();
      renderPlate();
      if (st.step === 'details') syncDetails();
    }

    /* ----- events ----- */
    root.addEventListener('change', function (e) {
      const t = e.target;
      if (t.name === 'size') {
        st.size = t.value;
        renderServiceList();
        renderExtras();
        refresh();
      } else if (t.name === 'pkg') {
        st.pkg = t.value;
        st.club = false;
        syncService();
        renderExtras();
        refresh();
      } else if (t.id === 'club-toggle') {
        st.club = t.checked;
        syncService();
        refresh();
      } else if (t.closest('#extras-list') && t.type === 'checkbox') {
        st.extras = st.extras.filter(function (id) { return id !== t.value; });
        if (t.checked) st.extras.push(t.value);
        syncExtras();
        refresh();
      } else if (t.id === 'newcust') {
        st.newCust = t.checked;
        syncExtras();
        refresh();
      }
    });

    root.addEventListener('click', function (e) {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.classList.contains('goal')) {
        st.goal = t.getAttribute('data-goal');
        renderServiceList();
      } else if (t.hasAttribute('data-upsell')) {
        st.pkg = t.getAttribute('data-upsell');
        st.club = false;
        syncService();
        renderExtras();
        refresh();
        const input = $('#pkg-' + st.pkg);
        if (input) input.focus();
      } else if (t.classList.contains('bundle')) {
        const ids = usableBundle(t.getAttribute('data-bundle'));
        const all = ids.every(function (id) { return st.extras.indexOf(id) !== -1; });
        st.extras = st.extras.filter(function (id) { return ids.indexOf(id) === -1; });
        if (!all) st.extras = st.extras.concat(ids);
        syncExtras();
        refresh();
      } else if (t.classList.contains('step-btn')) {
        go(t.getAttribute('data-goto'), true);
      } else if (t.classList.contains('btn-next')) {
        const order = flow();
        go(order[order.indexOf(st.step) + 1], true);
      } else if (t.classList.contains('btn-back')) {
        const order = flow();
        go(order[order.indexOf(st.step) - 1], true);
      }
    });

    /* details form */
    const fields = { name: '#f-name', mobile: '#f-mobile', suburb: '#f-suburb', day: '#f-day', key: '#f-key', notes: '#f-notes' };
    Object.keys(fields).forEach(function (k) {
      $(fields[k]).addEventListener('input', function (e) {
        st.d[k] = e.target.value;
        if (e.target.getAttribute('aria-invalid') === 'true') showProblems(true);
        syncDetails();
      });
    });

    function showProblems(onlyClear) {
      const p = detailsProblems();
      ['name', 'mobile', 'suburb'].forEach(function (k) {
        const input = $(fields[k]);
        const msg = $('#err-' + k);
        const bad = !!p[k];
        if (onlyClear && bad) return;
        input.setAttribute('aria-invalid', bad ? 'true' : 'false');
        msg.textContent = bad ? p[k] : '';
      });
      return p;
    }

    $('#details-form').addEventListener('submit', function (e) { e.preventDefault(); });

    $('#btn-sms').addEventListener('click', function (e) {
      const p = showProblems(false);
      const first = ['name', 'mobile', 'suburb'].filter(function (k) { return p[k]; })[0];
      if (first) { e.preventDefault(); $(fields[first]).focus(); return; }
      $('#btn-sms').setAttribute('href', smsHref(summaryText()));
    });

    $('#btn-copy').addEventListener('click', function () {
      const text = summaryText();
      const status = $('#copy-status');
      const done = function (ok) { status.textContent = ok ? 'Copied. Paste it into a text or message to 0444 546 092.' : 'Could not copy. Select the preview text and copy it by hand.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.className = 'visually-hidden';
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        document.body.removeChild(ta);
        done(ok);
      }
    });

    /* mobile plate breakdown */
    const toggle = $('#plate-toggle');
    toggle.addEventListener('click', function () {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      $('#plate').classList.toggle('is-open', open);
    });

    /* Preselect from the address, for example book.html#pkg=signature */
    function applyHash() {
      const params = new URLSearchParams(location.hash.replace(/^#/, ''));
      const pkg = params.get('pkg');
      const size = params.get('size');
      if (pkg && PKG[pkg]) { st.pkg = pkg; st.club = false; }
      if (size && SIZE[size]) { st.size = size; }
      if (params.get('club') === '1' && st.pkg && PKG[st.pkg].club) st.club = true;
      if (params.get('extras')) {
        params.get('extras').split(',').forEach(function (id) {
          if (EXTRA[id] && st.extras.indexOf(id) === -1) st.extras.push(id);
        });
      }
      if (st.size) { const r = $('#size-' + st.size); if (r) r.checked = true; }
      renderServiceList();
      renderExtras();
      if (st.size && st.size !== 'c' && pkg && st.step === 'vehicle') st.step = 'service';
      refresh();
    }

    renderVehicle();
    renderGoals();
    applyHash();
    window.addEventListener('hashchange', applyHash);
  }

  peekCutscene();

  function boot() {
    initPriceLabels();
    initNav();
    initSmoothScroll();
    initReveal();
    initHeroCinema();
    initAutoplayVideos();
    initFaq();
    initSlider();
    initBuilder();
    initPageTransition();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
