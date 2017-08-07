import createPlayer from '../index.es'

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe')
}

const figure = document.querySelector('figure')
const button = document.querySelector('a')
const master = document.querySelector('canvas').getContext('2d')

const { video, toggle, update } = createPlayer({ file: 'BigBuckBunny.mp4', auto: false })

const handleClick = (e) => {
  e.preventDefault()
  e.stopPropagation()

  toggle()
  figure.classList.toggle('is-playing')
}

const render = () => {
  master.drawImage(video, 0, 0)
}

const repeat = () => {
  update()
  render()

  window.requestAnimationFrame(repeat)
}

video.addEventListener('loadstart', () => {
  window.requestAnimationFrame(repeat)
})

video.addEventListener('ended', () => {
  figure.classList.remove('is-playing')
})

button.addEventListener('touchstart', handleClick)
button.addEventListener('mousedown', handleClick)
