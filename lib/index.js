const fs = require('fs');
const co = require('co');
const tildify = require('tildify');
const install = require('yarn-install');
const kopy = require('kopy');
const chalk = require('chalk');
const inquirer = require('inquirer');
const figlet = require('figlet');
const emoji = require('node-emoji');
const updateNotifier = require('update-notifier');
const pkg = require('../package');
const _ = require('./utils');
const AppError = require('./app-error');

module.exports = co.wrap(function*(options) {
  if (!options.name) {
    throw new AppError('> A folder name is required to perform this action');
  }

  _.log();
  _.log(
    chalk.hex('#04be35')(
      figlet.textSync('Create Web App', {
        font: 'Standard',
        horizontalLayout: 'fitted'
      })
    )
  );
  _.log();

  const dest = _.cwd(options.name);

  if (!options.force && fs.existsSync(dest)) {
    const { overWrite } = yield inquirer.prompt([
      {
        name: 'overWrite',
        type: 'confirm',
        message: `Directory ${chalk.yellow(
          tildify(dest)
        )} already exists, confirm to overwrite it anyway?`,
        default: false
      }
    ]);

    if (!overWrite) {
      throw new AppError('> Aborted.');
    }
  }

  let usePrompts = options.prompts;

  const defaults = Object.assign(
    {
      type: '',
      description: `My web app`
    },
    options
  );

  if (defaults.type) {
    usePrompts = false;
    _.log('> Detected project type from from CLI arguments, skipped prompts.');
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
      message: 'Choose the type of HTML',
      choices: [
        { name: 'Nunjucks (Former HTML)', value: 'nunjucks' },
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
        { name: 'Less', value: 'less' },
        { name: 'Stylus', value: 'stylus' }
      ]
    },
    {
      name: 'js',
      type: 'list',
      message: 'Choose the type of JavaScript',
      choices: [
        { name: 'Babel', value: 'babel' },
        { name: 'TypeScript', value: 'typescript' },
        { name: 'CoffeeScript', value: 'coffeescript' }
      ]
    }
  ];

  const kopyOptions = {
    filters: {
      'src/html/index.tpl': 'html === "nunjucks"',
      'src/html/layouts-nunjucks/**': 'html === "nunjucks"',
      'src/html/index.pug': 'html === "pug"',
      'src/html/layouts-pug/**': 'html === "pug"',
      'postcss.config.js': 'css === "postcss"',
      'src/css/**': 'css === "postcss"',
      'src/sass/**': 'css === "sass"',
      'src/less/**': 'css === "less"',
      'src/stylus/**': 'css === "stylus"',
      'src/js/app.js': 'js === "babel"',
      'rollup.config.js': 'js === "babel"',
      'tsconfig.json': 'js === "typescript"',
      'src/js/app.ts': 'js === "typescript"',
      'src/js/app.coffee': 'js === "coffeescript"'
    }
  };

  if (usePrompts === false) {
    kopyOptions.data = defaults;
  } else {
    kopyOptions.data = defaults;
    kopyOptions.prompts = prompts;
  }

  kopy(_.ownDir('template'), dest, kopyOptions).then(({ files, meta }) => {
    _.log();

    for (const file in files) {
      console.log(`${chalk.green('Generating')} · ${file}`);
    }

    for (const file of ['gitignore', 'editorconfig', 'postcssrc.js']) {
      _.move(dest, file, `.${file}`);
    }

    const htmlType = meta.merged.html;

    if (htmlType === 'nunjucks') {
      _.move(dest, 'src/html/layouts-nunjucks', 'src/html/layouts');
    } else if (htmlType === 'pug') {
      _.move(dest, 'src/html/layouts-pug', 'src/html/layouts');
    }

    _.log('\n> Installing web app in project:');
    install({ cwd: dest });
    _.success(`Successfully generated into ${chalk.yellow(tildify(dest))}\n`);

    _.log(chalk.green(`${emoji.get('car')}  To get started:`));
    _.log(`\n   cd ${meta.merged.name}\n`);
    _.log(chalk.green(`${emoji.get('beer')}  To watch for development:`));
    _.log('\n   npm run dev\n');
    _.log(chalk.green(`${emoji.get('wine_glass')}  To build for production:`));
    _.log('\n   npm run build\n');
  });

  updateNotifier({
    pkg,
    updateCheckInterval: 0
  }).notify();
});
