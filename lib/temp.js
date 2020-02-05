const uuidv1 = require('uuid/v1')
const path = require('path')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const promisify = require('util').promisify
const constants = require('./constants')

const primraf = promisify(rimraf)

class Temp {
  async init(directory) {
    this._directory = path.join(directory, constants.TEMP_DIRECTORY)
    await primraf(this._directory)
    await mkdirp(this._directory)
  }

  file() {
    return path.join(this._directory, uuidv1())
  }
}

module.exports = new Temp()
