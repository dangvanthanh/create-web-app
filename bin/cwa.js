#!/usr/bin/env node
const yargs = require('yargs')
const chalk = require('chalk')
const pkg = require('../package')
const _ = require('../lib/utils')

const argv = yargs
  .usage('\ncwa <project-name>')
  .version(pkg.version)
  .alias('h', 'help')
  .alias('v', 'version')
  .epilogue('for more information, find our manual at https://github.com/dangvanthanh/create-web-app')
  .help()
  .argv

const name = argv._[0]
delete argv._

const options = Object.assign({
  name
}, argv)

process.stdout.write('\x1Bc')
require('./init')(options).catch(err => {
  _.log()
  _.log(chalk.bgRed.black(' ERROR '), 'Error occurs during initializing a new project:\n')
  if (err.name === 'AppError') {
    _.log(chalk.red(err.message))
  } else {
    _.log(err.stack)
  }

  _.log()
  process.exit(1)
})
