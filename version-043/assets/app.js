document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  initCarousel();
  initFilters();
  initPlayers();
});

function initCarousel() {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));

  if (!slides.length) {
    return;
  }

  var current = 0;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      show(index);
    });
  });

  show(0);

  if (slides.length > 1) {
    window.setInterval(function () {
      show(current + 1);
    }, 6200);
  }
}

function initFilters() {
  var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-search-scope]'));

  scopes.forEach(function (scope) {
    var input = scope.querySelector('[data-card-search]');
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
    var filterValue = 'all';

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : '';

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-tags') || '',
          card.getAttribute('data-type') || '',
          card.getAttribute('data-year') || ''
        ].join(' ').toLowerCase();

        var typeText = (card.getAttribute('data-type') || '').toLowerCase();
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var matchesFilter = filterValue === 'all' || typeText.indexOf(filterValue.toLowerCase()) !== -1 || haystack.indexOf(filterValue.toLowerCase()) !== -1;

        card.classList.toggle('hidden-card', !(matchesQuery && matchesFilter));
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        filterValue = button.getAttribute('data-filter') || 'all';
        buttons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        apply();
      });
    });

    apply();
  });
}

function initPlayers() {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('.player-cover');

    if (!video) {
      return;
    }

    function start() {
      startVideo(video, cover);
    }

    if (cover) {
      cover.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (!video.getAttribute('src') && !video.dataset.ready) {
        start();
      }
    });
  });
}

function startVideo(video, cover) {
  var stream = video.getAttribute('data-stream') || '';

  if (!stream) {
    return;
  }

  if (!video.dataset.ready) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 30
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      video.hlsInstance = hls;
    } else {
      video.src = stream;
    }
    video.dataset.ready = 'true';
  }

  if (cover) {
    cover.classList.add('is-hidden');
  }

  var playPromise = video.play();

  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(function () {
      if (cover) {
        cover.classList.remove('is-hidden');
      }
    });
  }
}
