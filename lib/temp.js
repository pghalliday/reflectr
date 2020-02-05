const uuidv1 = require('uuid/v1')
const path = require('path')
const mkdirp = require('mkdirp')
const constants = require('./constants')

class Temp {
  async init(directory) {
    this._directory = path.join(directory, constants.TEMP_DIRECTORY)
    await mkdirp(this._directory)
  }

  file() {
    return path.join(this._directory, uuidv1())
  }
}

module.exports = new Temp()
