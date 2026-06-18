(function () {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");

    if (header && toggle) {
        toggle.addEventListener("click", function () {
            var opened = header.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var previous = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                restart();
            });
        });

        if (previous) {
            previous.addEventListener("click", function () {
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

        show(0);
        restart();
    });

    document.querySelectorAll("[data-movie-list]").forEach(function (list) {
        var scope = list.closest("main") || document;
        var input = scope.querySelector("[data-movie-search]");
        var pills = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-value]"));
        var activeCategory = "all";
        var cards = Array.prototype.slice.call(list.querySelectorAll("[data-title]"));

        function applyFilter() {
            var query = input ? input.value.trim().toLowerCase() : "";
            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-tags"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-category")
                ].join(" ").toLowerCase();
                var category = card.getAttribute("data-category") || "";
                var matchText = !query || haystack.indexOf(query) !== -1;
                var matchCategory = activeCategory === "all" || category === activeCategory;
                card.classList.toggle("is-filtered-out", !(matchText && matchCategory));
            });
        }

        if (input) {
            input.addEventListener("input", applyFilter);
        }

        pills.forEach(function (pill) {
            pill.addEventListener("click", function () {
                activeCategory = pill.getAttribute("data-filter-value") || "all";
                pills.forEach(function (item) {
                    item.classList.toggle("is-active", item === pill);
                });
                applyFilter();
            });
        });

        applyFilter();
    });
})();
