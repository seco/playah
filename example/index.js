(function () {
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
    if (isLame) {
      var time = Date.now();
      var diff = time - (status.time || time);

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
  source.addEventListener('loadeddata', function () {
    if (auto) {
      toggle();
    }
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
    // Just in case
    source.muted = 'muted';

    // Must have
    source.load();
  }

  return { toggle: toggle, update: update, source: source, status: status }
};

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

var figure = document.querySelector('figure');
var master = document.querySelector('canvas').getContext('2d');

var ref = createPlayer({ file: 'footage.mp4', auto: false });
var source = ref.source;
var toggle = ref.toggle;
var update = ref.update;

var render = function () {
  master.drawImage(source, 0, 0);
};

var repeat = function () {
  update();
  render();

  window.requestAnimationFrame(repeat);
};

source.addEventListener('ended', function () {
  figure.classList.remove('is-active');
});

source.addEventListener('loadstart', function () {
  window.requestAnimationFrame(repeat);
});

document.querySelector('a').addEventListener('click', function (e) {
  e.stopPropagation();
  e.preventDefault();

  figure.classList.toggle('is-active');
  toggle();
});

}());

