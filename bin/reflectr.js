#!/usr/bin/env node

const constants = require('../lib/constants')
const Config = require('../lib/config')
const Reflectr = require('../')
const UI = require('../lib/ui')

async function start() {
  try {
    const config = new Config(process.cwd())
    await config.init()
    const reflectr = new Reflectr(config)
    UI.addProgress(reflectr.photos, constants.FLICKR_PHOTOS_LABEL)
    UI.addProgress(reflectr.photosets, constants.FLICKR_PHOTOSETS_LABEL)
    await reflectr.run()
    console.log('done')
  } catch (err) {
    console.error(err)
  }
}

start()
