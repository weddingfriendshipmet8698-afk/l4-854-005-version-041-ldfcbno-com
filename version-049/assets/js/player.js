(function () {
  function initMoviePlayer(streamUrl) {
    var root = document.querySelector(".movie-player");
    if (!root) {
      return;
    }

    var video = root.querySelector("video");
    var cover = root.querySelector(".player-cover");
    var playButton = root.querySelector("[data-play-button]");
    var hlsInstance = null;
    var prepared = false;

    function prepare() {
      if (!video || prepared) {
        return;
      }
      prepared = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function play() {
      prepare();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          if (cover) {
            cover.classList.remove("is-hidden");
          }
        });
      }
    }

    if (playButton) {
      playButton.addEventListener("click", play);
    }

    if (cover) {
      cover.addEventListener("click", play);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener("play", function () {
        if (cover) {
          cover.classList.add("is-hidden");
        }
      });
      video.addEventListener("ended", function () {
        if (cover) {
          cover.classList.remove("is-hidden");
        }
      });
    }

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
