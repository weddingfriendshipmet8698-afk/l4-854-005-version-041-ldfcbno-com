(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");

    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function initHeroSliders() {
    document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
      var current = 0;

      if (slides.length < 2) {
        return;
      }

      function show(index) {
        current = index;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
        });
      });

      window.setInterval(function () {
        show((current + 1) % slides.length);
      }, 5200);
    });
  }

  function initFilters() {
    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var input = scope.querySelector("[data-filter-input]");
      var chips = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-chip]"));
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-card]"));
      var empty = scope.querySelector("[data-filter-empty]");
      var activeValue = "all";

      function matchCard(card, query) {
        var searchText = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre")
        ].join(" ").toLowerCase();
        var chipText = searchText;
        var queryMatched = !query || searchText.indexOf(query) !== -1;
        var chipMatched = activeValue === "all" || chipText.indexOf(activeValue.toLowerCase()) !== -1;
        return queryMatched && chipMatched;
      }

      function applyFilter() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var visible = 0;

        cards.forEach(function (card) {
          var matched = matchCard(card, query);
          card.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          activeValue = chip.getAttribute("data-filter-chip") || "all";
          chips.forEach(function (item) {
            item.classList.toggle("is-active", item === chip);
          });
          applyFilter();
        });
      });

      applyFilter();
    });
  }

  function movieResultCard(movie) {
    return [
      '<a class="movie-card" href="' + escapeHtml(movie.url) + '">',
      '<span class="poster-frame">',
      '<img src="' + escapeHtml(movie.image) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="poster-badge">' + escapeHtml(movie.region) + '</span>',
      '</span>',
      '<span class="movie-card-body">',
      '<h3>' + escapeHtml(movie.title) + '</h3>',
      '<p>' + escapeHtml(movie.oneLine) + '</p>',
      '<span class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span></span>',
      '</span>',
      '</a>'
    ].join("");
  }

  function initSearchPage() {
    var form = document.querySelector("[data-site-search-form]");
    var input = document.querySelector("[data-site-search-input]");
    var result = document.querySelector("[data-site-search-result]");
    var title = document.querySelector("[data-site-search-title]");

    if (!form || !input || !result || !window.SEARCH_MOVIES) {
      return;
    }

    function render(query) {
      var normalized = query.trim().toLowerCase();
      var movies = window.SEARCH_MOVIES.filter(function (movie) {
        var text = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.oneLine].join(" ").toLowerCase();
        return !normalized || text.indexOf(normalized) !== -1;
      }).slice(0, 72);

      if (title) {
        title.textContent = normalized ? '与“' + query + '”相关的影片' : "热门片库推荐";
      }

      result.innerHTML = movies.map(movieResultCard).join("") || '<div class="filter-empty">没有匹配内容</div>';
    }

    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    input.value = initial;
    render(initial);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var query = input.value.trim();
      var params = new URLSearchParams(window.location.search);

      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }

      var next = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
      window.history.replaceState({}, "", next);
      render(query);
    });
  }

  ready(function () {
    initMenu();
    initHeroSliders();
    initFilters();
    initSearchPage();
  });
})();
