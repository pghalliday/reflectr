const EventEmitter = require('events')
const request = require('request')
const createWriteStream = require('fs').createWriteStream
const rename = require('fs').promises.rename
const temp = require('./temp')
const constants = require('./constants')

module.exports = class Download extends EventEmitter {
  constructor(source, destination) {
    super()
    this._source = source
    this._destination = destination
  }

  async get() {
    this.emit('log', {
      level: 'info',
      message: `downloading ${this._source} to ${this._destination}`,
    })
    const tempFile = temp.file()
    await new Promise((resolve, reject) => {
      request
        .get(this._source, {
          timeout: constants.DOWNLOAD_REQUEST_TIMEOUT,
        })
        .on('error', reject)
        .on('response', (response) => {
          const total =
            parseInt(response.headers['content-length']) ||
            parseInt(response.headers['x-ttdb-l'])
          let value = 0
          this.emit('update-progress', {
            value,
            total,
          })
          response.on('data', (chunk) => {
            value += chunk.length
            this.emit('update-progress', {
              value,
              total,
            })
          })
        })
        .pipe(createWriteStream(tempFile))
        .on('finish', resolve)
    })
    await rename(tempFile, this._destination)
    this.emit('end-progress')
  }
}
