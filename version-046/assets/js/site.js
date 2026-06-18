(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        restart();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });
    restart();
  }

  function makeResult(item) {
    var a = document.createElement("a");
    a.className = "search-result";
    a.href = item.url;
    a.innerHTML = [
      '<span class="media-frame">',
      '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy" onerror="this.remove()">',
      '<span class="media-shade"></span>',
      '</span>',
      '<span>',
      '<strong>' + escapeHtml(item.title) + '</strong>',
      '<em>' + escapeHtml(item.oneLine) + '</em>',
      '<span>' + escapeHtml(item.region + " · " + item.type + " · " + item.year) + '</span>',
      '</span>'
    ].join("");
    return a;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initSearch() {
    var input = document.querySelector("[data-site-search]");
    var select = document.querySelector("[data-site-search-category]");
    var results = document.querySelector("[data-search-results]");
    var data = window.SearchData || [];
    if (!input || !results || !data.length) {
      return;
    }

    function run() {
      var query = input.value.trim().toLowerCase();
      var category = select ? select.value : "";
      results.innerHTML = "";
      if (!query && !category) {
        results.classList.remove("is-open");
        return;
      }
      var matches = data.filter(function (item) {
        var text = [item.title, item.oneLine, item.region, item.type, item.year, item.category, (item.tags || []).join(" ")].join(" ").toLowerCase();
        var categoryOk = !category || item.categorySlug === category;
        return categoryOk && (!query || text.indexOf(query) !== -1);
      }).slice(0, 30);
      matches.forEach(function (item) {
        results.appendChild(makeResult(item));
      });
      results.classList.toggle("is-open", matches.length > 0);
    }

    input.addEventListener("input", run);
    if (select) {
      select.addEventListener("change", run);
    }
  }

  function initCardFilter() {
    var input = document.querySelector("[data-filter-input]");
    if (!input) {
      return;
    }
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = ((card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-tags") || "")).toLowerCase();
        card.classList.toggle("hidden-card", query && text.indexOf(query) === -1);
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initSearch();
    initCardFilter();
  });
})();
