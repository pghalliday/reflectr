const EventEmitter = require('events')
const FlickrSDK = require('flickr-sdk')
const throttle = require('./throttle')
const Retry = require('./retry')
const constants = require('./constants')

module.exports = class Flickr extends EventEmitter {
  constructor(key, secret, oauthToken, oauthTokenSecret) {
    super()
    this._flickr = new FlickrSDK(FlickrSDK.OAuth.createPlugin(
      key,
      secret,
      oauthToken,
      oauthTokenSecret,
    ))
  }

  _retry(func, meta) {
    const retry = new Retry(
      func,
      constants.RETRY_API_INITIAL_WAIT,
      constants.RETRY_API_BACKOFF_FACTOR,
      constants.RETRY_API_MAX_WAIT,
      constants.RETRY_API_MAX_RETRIES,
    )
    this.emit('start-logging', {
      emitter: retry,
      meta,
    })
    return retry.start()
  }

  getPhotosPage(user_id, page) {
    return this._retry(() => {
      return throttle(() => this._flickr.people.getPhotos({
        user_id,
        page,
        per_page: constants.PHOTOS_PAGE_SIZE,
        extras: 'last_update,url_t,url_o,views,geo,original_format',
      }))
    }, {
      getPhotosPage: `user_id: ${user_id}: page: ${page}`,
    })
  }

  getPhotoInfo(photo_id, secret) {
    return this._retry(() => {
      return throttle(() => this._flickr.photos.getInfo({
        photo_id,
        secret,
      }))
    }, {
      getPhotoInfo: `photo_id: ${photo_id}`,
    })
  }

  getPhotosetPhotosPage(user_id, photoset_id, page) {
    return this._retry(() => {
      return throttle(() => this._flickr.photosets.getPhotos({
        user_id,
        photoset_id,
        page,
        per_page: constants.PHOTOSET_PHOTOS_PAGE_SIZE,
      }))
    }, {
      getPhotosetPhotosPage: `user_id: ${user_id}: photoset_id: ${photoset_id}: page: ${page}`,
    })
  }

  getPhotosetsPage(user_id, page) {
    return this._retry(() => {
      return throttle(() => this._flickr.photosets.getList({
        user_id,
        page,
        per_page: constants.PHOTOSETS_PAGE_SIZE,
      }))
    }, {
      getPhotosetsPage: `user_id: ${user_id}: page: ${page}`,
    })
  }
}
