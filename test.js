const kpow = require('kpow')
const test = require('tape')
const createPlayer = require('./')

kpow()

test('will report', (t) => {
  const player = createPlayer()

  t.notOk(player.stats.running)
  t.notOk(player.stats.time)
  t.end()
})
