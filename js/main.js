/* ============================================================
   DS ROOTS AGRO — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. LANGUAGE TOGGLE (EN / NE) ---------- */
  const langToggle = document.getElementById('langToggle');
  const LANG_KEY = 'dsroots-lang';

  function setLang(lang) {
    document.body.classList.toggle('lang-ne', lang === 'ne');
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var text = el.getAttribute('data-' + lang) || el.getAttribute('data-en');
      if (text) el.textContent = text;
    });
    document.querySelectorAll('.lang-toggle [data-lang]').forEach(function (s) {
      s.classList.toggle('lang-active', s.dataset.lang === lang);
    });
    localStorage.setItem(LANG_KEY, lang);
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var current = document.body.classList.contains('lang-ne') ? 'ne' : 'en';
      setLang(current === 'en' ? 'ne' : 'en');
    });
  }

  var savedLang = localStorage.getItem(LANG_KEY) || 'en';
  if (savedLang === 'ne') setLang('ne');

  /* ---------- 2. HEADER SCROLL EFFECT ---------- */
  var header = document.getElementById('siteHeader');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  /* ---------- 3. MOBILE MENU ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var mainNav = document.getElementById('mainNav');

  menuToggle.addEventListener('click', function () {
    var open = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  mainNav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 4. ACTIVE NAV LINK ON SCROLL ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var current = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  /* ---------- 5. FORM HANDLERS (front-end validation + mailto fallback) ---------- */
  function handleForm(formId, msgId, subjectPrefix) {
    var form = document.getElementById(formId);
    var msg = document.getElementById(msgId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var lines = [];
      data.forEach(function (value, key) { lines.push(key + ': ' + value); });
      var body = lines.join('\n');
      var subject = encodeURIComponent(subjectPrefix + ' — ' + (data.get('company') || data.get('name') || 'Website Inquiry'));
      var mailto = 'mailto:info@dsrootsagro.com?subject=' + subject + '&body=' + encodeURIComponent(body);

      msg.textContent = 'Opening your email app...';
      msg.className = 'form-msg success';
      window.location.href = mailto;

      setTimeout(function () {
        form.reset();
        msg.textContent = 'Thank you! Your message has been prepared.';
      }, 1200);
    });
  }

  handleForm('b2bForm', 'b2bMsg', 'B2B Inquiry');
  handleForm('contactForm', 'contactMsg', 'Website Contact');

  /* ---------- 6. FOOTER YEAR ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 7. SMOOTH SCROLL FOR ANCHORS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- 8. REVEAL ON SCROLL ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.business-card, .product-card, .zone-card, .feature, .stat, .meaning-card').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .8s cubic-bezier(0.16, 1, 0.3, 1), transform .8s cubic-bezier(0.16, 1, 0.3, 1)';
      io.observe(el);
    });
  }

})();