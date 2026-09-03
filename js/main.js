// ---------- Theme toggle ----------
function initThemeToggle() {
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var icon = toggle.querySelector('i');
  var stored = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var current = stored || (prefersDark ? 'dark' : 'light');

  applyTheme(current);

  toggle.addEventListener('click', function () {
    current = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', current);
    applyTheme(current);
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      icon.className = 'fa fa-sun-o';
    } else {
      root.removeAttribute('data-theme');
      icon.className = 'fa fa-moon-o';
    }
  }
}

// ---------- Mobile nav ----------
function initMobileNav() {
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- Smooth scroll + active link + nav background ----------
function initScrollNav() {
  var nav = document.getElementById('site-nav');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach(function (section) { sectionObserver.observe(section); });
}

initThemeToggle();
initMobileNav();
initScrollNav();
