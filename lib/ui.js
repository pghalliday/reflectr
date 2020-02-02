const MultiProgress = require('multi-progress')
const constants = require('./constants')

const multiProgress = new MultiProgress()

function addProgress(emitter, label) {
  const progressBar = multiProgress.newBar(constants.PROGRESS_FORMAT(label), {
    complete: constants.PROGRESS_COMPLETE,
    incomplete: constants.PROGRESS_INCOMPLETE,
    width: constants.PROGRESS_WIDTH,
    total: 1,
  })
  emitter.on('progress', (event) => {
    progressBar.total = event.total
    progressBar.tick(event.progress)
  })
}

module.exports = {
  addProgress,
}
