const FlickrPhotos = require('./flickr-photos')
const FlickrPhotosets = require('./flickr-photosets')

async function getPhotos() {
  const flickrPhotos = new FlickrPhotos()
  await flickrPhotos.load()
  return flickrPhotos.list
}

async function getPhotosets() {
  const flickrPhotosets = new FlickrPhotosets()
  await flickrPhotosets.load()
  return flickrPhotosets.list
}

async function getPhoto() {
}

module.exports = {
  getPhotos,
  getPhotosets,
  getPhoto,
}
