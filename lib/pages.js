const EventEmitter = require('events')
const isUndefined = require('lodash').isUndefined
const map = require('lodash').map
const constants = require('./constants')

module.exports = class Pages extends EventEmitter {
  constructor() {
    super()
    this._page = 1
  }

  async load() {
    await this._init()
    while (isUndefined(this._pages) || this._page <= this._pages) {
      const page = await this._getPage(this._page)
      await this._list.sync(page.list, page.total, this._page)
      this._pages = page.pages
      this.emit('update-progress', {
        value: this._page,
        total: this._pages,
      })
      this._page++
    }
    this.emit('end-progress')
    await this._end()
  }
}
