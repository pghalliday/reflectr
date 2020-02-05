const fs = require('fs').promises
const path = require('path')
const {
  createLogger,
  format,
  transports,
} = require('winston')
const constants = require('./constants')

function startLogging(parent, {emitter, meta}) {
  const logger = parent.child(meta)
  emitter.on('start-logging', startLogging.bind(null, logger))
  emitter.on('log', logger.log.bind(logger))
}

module.exports = async function log(directory, emitter) {
  const logFile = path.join(directory, constants.LOG_FILE)
  try {
    await fs.unlink(logFile)
  } catch (err) {
    // ignore the error, file may not exist
  }
  const logger = createLogger({
    format: format.combine(
      format.timestamp(),
      format.json(),
    ),
    transports: [
      new transports.File({
        filename: logFile,
      })
    ],
    exitOnError: false,
  })
  startLogging(logger, {emitter})
}
