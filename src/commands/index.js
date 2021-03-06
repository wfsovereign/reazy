import yeoman from 'yeoman-environment';
import _ from 'lodash';

const env = yeoman.createEnv();

const reazyGenerators = '../reazy-generator/generators';

env.register(require.resolve(`${reazyGenerators}/mobile-app`), 'reazy:mobile-app');
env.register(require.resolve(`${reazyGenerators}/web-app`), 'reazy:web-app');
env.register(require.resolve(`${reazyGenerators}/plugin`), 'reazy:plugin');
env.register(require.resolve(`${reazyGenerators}/add-plugin`), 'reazy:add-plugin');
env.register(require.resolve(`${reazyGenerators}/remove-plugin`), 'reazy:remove-plugin');

const generatorOptions = {
  disableNotifyUpdate: true
};

function requireFromString(src, filename) {
  var m = new module.constructor();
  m.paths = module.paths;
  m._compile(src, filename);
  return m.exports;
}

const processArgv = _.clone(process.argv);

export default function(vorpal) {
  vorpal.command('init <projectName> [type]', 'create a new app or plugin \n\  type: [web/mobile/plugin]').autocomplete(['mobile', 'web', 'plugin']).action(function (args, callback) {
    var _this = this;

    this.log('');
    var self = this;
    var generateAppSwitchCase = function generateAppSwitchCase(switchStatement) {
      switch (switchStatement) {
        case 'mobile':
          self.log('Generating a mobile app for you');
          env.run('reazy:mobile-app', generatorOptions, callback);
          break;
        case 'web':
          self.log('Generating a web app for you');
          env.run('reazy:web-app', generatorOptions, callback);
          break;
        case 'plugin':
          self.log('Generating a plugin for you');
          env.run('reazy:plugin', generatorOptions, callback);
          break;
        default:
          self.log('Invalid option');
          promptForType();
      }
    };
    var promptForType = function promptForType() {
      _this.prompt({
        type: 'list',
        name: 'type',
        message: 'What would you like to create?',
        choices: ['mobile', 'web', 'plugin']
      }, function (result) {
        generateAppSwitchCase(result.type);
      });
    };
    if (!args.type || ['mobile', 'web', 'plugin'].indexOf(args.type) === -1) {
      promptForType();
    } else {
      generateAppSwitchCase(args.type);
    }
  });

  vorpal
    .command('add <plugin>')
    .description('add a new plugin')
    .autocomplete(['native-config'])
    .action(function (args, callback) {
      env.run('reazy:add-plugin', args);
    });

  vorpal
    .command('remove <plugin>')
    .description('remove a plugin completely')
    .autocomplete(['native-config'])
    .action(function (args, callback) {
      env.run('reazy:remove-plugin', args);
    });

  // vorpal
  //   .catch('[words...]', 'Catches incorrect commands')
  //   .action(function (args, callback) {
  //     require('babel-register');
  //     const localProjectCli = require(process.cwd() + '/src/cli');
  //     localProjectCli.run(processArgv, vorpal);
  //   });
}

export { env };
