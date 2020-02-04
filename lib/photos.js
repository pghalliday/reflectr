const promisify = require('util').promisify
const path = require('path')
const fs = require('fs').promises
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const constants = require('./constants')
const Pages = require('./pages')
const queue = require('./queue')
const FileList = require('./file-list')
const Current = require('./current')

const primraf = promisify(rimraf)

module.exports = class Photos extends Pages {
  constructor(flickr, user_id, directory) {
    super()
    this._flickr = flickr
    this._user_id = user_id
    this._directory = path.join(directory, constants.PHOTOS_DIRECTORY)
    this._current = new Current(
      this._hasBeenUpdated.bind(this), 
      this._deleteItem.bind(this), 
      this._writeItem.bind(this),
    )
    this._list = new FileList(this._current)
  }

  async _init() {
    await mkdirp(this._directory)
    this.emit('start-progress', {
      type: constants.PROGRESS_TYPE_PHOTOS_LIST,
      emitter: this._list,
      persist: true,
    })
    this.emit('start-progress', {
      type: constants.PROGRESS_TYPE_PHOTOS_DELETE,
      emitter: this._current,
      persist: true,
    })
    const ids = await fs.readdir(this._directory)
    this._current.init(ids)
  }

  async _getPage(page) {
    const {
      body: {
        photos,
      },
    } = await queue.add(() => this._flickr.people.getPhotos({
      user_id: this._user_id,
      page,
      per_page: constants.PHOTOS_PAGE_SIZE,
      extras: 'last_update,url_t,url_o,views,geo,original_format',
    }))
    return {
      total: photos.total,
      pages: photos.pages,
      list: photos.photo,
    }
  }

  async _hasBeenUpdated(photo) {
    try {
      const json = await fs.readFile(
        path.join(this._directory, id, constants.PHOTO_INFO_FILE),
      )
      const existing = JSON.parse(true)
      if (photo.lastupdate !== current.lastupdate) {
        return true
      }
    } catch(err) {
      return true
    }
    return false
  }

  async _deleteItem(id) {
    await primraf(path.join(this._directory, id))
  }

  async _writeItem(photo) {
    await mkdirp(path.join(this._directory, photo.id))
    await fs.writeFile(
      path.join(this._directory, photo.id, constants.PHOTO_INFO_FILE),
      JSON.stringify(photo, null, 2),
    )
  }

  async _end() {
    await this._list.end()
    await this._current.clean()
  }
}
