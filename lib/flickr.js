const FlickrSDK = require('flickr-sdk')
const throttle = require('./throttle')
const constants = require('./constants')

module.exports = class Flickr {
  constructor(key, secret, oauthToken, oauthTokenSecret) {
    this._flickr = new FlickrSDK(FlickrSDK.OAuth.createPlugin(
      key,
      secret,
      oauthToken,
      oauthTokenSecret,
    ))
  }

  getPhotosPage(user_id, page) {
    return throttle(() => this._flickr.people.getPhotos({
      user_id,
      page,
      per_page: constants.PHOTOS_PAGE_SIZE,
      extras: 'last_update,url_t,url_o,views,geo,original_format',
    }))
  }

  getPhotoInfo(photo_id, secret) {
    return throttle(() => this._flickr.photos.getInfo({
      photo_id,
      secret,
    }))
  }

  getPhotosetPhotosPage(user_id, photoset_id, page) {
    return throttle(() => this._flickr.photosets.getPhotos({
      user_id,
      photoset_id,
      page,
      per_page: constants.PHOTOSET_PHOTOS_PAGE_SIZE,
    }))
  }

  getPhotosetsPage(user_id, page) {
    return throttle(() => this._flickr.photosets.getList({
      user_id,
      page,
      per_page: constants.PHOTOSETS_PAGE_SIZE,
    }))
  }
}
