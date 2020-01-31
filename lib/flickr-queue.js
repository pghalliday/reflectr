const PQueue = require('p-queue').default
const constants = require('./constants')

module.exports = new PQueue({
  concurrency: constants.FLICKR_QUEUE_CONCURRENCY,
  interval: constants.FLICKR_QUEUE_INTERVAL,
  intervalCap: constants.FLICKR_QUEUE_INTERVAL_CAP,
})
