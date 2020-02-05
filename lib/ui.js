const EventEmitter = require('events')
const cliProgress = require('cli-progress')
const colors = require('colors')
const isUndefined = require('lodash').isUndefined
const constants = require('./constants')

const multibar = new cliProgress.MultiBar({
  autopadding: true,
  forceRedraw: true,
  format: constants.PROGRESS_FORMAT,
}, cliProgress.Presets.rect)

class UI extends EventEmitter {
  init(emitter) {
    this._activeBars = []
    emitter.on('start-progress', ({type, emitter, params, persist}) => {
      const bar = new Bar(emitter, constants.PROGRESS_LABELS[type](params), persist)
      this._addActiveBar(bar)
      bar.on('new-bar', this._addActiveBar.bind(this))
      bar.on('end-bar', this._removeActiveBar.bind(this))
    })
  }

  stop() {
    multibar.stop()
  }

  _addActiveBar(bar) {
    this._activeBars.push(bar)
    this.emit('new-bar', bar)
  }

  _removeActiveBar(bar) {
    this._activeBars.splice(this._activeBars.indexOf(bar), 1)
    this.emit('end-bar', bar)
    if (this._activeBars.length === 0) {
      this.emit('end')
    }
  }
}

class Bar extends UI {
  constructor(emitter, label, persist) {
    super()
    this.init(emitter)
    let bar
    emitter.on('update-progress', ({value, total}) => {
      // console.log(`update: ${label}: ${total}: ${value}`)
      if (isUndefined(bar)) {
        bar = multibar.create(total, 0, {label})
      }
      if (isUndefined(value)) {
        bar.setTotal(Math.max(total, bar.value + 1))
        bar.increment(1)
      } else {
        bar.setTotal(Math.max(total, value))
        bar.update(value)
      }
    })
    emitter.on('end-progress', () => {
      // console.log(`end: ${label}`)
      if (!isUndefined(bar) && !persist) {
        setTimeout(() => {
          multibar.remove(bar)
          this.emit('end-bar', this)
        }, constants.PROGRESS_WAIT_ON_END_MS)
      } else {
        this.emit('end-bar', this)
      }
    })
  }
}

module.exports = new UI()
