const EventEmitter = require('events')
const wait = require('./wait')

module.exports = class Retry extends EventEmitter {
  constructor(func, initialWait, backoffFactor, maxWait, maxRetries) {
    super()
    this._func = func
    this._initialWait = initialWait
    this._backoffFactor = backoffFactor
    this._maxWait = maxWait
    this._maxRetries = maxRetries
    this._count = 0
  }

  _delay() {
    return Math.min(
      this._initialWait * Math.pow(this._backoffFactor, this._count),
      this._maxWait,
    )
  }

  async start() {
    try {
      return await this._func()
    } catch (err) {
      const delay = this._delay()
      this._count++
      if (this._count <= this._maxRetries) {
        this.emit('log', {
          level: 'warning',
          message: err.message,
        })
        this.emit('log', {
          level: 'info',
          message: `retrying in ${delay}ms`,
        })
        await wait(delay)
        this.emit('log', {
          level: 'info',
          message: `retry ${this._count}`,
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
