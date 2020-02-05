#!/usr/bin/env node

const constants = require('../lib/constants')
const Config = require('../lib/config')
const Reflectr = require('../')
const ui = require('../lib/ui')

async function start() {
  try {
    const config = new Config(process.cwd())
    await config.init()
    const reflectr = new Reflectr(config)
    ui.init(reflectr)
    ui.on('end', () => {
      ui.stop()
      console.log('done')
      process.exit()
    })
    await reflectr.run()
  } catch (err) {
    console.error(err)
    process.exit(-1)
  }
}

start()
