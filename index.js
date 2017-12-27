'use strict';

// # Playah
// Helps control video elements

var createPlayer = function (video, delay) {
  if ( delay === void 0 ) delay = 30;

  if (video === undefined || video.nodeName === undefined || video.nodeName !== 'VIDEO') {
    throw TypeError('Missing valid source')
  }

  // Needs fixing?
  var veto = /iPad|iPhone|iPod/.test(navigator.platform);

  // Is playing?
  var idle = true;

  var tick = function (since) {
    var stamp = Date.now();
    var delta = stamp - (since || stamp);

    // In ms
    video.currentTime += delta * 0.001;

    // Be safe
    video.currentTime %= video.duration || 0.001;

    // Repeat, repurpose veto flag
    veto = setTimeout(tick, delay, stamp);
  };

  var kick = function () {
    if (idle) {
      tick();
    }

    idle = false;
  };

  var drop = function () {
    if (veto) {
      clearTimeout(veto);
    }

    idle = true;
  };

  var stop = veto ? drop : function () {
    video.pause();
  };

  var play = veto ? kick : function () {
    var playsMaybe = video.play();

    // Some browsers don't support the promise based version yet
    if (playsMaybe) {
      playsMaybe.catch(console.log);
    }
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

    // Must have
    video.load();
  }

  return { play: play, stop: stop, start: play, pause: stop }
};

module.exports = createPlayer;

