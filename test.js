'use strict'

const kpow = require('kpow')
const test = require('tape')
const createPlayer = require('./')

kpow()

test('will report', (t) => {
  const { stats } = createPlayer()

  t.notOk(stats.running)
  t.notOk(stats.time)
  t.end()
})
