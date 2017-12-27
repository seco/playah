import 'cutaway'
import { report, assert } from 'tapeless'
import createPlayer from './index.es'

const { ok, equal } = assert

try {
  createPlayer()
} catch (e) {
  ok(e, e.message, 'will throw sans video input')
}

const source = document.createElement('video')

const { play, stop } = createPlayer(source)

equal(typeof play, 'function', 'play', 'will return')
equal(typeof stop, 'function', 'stop')

report()
