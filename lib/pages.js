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
      this.emit('log', {
        level: 'info',
        message: `getting page ${this._page}`,
      })
      const page = await this._getPage(this._page)
      this._pages = page.pages
      this.emit('log', {
        level: 'info',
        message: `syncing page ${this._page} of ${this._pages}`,
      })
      await this._list.sync(page.list, page.total, this._page)
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
