const config = require('./config')
const constants = require('./constants')
const flickrAPI = require('./flickr-api')
const FlickrPages = require('./flickr-pages')

class FlickrPhotosets extends FlickrPages {
  constructor() {
    super(constants.FLICKR_PHOTOSETS_LABEL, (page) => () => flickrAPI.flickr.photosets.getList({
      user_id: config.id,
      page,
      per_page: constants.FLICKR_PHOTOSETS_PAGE_SIZE,
    }), 'photosets', 'photoset')
  }
}

module.exports = FlickrPhotosets
