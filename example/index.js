(function () {
'use strict';

// # Playah
// Helps render video on canvas

var createPlayer = function (options) {
  // Apply fix?
  var isIOS = /iPad|iPhone|iPod/.test(navigator.platform);

  // Current config
  var wants = Object.assign({ auto: true, loop: false, file: '' }, options);

  // Status
  var stats = { running: false, time: 0 };

  // Source
  var video = document.createElement('video');

  // Toggle
  var onoff = function () {
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
  var frame = function () {
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

  return { toggle: onoff, update: frame, video: video, stats: stats }
};

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

var figure = document.querySelector('figure');
var button = document.querySelector('a');
var master = document.querySelector('canvas').getContext('2d');

var player = createPlayer({ file: 'BigBuckBunny.mp4' });

var toggle = function (e) {
  e.preventDefault();
  e.stopPropagation();

  player.toggle();
  figure.classList.toggle('is-playing');
};

var update = player.update;
var render = function () {
  master.drawImage(player.video, 0, 0);
};
var repeat = function () {
  update();
  render();

  window.requestAnimationFrame(repeat);
};

player.video.addEventListener('loadstart', function () {
  window.requestAnimationFrame(repeat);
});

player.video.addEventListener('loadeddata', function () {
  figure.classList.add('is-playing');
});

player.video.addEventListener('ended', function () {
  figure.classList.remove('is-playing');
});

button.addEventListener('touchstart', toggle);
button.addEventListener('mousedown', toggle);

}());

