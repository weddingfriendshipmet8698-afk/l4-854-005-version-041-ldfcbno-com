(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(i) {
      if (!slides.length) {
        return;
      }
      index = (i + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var empty = document.querySelector('[data-empty-state]');
  var categorySelect = document.querySelector('[data-category-select]');

  function filterCards() {
    var keyword = searchInputs.map(function (input) {
      return input.value.trim().toLowerCase();
    }).filter(Boolean).join(' ');
    var selectedCategory = categorySelect ? categorySelect.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var text = (card.getAttribute('data-title') || '').toLowerCase();
      var category = card.getAttribute('data-category') || '';
      var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchCategory = !selectedCategory || category === selectedCategory;
      var showCard = matchKeyword && matchCategory;
      card.style.display = showCard ? '' : 'none';
      if (showCard) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', filterCards);
  });

  if (categorySelect) {
    categorySelect.addEventListener('change', filterCards);
  }
})();
