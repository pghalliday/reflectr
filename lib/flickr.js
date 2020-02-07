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

  getPhotosPage(user_id, page) {
    const retry = new Retry(async () => {
      return throttle(() => this._flickr.people.getPhotos({
        user_id,
        page,
        per_page: constants.PHOTOS_PAGE_SIZE,
        extras: 'last_update,url_t,url_o,views,geo,original_format',
      }))
    }, constants.RETRY_API_WAIT, constants.RETRY_API_LIMIT)
    this.emit('start-logging', {
      emitter: retry,
      meta: {
        getPhotosPage: `user_id: ${user_id}: page: ${page}`,
      }
    })
    return retry.start()
  }

  getPhotoInfo(photo_id, secret) {
    const retry = new Retry(async () => {
      return throttle(() => this._flickr.photos.getInfo({
        photo_id,
        secret,
      }))
    }, constants.RETRY_API_WAIT, constants.RETRY_API_LIMIT)
    this.emit('start-logging', {
      emitter: retry,
      meta: {
        getPhotoInfo: `photo_id: ${photo_id}`,
      }
    })
    return retry.start()
  }

  getPhotosetPhotosPage(user_id, photoset_id, page) {
    const retry = new Retry(async () => {
      return throttle(() => this._flickr.photosets.getPhotos({
        user_id,
        photoset_id,
        page,
        per_page: constants.PHOTOSET_PHOTOS_PAGE_SIZE,
      }))
    }, constants.RETRY_API_WAIT, constants.RETRY_API_LIMIT)
    this.emit('start-logging', {
      emitter: retry,
      meta: {
        getPhotosetPhotosPage: `user_id: ${user_id}: photoset_id: ${photoset_id}: page: ${page}`,
      }
    })
    return retry.start()
  }

  getPhotosetsPage(user_id, page) {
    const retry = new Retry(async () => {
      return throttle(() => this._flickr.photosets.getList({
        user_id,
        page,
        per_page: constants.PHOTOSETS_PAGE_SIZE,
      }))
    }, constants.RETRY_API_WAIT, constants.RETRY_API_LIMIT)
    this.emit('start-logging', {
      emitter: retry,
      meta: {
        getPhotosetsPage: `user_id: ${user_id}: page: ${page}`,
      }
    })
    return retry.start()
  }
}
