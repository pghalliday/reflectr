const EventEmitter = require('events')
const Flickr = require('flickr-sdk')
const constants = require('./lib/constants')
const Photos = require('./lib/photos')
const Photosets = require('./lib/photosets')
const temp = require('./lib/temp')

module.exports = class Reflector extends EventEmitter {
  constructor(config) {
    super()
    const flickr = new Flickr(Flickr.OAuth.createPlugin(
      config.key,
      config.secret,
      config.oauthToken,
      config.oauthTokenSecret,
    ))
    this._directory = config.directory
    this._photos = new Photos(flickr, config.id, config.directory)
    this._photosets = new Photosets(flickr, config.id, config.directory)
  }

  async run() {
    await temp.init(this._directory)
    this.emit('start-progress', {
      type: constants.PROGRESS_TYPE_PHOTOS,
      emitter: this._photos,
    })
    this.emit('start-progress', {
      type: constants.PROGRESS_TYPE_PHOTOSETS,
      emitter: this._photosets,
    })
    await Promise.all([
      this._photos.load(),
      this._photosets.load(),
    ])
  }
}
