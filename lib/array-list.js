const EventEmitter = require('events')

module.exports = class ArrayList extends EventEmitter {
  constructor() {
    super()
    this.items = []
  }

  async sync(list) {
    this.items = this.items.concat(list)
  }
}
