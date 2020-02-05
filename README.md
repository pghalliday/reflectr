# reflectr

CLI tool to mirror photos, albums, tags, descriptions, etc for a Flickr account.

## Install

```
npm install -g reflectr
```

## Usage

First create an application at [Flickr](https://www.flickr.com/services/apps/) to generate an API key and secret.

Then create a folder to store the mirrored data and run the following command in that folder.

```
reflectr
```

You will then be prompted for a passphrase to store encrypted Flickr secrets, your Flickr API key and secret, and to authorize that API key for your account.

This information will be stored, encrypted, in the folder as `.reflectr.json` so that on subsequent runs you only need to enter the passphrase to resync with your account.

## API

`Reflectr` can also be used as a library in your own projects.

```javascript
const Reflectr = require('reflectr')

const reflectr = new Reflectr({
  directory: 'WORKING_DIRECTORY',
  key: 'FLICKR API KEY',
  secret: 'FLICKR API SECRET',
  oauthToken: 'FLICKR USER OAUTH TOKEN',
  oauthTokenSecret: 'FLICR USER OATH TOKEN SECRET',
  id: 'FLICKR USER ID',
  username: 'FLICKR USERNAME',
})

async function main() {
  try {
    await reflectr.run()
  } catch (err) {
    ...
  }
}

main()
```

For examples on how to get the OAuth token, etc, see `./lib/config.js`.

For examples on how to plug in progress and logging implementations, see `./lib/log.js` and `./lib/ui.js`.

To see how these are put together with the `Reflectr` class, see `./bin/reflectr.js`.

## Known limitations

- Currently only supports Photos and Photosets (albums)
- Calls to the flickr API are limited to 1 per second to avoid the flickr rate limits
  - This throttling is applied globally to all instances of `Reflectr` if you are using the API
- Only downloads the original photos and thumbnails, thumbnails will reflect edits made to images in flickr but the original photos may not

## Unknown limitations

The are probably many, feel free to let me know if you require a feature and I'll be happy to take it into consideration (also feel free to submit pull requests!)
