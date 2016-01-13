'use strict';
var prompt = require('prompt');
var readmeify = require('../..');
var util = require('util');
var parse = require('parse-github-repo-url');

module.exports = function(schema, settings, callback) {
  var exitNoGithub = function() {
    callback(new Error('I have no idea where this code lives (no github URL found)'), 1);
  };
  // Find out the short form of github page.
  if (!settings || !settings.package || !settings.package.repository || !settings.package.repository.url) {
    return exitNoGithub();
  }
  var parsedRepo = parse(settings.package.repository.url);
  var ghurl = util.format('%s/%s', parsedRepo[0], parsedRepo[1]);
  if (!ghurl) {
    return exitNoGithub();
  }
  prompt.message = 'READMEIFY!'.cyan;
  prompt.start();
  prompt.get(schema, function (err, result) {
    if (err) {
      if (err.message === 'canceled') {
        console.log('\nReadmeify cancelled!\n'.yellow);
        callback(null, 0);
      }
      callback(err, 1);
    }
    readmeify(result, settings);
  });
};
