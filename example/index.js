'use strict';

var Playah = window.playah;
var player = new Playah(document.getElementById('canvas'), 'BigBuckBunny.mp4');

// OR
// new Playah({
//    fps: 25,
//    source: 'BigBuckBunny.mp4',
// }, document.getElementById('canvas'))

var animate = function() {
  player.update();
  player.render();

  window.requestAnimationFrame(animate);
};

document.documentElement.className = 'html js';

window.addEventListener('load', function _onLoad(e) {
  window.requestAnimationFrame(animate);
}, false);
