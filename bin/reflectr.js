#!/usr/bin/env node

const constants = require('../lib/constants')
const Config = require('../lib/config')
const Reflectr = require('../')
const ui = require('../lib/ui')
const log = require('../lib/log')

async function start() {
  try {
    const config = new Config(process.cwd())
    await config.init()
    const reflectr = new Reflectr(config)
    await log(config.directory, reflectr)
    ui.init(reflectr)
    ui.on('end', () => {
      ui.stop()
      console.log('done')
      process.exit(constants.EXIT_CODE_SUCCESS)
    })
    await reflectr.run()
  } catch (err) {
    ui.stop()
    console.error(err)
    process.exit(constants.EXIT_CODE_ERROR)
  }
}

start()
