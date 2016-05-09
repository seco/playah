'use strict';

function Playah(options, target) {
  var defaults = Object.create(Playah.defaults);
  var settings = options || {};

  for (var prop in defaults) {
    if (!settings.hasOwnProperty(prop)) {
      settings[prop] = defaults[prop];
    }
  }

  this.config = settings;

  this.then = null;
  this.isLoading = true;
  this.isRunning = false;

  this.video = document.createElement('video');
  this.context = document.createElement('canvas').getContext('2d');

  this.needsFix = /iPad|iPhone|iPod/.test(navigator.platform);
  this.avoidFix = !this.needsFix;

  this.ready = function(fn) {
    this.config.onReady = fn || this.config.onReady;

    return this;
  };

  this.ended = function(fn) {
    this.config.onEnded = fn || this.config.onEnded;

    return this;
  };

  if (target && target.nodeName.toLowerCase() === 'canvas') {
    this.context = target.getContext('2d');
  }

  if (this.needsFix) {

    // TODO: Add independent audio track if audio part required on iOS
    this.video.muted = 'muted';

    // Automatic preload not available on iOS
    this.video.load();
  }

  this.video.setAttribute('src', this.config.src);
  this.video.setAttribute('preload', 'auto');

  this.video.addEventListener('loadstart', function _onLoadStart(e) {
    try {
      this.video.currentTime = this.config.startTime;
    } catch (error) {

      // No currentTime hack available, iOS <8 I think
      this.video.removeEventListener('loadstart', _onLoadStart, false);

      return;
    }

    // Start playing immediately
    if (this.config.autoStart) {
      this.toggle();
    }

    this.config.onReady();
  }.bind(this), false);

  this.video.addEventListener('loadeddata', function _onLoadedData(e) {

    // Done loading
    this.isLoading = false;
  }.bind(this), false);

  this.video.addEventListener('ended', function _onEnded(e) {

    // Done playing
    this.isRunning = false;

    // From the top
    if (this.loop) {
      this.toggle();
    }

    this.config.onEnded();
  }.bind(this), false);
}

Playah.prototype = {
  constructor: Playah,

  update: function() {
    if (this.needsFix) {
      var now = new Date().getTime();
      var delta = now - (this.then || now);

      if (this.isRunning) {
        this.video.currentTime += delta * 0.001;

        if (this.video.currentTime >= this.video.duration) {
          this.video.currentTime = 0;

          this.isRunning = false;
        }
      }

      this.then = now;
    }

    return this;
  },

  render: function() {
    if (this.isRunning) {
      this.context.drawImage(this.video, 0, 0);
    }

    return this;
  },

  toggle: function() {
    if (this.avoidFix) {
      if (this.isRunning) {
        this.video.pause();
      } else {
        this.video.play();
      }
    }

    this.isRunning = !this.isRunning;

    return this;
  }
};

Playah.defaults = {
  src: '',
  loop: true,
  startTime: 0,
  autoStart: false,

  // Fire this callback when ready to play
  onReady: function() {},

  // Fire this callback when done playing back
  onEnded: function() {}
};

module.exports = Playah;
