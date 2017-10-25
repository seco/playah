'use strict';

// # Playah
// Helps render video on canvas

const createPlayer = (options) => {
  // Apply fix?
  const isIOS = /iPad|iPhone|iPod/.test(navigator.platform);

  // Current config
  const wants = Object.assign({ auto: true, loop: false, file: '' }, options);

  // Status
  const stats = { running: false, time: 0 };

  // Source
  const video = document.createElement('video');

  // Toggle
  const onoff = () => {
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
  const frame = () => {
    if (isIOS) {
      const time = new Date().getTime();
      const diff = time - (stats.time || time);

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
  video.addEventListener('loadeddata', () => {
    if (wants.auto) {
      onoff();
    }
  });

  // Done playing
  video.addEventListener('ended', () => {
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

  return { toggle: onoff, update: frame, video, stats }
};

module.exports = createPlayer;
