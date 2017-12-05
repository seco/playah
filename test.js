import 'cutaway'
import { report, assert } from 'tapeless'
import createPlayer from './index.es'

const { notOk } = assert
const { status } = createPlayer()

notOk(status.busy, 'running state', 'will report')
notOk(status.time, 'current time')

report()
