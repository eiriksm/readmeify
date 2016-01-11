'use strict';
var util = require('util');
var fs = require('fs');
var prompt = require('prompt');
var parse = require('parse-github-repo-url');

module.exports = function(input, settings, cb) {
  var ghurl;
  if (settings && settings.package) {
    var parsedRepo = parse(settings.package.repository.url);
    ghurl = util.format('%s/%s', parsedRepo[0], parsedRepo[1]);
  }
  else {
    cb(new Error('NO GH URL'));
    return;
  }
  var readmeArray = [];
  var callback = function(code) {
    /*istanbul ignore else*/
    if (cb) {
      return cb(null, code);
    }
    /*istanbul ignore next*/
    process.exit(code); // eslint-disable-line no-process-exit
  };
  var readmefile;
  var written = false;

  var hasTrueInput = function(userInput, type) {
    if (userInput && userInput[type] && userInput[type] === 'y') {
      return true;
    }
    return false;
  };

  var checkDavid = function(userInput, url) {
    if (hasTrueInput(userInput, 'david')) {
      var davidLine = util.format('[![Dependency Status](https://david-dm.org/%s.svg)](https://david-dm.org/%s)', url, url);
      readmeArray.splice(2, 0, davidLine);
      written = true;
    }
  };

  var checkTravis = function(userInput, url) {
    if (hasTrueInput(userInput, 'travis')) {
      var travisLine = util.format('[![Build Status](https://travis-ci.org/%s.svg?branch=master)](https://travis-ci.org/%s)', url, url);
      readmeArray.splice(2, 0, travisLine);
      written = true;
    }
  };

  var checkCodeClimate = function(userInput, url) {
    if (hasTrueInput(userInput, 'codeclimate')) {
      var ccline = util.format('[![Code Climate](https://codeclimate.com/github/%s/badges/gpa.svg)](https://codeclimate.com/github/%s)', url, url);
      readmeArray.splice(2, 0, ccline);
      written = true;
    }
  };
  var checkCoveralls = function(userInput, url) {
    if (hasTrueInput(userInput, 'coveralls')) {
      var caline = util.format('[![Coverage Status](https://coveralls.io/repos/%s/badge.svg?branch=master)](https://coveralls.io/r/%s?branch=master)', url, url);
      readmeArray.splice(2, 0, caline);
      written = true;
    }
  };

  var createReadme = function(config) {
    // First add title.
    readmeArray.push(config.package.name);

    // Add a line under that.
    readmeArray.push('==');

    // Add a blank line.
    readmeArray.push('');

    // Add description.
    readmeArray.push(config.package.description);

    // Write to disc.
    fs.writeFileSync(config.dir + '/README.md', readmeArray.join('\n'));
    return require('./bin/lib/findReadme')(config.dir);
  };
  var createTravisYml = function(config) {

    // Create a README based on package.json
    var ymlArray = [];

    // First add language.
    ymlArray.push('language: node_js');

    // Add testable node versions.
    ymlArray.push('node_js:');
    ymlArray.push('  - "4"');
    ymlArray.push('  - "0.10"');
    ymlArray.push('sudo: false');

    // Write to disc.
    fs.writeFileSync(config.dir + '/.travis.yml', ymlArray.join('\n'));
  };
  if (input && input.readme && input.readme === 'y') {
    readmefile = createReadme(settings);
  }
  else {
    readmefile = require('./bin/lib/findReadme')(settings.dir);
  }

  // Split readme into pieces.
  if (readmefile) {
    readmeArray = readmefile.split('\n');
  }

  checkDavid(input, ghurl);
  checkCodeClimate(input, ghurl);
  checkCoveralls(input, ghurl);
  checkTravis(input, ghurl);
  if (input && input.travisyml && input.travisyml === 'y') {
    createTravisYml(settings);
  }

  // Ok, let's present the result to the user, and ask for permission to write
  // it to a file.
  var endResult = readmeArray.join('\n');
  prompt.message = 'READMEIFY!'.cyan;
  var stdin = settings.stdin || process.stdin;
  prompt.started = false;
  prompt.start({stdin: stdin});
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
        /*istanbul ignore else*/
        if (err.message === 'canceled') {
          console.log('Readmeify cancelled!\n'.yellow);
          return callback(0);
        }
        /*istanbul ignore next*/
        console.error(err);
        /*istanbul ignore next*/
        return callback(1);
      }
      if (result.ok === 'y') {
        fs.writeFileSync(settings.dir + '/README.md', endResult);
      }
      callback(0);
    });
  }
};
