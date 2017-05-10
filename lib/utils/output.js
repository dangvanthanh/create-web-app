const path = require('path')
const chalk = require('chalk')

exports.log = function (...args) {
  console.log(...args)
}

exports.error = function (...args) {
  console.log(`\n${chalk.bgRed.black(' ERROR ')}`, ...args)
}

exports.success = function (...args) {
  console.log(`\n${chalk.bgGreen.black(' DONE ')}`, ...args)
}

exports.cwd = function (...args) {
  return path.resolve(...args)
}

exports.ownDir = function (...args) {
  return path.join(__dirname, '../../', ...args)
}
