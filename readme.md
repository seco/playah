## Playah
> Helps draw video on canvas, including on iOS >= 8

### Setup
```sh
npm install thewhodidthis/playah
```

### Usage
```js
const createPlayer = require('playah');

const player = createPlayer({ file: 'BigBuckBunny.mp4', loop: true });
const master = document.createElement('canvas').getContext('2d');

player.update();
master.drawImage(player.video, 0, 0);
```
