document.documentElement.classList.add('js');

// ---------- Theme toggle ----------
function initThemeToggle() {
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var icon = toggle.querySelector('i');
  var stored = null;
  try {
    stored = localStorage.getItem('theme');
  } catch (e) {}
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var current = stored || (prefersDark ? 'dark' : 'light');

  applyTheme(current);

  toggle.addEventListener('click', function () {
    current = current === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('theme', current);
    } catch (e) {}
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

// ---------- Scroll reveal ----------
function initScrollReveal() {
  var items = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    items.forEach(function (item) { item.classList.add('is-visible'); });
    return;
  }

  var revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  items.forEach(function (item) { revealObserver.observe(item); });
}

// ---------- Rotating hero role text ----------
function initHeroRole() {
  var el = document.getElementById('hero-role');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var roles = [
    'solving challenging problems',
    'learning new technology',
    'connecting over big ideas',
    'staying active outdoors'
  ];

  if (reduceMotion) {
    el.textContent = roles[0];
    return;
  }

  var roleIndex = 0;
  var charIndex = roles[0].length;
  var deleting = true;

  function tick() {
    var word = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = word.slice(0, charIndex);

    var delay = deleting ? 40 : 80;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      delay = 1400;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    }

    setTimeout(tick, delay);
  }

  setTimeout(tick, 1400);
}

// ---------- Hero particles (stars, dark mode only) ----------
function initHeroParticles() {
  var canvas = document.getElementById('hero-particles');
  var hero = canvas.closest('.hero');
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var particles = [];
  var width, height, dpr;
  var animId = null;

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedParticles();
  }

  function seedParticles() {
    var count = Math.min(90, Math.round((width * height) / 12000));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(withMotion) {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(function (p) {
      if (withMotion) {
        p.x += p.vx;
        p.y += p.vy;
        p.twinklePhase += p.twinkleSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      var twinkle = withMotion ? (Math.sin(p.twinklePhase) + 1) / 2 : 0.6;
      var opacity = 0.15 + twinkle * 0.45;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + opacity.toFixed(2) + ')';
      ctx.fill();
    });
  }

  function loop() {
    draw(true);
    animId = requestAnimationFrame(loop);
  }

  function start() {
    if (animId !== null) return;
    if (reduceMotion) {
      draw(false);
      return;
    }
    loop();
  }

  function stop() {
    if (animId !== null) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    ctx.clearRect(0, 0, width, height);
  }

  resize();

  window.addEventListener('resize', function () {
    resize();
    if (isDark()) {
      if (reduceMotion) draw(false);
    }
  });

  if (isDark()) start();

  var themeObserver = new MutationObserver(function () {
    if (isDark()) {
      start();
    } else {
      stop();
    }
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

// ---------- Projects carousel ----------
function initProjectsCarousel() {
  var wrapper = document.querySelector('.carousel-track-wrapper');
  var track = document.getElementById('carousel-track');
  var slides = Array.prototype.slice.call(track.querySelectorAll('.carousel-slide'));
  var dots = document.querySelectorAll('#carousel-dots .carousel-dot');
  var prevBtn = document.getElementById('carousel-prev');
  var nextBtn = document.getElementById('carousel-next');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current = Math.floor((slides.length - 1) / 2);

  if (reduceMotion) {
    track.style.transition = 'none';
  }

  function update() {
    var slide = slides[current];
    var offset = wrapper.clientWidth / 2 - (slide.offsetLeft + slide.offsetWidth / 2);
    track.style.transform = 'translateX(' + offset + 'px)';

    slides.forEach(function (s, i) {
      s.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    update();
  }

  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); });
  });
  slides.forEach(function (slide, i) {
    slide.addEventListener('click', function (e) {
      if (i === current || e.target.closest('a')) return;
      goTo(i);
    });
  });

  window.addEventListener('resize', update);
  window.addEventListener('load', update);

  update();
}

// ---------- Card cursor tilt ----------
function initCardTilt() {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var maxTilt = 8;
  var cards = document.querySelectorAll('.card, .interest-card');

  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', (px * maxTilt * 2).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', (-py * maxTilt * 2).toFixed(2) + 'deg');
    });

    card.addEventListener('mouseleave', function () {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

initThemeToggle();
initMobileNav();
initScrollNav();
initScrollReveal();
initHeroRole();
initHeroParticles();
initProjectsCarousel();
initCardTilt();
