import 'cutaway'
import { report, assert } from 'tapeless'
import createPlayer from './index.es'

const { ok, notOk } = assert
const { status } = createPlayer()

ok(status.idle, 'running state', 'will report')
notOk(status.time, 'current time')

report()
