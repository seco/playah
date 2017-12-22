(function () {
'use strict';

// # Playah
// Helps render video on canvas

var createPlayer = function (ref) {
  if ( ref === void 0 ) ref = {};
  var auto = ref.auto; if ( auto === void 0 ) auto = true;
  var loop = ref.loop; if ( loop === void 0 ) loop = false;
  var file = ref.file; if ( file === void 0 ) file = '';

  var source = document.createElement('video');
  var status = { time: 0, idle: true, lame: /iPad|iPhone|iPod/.test(navigator.platform) };

  var toggle = function () {
    if (!status.lame) {
      if (!status.idle) {
        source.pause();
      } else {
        var playing = source.play();

        // Some browsers don't support the promise based version yet
        if (playing !== undefined) {
          playing.then(function () {
            status.idle = false;
          }).catch(function () {
            status.idle = true;
          });

          return
        }
      }
    }

    status.idle = !status.idle;
  };

  // Update
  var update = function () {
    if (status.idle) {
      return
    }

    if (status.lame) {
      var time = Date.now();
      var then = status.time || time;
      var step = time - then;

      source.currentTime += step * 0.001;
      status.time = time;
    }
  };

  // Go
  source.src = file;
  source.preload = 'auto';

  // Check availability
  source.addEventListener('loadstart', function onloadstart() {
    try {
      source.currentTime = 0;
    } catch (e) {
      // No currentTime hack available, that means iOS <8 I believe
      source.removeEventListener('loadstart', onloadstart);
    }
  });

  // First frame done loading
  source.addEventListener('loadeddata', function onloadeddata() {
    if (auto) {
      toggle();
    }

    source.removeEventListener('loadeddata', onloadeddata);
  });

  // Done playing
  source.addEventListener('ended', function () {
    status.idle = true;
    status.time = source.currentTime = 0;

    if (loop) {
      toggle();
    }
  });

  if (status.lame) {
    // Sorry :))
    source.muted = 'muted';

    // Must have
    source.load();
  }

  return { source: source, toggle: toggle, update: update, status: status }
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

