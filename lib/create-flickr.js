const config = require('./config')
const open = require('open')
const prompts = require('prompts')
const Flickr = require('flickr-sdk')
const constants = require('./constants')

async function createFlickr() {
  await checkKey()
  await checkSecret()
  await checkOauth()
  return new Flickr(Flickr.OAuth.createPlugin(
    config.key,
    config.secret,
    config.oauthToken,
    config.oauthTokenSecret,
  ))
}

async function checkKey() {
  if (!config.key) {
    const responses = await prompts({
      type: 'text',
      name: 'key',
      message: constants.PROMPT_FLICKR_API_KEY,
    })
    await config.setKey(responses.key.trim())
  }
}

async function checkSecret() {
  if (!config.secret) {
    const responses = await prompts({
      type: 'text',
      name: 'secret',
      message: constants.PROMPT_FLICKR_API_SECRET,
    })
    await config.setSecret(responses.secret.trim())
  }
}

async function checkOauth() {
  if (!(config.oauthToken && config.oauthTokenSecret && config.id && config.username)) {
    const oauth = new Flickr.OAuth(
      config.key,
      config.secret,
    )
    const {body} = await oauth.request('oob')
    open(oauth.authorizeUrl(body.oauth_token))
    const {verifier} = await prompts({
      type: 'text',
      name: 'verifier',
      message: constants.PROMPT_FLICKR_VERIFIER_CODE,
    })
    const {
      body: {
        oauth_token,
        oauth_token_secret,
        user_nsid,
        username,
      },
    } = await oauth.verify(body.oauth_token, verifier.trim(), body.oauth_token_secret)
    await config.setOauth(oauth_token, oauth_token_secret, user_nsid, username)
  }
}


module.exports = createFlickr
