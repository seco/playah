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
var player = new Playah(document.getElementById('canvas'), 'BigBuckBunny.mp4');

// Render a single frame
player.update().render();
```
