const fs = require('fs')
const path = require('path')
const co = require('co')
const tildify = require('tildify')
const install = require('yarn-install')
const kopy = require('kopy')
const chalk = require('chalk')
const inquirer = require('inquirer')
const _ = require('./utils/output')
const AppError = require('./utils/app-error')

module.exports = co.wrap(function* (options) {
  if (!options.name) {
    throw new AppError('> A folder name is required to perform this action')
  }

  const dest = _.cwd(options.name)

  if (!options.force && fs.existsSync(dest)) {
    const { overWrite } = yield inquirer.prompt([{
      name: 'overWrite',
      type: 'confirm',
      message: `Directory ${chalk.yellow(tildify(dest))} already exists, confirm to overwrite it anyway?`,
      default: false
    }])

    if (!overWrite) {
      throw new AppError('> Aborted.')
    }
  }

  let usePrompts = options.prompts

  const defaults = Object.assign({
    type: '',
    description: `My web app`
  }, options)

  if (defaults.type) {
    usePrompts = false
    _.log('> Detected project type from from CLI arguments, skipped prompts.')
  }

  const prompts = [
    {
      name: 'name',
      default: defaults.name,
      message: 'Choose the name for your new project:'
    },
    {
      name: 'description',
      default: defaults.description,
      message: 'Briefly describe your new project'
    },
    {
      name: 'html',
      type: 'list',
      message: 'Choose the type of HTML Template',
      choices: [
        { name: 'Nunjucks', value: 'nunjucks' },
        { name: 'Pug', value: 'pug' }
      ]
    },
    {
      name: 'css',
      type: 'list',
      message: 'Choose the type of CSS Preprocessor',
      choices: [
        { name: 'PostCSS', value: 'postcss' },
        { name: 'Sass', value: 'sass' },
        { name: 'Less', value: 'less' }
      ]
    },
    {
      name: 'js',
      type: 'list',
      message: 'Choose the type of JavaScript',
      choices: [
        { name: 'ES6', value: 'es6' },
        { name: 'TypeScript', value: 'typescript' },
        { name: 'CoffeeScript', value: 'coffeescript' }
      ]
    }
  ]

  const kopyOptions = {
    filters: {
      'src/css/**': 'css === postcss',
      'src/sass/**': 'css === sass',
      'src/less/**': 'css === less'
    }
  }

  if (usePrompts === false) {
    kopyOptions.data = defaults
  } else {
    kopyOptions.data = defaults
    kopyOptions.prompts = prompts
  }

  const { files, merged } = yield kopy(_.ownDir('template'), dest, kopyOptions)

  _.log()

  for (const file of files) {
    _.log(`${chalk.green('Generating')} · ${file}`)
  }

  _.log('\n> Installing web app in project:')
  install({ cwd: dest })
  _.success(`Successfully generated into ${chalk.yellow(tildify(dest))}\n`)
})
