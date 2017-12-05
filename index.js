'use strict';

// # Playah
// Helps render video on canvas

const createPlayer = ({ auto = true, loop = false, file = '' } = {}) => {
  const isLame = /iPad|iPhone|iPod/.test(navigator.platform);
  const isCool = !isLame;

  const status = { busy: false, time: 0 };
  const source = document.createElement('video');

  const toggle = () => {
    if (isCool) {
      if (status.busy) {
        source.pause();
      } else {
        const launch = source.play();

        // Some browsers don't support the promise based version yet
        if (launch !== undefined) {
          launch.then(() => {
            status.busy = true;
          }).catch(() => {
            status.busy = false;
          });

          return
        }
      }
    }

    status.busy = !status.busy;
  };

  // Update
  const update = () => {
    if (isLame) {
      const time = Date.now();
      const diff = time - (status.time || time);

      if (status.busy) {
        source.currentTime += diff * 0.001;
      }

      status.time = time;
    }
  };

  // Go
  source.src = file;
  source.preload = 'auto';

  // Check availability
  source.addEventListener('loadstart', function onloadstart() {
    try {
      source.currentTime = status.time;
    } catch (e) {
      // No currentTime hack available, that means iOS <8 I believe
      source.removeEventListener('loadstart', onloadstart, false);
    }
  });

  // First frame done loading
  source.addEventListener('loadeddata', () => {
    if (auto) {
      toggle();
    }
  });

  // Done playing
  source.addEventListener('ended', () => {
    status.busy = false;
    status.time = source.currentTime = 0;

    if (loop) {
      toggle();
    }
  });

  if (isLame) {
    // Just in case
    source.muted = 'muted';

    // Must have
    source.load();
  }

  return { toggle, update, source, status }
};

module.exports = createPlayer;
