const path = require('path');
const $ = require('shelljs');
const chalk = require('chalk');

exports.log = function(...args) {
  console.log(...args);
};

exports.error = function(...args) {
  console.log(`\n${chalk.bgRed.black(' ERROR ')}`, ...args);
};

exports.success = function(...args) {
  console.log(`\n${chalk.bgGreen.black(' DONE ')}`, ...args);
};

exports.cwd = function(...args) {
  return path.resolve(...args);
};

exports.ownDir = function(...args) {
  return path.join(__dirname, '../', ...args);
};

exports.move = function(dir, from, to) {
  console.log(`${chalk.magenta('Moving    ')} · ${from} -> ${to}`);
  const dest = path.join(dir, to);
  $.rm('-rf', dest);
  $.mv(path.join(dir, from), dest);
};
