const constants = require('./constants')
const flickrQueue = require('./flickr-queue')
const multiProgress = require('./multi-progress')
const isUndefined = require('lodash').isUndefined

class FlickrPages {
  constructor(label, apiCallback, field, subfield) {
    this._apiCallback = apiCallback
    this._field = field
    this._subfield = subfield
    this._progressBar = multiProgress.newBar(constants.PROGRESS_FORMAT(label), {
      complete: constants.PROGRESS_COMPLETE,
      incomplete: constants.PROGRESS_INCOMPLETE,
      width: constants.PROGRESS_WIDTH,
      total: 1,
    })
    this._page = 1
    this.list = []
  }

  async load() {
    while (isUndefined(this._pages) || this._page <= this._pages) {
      const {body} = await flickrQueue.add(this._apiCallback(this._page))
      const field = body[this._field]
      this.list = this.list.concat(field[this._subfield]) 
      this._pages = field.pages
      this._progressBar.total = this._pages
      this._progressBar.tick()
      this._page++
    }
  }
}

module.exports = FlickrPages
