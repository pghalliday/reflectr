const PQueue = require('p-queue').default
const constants = require('./constants')

module.exports = new PQueue({
  concurrency: constants.QUEUE_CONCURRENCY,
  interval: constants.QUEUE_INTERVAL,
  intervalCap: constants.QUEUE_INTERVAL_CAP,
})
