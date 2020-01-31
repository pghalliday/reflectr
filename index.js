const config = require('./lib/config')
const createFlickr = require('./lib/create-flickr')

function print(obj) {
  console.log(JSON.stringify(obj, null, 2))
}

async function reflectr() {
  try {
    await config.init()
    const flickr = await createFlickr()
    print(await flickr.test.login())
  } catch (err) {
    console.error(err)
  }
}

module.exports = reflectr
