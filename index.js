const config = require('./lib/config')
const flickrAPI = require('./lib/flickr-api')
const flickr = require('./lib/flickr')

function print(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

async function reflectr() {
  try {
    await config.init()
    await flickrAPI.init()
    const [
      photos,
      photosets,
    ] = await Promise.all([
      flickr.getPhotos(),
      flickr.getPhotosets(),
    ])
    print(photosets)
  } catch (err) {
    console.error(err)
  }
}

module.exports = reflectr
