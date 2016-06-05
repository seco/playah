'use strict';

var Playah = window.playah;

var html = document.documentElement;
var toggle = document.getElementById('toggle');
var canvas = document.getElementById('canvas');

var frameId;
var isReady = false;

var player = new Playah({
  src: 'BigBuckBunny.mp4',
  loop: false
}, canvas);

var animate = function() {
  player.update();
  player.render();

  frameId = window.requestAnimationFrame(animate);
};

player.config.ended = function() {
  html.classList.remove('is-playing');
};

toggle.addEventListener('click', function _onClick(e) {
  if (player.isLoading === false) {
    player.toggle();

    html.classList.toggle('is-playing');
  }

  return false;
}, false);

window.addEventListener('load', function _onLoad(e) {
  frameId = window.requestAnimationFrame(animate);
}, false);

html.className = 'html';

if (window !== window.top) {
  html.classList.add('is-iframe');
}
