const EventEmitter = require('events')

module.exports = class FileList extends EventEmitter {
  constructor(current) {
    super()
    this._current = current
    this._count = 0
  }

  async sync(list, total) {
    await Promise.all(list.map(async (item) => {
      await this._current.check(item)
      this._count++
      this.emit('update-progress', {
        value: this._count,
        total,
      })
    }))
  }

  async end() {
    this.emit('end-progress')
  }
}
