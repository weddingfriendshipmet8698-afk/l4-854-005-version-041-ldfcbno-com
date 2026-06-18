(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function text(value) {
        return (value || "").toString().toLowerCase().trim();
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-button]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        }

        function start() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                show(dotIndex);
                start();
            });
        });

        show(0);
        start();
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll(".filter-panel"));
        panels.forEach(function (panel) {
            var input = panel.querySelector("[data-movie-search]");
            var year = panel.querySelector("[data-year-filter]");
            var region = panel.querySelector("[data-region-filter]");
            var section = panel.parentElement || document;
            var cards = Array.prototype.slice.call(section.querySelectorAll(".movie-card"));
            if (!cards.length && input) {
                cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
            }

            function passYear(card, selected) {
                if (!selected || selected === "全部年份") {
                    return true;
                }
                var cardYear = card.getAttribute("data-year") || "";
                if (selected === "2018以前") {
                    var found = cardYear.match(/\d{4}/);
                    return found ? Number(found[0]) <= 2018 : true;
                }
                return cardYear.indexOf(selected) !== -1;
            }

            function passRegion(card, selected) {
                if (!selected || selected === "全部地区") {
                    return true;
                }
                if (selected === "其他") {
                    return !/(日本|韩国|中国|中国香港|美国|法国|英国)/.test(card.getAttribute("data-region") || "");
                }
                return (card.getAttribute("data-region") || "").indexOf(selected) !== -1;
            }

            function apply() {
                var keyword = text(input ? input.value : "");
                var yearValue = year ? year.value : "";
                var regionValue = region ? region.value : "";
                cards.forEach(function (card) {
                    var haystack = text([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-meta"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-region")
                    ].join(" "));
                    var ok = (!keyword || haystack.indexOf(keyword) !== -1) && passYear(card, yearValue) && passRegion(card, regionValue);
                    card.classList.toggle("is-filtered-out", !ok);
                });
            }

            if (input) {
                input.addEventListener("input", apply);
            }
            if (year) {
                year.addEventListener("change", apply);
            }
            if (region) {
                region.addEventListener("change", apply);
            }
        });
    }

    window.initMoviePlayer = function (videoId, overlayId, source) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var attached = false;
        var hls = null;
        if (!video || !source) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function play() {
            attach();
            video.controls = true;
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    if (overlay) {
                        overlay.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (overlay) {
            overlay.addEventListener("click", play);
        }
        video.addEventListener("click", function () {
            if (!attached || video.paused) {
                play();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls && typeof hls.destroy === "function") {
                hls.destroy();
            }
        });
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
