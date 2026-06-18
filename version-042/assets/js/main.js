(function () {
    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function $all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMenu() {
        var toggle = $("[data-menu-toggle]");
        var nav = $("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var hero = $("[data-hero]");
        if (!hero) {
            return;
        }

        var slides = $all("[data-hero-slide]", hero);
        var dots = $all("[data-hero-dot]", hero);
        var next = $("[data-hero-next]", hero);
        var prev = $("[data-hero-prev]", hero);
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

        function move(step) {
            show(current + step);
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                move(1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (next) {
            next.addEventListener("click", function () {
                move(1);
                start();
            });
        }

        if (prev) {
            prev.addEventListener("click", function () {
                move(-1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var index = Number(dot.getAttribute("data-hero-dot"));
                show(index);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupSearchRedirect() {
        var form = $("[data-search-redirect]");
        if (!form) {
            return;
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var input = $("[data-search-redirect-input]", form);
            var query = input ? input.value.trim() : "";
            var target = "./search.html";
            if (query) {
                target += "?q=" + encodeURIComponent(query);
            }
            window.location.href = target;
        });
    }

    function setupFilters() {
        var panel = $("[data-filter-panel]");
        if (!panel) {
            return;
        }

        var cards = $all("[data-search-card]");
        var input = $("[data-filter-input]", panel);
        var type = $("[data-filter-type]", panel);
        var year = $("[data-filter-year]", panel);
        var category = $("[data-filter-category]", panel);
        var empty = $("[data-no-results]");

        function apply() {
            var query = input ? input.value.trim().toLowerCase() : "";
            var typeValue = type ? type.value : "";
            var yearValue = year ? year.value : "";
            var categoryValue = category ? category.value : "";
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute("data-text") || "").toLowerCase();
                var cardType = card.getAttribute("data-type") || "";
                var cardYear = card.getAttribute("data-year") || "";
                var cardCategory = card.getAttribute("data-category") || "";
                var matched = true;

                if (query && text.indexOf(query) === -1) {
                    matched = false;
                }

                if (typeValue && cardType.indexOf(typeValue) === -1) {
                    matched = false;
                }

                if (yearValue && cardYear !== yearValue) {
                    matched = false;
                }

                if (categoryValue && cardCategory !== categoryValue) {
                    matched = false;
                }

                card.classList.toggle("hidden-card", !matched);

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        [input, type, year, category].forEach(function (control) {
            if (!control) {
                return;
            }
            control.addEventListener("input", apply);
            control.addEventListener("change", apply);
        });

        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q && input) {
            input.value = q;
        }

        apply();
    }

    setupMenu();
    setupHero();
    setupSearchRedirect();
    setupFilters();
})();

function startHlsPlayer(config) {
    var video = document.getElementById(config.videoId);
    var cover = document.getElementById(config.coverId);
    var button = document.getElementById(config.buttonId);
    var loaded = false;
    var hlsInstance = null;

    if (!video || !cover || !button || !config.src) {
        return;
    }

    function attach() {
        if (loaded) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = config.src;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(config.src);
            hlsInstance.attachMedia(video);
        } else {
            video.src = config.src;
        }

        loaded = true;
    }

    function play() {
        attach();
        cover.classList.add("is-hidden");
        video.controls = true;
        var promise = video.play();
        if (promise && promise.catch) {
            promise.catch(function () {
                cover.classList.remove("is-hidden");
            });
        }
    }

    button.addEventListener("click", function (event) {
        event.stopPropagation();
        play();
    });

    cover.addEventListener("click", play);

    video.addEventListener("click", function () {
        if (video.paused) {
            play();
        }
    });

    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
