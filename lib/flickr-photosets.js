const constants = require('./constants')
const FlickrPages = require('./flickr-pages')

class FlickrPhotosets extends FlickrPages {
  constructor(flickr, id) {
    super((page) => () => flickr.photosets.getList({
      user_id: id,
      page,
      per_page: constants.FLICKR_PHOTOSETS_PAGE_SIZE,
    }), 'photosets', 'photoset')
  }
}

module.exports = FlickrPhotosets
