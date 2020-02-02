module.exports = {
  CONFIG_FILE: '.reflectr.json',

  FLICKR_QUEUE_INTERVAL: 60*60*1000,
  FLICKR_QUEUE_INTERVAL_CAP: 3600,
  FLICKR_QUEUE_CONCURRENCY: 10,

  FLICKR_PHOTOS_PAGE_SIZE: 500,
  FLICKR_PHOTOS_LABEL: 'photos',

  FLICKR_PHOTOSETS_PAGE_SIZE: 500,
  FLICKR_PHOTOSETS_LABEL: 'photosets',

  MSG_NO_CONFIG: 'No valid configuration file found, will create a new one',

  PROMPT_CONFIG_PASSPHRASE: 'Enter the passphrase to encrypt/decrypt configuration secrets',
  PROMPT_FLICKR_API_KEY: 'Enter your Flickr API key from https://www.flickr.com/services/apps/',
  PROMPT_FLICKR_API_SECRET: 'Enter your Flickr API secret from https://www.flickr.com/services/apps/',
  PROMPT_FLICKR_VERIFIER_CODE: 'Authorise the Flickr appliction in the browser window that just opened and enter the verifier code here',

  PROGRESS_COMPLETE: '=',
  PROGRESS_INCOMPLETE: ' ',
  PROGRESS_WIDTH: 20,
  PROGRESS_FORMAT: (label) => `  Loading ${label} [:bar] page :current/:total`,
}
