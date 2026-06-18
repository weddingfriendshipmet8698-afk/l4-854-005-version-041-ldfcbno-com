(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
      document.body.classList.toggle('no-scroll', mobileNav.classList.contains('open'));
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  const filterForms = Array.from(document.querySelectorAll('[data-filter-form]'));
  filterForms.forEach(function (form) {
    const root = document.querySelector(form.getAttribute('data-filter-root')) || document;
    const cards = Array.from(root.querySelectorAll('[data-filter-card]'));
    const count = document.querySelector(form.getAttribute('data-filter-count') || '');
    const inputs = Array.from(form.querySelectorAll('input, select'));

    function value(name) {
      const field = form.querySelector('[name="' + name + '"]');
      return field ? String(field.value || '').trim().toLowerCase() : '';
    }

    function apply() {
      const q = value('q');
      const region = value('region');
      const type = value('type');
      const year = value('year');
      let visible = 0;

      cards.forEach(function (card) {
        const text = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.year,
          card.dataset.type,
          card.dataset.genre,
          card.dataset.keywords
        ].join(' ').toLowerCase();
        const matched = (!q || text.indexOf(q) !== -1) &&
          (!region || String(card.dataset.region || '').toLowerCase().indexOf(region) !== -1) &&
          (!type || String(card.dataset.type || '').toLowerCase().indexOf(type) !== -1) &&
          (!year || String(card.dataset.year || '').toLowerCase() === year);

        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = String(visible);
      }
    }

    inputs.forEach(function (input) {
      input.addEventListener('input', apply);
      input.addEventListener('change', apply);
    });

    apply();
  });
})();

window.initMoviePlayer = function (source) {
  const video = document.querySelector('[data-player-video]');
  const overlay = document.querySelector('[data-player-overlay]');
  const button = document.querySelector('[data-player-start]');
  let started = false;
  let hlsInstance = null;

  if (!video || !source) {
    return;
  }

  function attach() {
    if (started) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }

    started = true;
  }

  function play() {
    attach();

    if (overlay) {
      overlay.classList.add('hidden');
    }

    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener('click', play);
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      play();
    });
  }

  video.addEventListener('click', function () {
    if (!started) {
      play();
    }
  });

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
};
