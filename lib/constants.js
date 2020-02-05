const PROGRESS_TYPE_PHOTO = 'photo'
const PROGRESS_TYPE_PHOTOS = 'photos'
const PROGRESS_TYPE_PHOTOS_DELETE = 'photos_delete'
const PROGRESS_TYPE_PHOTOS_LIST = 'photos_list'
const PROGRESS_TYPE_PHOTOSETS = 'photosets'
const PROGRESS_TYPE_PHOTOSETS_DELETE = 'photosets_delete'
const PROGRESS_TYPE_PHOTOSETS_LIST = 'photosets_list'
const PROGRESS_TYPE_PHOTOSET_PHOTOS = 'photoset_photos'
const PROGRESS_TYPE_PHOTOSET_PHOTOS_LIST = 'photoset_photos_list'

module.exports = {
  CONFIG_FILE: '.reflectr.json',
  TEMP_DIRECTORY: '.temp',
  PHOTO_INFO_FILE: 'info.json',
  PHOTO_THUMBNAIL_FILE: 'thumbnail.jpg',
  PHOTO_ORIGINAL_FILE: 'orignal',
  PHOTOSET_INFO_FILE: 'info.json',
  PHOTOS_DIRECTORY: 'photos',
  PHOTOSETS_DIRECTORY: 'photosets',

  QUEUE_INTERVAL: 60*60*1000,
  QUEUE_INTERVAL_CAP: 3600,
  QUEUE_CONCURRENCY: 10,

  PHOTOS_PAGE_SIZE: 500,
  PHOTOSETS_PAGE_SIZE: 500,
  PHOTOSET_PHOTOS_PAGE_SIZE: 500,

  MSG_NO_CONFIG: 'No valid configuration file found, will create a new one',

  PROMPT_CONFIG_PASSPHRASE: 'Enter the passphrase to encrypt/decrypt configuration secrets',
  PROMPT_API_KEY: 'Enter your Flickr API key from https://www.flickr.com/services/apps/',
  PROMPT_API_SECRET: 'Enter your Flickr API secret from https://www.flickr.com/services/apps/',
  PROMPT_VERIFIER_CODE: 'Authorise the Flickr appliction in the browser window that just opened and enter the verifier code here',

  PROGRESS_COMPLETE: '=',
  PROGRESS_INCOMPLETE: ' ',
  PROGRESS_WIDTH: 20,
  PROGRESS_WAIT_ON_END_MS: 2000,

  PROGRESS_TYPE_PHOTO: PROGRESS_TYPE_PHOTO,
  PROGRESS_TYPE_PHOTOS: PROGRESS_TYPE_PHOTOS,
  PROGRESS_TYPE_PHOTOS_DELETE: PROGRESS_TYPE_PHOTOS_DELETE,
  PROGRESS_TYPE_PHOTOS_LIST: PROGRESS_TYPE_PHOTOS_LIST,
  PROGRESS_TYPE_PHOTOSETS: PROGRESS_TYPE_PHOTOSETS,
  PROGRESS_TYPE_PHOTOSETS_DELETE: PROGRESS_TYPE_PHOTOSETS_DELETE,
  PROGRESS_TYPE_PHOTOSETS_LIST: PROGRESS_TYPE_PHOTOSETS_LIST,
  PROGRESS_TYPE_PHOTOSET_PHOTOS: PROGRESS_TYPE_PHOTOSET_PHOTOS,
  PROGRESS_TYPE_PHOTOSET_PHOTOS_LIST: PROGRESS_TYPE_PHOTOSET_PHOTOS_LIST,

  PROGRESS_LABELS: {
    [PROGRESS_TYPE_PHOTO]: ({id}) => `photo ${id} bytes downloaded`,
    [PROGRESS_TYPE_PHOTOS]: () => 'photo pages loaded',
    [PROGRESS_TYPE_PHOTOS_DELETE]: () => 'photos deleted',
    [PROGRESS_TYPE_PHOTOS_LIST]: () => 'photos synced',
    [PROGRESS_TYPE_PHOTOSETS]: () => 'photoset pages loaded',
    [PROGRESS_TYPE_PHOTOSETS_DELETE]: () => 'photosets deleted',
    [PROGRESS_TYPE_PHOTOSETS_LIST]: () => 'photosets synced',
    [PROGRESS_TYPE_PHOTOSET_PHOTOS]: ({id}) => `photoset ${id} photo pages loaded`,
    [PROGRESS_TYPE_PHOTOSET_PHOTOS_LIST]: ({id}) => `photoset ${id} photos synced`,
  }
}
