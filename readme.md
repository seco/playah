> Helps draw video on canvas, including on iOS >= 8

### Setup
```sh
# Fetch latest from github
npm i thewhodidthis/playah
```

### Usage
```js
import createPlayer from 'playah'

const target = document.createElement('canvas').getContext('2d')
const source = createPlayer({ file: 'BigBuckBunny.mp4', loop: true })

source.update()
target.drawImage(source.video, 0, 0)
```
