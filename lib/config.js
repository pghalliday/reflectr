const fs = require('fs').promises
const Cryptr = require('cryptr')
const prompts = require('prompts')
const constants = require('./constants')

class Config {
  async init() {
    const {passphrase} = await prompts({
      type: 'password',
      name: 'passphrase',
      message: constants.PROMPT_CONFIG_PASSPHRASE,
    })
    this.cryptr = new Cryptr(passphrase)
    try {
      const json = await fs.readFile(constants.CONFIG_FILE)
      this.config = JSON.parse(json)
    } catch (err) {
      this.config = {}
      console.log(constants.MSG_NO_CONFIG)
    }
  }

  async _write() {
    await fs.writeFile(constants.CONFIG_FILE, JSON.stringify(this.config, null, 2))
  }

  get key() {
    if (this.config.key) {
      return this.cryptr.decrypt(this.config.key)
    }
  }

  get secret() {
    if (this.config.secret) {
      return this.cryptr.decrypt(this.config.secret)
    }
  }

  get oauthToken() {
    if (this.config.oauthToken) {
      return this.cryptr.decrypt(this.config.oauthToken)
    }
  }

  get oauthTokenSecret() {
    if (this.config.oauthTokenSecret) {
      return this.cryptr.decrypt(this.config.oauthTokenSecret)
    }
  }

  get id() {
    return this.config.id
  }

  get username() {
    return this.config.username
  }

  async setKey(key) {
    this.config.key = this.cryptr.encrypt(key)
    await this._write()
  }

  async setSecret(secret) {
    this.config.secret = this.cryptr.encrypt(secret)
    await this._write()
  }

  async setOauth(token, secret, id, username) {
    this.config.oauthToken = this.cryptr.encrypt(token)
    this.config.oauthTokenSecret = this.cryptr.encrypt(secret)
    this.config.id = id
    this.config.username = username
    await this._write()
  }
}

module.exports = new Config()
