function setupPlayer(source) {
  var video = document.getElementById('movie-player');
  var overlay = document.querySelector('.player-overlay');
  var button = document.getElementById('play-trigger');
  var loaded = false;
  var hlsInstance = null;

  if (!video || !source) {
    return;
  }

  function loadVideo() {
    if (loaded) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }

    loaded = true;
  }

  function startPlay() {
    loadVideo();
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    video.setAttribute('controls', 'controls');
    var playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener('click', startPlay);
  }

  if (overlay) {
    overlay.addEventListener('click', startPlay);
  }

  video.addEventListener('click', function () {
    if (!loaded || video.paused) {
      startPlay();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
