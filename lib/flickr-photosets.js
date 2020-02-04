const constants = require('./constants')
const FlickrPages = require('./flickr-pages')
const flickrQueue = require('./flickr-queue')

class FlickrPhotosets extends FlickrPages {
  constructor(flickr, id, directory) {
    super(async (page) => {
      const {
        body: {
          photosets,
        },
      } = await flickrQueue.add(() => flickr.photosets.getList({
        user_id: id,
        page,
        per_page: constants.FLICKR_PHOTOSETS_PAGE_SIZE,
      }))
      return {
        total: photosets.total,
        pages: photosets.pages,
        list: photosets.photoset,
      }
    }, async (photoset) => {
      // handle photoset
    })
  }
}

module.exports = FlickrPhotosets
