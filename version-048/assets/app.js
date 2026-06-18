(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var header = document.querySelector(".site-header");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var opened = document.body.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", opened ? "true" : "false");
      });
    }
    window.addEventListener("scroll", function () {
      if (!header) {
        return;
      }
      header.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    if (slides.length < 2) {
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
    function play() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        window.clearInterval(timer);
        show(i);
        play();
      });
    });
    show(0);
    play();
  }

  function initFilters() {
    var panel = document.querySelector("[data-filter-panel]");
    if (!panel) {
      return;
    }
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-filter-card]"));
    var empty = document.querySelector("[data-empty]");
    var controls = Array.prototype.slice.call(panel.querySelectorAll("input, select"));
    function value(name) {
      var el = panel.querySelector("[name='" + name + "']");
      return el ? String(el.value).trim().toLowerCase() : "";
    }
    function run() {
      var q = value("q");
      var type = value("type");
      var year = value("year");
      var category = value("category");
      var shown = 0;
      cards.forEach(function (card) {
        var haystack = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.category
        ].join(" ").toLowerCase();
        var matched = true;
        if (q && haystack.indexOf(q) === -1) {
          matched = false;
        }
        if (type && String(card.dataset.type).toLowerCase() !== type) {
          matched = false;
        }
        if (year && String(card.dataset.year).toLowerCase() !== year) {
          matched = false;
        }
        if (category && String(card.dataset.category).toLowerCase() !== category) {
          matched = false;
        }
        card.hidden = !matched;
        if (matched) {
          shown += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("show", shown === 0);
      }
    }
    controls.forEach(function (control) {
      control.addEventListener("input", run);
      control.addEventListener("change", run);
    });
    run();
  }

  window.initMoviePlayer = function (source) {
    function setup() {
      var video = document.getElementById("movie-player");
      var cover = document.querySelector(".player-cover");
      var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-play-button]"));
      if (!video || !source) {
        return;
      }
      var loaded = false;
      function load() {
        if (loaded) {
          return;
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
      }
      function start() {
        load();
        if (cover) {
          cover.classList.add("is-hidden");
        }
        video.controls = true;
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }
      buttons.forEach(function (button) {
        button.addEventListener("click", start);
      });
      video.addEventListener("click", function () {
        if (!loaded) {
          start();
        }
      });
    }
    ready(setup);
  };

  ready(function () {
    initNavigation();
    initHero();
    initFilters();
  });
})();
