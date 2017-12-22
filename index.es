// # Playah
// Helps render video on canvas

const createPlayer = ({ auto = true, loop = false, file = '' } = {}) => {
  const source = document.createElement('video')
  const status = { time: 0, idle: true, lame: /iPad|iPhone|iPod/.test(navigator.platform) }

  const toggle = () => {
    if (!status.lame) {
      if (!status.idle) {
        source.pause()
      } else {
        const playing = source.play()

        // Some browsers don't support the promise based version yet
        if (playing !== undefined) {
          playing.then(() => {
            status.idle = false
          }).catch(() => {
            status.idle = true
          })

          return
        }
      }
    }

    status.idle = !status.idle
  }

  // Update
  const update = () => {
    if (status.idle) {
      return
    }

    if (status.lame) {
      const time = Date.now()
      const then = status.time || time
      const step = time - then

      source.currentTime += step * 0.001
      status.time = time
    }
  }

  // Go
  source.src = file
  source.preload = 'auto'

  // Check availability
  source.addEventListener('loadstart', function onloadstart() {
    try {
      source.currentTime = 0
    } catch (e) {
      // No currentTime hack available, that means iOS <8 I believe
      source.removeEventListener('loadstart', onloadstart)
    }
  })

  // First frame done loading
  source.addEventListener('loadeddata', function onloadeddata() {
    if (auto) {
      toggle()
    }

    source.removeEventListener('loadeddata', onloadeddata)
  })

  // Done playing
  source.addEventListener('ended', () => {
    status.idle = true
    status.time = source.currentTime = 0

    if (loop) {
      toggle()
    }
  })

  if (status.lame) {
    // Sorry :))
    source.muted = 'muted'

    // Must have
    source.load()
  }

  return { source, toggle, update, status }
}

export default createPlayer
