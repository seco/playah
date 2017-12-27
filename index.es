// # Playah
// Helps control video elements

const createPlayer = (video, delay = 30) => {
  if (!video || !video.src || !video.nodeName || video.nodeName !== 'VIDEO') {
    throw TypeError('Missing valid source')
  }

  // Needs fixing?
  let veto = /iPad|iPhone|iPod/.test(navigator.platform)

  // Is playing?
  let idle = true

  const tick = (since) => {
    const stamp = Date.now()
    const delta = stamp - (since || stamp)

    // In ms
    video.currentTime += delta * 0.001

    // Repeat, repurpose veto flag
    veto = setTimeout(tick, delay, stamp)
  }

  const kick = () => {
    if (idle) {
      tick()
    }

    idle = false
  }

  const drop = () => {
    if (veto) {
      clearTimeout(veto)
    }

    idle = true
  }

  const stop = veto ? drop : () => {
    video.pause()
  }

  const play = veto ? kick : () => {
    const playsMaybe = video.play()

    // Some browsers don't support the promise based version yet
    if (playsMaybe) {
      playsMaybe.catch(console.log)
    }
  }

  // Check availability
  video.addEventListener('loadstart', function xloadstart() {
    try {
      video.currentTime = 0
    } catch (e) {
      // No currentTime hack available, that means iOS <8 I believe
      throw e
    }

    video.removeEventListener('loadstart', xloadstart)
  })

  // Done playing
  video.addEventListener('ended', () => {
    video.currentTime = 0

    if (veto) {
      stop()
    }

    if (video.loop) {
      play()
    }
  })

  if (veto) {
    if (video.autoplay) {
      play()
    }

    // Drop before anyone gets hurt
    video.removeAttribute('autoplay')

    // Must have
    video.load()
  }

  return { play, stop, start: play, pause: stop }
}

export default createPlayer
