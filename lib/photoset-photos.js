const constants = require('./constants')
const Pages = require('./pages')
const queue = require('./queue')
const ArrayList = require('./array-list')

module.exports = class PhotosetPhotos extends Pages {
  constructor(flickr, user_id, photoset_id) {
    super()
    this._flickr = flickr
    this._user_id = user_id
    this._photoset_id = photoset_id
    this._list = new ArrayList()
  }

  get photos() {
    return this._list.items
  }

  async _init() {
    // do nothing
  }

  async _getPage(page) {
    const {
      body: {
        photoset,
      },
    } = await queue.add(() => this._flickr.photosets.getPhotos({
      user_id: this._user_id,
      photoset_id: this._photoset_id,
      page,
      per_page: constants.PHOTOSET_PHOTOS_PAGE_SIZE,
    }))
    return {
      total: photoset.total,
      pages: photoset.pages,
      list: photoset.photo,
    }
  }

  async _end() {
    this.emit('end')
  }
}
