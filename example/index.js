'use strict';

var Playah = window.playah;

var html = document.documentElement;
var canvas = document.getElementById('canvas');

var frameId;

var player = new Playah({
  src: 'BigBuckBunny.mp4'
}, canvas);

var animate = function() {
  player.update();
  player.render();

  frameId = window.requestAnimationFrame(animate);
};

html.className = 'html js';

if (window !== window.top) {
  html.className += ' is-iframe';
}

player.ready(function() {
  console.log('ready');
});

player.ended(function() {
  console.log('ended');
});

canvas.addEventListener('click', function _onClick(e) {
  player.toggle();

  return false;
}, false);

window.addEventListener('load', function _onLoad(e) {
  frameId = window.requestAnimationFrame(animate);
}, false);
