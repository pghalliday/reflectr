const pThrottle = require('p-throttle')
const constants = require('./constants')

module.exports = pThrottle((func) => {
  return func()
}, constants.THROTTLE_LIMIT, constants.THROTTLE_INTERVAL)
