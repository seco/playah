'use strict';

// # Playah
// Helps render video on canvas

var createPlayer = function (ref) {
  if ( ref === void 0 ) ref = {};
  var auto = ref.auto; if ( auto === void 0 ) auto = true;
  var loop = ref.loop; if ( loop === void 0 ) loop = false;
  var file = ref.file; if ( file === void 0 ) file = '';

  var isLame = /iPad|iPhone|iPod/.test(navigator.platform);
  var isCool = !isLame;

  var status = { busy: false, time: 0 };
  var source = document.createElement('video');

  var toggle = function () {
    if (isCool) {
      if (status.busy) {
        source.pause();
      } else {
        var launch = source.play();

        // Some browsers don't support the promise based version yet
        if (launch !== undefined) {
          launch.then(function () {
            status.busy = true;
          }).catch(function () {
            status.busy = false;
          });

          return
        }
      }
    }

    status.busy = !status.busy;
  };

  // Update
  var update = function () {
    if (isLame && status.busy) {
      var time = Date.now();
      var diff = time - (status.time || time);

      source.currentTime += diff * 0.001;
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
  source.addEventListener('loadeddata', function onloadeddata() {
    if (auto) {
      toggle();
    }

    source.removeEventListener('onloadeddata', onloadeddata, false);
  });

  // Done playing
  source.addEventListener('ended', function () {
    status.busy = false;
    status.time = source.currentTime = 0;

    if (loop) {
      toggle();
    }
  });

  if (isLame) {
    // Sorry :))
    source.muted = 'muted';

    // Must have
    source.load();
  }

  return { toggle: toggle, update: update, source: source, status: status }
};

module.exports = createPlayer;

