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

  // Is playing?
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

    // Paused?
    return idle
  };

  var drop = function () {
    if (veto) {
      clearTimeout(veto);
    }

    idle = true;

    // Paused?
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

module.exports = createPlayer;

