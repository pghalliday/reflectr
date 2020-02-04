const cliProgress = require('cli-progress')
const colors = require('colors')
const isUndefined = require('lodash').isUndefined

const multibar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true,
  autopadding: true,
  format: `{percentage}% {bar} ${'{value}'.red} of ${'{total}'.red} {label}`,
}, cliProgress.Presets.rect)

function addProgress(emitter, label) {
  let bar
  emitter.on('progress', (event) => {
    if (isUndefined(bar)) {
      bar = multibar.create(event.total, 0, {label})
    }
    if (isUndefined(event.value)) {
      bar.setTotal(Math.max(event.total, bar.value + 1))
      bar.increment(1)
    } else {
      bar.setTotal(Math.max(event.total, event.value))
      bar.update(event.value)
    }
  })
}

function stop() {
  multibar.stop()
}

module.exports = {
  addProgress,
  stop,
}
