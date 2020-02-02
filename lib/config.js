const fs = require('fs').promises
const path = require('path')
const Cryptr = require('cryptr')
const prompts = require('prompts')
const Flickr = require('flickr-sdk')
const open = require('open')
const constants = require('./constants')

module.exports = class Config {
  constructor(directory) {
    this.directory = directory
    this._filePath = path.join(directory, constants.CONFIG_FILE)
  }

  async init() {
    const {passphrase} = await prompts({
      type: 'password',
      name: 'passphrase',
      message: constants.PROMPT_CONFIG_PASSPHRASE,
    })
    this.cryptr = new Cryptr(passphrase)
    try {
      const json = await fs.readFile(this._filePath)
      this.config = JSON.parse(json)
    } catch (err) {
      this.config = {}
      console.log(constants.MSG_NO_CONFIG)
    }
    await this._checkKey()
    await this._checkSecret()
    await this._checkOauth()
  }

  async _write() {
    await fs.writeFile(this._filePath, JSON.stringify(this.config, null, 2))
  }

  async _checkKey() {
    if (!this.config.key) {
      const responses = await prompts({
        type: 'text',
        name: 'key',
        message: constants.PROMPT_FLICKR_API_KEY,
      })
      this.config.key = this.cryptr.encrypt(responses.key.trim())
      await this._write()
    }
  }

  async _checkSecret() {
    if (!this.config.secret) {
      const responses = await prompts({
        type: 'password',
        name: 'secret',
        message: constants.PROMPT_FLICKR_API_SECRET,
      })
      this.config.secret = this.cryptr.encrypt(responses.secret.trim())
      await this._write()
    }
  }

  async _checkOauth() {
    if (!(this.config.oauthToken && this.config.oauthTokenSecret && this.config.id && this.config.username)) {
      const oauth = new Flickr.OAuth(
        this.key,
        this.secret,
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
      this.config.oauthToken = this.cryptr.encrypt(oauth_token)
      this.config.oauthTokenSecret = this.cryptr.encrypt(oauth_token_secret)
      this.config.id = user_nsid
      this.config.username = username
      await this._write()
    }
  }

  get key() {
    return this.cryptr.decrypt(this.config.key)
  }

  get secret() {
    return this.cryptr.decrypt(this.config.secret)
  }

  get oauthToken() {
    return this.cryptr.decrypt(this.config.oauthToken)
  }

  get oauthTokenSecret() {
    return this.cryptr.decrypt(this.config.oauthTokenSecret)
  }

  get id() {
    return this.config.id
  }

  get username() {
    return this.config.username
  }
}
