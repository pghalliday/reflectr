const config = require('./config')
const constants = require('./constants')
const flickrAPI = require('./flickr-api')
const FlickrPages = require('./flickr-pages')

class FlickrPhotos extends FlickrPages {
  constructor() {
    super(constants.FLICKR_PHOTOS_LABEL, (page) => () => flickrAPI.flickr.people.getPhotos({
      user_id: config.id,
      page,
      per_page: constants.FLICKR_PHOTOS_PAGE_SIZE,
      extras: 'description,tags,machine_tags,url_t,url_o,views,date_taken,date_upload,geo,last_update,original_format',
    }), 'photos', 'photo')
  }
}

module.exports = FlickrPhotos
