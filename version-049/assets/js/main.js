(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  function setHeaderState() {
    if (!header) {
      return;
    }
    if (window.scrollY > 16) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  document.querySelectorAll("img").forEach(function (image) {
    image.addEventListener("error", function () {
      image.style.display = "none";
    });
  });

  var slider = document.querySelector("[data-hero-slider]");
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
    var prev = slider.querySelector(".hero-prev");
    var next = slider.querySelector(".hero-next");
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle("active", position === current);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle("active", position === current);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    showSlide(0);
    startTimer();
  }

  var search = document.getElementById("movieSearch");
  var list = document.querySelector("[data-card-list]");
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var activeFilter = "all";

  function applyFilters() {
    if (!list) {
      return;
    }
    var query = search ? search.value.trim().toLowerCase() : "";
    var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

    cards.forEach(function (card) {
      var matchesFilter = activeFilter === "all" || card.getAttribute("data-category") === activeFilter;
      var haystack = (card.getAttribute("data-search") || card.innerText || "").toLowerCase();
      var matchesSearch = !query || haystack.indexOf(query) !== -1;
      card.classList.toggle("is-hidden-card", !(matchesFilter && matchesSearch));
    });
  }

  if (search) {
    search.addEventListener("input", applyFilters);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.getAttribute("data-filter") || "all";
      filterButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      applyFilters();
    });
  });

  applyFilters();
})();
