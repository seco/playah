(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.playah = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

  this.isRunning = false;
  this.isLoading = true;
  this.then = null;

  this.video = document.createElement('video');
  this.context = document.createElement('canvas').getContext('2d');

  this.needsFix = /iPad|iPhone|iPod/.test(navigator.platform);
  this.avoidFix = !this.needsFix;

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

    this.config.onLoaded();
  }.bind(this), false);

  this.video.addEventListener('ended', function _onEnded(e) {

    // Done playing
    this.isRunning = false;

    // From the top
    if (this.config.loop) {
      this.toggle();
    }

    this.config.onEnded();
  }.bind(this), false);

  if (target && target.nodeName.toLowerCase() === 'canvas') {
    this.context = target.getContext('2d');
  }

  if (this.needsFix) {

    // TODO: Add independent audio track if audio part required on iOS
    this.video.muted = 'muted';

    // Automatic preload not available on iOS
    this.video.load();
  }
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

  // Fire this callback when metadata has loaded
  onLoaded: function() {},

  // Fire this callback when done playing back
  onEnded: function() {}
};

module.exports = Playah;

},{}]},{},[1])(1)
});