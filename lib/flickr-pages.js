const EventEmitter = require('events')
const isUndefined = require('lodash').isUndefined
const constants = require('./constants')
const flickrQueue = require('./flickr-queue')

class FlickrPages extends EventEmitter {
  constructor(apiCallback, field, subfield) {
    super()
    this._apiCallback = apiCallback
    this._field = field
    this._subfield = subfield
    this._page = 1
    this.list = []
  }

  async load() {
    while (isUndefined(this._pages) || this._page <= this._pages) {
      const {body} = await flickrQueue.add(this._apiCallback(this._page))
      const field = body[this._field]
      this.list = this.list.concat(field[this._subfield]) 
      this._pages = field.pages
      this.emit('progress', {
        total: this._pages,
      })
      this._page++
    }
  }
}

module.exports = FlickrPages
