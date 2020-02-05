const EventEmitter = require('events')

class FilePage extends EventEmitter {
  constructor(current) {
    super()
    this._current = current
  }

  async sync(list, page) {
    const total = list.length
    for (let i = 0; i < total; i++) {
      await this._current.check(list[i])
      this.emit('update-progress', {
        total,
      })
    }
    this.emit('end-progress')
  }
}

module.exports = class FileList extends EventEmitter {
  constructor(current, type) {
    super()
    this._current = current
    this._type = type
  }

  async sync(list, total, page) {
    let value
    const filePage = new FilePage(this._current)
    filePage.on('update-progress', (event) => {
      this.emit('update-progress', {
        total,
      })
    })
    this.emit('start-progress', {
      type: this._type,
      emitter: filePage,
      params: {
        page,
      },
    })
    await filePage.sync(list, page)
  }

  async end() {
    this.emit('end-progress')
  }
}
