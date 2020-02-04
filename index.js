const Flickr = require('flickr-sdk')
const FlickrPhotos = require('./lib/flickr-photos')
const FlickrPhotosets = require('./lib/flickr-photosets')

module.exports = class Reflector {
  constructor(config) {
    const flickr = new Flickr(Flickr.OAuth.createPlugin(
      config.key,
      config.secret,
      config.oauthToken,
      config.oauthTokenSecret,
    ))
    this.photos = new FlickrPhotos(flickr, config.id, config.directory)
    this.photosets = new FlickrPhotosets(flickr, config.id, config.directory)
  }

  async run() {
    await Promise.all([
      this.photos.load(),
      this.photosets.load(),
    ])
  }
}
