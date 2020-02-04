const EventEmitter = require('events')
const constants = require('./constants')

class FlickrList extends EventEmitter {
  constructor(itemCallback) {
    super()
    this._itemCallback = itemCallback
  }

  async sync(list, total) {
    await Promise.all(list.map(async (item) => {
      await this._itemCallback(item)
      this.emit('progress', {
        total,
      })
    }))
  }
}

module.exports = FlickrList
