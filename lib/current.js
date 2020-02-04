const EventEmitter = require('events')

module.exports = class Current extends EventEmitter {
  constructor(hasBeenUpdated, deleteItem, writeItem) {
    super()
    this._hasBeenUpdated = hasBeenUpdated
    this._deleteItem = deleteItem
    this._writeItem = writeItem
  }

  init(ids) {
    this._ids = ids
  }

  async check(item) {
    const index = this._ids.indexOf(item.id)
    if (index !== -1) {
      this._ids.splice(index, 1)
      const hasBeenUpdated = await this._hasBeenUpdated(item)
      if (hasBeenUpdated)  {
        await this._writeItem(item)
      }
    } else {
      await this._writeItem(item)
    }
  }

  async clean() {
    const total = this._ids.length
    const ids = this._ids
    for (let i = 0; i < total; i++) {
      await this._deleteItem(ids[i])
      this.emit('update-progress', {
        value: i + 1,
        total,
      })
    }
    this.emit('end-progress')
  }
}
