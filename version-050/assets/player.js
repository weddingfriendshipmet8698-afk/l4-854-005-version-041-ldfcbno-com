(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function initPlayer(player) {
    var video = player.querySelector("video");
    var overlay = player.querySelector("[data-player-overlay]");
    var message = player.querySelector("[data-player-message]");
    var stream = player.getAttribute("data-stream");
    var prepared = false;
    var hls = null;

    if (!video || !stream) {
      return;
    }

    function showMessage(text) {
      if (!message) {
        return;
      }
      message.textContent = text;
      message.hidden = false;
    }

    function prepare() {
      if (prepared) {
        return;
      }
      prepared = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showMessage("视频暂时无法播放，请稍后再试");
          }
        });
        return;
      }

      showMessage("视频暂时无法播放，请稍后再试");
    }

    function begin() {
      prepare();
      video.controls = true;

      if (overlay) {
        overlay.classList.add("is-hidden");
      }

      var playTask = video.play();

      if (playTask && typeof playTask.catch === "function") {
        playTask.catch(function () {
          if (overlay) {
            overlay.classList.remove("is-hidden");
          }
        });
      }
    }

    prepare();

    if (overlay) {
      overlay.addEventListener("click", begin);
    }

    player.querySelectorAll("[data-play]").forEach(function (button) {
      button.addEventListener("click", begin);
    });

    video.addEventListener("play", function () {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
    });

    video.addEventListener("ended", function () {
      if (overlay) {
        overlay.classList.remove("is-hidden");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(initPlayer);
  });
})();
