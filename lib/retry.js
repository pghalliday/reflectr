const EventEmitter = require('events')
const wait = require('./wait')

module.exports = class Retry extends EventEmitter {
  constructor(func, wait, limit) {
    super()
    this._func = func
    this._wait = wait
    this._limit = limit
    this._count = 0
  }

  async start() {
    try {
      return await this._func()
    } catch (err) {
      this._count++
      if (this._count <= this._limit) {
        this.emit('log', {
          level: 'warning',
          message: err.message,
        })
        this.emit('log', {
          level: 'info',
          message: `retrying in ${this._wait}ms`,
        })
        await wait(this._wait)
        this.emit('log', {
          level: 'info',
          message: `retry ${this._count} of ${this._limit}`,
        })
        return this.start()
      } else {
        this.emit('log', {
          level: 'error',
          message: err.message,
        })
        throw err
      }
    }
  }
}
