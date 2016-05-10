## Playah
> Helps draw video on canvas, including on iOS >= 8.

### Setup
```sh
npm install thewhodidthis/playah

# Build demo
npm run example
```

### Usage
```js
var Playah = require('playah');
var player = new Playah({
	loop: false,
	autoStart: true,
	src: 'BigBuckBunny.mp4'
}, document.getElementById('canvas'));

// Render a single frame and stop
window.addEventListener('load', function _onLoad(e) {
	var frameId = window.requestAnimationFrame(function() {
		player.update().render().toggle();
	});
}, false);
```
