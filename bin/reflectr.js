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
    UI.addProgress(reflectr.photosets, constants.FLICKR_PHOTOSETS_PROGRESS_LABEL)
    UI.addProgress(reflectr.photosets.list, constants.FLICKR_PHOTOSETS_LIST_PROGRESS_LABEL)
    UI.addProgress(reflectr.photos, constants.FLICKR_PHOTOS_PROGRESS_LABEL)
    UI.addProgress(reflectr.photos.list, constants.FLICKR_PHOTOS_LIST_PROGRESS_LABEL)
    await reflectr.run()
    UI.stop()
    console.log('done')
  } catch (err) {
    console.error(err)
  }
}

start()
