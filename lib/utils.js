const path = require('path')

exports.log = function (...args) {
  console.log(...args)
}

exports.cwd = function (...args) {
  return path.resolve(...args)
}

exports.ownDir = function (...args) {
  return path.join(__dirname, '../', ...args)
}
