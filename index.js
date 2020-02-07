const EventEmitter = require('events')
const Flickr = require('./lib/flickr')
const constants = require('./lib/constants')
const Photos = require('./lib/photos')
const Photosets = require('./lib/photosets')
const temp = require('./lib/temp')

module.exports = class Reflector extends EventEmitter {
  constructor(config) {
    super()
    this._flickr = new Flickr(
      config.key,
      config.secret,
      config.oauthToken,
      config.oauthTokenSecret,
    )
    this._directory = config.directory
    this._photos = new Photos(this._flickr, config.id, config.directory)
    this._photosets = new Photosets(this._flickr, config.id, config.directory)
  }

  async run() {
    await temp.init(this._directory)
    this.emit('start-logging', {
      emitter: this._flickr,
      meta: {
        section: 'flickr',
      },
    })
    this.emit('start-logging', {
      emitter: this._photos,
      meta: {
        section: 'photos',
      },
    })
    this.emit('start-progress', {
      type: constants.PROGRESS_TYPE_PHOTOS,
      emitter: this._photos,
    })
    this.emit('start-logging', {
      emitter: this._photosets,
      meta: {
        section: 'photosets',
      },
    })
    this.emit('start-progress', {
      type: constants.PROGRESS_TYPE_PHOTOSETS,
      emitter: this._photosets,
    })
    await this._photosets.load()
    await this._photos.load()
  }
}
