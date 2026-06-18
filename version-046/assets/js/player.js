(function () {
  window.initMoviePlayer = function (src, videoId, overlayId) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    if (!video || !src) {
      return;
    }

    var hls = null;
    var attached = false;

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else {
        video.src = src;
      }
    }

    function begin() {
      attach();
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", begin);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        begin();
      }
    });
    video.addEventListener("play", function () {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
