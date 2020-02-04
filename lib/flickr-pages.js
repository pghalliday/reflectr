const EventEmitter = require('events')
const isUndefined = require('lodash').isUndefined
const map = require('lodash').map
const constants = require('./constants')
const FlickrList = require('./flickr-list')

class FlickrPages extends EventEmitter {
  constructor(pageCallback, itemCallback) {
    super()
    this.list = new FlickrList(itemCallback)
    this._pageCallback = pageCallback
    this._page = 1
  }

  async load() {
    let promises = []
    while (isUndefined(this._pages) || this._page <= this._pages) {
      const page = await this._pageCallback(this._page)
      promises.push(this.list.sync(page.list, page.total))
      this._pages = page.pages
      this.emit('progress', {
        total: this._pages,
      })
      this._page++
    }
    await Promise.all(promises)
  }
}

module.exports = FlickrPages
