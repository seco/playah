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
const { update, source } = createPlayer({ file: 'BigBuckBunny.mp4' })

const render = () => {
    target.drawImage(source, 0, 0)
}

window.requestAnimationFrame(() => {
    update()
    render()
})
```
