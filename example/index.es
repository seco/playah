import createPlayer from '../index.es';

if (window !== window.top) {
  document.documentElement.classList.add('is-iframe');
}

const figure = document.querySelector('figure');
const button = document.querySelector('a');
const master = document.querySelector('canvas').getContext('2d');

const player = createPlayer({ file: 'BigBuckBunny.mp4' });

const toggle = (e) => {
  e.preventDefault();
  e.stopPropagation();

  player.toggle();
  figure.classList.toggle('is-playing');
};

const update = player.update;
const render = () => {
  master.drawImage(player.video, 0, 0);
};
const repeat = () => {
  update();
  render();

  window.requestAnimationFrame(repeat);
};

player.video.addEventListener('loadstart', () => {
  window.requestAnimationFrame(repeat);
});

player.video.addEventListener('loadeddata', () => {
  figure.classList.add('is-playing');
});

player.video.addEventListener('ended', () => {
  figure.classList.remove('is-playing');
});

button.addEventListener('touchstart', toggle);
button.addEventListener('mousedown', toggle);

