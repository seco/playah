> Helps controls video elements, including on iOS >= 8

### Setup
```sh
# Fetch latest from github
npm i thewhodidthis/playah
```

### Usage
```js
import createPlayer from 'playah'

const video = document.createElement('video')

'playsinline loop autoplay'.split(' ').forEach((v) => {
  video.setAttribute(v, '')
})

video.setAttribute('src', 'footage.mp4')

const { play, stop } = createPlayer(video)

let isBusy

video.addEventListener('loadstart', () => {
    isBusy = true
})

video.addEventListener('click', (e) => {
    e.preventDefault()

    if (isBusy) {
        stop()
    } else {
        play()
    }

    isBusy = !isBusy
}, false)

document.body.appendChild(video)
```
