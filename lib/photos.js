const promisify = require('util').promisify
const path = require('path')
const fs = require('fs').promises
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const constants = require('./constants')
const Pages = require('./pages')
const FileList = require('./file-list')
const Current = require('./current')
const Download = require('./download')

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
    this._list = new FileList(this._current, constants.PROGRESS_TYPE_PHOTOS_PAGE)
  }

  async _init() {
    await mkdirp(this._directory)
    this.emit('start-logging', {
      emitter: this._list,
      meta: {
        subsection: 'filelist',
      },
    })
    this.emit('start-progress', {
      type: constants.PROGRESS_TYPE_PHOTOS_LIST,
      emitter: this._list,
      persist: true,
    })
    this.emit('start-logging', {
      emitter: this._current,
      meta: {
        subsection: 'current',
      },
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
    } = await this._flickr.getPhotosPage(this._user_id, page)
    return {
      total: photos.total,
      pages: photos.pages,
      list: photos.photo,
    }
  }

  async _hasBeenUpdated(photo) {
    const directory = path.join(this._directory, photo.id)
    try {
      const json = await fs.readFile(
        path.join(directory, constants.PHOTO_INFO_FILE),
      )
      const current = JSON.parse(json)
      if (photo.lastupdate !== current.lastupdate) {
        this.emit('log', {
          level: 'info',
          message: `${photo.id} needs updating: ${photo.lastupdate}: ${current.lastupdate}`,
        })
        return true
      }
      // check that the photo files exist
      await fs.stat(path.join(directory, constants.PHOTO_THUMBNAIL_FILE))
      await fs.stat(path.join(directory, `${constants.PHOTO_ORIGINAL_FILE}.${photo.originalformat}`))
    } catch(err) {
      this.emit('log', {
        level: 'info',
        message: `Error encountered checking for updates on ${photo.id}, assuming update needed: ${err.message}`,
      })
      return true
    }
    this.emit('log', {
      level: 'info',
      message: `No change for ${photo.id}, skipping update`,
    })
    return false
  }

  async _deleteItem(id) {
    await primraf(path.join(this._directory, id))
  }

  async _writeItem(photo) {
    const directory = path.join(this._directory, photo.id)
    await mkdirp(directory)
    const {
      body,
    } = await this._flickr.getPhotoInfo(photo.id, photo.secret)
    photo.info = body.photo
    this.emit('log', {
      level: 'info',
      message: `Writing info for ${photo.id}`,
    })
    await fs.writeFile(
      path.join(directory, constants.PHOTO_INFO_FILE),
      JSON.stringify(photo, null, 2),
    )
    const downloadThumbnail = new Download(
      photo.url_t,
      path.join(directory, constants.PHOTO_THUMBNAIL_FILE),
    )
    this.emit('start-logging', {
      emitter: downloadThumbnail,
      meta: {
        thumbnail: photo.id,
      },
    })
    this.emit('start-progress', {
      type: constants.PROGRESS_TYPE_DOWNLOAD_THUMBNAIL,
      emitter: downloadThumbnail,
      params: {
        id: photo.id,
        url: photo.url_t,
      }
    })
    await downloadThumbnail.get()
    const downloadOriginal = new Download(
      photo.url_o,
      path.join(directory, `${constants.PHOTO_ORIGINAL_FILE}.${photo.originalformat}`),
    )
    this.emit('start-logging', {
      emitter: downloadOriginal,
      meta: {
        original: photo.id,
      },
    })
    this.emit('start-progress', {
      type: constants.PROGRESS_TYPE_DOWNLOAD_ORIGINAL,
      emitter: downloadOriginal,
      params: {
        id: photo.id,
        url: photo.url_o,
      }
    })
    await downloadOriginal.get()
  }

  async _end() {
    await this._list.end()
    await this._current.clean()
  }
}
