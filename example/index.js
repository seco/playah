'use strict';

var Playah = window.playah;

var html = document.documentElement;
var toggle = document.getElementById('toggle');
var canvas = document.getElementById('canvas');

var frameId;

var player = new Playah({
  src: 'BigBuckBunny.mp4',
  loop: false
}, canvas);

var animate = function() {
  player.update();
  player.render();

  //if (html.classList.contains('is-playing')) {
    //console.log(player.video.currentTime);
  //}

  frameId = window.requestAnimationFrame(animate);
};

player.onEnded = function() {
  html.classList.remove('is-playing');
};

toggle.addEventListener('click', function _onClick(e) {
  player.toggle();

  html.classList.toggle('is-playing');

  return false;
}, false);

window.addEventListener('load', function _onLoad(e) {
  frameId = window.requestAnimationFrame(animate);
}, false);

html.className = 'html';

if (window !== window.top) {
  html.classList.add('is-iframe');
}
