/* ==========================================================================
   AURA ESTATES — main.js
   Classic script, IIFE pattern, no ES modules, no build step.
   Every init is wrapped in safe() so one failure can't break the rest.
   ========================================================================== */

(function () {
  'use strict';

  window.__BRAND__ = { name: 'Aura Estates', year: new Date().getFullYear() };

  function safe(fn, label) {
    try {
      fn();
    } catch (err) {
      console.warn('[Aura Estates] init failed:', label, err);
    }
  }

  /* ------------------------------------------------------------ splash */
  function initSplash() {
    var splash = document.getElementById('splash');
    if (!splash) return;
    var hide = function () {
      splash.style.opacity = '0';
      splash.style.visibility = 'hidden';
      splash.style.pointerEvents = 'none';
    };
    window.addEventListener('load', function () {
      setTimeout(hide, 900);
    });
    setTimeout(hide, 3200);
  }

  /* ------------------------------------------------------------ custom cursor */
  function initCursor() {
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    var rx = 0, ry = 0, dx = 0, dy = 0;
    window.addEventListener('mousemove', function (e) {
      dx = e.clientX; dy = e.clientY;
      dot.style.transform = 'translate(' + dx + 'px,' + dy + 'px) translate(-50%,-50%)';
    });

    function loop() {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    var hoverables = document.querySelectorAll('a, button, .property-card, input, textarea, select, .filter-chip');
    hoverables.forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-active'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-active'); });
    });
  }

  /* ------------------------------------------------------------ mesh mouse glow */
  function initMeshGlow() {
    var glow = document.querySelector('.mesh-glow');
    if (!glow) return;
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var ticking = false;
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var mx = ((e.clientX - rect.left) / rect.width) * 100;
      var my = ((e.clientY - rect.top) / rect.height) * 100;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          glow.style.setProperty('--mx', mx + '%');
          glow.style.setProperty('--my', my + '%');
          ticking = false;
        });
      }
    });
  }

  /* ------------------------------------------------------------ nav */
  function initNav() {
    var nav = document.querySelector('.site-nav');
    if (nav) {
      var onScroll = function () {
        if (window.scrollY > 40) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var burger = document.querySelector('.nav-burger');
    if (burger) {
      burger.addEventListener('click', function () {
        document.body.classList.toggle('nav-open');
      });
      document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
          document.body.classList.remove('nav-open');
        });
      });
    }

    var path = (window.location.pathname.split('/').pop() || 'index.html');
    document.querySelectorAll('.nav-links a[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === path) a.classList.add('is-active');
    });
  }

  /* ------------------------------------------------------------ smooth anchor scroll */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var y = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  /* ------------------------------------------------------------ headline split */
  function initSplitText() {
    document.querySelectorAll('[data-split]').forEach(function (el) {
      if (el.dataset.splitDone) return;
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w, i) {
        return '<span class="split-word" style="transition-delay:' + (i * 0.05) + 's">' + w + '&nbsp;</span>';
      }).join('');
      el.dataset.splitDone = 'true';
    });
  }

  /* ------------------------------------------------------------ scroll reveal */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    var reveal = function (el) { el.classList.add('is-visible'); };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(reveal);
    }

    setTimeout(function () {
      items.forEach(reveal);
    }, 6000);
  }

  /* ------------------------------------------------------------ animated counters */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var animate = function (el) {
      if (el.dataset.counted) return;
      el.dataset.counted = 'true';
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
      var duration = 1600;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var val = target * eased;
        el.textContent = decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString('es-MX');
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString('es-MX');
      }
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      counters.forEach(function (el) { io.observe(el); });
    } else {
      counters.forEach(animate);
    }

    setTimeout(function () {
      counters.forEach(animate);
    }, 6000);
  }

  /* ------------------------------------------------------------ property filters (catalog page) */
  function initFilters() {
    var filterBar = document.querySelector('.filters');
    if (!filterBar) return;
    var chips = filterBar.querySelectorAll('.filter-chip');
    var cards = document.querySelectorAll('.property-card[data-type]');
    var emptyState = document.querySelector('.empty-state');
    if (!chips.length || !cards.length) return;

    var state = { tipo: 'todas', operacion: 'todas' };

    function applyFilters() {
      var visibleCount = 0;
      cards.forEach(function (card) {
        var matchesTipo = state.tipo === 'todas' || card.getAttribute('data-type') === state.tipo;
        var matchesOp = state.operacion === 'todas' || card.getAttribute('data-operation') === state.operacion;
        var show = matchesTipo && matchesOp;
        card.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });
      if (emptyState) emptyState.classList.toggle('is-visible', visibleCount === 0);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var group = chip.getAttribute('data-group');
        var value = chip.getAttribute('data-value');
        filterBar.querySelectorAll('.filter-chip[data-group="' + group + '"]').forEach(function (c) {
          c.classList.remove('is-active');
        });
        chip.classList.add('is-active');
        state[group] = value;
        applyFilters();
      });
    });

    applyFilters();
  }

  /* ------------------------------------------------------------ contact form (frontend-only demo) */
  function initContactForm() {
    var form = document.querySelector('.contact-form');
    if (!form) return;
    var success = document.querySelector('.form-success');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (success) {
        success.classList.add('is-visible');
        success.setAttribute('tabindex', '-1');
        success.focus({ preventScroll: true });
      }
      form.reset();
    });
  }

  /* ------------------------------------------------------------ newsletter (frontend-only demo) */
  function initNewsletter() {
    var form = document.querySelector('.newsletter-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input');
      var btn = form.querySelector('button');
      if (btn) {
        var original = btn.innerHTML;
        btn.innerHTML = '&#10003;';
        setTimeout(function () { btn.innerHTML = original; }, 2200);
      }
      if (input) input.value = '';
    });
  }

  /* ------------------------------------------------------------ footer year */
  function initFooterYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = window.__BRAND__.year;
    });
  }

  /* ------------------------------------------------------------ boot */
  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.remove('no-js');
    safe(initSplash, 'splash');
    safe(initSplitText, 'splitText');
    safe(initCursor, 'cursor');
    safe(initMeshGlow, 'meshGlow');
    safe(initNav, 'nav');
    safe(initSmoothScroll, 'smoothScroll');
    safe(initReveal, 'reveal');
    safe(initCounters, 'counters');
    safe(initFilters, 'filters');
    safe(initContactForm, 'contactForm');
    safe(initNewsletter, 'newsletter');
    safe(initFooterYear, 'footerYear');
  });
})();
