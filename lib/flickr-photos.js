const constants = require('./constants')
const FlickrPages = require('./flickr-pages')
const flickrQueue = require('./flickr-queue')

class FlickrPhotos extends FlickrPages {
  constructor(flickr, id, directory) {
    super(async (page) => {
      const {
        body: {
          photos,
        },
      } = await flickrQueue.add(() => flickr.people.getPhotos({
        user_id: id,
        page,
        per_page: constants.FLICKR_PHOTOS_PAGE_SIZE,
        extras: 'description,tags,machine_tags,url_t,url_o,views,date_taken,date_upload,geo,last_update,original_format',
      }))
      return {
        total: photos.total,
        pages: photos.pages,
        list: photos.photo,
      }
    }, async (photo) => {
    })
  }
}

module.exports = FlickrPhotos
