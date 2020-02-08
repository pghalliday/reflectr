# reflectr

CLI tool to mirror photos, albums, tags, descriptions, etc for a Flickr account.

## Motivation

So you've spent hours cataloguing your photo collection in Flickr, adding titles, descriptions and tags and then sorted them into albums. But where does that data live? Well, pretty much only at Flickr!

If this makes you nervous then this is the tool for you.

As well as backing up the original photos as uploaded to Flickr, Reflectr will query the Flickr APIs to gather the meta data and album information (photosets in the API) and store that raw data locally.

At this time no UI is implemented to browse the backed up data but at least you can feel secure that all that work you put into organising and labelling your collection is safe where you can always reach it.

Note though, that this is not a full back up solution. If data is deleted from Flickr then running the tool will also delete that data locally. However there are plenty of other backup tools that you can use to provide a historical backup of your local data (eg. Apple Time Machine, etc). Also, at this time, only select information matching my own requirements is synced (this should be quite simple to extend though).

## Install

```
npm install -g @pghalliday/reflectr
```

## Usage

First create an application at [Flickr](https://www.flickr.com/services/apps/) to generate an API key and secret.

Then create a folder to store the mirrored data and run the following command in that folder.

```
reflectr
```

You will then be prompted for a passphrase to store encrypted Flickr secrets, your Flickr API key and secret, and to authorize that API key for your account.

This information will be stored, encrypted, in the folder as `config.json` so that on subsequent runs you only need to enter the passphrase to resync with your account.

A log for the last run will be stored in the folder as `log.json`.

## API

`Reflectr` can also be used as a library in your own projects.

```javascript
const Reflectr = require('@pghalliday/reflectr')

const reflectr = new Reflectr({
  directory: 'WORKING_DIRECTORY',
  key: 'FLICKR_API_KEY',
  secret: 'FLICKR_API_SECRET',
  oauthToken: 'FLICKR_USER_OAUTH_TOKEN',
  oauthTokenSecret: 'FLICKR_USER_OATH_TOKEN_SECRET',
  id: 'FLICKR_USER_ID',
  username: 'FLICKR_USERNAME',
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

For an example of how to get the OAuth token, etc, see `./lib/config.js`.

For examples on how to plug in progress and logging implementations, see `./lib/log.js` and `./lib/ui.js`.

To see how these are put together with the `Reflectr` class, see `./bin/reflectr.js`.

## Known limitations

- Currently only supports Photos and Photosets (albums)
- Calls to the flickr API are limited to 1 per second to avoid the flickr rate limits
  - This throttling is applied globally to all instances of `Reflectr` if you are using the API
- Only downloads the original photos and thumbnails, thumbnails will reflect edits made to images in flickr but the original photos may not
- The flickr API does not appear to be super stable so 500 errors and timeouts may occur during long running jobs. Downloads and API calls will retry up to 25 times using an exponential backoff algorithm that may take hours to max out, but then the job will exit with an error

## Unknown limitations

These are probably innumerable, feel free to let me know if you require a feature or bug fix and I'll be happy to take it into consideration (also feel free to submit pull requests!)
