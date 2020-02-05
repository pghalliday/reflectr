const colors = require('colors')

const PROGRESS_TYPE_PHOTO = 'photo'
const PROGRESS_TYPE_PHOTOS = 'photos'
const PROGRESS_TYPE_PHOTOS_DELETE = 'photos_delete'
const PROGRESS_TYPE_PHOTOS_LIST = 'photos_list'
const PROGRESS_TYPE_PHOTOS_PAGE = 'photos_page'
const PROGRESS_TYPE_PHOTOSETS = 'photosets'
const PROGRESS_TYPE_PHOTOSETS_DELETE = 'photosets_delete'
const PROGRESS_TYPE_PHOTOSETS_LIST = 'photosets_list'
const PROGRESS_TYPE_PHOTOSETS_PAGE = 'photosets_page'
const PROGRESS_TYPE_PHOTOSET_PHOTOS = 'photoset_photos'
const PROGRESS_TYPE_PHOTOSET_PHOTOS_LIST = 'photoset_photos_list'
const PROGRESS_TYPE_DOWNLOAD_THUMBNAIL = 'download_thumbnail'
const PROGRESS_TYPE_DOWNLOAD_ORIGINAL = 'download_original'

module.exports = {
  EXIT_CODE_SUCCESS: 0,
  EXIT_CODE_ERROR: -1,

  LOG_FILE: 'log.json',
  CONFIG_FILE: 'config.json',
  TEMP_DIRECTORY: '.temp',
  PHOTO_INFO_FILE: 'info.json',
  PHOTO_THUMBNAIL_FILE: 'thumbnail.jpg',
  PHOTO_ORIGINAL_FILE: 'orignal',
  PHOTOSET_INFO_FILE: 'info.json',
  PHOTOS_DIRECTORY: 'photos',
  PHOTOSETS_DIRECTORY: 'photosets',

  THROTTLE_LIMIT: 1,
  THROTTLE_INTERVAL: 1000,

  PHOTOS_PAGE_SIZE: 500,
  PHOTOSETS_PAGE_SIZE: 500,
  PHOTOSET_PHOTOS_PAGE_SIZE: 500,

  DOWNLOAD_REQUEST_TIMEOUT: 5000,

  MSG_NO_CONFIG: 'No valid configuration file found, will create a new one',

  PROMPT_CONFIG_PASSPHRASE: 'Enter the passphrase to encrypt/decrypt configuration secrets',
  PROMPT_API_KEY: 'Enter your Flickr API key from https://www.flickr.com/services/apps/',
  PROMPT_API_SECRET: 'Enter your Flickr API secret from https://www.flickr.com/services/apps/',
  PROMPT_VERIFIER_CODE: 'Authorise the Flickr appliction in the browser window that just opened and enter the verifier code here',

  PROGRESS_COMPLETE: '=',
  PROGRESS_INCOMPLETE: ' ',
  PROGRESS_WIDTH: 20,
  PROGRESS_WAIT_ON_END_MS: 2000,
  PROGRESS_FORMAT: `{percentage}% {bar} ${'{value}'.red} of ${'{total}'.red} {label}`,

  PROGRESS_TYPE_PHOTO: PROGRESS_TYPE_PHOTO,
  PROGRESS_TYPE_PHOTOS: PROGRESS_TYPE_PHOTOS,
  PROGRESS_TYPE_PHOTOS_DELETE: PROGRESS_TYPE_PHOTOS_DELETE,
  PROGRESS_TYPE_PHOTOS_LIST: PROGRESS_TYPE_PHOTOS_LIST,
  PROGRESS_TYPE_PHOTOS_PAGE: PROGRESS_TYPE_PHOTOS_PAGE,
  PROGRESS_TYPE_PHOTOSETS: PROGRESS_TYPE_PHOTOSETS,
  PROGRESS_TYPE_PHOTOSETS_DELETE: PROGRESS_TYPE_PHOTOSETS_DELETE,
  PROGRESS_TYPE_PHOTOSETS_LIST: PROGRESS_TYPE_PHOTOSETS_LIST,
  PROGRESS_TYPE_PHOTOSETS_PAGE: PROGRESS_TYPE_PHOTOSETS_PAGE,
  PROGRESS_TYPE_PHOTOSET_PHOTOS: PROGRESS_TYPE_PHOTOSET_PHOTOS,
  PROGRESS_TYPE_PHOTOSET_PHOTOS_LIST: PROGRESS_TYPE_PHOTOSET_PHOTOS_LIST,
  PROGRESS_TYPE_DOWNLOAD_THUMBNAIL: PROGRESS_TYPE_DOWNLOAD_THUMBNAIL,
  PROGRESS_TYPE_DOWNLOAD_ORIGINAL: PROGRESS_TYPE_DOWNLOAD_ORIGINAL,

  PROGRESS_LABELS: {
    [PROGRESS_TYPE_PHOTO]: ({id}) => `photo ${id} bytes downloaded`,
    [PROGRESS_TYPE_PHOTOS]: () => 'photo pages loaded',
    [PROGRESS_TYPE_PHOTOS_DELETE]: () => 'photos deleted',
    [PROGRESS_TYPE_PHOTOS_LIST]: () => 'photos synced',
    [PROGRESS_TYPE_PHOTOS_PAGE]: ({page}) => `page ${`${page}`.red} photos synced`,
    [PROGRESS_TYPE_PHOTOSETS]: () => 'photoset pages loaded',
    [PROGRESS_TYPE_PHOTOSETS_DELETE]: () => 'photosets deleted',
    [PROGRESS_TYPE_PHOTOSETS_LIST]: () => 'photosets synced',
    [PROGRESS_TYPE_PHOTOSETS_PAGE]: ({page}) => `page ${`${page}`.red} photosets synced`,
    [PROGRESS_TYPE_PHOTOSET_PHOTOS]: ({id}) => `photoset ${id} photo pages loaded`,
    [PROGRESS_TYPE_PHOTOSET_PHOTOS_LIST]: ({id}) => `photoset ${id} photos synced`,
    [PROGRESS_TYPE_DOWNLOAD_THUMBNAIL]: ({id, url}) => `bytes downloaded of thumbnail ${id}: ${url}`,
    [PROGRESS_TYPE_DOWNLOAD_ORIGINAL]: ({id, url}) => `bytes downloaded of original ${id}: ${url}`,
  }
}
