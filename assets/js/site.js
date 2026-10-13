/* Lubby's Locs — site.js (vanilla, no dependencies) */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var R = root.getAttribute('data-root') || '';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function icon(n, cls) { return '<svg class="' + (cls || 'i') + '" aria-hidden="true" focusable="false"><use href="#i-' + n + '"/></svg>'; }

  /* ---------------- products (Square store, Oct 12 2026) ---------------- */
  var P = {
    'hair-butter': { n: 'Hair Butter', p: 10, u: 'https://lubbys-locs.square.site/product/hair-butter/1' },
    'growth-oil': { n: 'Growth Oil', p: 10, u: 'https://lubbys-locs.square.site/product/growth-oil/2' },
    'velvet-durag': { n: 'Velvet Durag', p: 8, u: 'https://lubbys-locs.square.site/product/velvet-durag/3' },
    'durag-premium-silk': { n: 'Premium Silk Durag', p: 8, u: 'https://lubbys-locs.square.site/product/durag-premium-silk/4' },
    'hair-bonnet-regular': { n: 'Hair Bonnet — Regular', p: 5, u: 'https://lubbys-locs.square.site/product/hair-bonnet-regular/5' },
    'loc-stocking-cap': { n: 'Loc Stocking Cap', p: 5, u: 'https://lubbys-locs.square.site/product/loc-stocking-cap/6' },
    'hair-bonnet-xl': { n: 'Hair Bonnet XL', p: 8, u: 'https://lubbys-locs.square.site/product/hair-bonnet-xl/7' }
  };
  var KEY = 'lubbys-bag-v1', MAXQ = 20;
  var bag = [];
  function load() {
    try { var raw = window.localStorage.getItem(KEY); var d = raw ? JSON.parse(raw) : []; if (Array.isArray(d)) bag = d.filter(function (l) { return l && P[l.s] && l.q > 0; }).map(function (l) { return { s: l.s, q: Math.min(MAXQ, Math.max(1, l.q | 0)) }; }); } catch (e) { bag = bag || []; }
  }
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(bag)); } catch (e) { /* storage blocked: keep in memory */ } }
  function money(n) { return '$' + n.toFixed(2); }
  function count() { return bag.reduce(function (a, l) { return a + l.q; }, 0); }
  function subtotal() { return bag.reduce(function (a, l) { return a + l.q * P[l.s].p; }, 0); }
  function find(s) { for (var i = 0; i < bag.length; i++) if (bag[i].s === s) return bag[i]; return null; }
  function add(s, q) { var l = find(s); if (l) l.q = Math.min(MAXQ, l.q + q); else bag.push({ s: s, q: Math.min(MAXQ, q) }); save(); render(); }
  function setQ(s, q) { var l = find(s); if (!l) return; if (q <= 0) { bag = bag.filter(function (x) { return x.s !== s; }); } else l.q = Math.min(MAXQ, q); save(); render(); }
  function img(s) { return R + 'assets/img/shop/' + s + '-480.webp'; }

  var bagEl = $('#bag'), scrim = $('.scrim'), lastFocus = null;
  function render() {
    var n = count();
    $$('[data-bag-count]').forEach(function (el) { el.textContent = n ? String(n) : ''; });
    $$('[data-bag-open]').forEach(function (b) { b.setAttribute('data-n', n); b.setAttribute('aria-label', 'Open your bag, ' + n + (n === 1 ? ' item' : ' items')); });
    if (!bagEl) return;
    var lines = $('[data-bag-lines]', bagEl), empty = $('[data-bag-empty]', bagEl), foot = $('[data-bag-foot]', bagEl);
    lines.innerHTML = bag.map(function (l) {
      var p = P[l.s];
      return '<li class="bline" data-line="' + l.s + '"><a href="' + R + 'shop/' + l.s + '.html" tabindex="-1" aria-hidden="true"><img src="' + img(l.s) + '" width="76" height="76" alt=""></a>' +
        '<div><p class="bline__n"><a href="' + R + 'shop/' + l.s + '.html">' + p.n + '</a></p><p class="bline__p">' + money(p.p) + ' each</p>' +
        '<div class="bline__row"><div class="qty" role="group" aria-label="Quantity of ' + p.n + '">' +
        '<button type="button" data-l-step="-1" aria-label="Decrease quantity of ' + p.n + '">' + icon('minus') + '</button>' +
        '<input type="number" inputmode="numeric" min="1" max="' + MAXQ + '" value="' + l.q + '" data-l-input aria-label="Quantity of ' + p.n + '">' +
        '<button type="button" data-l-step="1" aria-label="Increase quantity of ' + p.n + '">' + icon('plus') + '</button></div>' +
        '<span class="bline__t">' + money(l.q * p.p) + '</span></div>' +
        '<button type="button" class="bline__rm" data-l-rm>Remove<span class="sr"> ' + p.n + '</span></button></div></li>';
    }).join('');
    empty.hidden = bag.length > 0;
    foot.hidden = bag.length === 0;
    $('[data-bag-subtotal]', bagEl).textContent = money(subtotal());
    if (!bag.length) showView('list');
  }
  function showView(v) {
    $$('.bag__view', bagEl).forEach(function (el) { el.hidden = el.getAttribute('data-view') !== v; });
    var foot = $('[data-bag-foot]', bagEl); if (foot) foot.hidden = v !== 'list' || !bag.length;
  }
  function openBag(opener) {
    if (!bagEl) return;
    lastFocus = opener || doc.activeElement;
    bagEl.hidden = false; scrim.hidden = false;
    showView('list');
    requestAnimationFrame(function () { bagEl.classList.add('is-open'); scrim.classList.add('is-open'); });
    doc.body.classList.add('is-locked');
    $$('[data-bag-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    setTimeout(function () { var x = $('.bag__x', bagEl); if (x) x.focus(); }, 60);
  }
  function closeBag() {
    if (!bagEl || bagEl.hidden) return;
    bagEl.classList.remove('is-open'); scrim.classList.remove('is-open');
    doc.body.classList.remove('is-locked');
    $$('[data-bag-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    setTimeout(function () { bagEl.hidden = true; scrim.hidden = true; }, reduce ? 0 : 380);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function checkout() {
    if (!bag.length) return;
    if (bag.length === 1) { window.location.href = P[bag[0].s].u; return; }
    var co = $('[data-bag-co]', bagEl);
    co.innerHTML = bag.map(function (l) {
      var p = P[l.s];
      return '<li class="coi"><img src="' + img(l.s) + '" width="56" height="56" alt=""><div><p class="coi__n">' + p.n + '</p><p class="coi__q">Qty ' + l.q + ' &middot; ' + money(l.q * p.p) + '</p></div>' +
        '<a href="' + p.u + '" target="_blank" rel="noopener" data-co-link>Open on Square' + icon('out') + '<span class="sr"> (opens in a new tab)</span></a></li>';
    }).join('');
    showView('checkout');
    var lead = $('.bag__lead', bagEl); if (lead) { lead.setAttribute('tabindex', '-1'); lead.focus(); }
  }
  var toastT;
  function toast(msg) {
    var t = $('[data-toast]'); if (!t) return;
    t.textContent = msg; t.classList.add('is-on'); clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove('is-on'); }, 2400);
  }
  function bump() { $$('.bagbtn').forEach(function (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }); }

  doc.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null; if (!t) return;
    var a;
    if ((a = t.closest('[data-bag-open]'))) { e.preventDefault(); openBag(a); return; }
    if (t.closest('[data-bag-close]')) { closeBag(); return; }
    if ((a = t.closest('[data-add]'))) {
      var s = a.getAttribute('data-add'), q = 1;
      if (a.hasAttribute('data-qty-from')) { var inp = $('[data-qty-input]'); q = Math.max(1, Math.min(MAXQ, parseInt(inp && inp.value, 10) || 1)); }
      add(s, q); bump(); toast(P[s].n + (q > 1 ? ' x' + q : '') + ' added to your bag'); openBag(a); return;
    }
    if ((a = t.closest('[data-add-set]'))) {
      a.getAttribute('data-add-set').split(',').forEach(function (s) { add(s, 1); });
      bump(); toast('Bonnet and butter added to your bag'); openBag(a); return;
    }
    if ((a = t.closest('[data-qty-step]'))) {
      var i2 = $('[data-qty-input]'); if (i2) i2.value = Math.max(1, Math.min(MAXQ, (parseInt(i2.value, 10) || 1) + parseInt(a.getAttribute('data-qty-step'), 10)));
      return;
    }
    var line = t.closest('[data-line]');
    if (line) {
      var ls = line.getAttribute('data-line'), cur = find(ls);
      if (t.closest('[data-l-step]') && cur) { setQ(ls, cur.q + parseInt(t.closest('[data-l-step]').getAttribute('data-l-step'), 10)); var nb = $('[data-line="' + ls + '"] [data-l-step="' + t.closest('[data-l-step]').getAttribute('data-l-step') + '"]', bagEl); if (nb) nb.focus(); else { var x = $('.bag__x', bagEl); if (x) x.focus(); } return; }
      if (t.closest('[data-l-rm]')) { setQ(ls, 0); toast(P[ls].n + ' removed'); var f = $('[data-l-rm]', bagEl) || $('.bag__x', bagEl); if (f) f.focus(); return; }
    }
    if (t.closest('[data-bag-checkout]')) { checkout(); return; }
    if (t.closest('[data-bag-back]')) { showView('list'); return; }
    if ((a = t.closest('[data-co-link]'))) { a.classList.add('is-done'); }
  });
  doc.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches && t.matches('[data-l-input]')) { var line = t.closest('[data-line]'); setQ(line.getAttribute('data-line'), Math.max(0, Math.min(MAXQ, parseInt(t.value, 10) || 0))); }
    if (t.matches && t.matches('[data-qty-input]')) { t.value = Math.max(1, Math.min(MAXQ, parseInt(t.value, 10) || 1)); }
  });
  window.addEventListener('storage', function (e) { if (e.key === KEY) { load(); render(); } });
  load(); render();
  // pages loaded from bfcache: resync
  window.addEventListener('pageshow', function () { load(); render(); });

  /* ---------------- mobile nav ---------------- */
  var mbtn = $('.menubtn'), mnav = $('#mnav');
  function closeNav() { if (!mnav || mnav.hidden) return; mnav.hidden = true; mbtn.setAttribute('aria-expanded', 'false'); doc.body.classList.remove('is-locked'); mbtn.focus(); }
  if (mbtn && mnav) {
    mbtn.addEventListener('click', function () { mnav.hidden = false; mbtn.setAttribute('aria-expanded', 'true'); doc.body.classList.add('is-locked'); var x = $('[data-mnav-close]', mnav); if (x) x.focus(); });
    $('[data-mnav-close]', mnav).addEventListener('click', closeNav);
    $$('a', mnav).forEach(function (a) { a.addEventListener('click', function () { mnav.hidden = true; doc.body.classList.remove('is-locked'); }); });
  }
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (lb && !lb.hidden) { closeLb(); return; } if (bagEl && !bagEl.hidden) { closeBag(); return; } closeNav(); }
    if (lb && !lb.hidden) { if (e.key === 'ArrowRight') stepLb(1); if (e.key === 'ArrowLeft') stepLb(-1); }
    if (e.key === 'Tab' && bagEl && !bagEl.hidden) { trap(e, bagEl); }
    if (e.key === 'Tab' && lb && !lb.hidden) { trap(e, lb); }
  });
  function trap(e, box) {
    var f = $$('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]', box).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return; var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------------- reveal + heading wipes ---------------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }) : null;
  $$('.wipe, .rv, .gi').forEach(function (el, i) {
    if (el.classList.contains('gi')) el.classList.add('reveal');
    if (io && !reduce) io.observe(el); else el.classList.add('is-in');
  });

  /* ---------------- scroll engine (rAF) ---------------- */
  var spins = $$('[data-spin]'), tilt = $$('[data-tilt]'), stages = $$('[data-stage]'), locSvg = $('[data-loc]');
  var loc = null;
  function buildLoc() {
    if (!locSvg) return;
    var body = locSvg.parentNode, H = body.offsetHeight, W = 44, amp = 9, per = 46, cx = W / 2;
    locSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); locSvg.setAttribute('width', W); locSvg.setAttribute('height', H);
    function strand(ph) { var d = 'M' + (cx + amp * Math.sin(ph)).toFixed(1) + ' 0'; for (var y = 4; y <= H; y += 4) d += ' L' + (cx + amp * Math.sin(ph + y / per * Math.PI * 2)).toFixed(1) + ' ' + y; return d; }
    var ns = 'http://www.w3.org/2000/svg';
    locSvg.innerHTML = '';
    function path(d, stroke, w, cls) { var p = doc.createElementNS(ns, 'path'); p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', stroke); p.setAttribute('stroke-width', w); p.setAttribute('stroke-linecap', 'round'); if (cls) p.setAttribute('class', cls); locSvg.appendChild(p); return p; }
    path('M' + cx + ' 0 L' + cx + ' ' + H, '#2a2a2a', 3, 's1');
    var defs = doc.createElementNS(ns, 'defs'), cp = doc.createElementNS(ns, 'clipPath'), rect = doc.createElementNS(ns, 'rect');
    cp.setAttribute('id', 'locclip'); rect.setAttribute('x', -20); rect.setAttribute('y', -10); rect.setAttribute('width', W + 40); rect.setAttribute('height', reduce ? H + 20 : 0);
    cp.appendChild(rect); defs.appendChild(cp); locSvg.appendChild(defs);
    var g = doc.createElementNS(ns, 'g'); g.setAttribute('clip-path', 'url(#locclip)'); locSvg.appendChild(g);
    function gpath(d, stroke, w) { var p = path(d, stroke, w); g.appendChild(p); return p; }
    gpath(strand(0), '#C8202A', 9); gpath(strand(Math.PI), '#E03030', 9);
    var hl = gpath(strand(Math.PI), '#F6F1EC', 2.2); hl.setAttribute('stroke-dasharray', '6 40'); hl.setAttribute('opacity', '.55');
    var hl2 = gpath(strand(0), '#0E0E0E', 2.2); hl2.setAttribute('stroke-dasharray', '4 42'); hl2.setAttribute('opacity', '.5');
    var tip = doc.createElementNS(ns, 'circle'); tip.setAttribute('r', '9'); tip.setAttribute('cx', cx); tip.setAttribute('fill', '#D9A441'); tip.setAttribute('cy', reduce ? H : 0); locSvg.appendChild(tip);
    loc = { rect: rect, hl: hl, hl2: hl2, tip: tip, H: H, body: body };
  }
  function frame() {
    ticking = false;
    var y = window.pageYOffset, vh = window.innerHeight;
    if (!reduce) {
      spins.forEach(function (el) { el.style.transform = 'rotate(' + (y * 0.12).toFixed(2) + 'deg)'; });
      if (window.innerWidth < 768) tilt.forEach(function (el) {
        var r = el.getBoundingClientRect(), p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = 'rotateX(' + (p * 10).toFixed(2) + 'deg) rotateY(' + (-p * 8).toFixed(2) + 'deg)';
      });
    }
    if (loc) {
      var r = loc.body.getBoundingClientRect(), prog = Math.max(0, Math.min(1, (vh * 0.62 - r.top) / r.height));
      var drawn = reduce ? 1 : prog;
      loc.rect.setAttribute('height', (loc.H * drawn + 10).toFixed(1));
      loc.hl.setAttribute('stroke-dashoffset', (-(y * 0.5) % 46).toFixed(1));
      loc.hl2.setAttribute('stroke-dashoffset', ((y * 0.5) % 46).toFixed(1));
      loc.tip.setAttribute('cy', (loc.H * drawn).toFixed(1));
      var tipY = r.top + loc.H * drawn;
      stages.forEach(function (st) { var sr = st.getBoundingClientRect(); var node = sr.top + (window.innerWidth >= 900 ? sr.height / 2 : 20); if (tipY >= node - 4 || reduce) st.classList.add('is-on'); });
    }
  }
  var ticking = false;
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  if (stages.length && !locSvg) stages.forEach(function (s) { s.classList.add('is-on'); });
  if (locSvg) { buildLoc(); var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { buildLoc(); frame(); }, 150); }); window.addEventListener('load', function () { buildLoc(); frame(); }); }
  window.addEventListener('scroll', onScroll, { passive: true });
  frame();

  /* desktop pointer tilt */
  if (!reduce) tilt.forEach(function (el) {
    var wrap = el.parentNode;
    wrap.addEventListener('pointermove', function (e) {
      if (window.innerWidth < 768) return;
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, yy = (e.clientY - r.top) / r.height - .5;
      el.style.transform = 'rotateY(' + (x * 18).toFixed(2) + 'deg) rotateX(' + (-yy * 14).toFixed(2) + 'deg)';
      el.style.setProperty('--sx', (x * 60).toFixed(1) + '%');
    });
    wrap.addEventListener('pointerleave', function () { if (window.innerWidth >= 768) { el.style.transform = 'rotateY(-12deg) rotateX(6deg)'; el.style.setProperty('--sx', '0%'); } });
    if (window.innerWidth >= 768) el.style.transform = 'rotateY(-12deg) rotateX(6deg)';
    el.style.transition = 'transform .25s ease-out';
  });

  /* ---------------- services category nav highlight ---------------- */
  var cl = $$('.cnav .chip');
  if (cl.length && io) {
    var secIo = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { cl.forEach(function (c) { var on = c.getAttribute('href') === '#' + en.target.id; c.setAttribute('aria-current', on ? 'true' : 'false'); if (on && c.scrollIntoView) { var list = c.closest('.cnav__list'); list.scrollTo({ left: list.scrollLeft + c.getBoundingClientRect().left - list.getBoundingClientRect().left - 4, behavior: reduce ? 'auto' : 'smooth' }); } }); } });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('.msec').forEach(function (s) { secIo.observe(s); });
  }

  /* ---------------- gallery filters + lightbox ---------------- */
  var gBtns = $$('[data-filter]'), gItems = $$('.gi'), gCount = $('[data-gcount]');
  gBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter'), n = 0;
      gBtns.forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      gItems.forEach(function (it) { var show = f === 'all' || it.getAttribute('data-cat') === f; it.hidden = !show; if (show) { n++; it.classList.add('is-in'); } });
      if (gCount) gCount.textContent = f === 'all' ? 'Showing all ' + n + ' photos' : 'Showing ' + n + ' ' + b.firstChild.textContent.trim() + ' photo' + (n === 1 ? '' : 's');
    });
  });
  var lb = $('[data-lbox]'), lbImg, lbCap, lbIdx = 0, lbOpener;
  function visibleG() { return gItems.filter(function (it) { return !it.hidden; }).map(function (it) { return $('[data-lb]', it); }); }
  function showLb(i) { var list = visibleG(); if (!list.length) return; lbIdx = (i + list.length) % list.length; var b = list[lbIdx]; lbImg.src = b.getAttribute('data-lb'); lbImg.alt = $('img', b).alt; lbCap.textContent = b.getAttribute('data-cap'); }
  function stepLb(d) { showLb(lbIdx + d); }
  function closeLb() { lb.hidden = true; doc.body.classList.remove('is-locked'); if (lbOpener) lbOpener.focus(); }
  if (lb) {
    lbImg = $('[data-lb-img]', lb); lbCap = $('[data-lb-cap]', lb);
    doc.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-lb]');
      if (b) { lbOpener = b; lb.hidden = false; doc.body.classList.add('is-locked'); showLb(visibleG().indexOf(b)); $('[data-lb-close]', lb).focus(); }
    });
    $('[data-lb-close]', lb).addEventListener('click', closeLb);
    $('[data-lb-prev]', lb).addEventListener('click', function () { stepLb(-1); });
    $('[data-lb-next]', lb).addEventListener('click', function () { stepLb(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  }

  /* ---------------- shop filter + sort ---------------- */
  var grid = $('[data-pgrid]');
  if (grid) {
    var cards = $$('.pcard', grid), pCount = $('[data-pcount]'), pf = $$('[data-pfilter]'), sortSel = $('[data-psort]');
    cards.forEach(function (c, i) { c.setAttribute('data-i', i); });
    function applyShop() {
      var on = pf.filter(function (b) { return b.classList.contains('is-on'); })[0], f = on ? on.getAttribute('data-pfilter') : 'all', n = 0;
      cards.forEach(function (c) { var show = f === 'all' || c.getAttribute('data-cat') === f; c.hidden = !show; if (show) n++; });
      var v = sortSel ? sortSel.value : 'featured';
      cards.slice().sort(function (a, b) {
        if (v === 'price-asc') return a.dataset.price - b.dataset.price || a.dataset.i - b.dataset.i;
        if (v === 'price-desc') return b.dataset.price - a.dataset.price || a.dataset.i - b.dataset.i;
        if (v === 'name') return a.dataset.name.localeCompare(b.dataset.name);
        return a.dataset.i - b.dataset.i;
      }).forEach(function (c) { grid.appendChild(c); });
      var tile = $('[data-ptile]', grid); if (tile) grid.appendChild(tile);
      if (pCount) pCount.textContent = (f === 'all' ? 'Showing all ' : 'Showing ') + n + ' product' + (n === 1 ? '' : 's');
    }
    pf.forEach(function (b) { b.addEventListener('click', function () { pf.forEach(function (x) { var o = x === b; x.classList.toggle('is-on', o); x.setAttribute('aria-pressed', o ? 'true' : 'false'); }); applyShop(); }); });
    if (sortSel) sortSel.addEventListener('change', applyShop);
  }

  /* ---------------- contact form ---------------- */
  var form = $('[data-form]');
  if (form) {
    var err = $('[data-form-err]', form), ok = $('[data-form-ok]', form);
    if (/[?&]sent=1/.test(window.location.search)) { ok.hidden = false; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var el = form.elements, fN = el['name'], fP = el['phone'], fE = el['email'], fM = el['message'];
      var name = fN.value.trim(), ph = fP.value.trim(), em = fE.value.trim(), msg = fM.value.trim();
      var bad = [];
      if (!name) bad.push(fN); if (!ph && !em) bad.push(fP); if (em && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) bad.push(fE); if (!msg) bad.push(fM);
      $$('input,textarea', form).forEach(function (f) { f.removeAttribute('aria-invalid'); });
      if (bad.length) { bad.forEach(function (f) { f.setAttribute('aria-invalid', 'true'); }); err.hidden = false; bad[0].focus(); return; }
      err.hidden = true;
      var local = /^(localhost|127\.|0\.0\.0\.0|$)/.test(window.location.hostname) || window.location.protocol === 'file:';
      function done(m) { ok.hidden = false; if (m) $('.form__okt', ok).lastChild.textContent = m; ok.focus(); }
      if (local) { done('Preview mode: the form sends once the site is live on Netlify.'); return; }
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function (r) { if (!r.ok) throw 0; form.reset(); done(); })
        .catch(function () { form.submit(); });
    });
  }
})();
