import 'cutaway'
import { report, assert } from 'tapeless'
import createPlayer from './index.es'

const { notOk } = assert
const { stats } = createPlayer()

notOk(stats.running, 'running state', 'will report')
notOk(stats.time, 'current time')

report()
