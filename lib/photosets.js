const promisify = require('util').promisify
const path = require('path')
const fs = require('fs').promises
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const constants = require('./constants')
const Pages = require('./pages')
const PhotosetPhotos = require('./photoset-photos')
const FileList = require('./file-list')
const Current = require('./current')

const primraf = promisify(rimraf)

module.exports = class Photosets extends Pages {
  constructor(flickr, user_id, directory) {
    super()
    this._flickr = flickr
    this._user_id = user_id
    this._directory = path.join(directory, constants.PHOTOSETS_DIRECTORY)
    this._current = new Current(
      this._hasBeenUpdated.bind(this), 
      this._deleteItem.bind(this), 
      this._writeItem.bind(this),
    )
    this._list = new FileList(this._current, constants.PROGRESS_TYPE_PHOTOSETS_PAGE)
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
      type: constants.PROGRESS_TYPE_PHOTOSETS_LIST,
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
      type: constants.PROGRESS_TYPE_PHOTOSETS_DELETE,
      emitter: this._current,
      persist: true,
    })
    const ids = await fs.readdir(this._directory)
    this._current.init(ids)
  }

  async _getPage(page) {
    const {
      body: {
        photosets,
      },
    } = await this._flickr.getPhotosetsPage(this._user_id, page)
    return {
      total: photosets.total,
      pages: photosets.pages,
      list: photosets.photoset,
    }
  }

  async _hasBeenUpdated(photoset) {
    try {
      const json = await fs.readFile(
        path.join(this._directory, photoset.id, constants.PHOTOSET_INFO_FILE),
      )
      const current = JSON.parse(json)
      if (photoset.date_update !== current.date_update) {
        this.emit('log', {
          level: 'info',
          message: `${photoset.id} needs updating: ${photo.lastupdate}: ${current.lastupdate}`,
        })
        return true
      }
    } catch(err) {
      this.emit('log', {
        level: 'info',
        message: `Error encountered checking for updates on ${photoset.id}, assuming update needed: ${err.message}`,
      })
      return true
    }
    this.emit('log', {
      level: 'info',
      message: `No change for ${photoset.id}, skipping update`,
    })
    return false
  }

  async _deleteItem(id) {
    await primraf(path.join(this._directory, id))
  }

  async _writeItem(photoset) {
    photoset.photos = {}
    const photosetPhotos = new PhotosetPhotos(
      this._flickr,
      this._user_id,
      photoset.id,
    )
    photosetPhotos.on('end', () => {
      photoset.photos = photosetPhotos.photos
    })
    this.emit('start-logging', {
      emitter: photosetPhotos,
      meta: {
        photosetPhotos: photoset.id,
      },
    })
    this.emit('start-progress', {
      type: constants.PROGRESS_TYPE_PHOTOSET_PHOTOS,
      emitter: photosetPhotos,
      params: {
        id: photoset.id,
      },
    })
    await photosetPhotos.load()
    await mkdirp(path.join(this._directory, photoset.id))
    await fs.writeFile(
      path.join(this._directory, photoset.id, constants.PHOTOSET_INFO_FILE),
      JSON.stringify(photoset, null, 2),
    )
  }

  async _end() {
    await this._list.end()
    await this._current.clean()
  }
}
