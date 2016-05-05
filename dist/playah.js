(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.playah = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});