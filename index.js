var util = require('util');
var fs = require('fs');
var prompt = require('prompt');

module.exports = function(input, settings) {
  var readmefile;
  var exitNoGithub = function() {
    console.error('I have no idea where this code lives (no github URL found).');
    process.exit(1);
  };
  var written = false;

  var hasTrueInput = function(input, type) {
    if (input[type] && input[type] === 'y') {
      return true;
    }
    return false;
  };

  var checkDavid = function(input, ghurl) {
    if (hasTrueInput(input, 'david')) {
      var davidLine = util.format('[![Dependency Status](https://david-dm.org/%s.svg?theme=shields.io)](https://david-dm.org/%s)', ghurl, ghurl);
      readmeArray.splice(2, 0, davidLine);
      written = true;
    }
  };

  var checkTravis = function(input, ghurl) {
    if (hasTrueInput(input, 'travis')) {
      var travisLine = util.format('[![Build Status](https://travis-ci.org/%s.svg)](https://travis-ci.org/%s)', ghurl, ghurl);
      readmeArray.splice(2, 0, travisLine);
      written = true;
    }
  };

  var checkCodeClimate = function(input, ghurl) {
    if (hasTrueInput(input, 'codeclimate')) {
      var ccline = util.format('[![Code Climate](http://img.shields.io/codeclimate/github/%s.svg)](https://codeclimate.com/github/%s)', ghurl, ghurl);
      readmeArray.splice(2, 0, ccline);
      written = true;
    }
  };
  var checkCoveralls = function(input, ghurl) {
    if (hasTrueInput(input, 'coveralls')) {
      var caline = util.format('[![Coverage Status](http://img.shields.io/coveralls/%s.svg)](https://coveralls.io/r/%s?branch=master)', ghurl, ghurl);
      readmeArray.splice(2, 0, caline);
      written = true;
    }
  };

  var createReadme = function(settings) {

    // Create a README based on package.json
    var readmeArray = [];

    // First add title.
    readmeArray.push(settings.package.name);

    // Add a line under that.
    readmeArray.push('==');

    // Add a blank line.
    readmeArray.push('');

    // Add description.
    readmeArray.push(settings.package.description);

    // Write to disc.
    fs.writeFileSync(settings.dir + '/README.md', readmeArray.join('\n'));
    return require('./bin/lib/findReadme')(settings.dir);
  };
  var createTravisYml = function(settings) {

    // Create a README based on package.json
    var ymlArray = [];

    // First add language.
    ymlArray.push('language: node_js');

    // Add testable node versions
    ymlArray.push('node_js:');
    ymlArray.push('  - "0.11"');
    ymlArray.push('  - "0.10"');

    // Add a blank line for readability
    ymlArray.push('');

    // Add test script
    ymlArray.push('script:');
    ymlArray.push('  - npm test');

    // Write to disc.
    fs.writeFileSync(settings.dir + '/.travis.yml', ymlArray.join('\n'));
  };
  // Find out the short form of github page.
  if (!settings || !settings.package || !settings.package.repository || !settings.package.repository.url) {
    exitNoGithub();
  }
  var ghurl = settings.package.repository.url;
  var ghreg = /[a-z]*:\/\/github.com\//;
  if (!ghurl.match(ghreg)) {
    exitNoGithub();
  }
  else {
    ghurl = ghurl.replace(ghreg, '').replace('.git', '');
  }
  if (input.readme && input.readme === 'y') {
    readmefile = createReadme(settings);
  }
  else {
    readmefile = require('./bin/lib/findReadme')(settings.dir);
  }

  // Split readme into pieces.
  var readmeArray = readmefile.split('\n');

  checkDavid(input, ghurl);
  checkCodeClimate(input, ghurl);
  checkCoveralls(input, ghurl);
  checkTravis(input, ghurl);
  if (input.travisyml && input.travisyml === 'y') {
    createTravisYml(settings);
  }

  // Ok, let's present the result to the user, and ask for permission to write
  // it to a file.
  var endResult = readmeArray.join('\n');
  prompt.message = "READMEIFY!".cyan;
  prompt.start();
  var schema = {
    properties: {
      ok: {
        type: 'string',
        default: 'y',
        before: require('./bin/lib/beforeBool'),
        description: 'Does this look OK?'
      }
    }
  };
  if (written) {
    console.log('--- PREVIEW ---'.yellow);
    console.log(endResult.grey);
    prompt.get(schema, function (err, result) {
      if (err) {
        if (err.message === 'canceled') {
          console.log('Readmeify cancelled!\n'.yellow);
          process.exit(0);
        }
        console.error(err);
        process.exit(1);
      }
      if (result.ok === 'y') {
        fs.writeFileSync(settings.dir + '/README.md', endResult);
      }
    });
  }
};
