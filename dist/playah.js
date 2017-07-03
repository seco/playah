var Playah = (function () {
'use strict';

var createPlayer = function createPlayer(options) {
  // Needs fix?
  var isIOS = /iPad|iPhone|iPod/.test(window.navigator.platform);

  // Config
  var wants = Object.assign({ auto: true, loop: false, file: '' }, options);

  // Status
  var stats = { running: false, time: 0 };

  // Source
  var video = document.createElement('video');

  // Toggle
  var onoff = function onoff() {
    if (!isIOS) {
      if (stats.running) {
        video.pause();
      } else {
        video.play();
      }
    }

    stats.running = !stats.running;
  };

  // Update
  var frame = function frame() {
    if (isIOS) {
      var time = new Date().getTime();
      var diff = time - (stats.time || time);

      if (stats.running) {
        video.currentTime += diff * 0.001;

        if (video.currentTime >= video.duration) {
          video.currentTime = 0;
          stats.running = false;
        }
      }

      stats.time = time;
    }
  };

  // Go
  video.src = wants.file;
  video.preload = 'auto';

  // Check availability
  video.addEventListener('loadstart', function onloadstart() {
    try {
      video.currentTime = stats.time;
    } catch (error) {
      // No currentTime hack available, that means iOS <8 I believe
      video.removeEventListener('loadstart', onloadstart, false);
    }
  });

  // First frame done loading
  video.addEventListener('loadeddata', function () {
    if (wants.auto) {
      onoff();
    }
  });

  // Done playing
  video.addEventListener('ended', function () {
    stats.running = false;

    if (wants.loop) {
      onoff();
    }
  });

  if (isIOS) {
    // Just in case
    video.muted = 'muted';

    // Must have
    video.load();
  }

  return { toggle: onoff, update: frame, video: video, stats: stats };
};

return createPlayer;

}());
