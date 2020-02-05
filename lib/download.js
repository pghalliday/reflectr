const request = require('request')
const createWriteStream = require('fs').createWriteStream
const rename = require('fs').promises.rename
const temp = require('./temp')

module.exports = async function download(source, destination) {
  const tempFile = temp.file()
  await new Promise((resolve, reject) => {
    request
      .get(source)
      .on('error', reject)
      .pipe(createWriteStream(tempFile))
      .on('finish', resolve)
  })
  await rename(tempFile, destination)
}
