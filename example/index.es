import createPlayer from '../index.es'

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe')
}

const figure = document.querySelector('figure')
const master = document.querySelector('canvas').getContext('2d')

const { source, toggle, update } = createPlayer({ file: 'footage.mp4', auto: false })

const render = () => {
  master.drawImage(source, 0, 0)
}

const repeat = () => {
  update()
  render()

  window.requestAnimationFrame(repeat)
}

source.addEventListener('ended', () => {
  figure.classList.remove('is-active')
})

source.addEventListener('loadstart', () => {
  window.requestAnimationFrame(repeat)
})

document.querySelector('a').addEventListener('click', (e) => {
  e.stopPropagation()
  e.preventDefault()

  figure.classList.toggle('is-active')
  toggle()
})
