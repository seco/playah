(function () {
'use strict';

// # Playah
// Helps control video elements

var createPlayer = function (video, delay) {
  if ( delay === void 0 ) delay = 30;

  if (!video || !video.src || !video.nodeName || video.nodeName !== 'VIDEO') {
    throw TypeError('Missing valid source')
  }

  // Needs fixing?
  var veto = delay && /iPad|iPhone|iPod/.test(navigator.platform);

  // Paused?
  var idle = true;

  var tick = function (since) {
    var stamp = Date.now();
    var delta = stamp - (since || stamp);

    // In ms
    video.currentTime += delta * 0.001;

    // Repeat, repurpose veto flag
    veto = setTimeout(tick, delay, stamp);
  };

  var kick = function () {
    if (idle) {
      tick();
    }

    idle = false;

    return idle
  };

  var drop = function () {
    if (veto) {
      clearTimeout(veto);
    }

    idle = true;

    return idle
  };

  var stop = veto ? drop : function () {
    video.pause();

    return video.paused
  };

  var play = veto ? kick : function () {
    var playsMaybe = video.play();

    // Some browsers don't support the promise based version yet
    if (playsMaybe) {
      // Fail silently, because the `paused` attribute remains unchanged regardless
      playsMaybe.catch(function () {});
    }

    return video.paused
  };

  // Check availability
  video.addEventListener('loadstart', function xloadstart() {
    try {
      video.currentTime = 0;
    } catch (e) {
      // No currentTime hack available, that means iOS <8 I believe
      throw e
    }

    video.removeEventListener('loadstart', xloadstart);
  });

  // Done playing
  video.addEventListener('ended', function () {
    video.currentTime = 0;

    if (veto) {
      stop();
    }

    if (video.loop) {
      play();
    }
  });

  if (veto) {
    if (video.autoplay) {
      play();
    }

    // Drop before anyone gets hurt
    video.removeAttribute('autoplay');

    // Must have
    video.load();
  }

  return { play: play, stop: stop, start: play, pause: stop }
};

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

var source = document.createElement('video');

// Fallback video from
// https://www.pond5.com/stock-footage/43338828/czechoslovak-troops-marching-parade.html
source.setAttribute('src', 'source.mp4');

var player = createPlayer(source);

var figure = document.querySelector('figure');
var target = document.querySelector('canvas').getContext('2d');

var createLoop = function (loop) {
  var id = false;

  var start = function () {
    loop();

    id = window.requestAnimationFrame(start);
  };

  var pause = function () {
    id = id && window.cancelAnimationFrame(id);
  };

  return { start: start, pause: pause }
};

var looper = createLoop(function () {
  target.drawImage(source, 0, 0);
});

source.addEventListener('ended', function () {
  figure.classList.remove('is-active');
  looper.pause();
});

document.querySelector('a').addEventListener('click', function (e) {
  e.stopPropagation();
  e.preventDefault();

  if (figure.classList.contains('is-active')) {
    player.pause();
    looper.pause();
  } else {
    player.start();
    looper.start();
  }

  figure.classList.toggle('is-active');
}, false);

}());

