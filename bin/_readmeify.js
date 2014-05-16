var fs = require('fs');
var dir = process.cwd();
var beforeBool = require('./lib/beforeBool');
var isVersionArg = require('./lib/version').arg;
var displayVersion = require('./lib/version').display;

var schema = {
  properties: {
    readme: {
      type: 'string',
      default: 'y',
      before: beforeBool,
      description: 'No README.md found, would you like to create one?',
      conform: function(val) {
        if (val !== 'y') {
          console.log('Nothing to do here. Exiting.');
          process.exit(1);
        }
        return true;
      }
    },
    david: {
      type: 'string',
      default: 'y',
      before: beforeBool,
      description: 'Do you want a david.dm badge?'
    },
    travis: {
      type: 'string',
      default: 'y',
      before: beforeBool,
      description: 'Do you want a travis-ci badge?'
    },
    codeclimate: {
      type: 'string',
      default: 'y',
      before: beforeBool,
      description: 'Do you want a Code climate badge?'
    },
    coveralls: {
      type: 'string',
      default: 'y',
      before: beforeBool,
      description: 'Do you want a coveralls badge?'
    },
    travisyml: {
      type: 'string',
      default: 'y',
      before: beforeBool,
      description: 'Do you want a .travis.yml file?'
    }
  }
};

var readmefile = require('./lib/findReadme')(dir);
if (readmefile) {
  delete schema.properties.readme;
}
var pack = require('./lib/findPackage')(dir);
if (!pack) {
  console.error('No package.json found in ' + dir.red);
  process.exit(1);
}
var settings = {
  dir: dir,
  package: pack
};
if (process.argv[2] && isVersionArg(process.argv[2])) {
  displayVersion();
  process.exit(0);
}
require('./lib/startPrompt')(schema, settings);
