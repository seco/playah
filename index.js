'use strict';

function Playah(target, source) {
  var time;
  var loop = true;
  var isLoading = true;
  var isPlaying = false;

  var iOS = /iPad|iPhone|iPod/.test(navigator.platform);
  var video = document.createElement('video');
  var context = target.getContext('2d');

  var toggle = function() {
    if (!iOS) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }

    isPlaying = !isPlaying;
  };

  var update = function() {
    if (iOS) {
      var now = new Date().getTime();
      var delta = now - (time || now);

      video.currentTime += delta * 0.001;
      time = now;
    }

    if (video.currentTime >= video.duration) {
      video.currentTime = 0;
      isPlaying = false;
    }

    return this;
  };

  var render = function() {
    context.drawImage(video, 0, 0);

    return this;
  };

  video.setAttribute('src', source);
  video.setAttribute('preload', 'auto');

  video.addEventListener('loadstart', function _onLoadStart(e) {
    try {
      video.currentTime = 0;
    } catch (error) {
      video.removeEventListener('loadstart', _onLoadStart, false);

      return;
    }

    toggle();
  }, false);

  video.addEventListener('loadeddata', function _onLoadedData(e) {
    isLoading = false;
  }, false);

  video.addEventListener('ended', function _onEnded(e) {
    if (loop) {
      toggle();
    }
  }, false);

  if (iOS) {
    video.load();
  }

  return {
    toggle: toggle,
    update: update,
    render: render
  };
}

module.exports = Playah;
