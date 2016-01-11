'use strict';
var util = require('util');

exports.arg = function(arg) {
  var args = {
    '--version': true,
    'version': true,
    'v': true,
    '--v': true,
    '-v': true
  };
  if (args[arg]) {
    return true;
  }
  return false;
};

exports.display = function() {
  var v = require('../../package').version;
  console.log(util.format('Readmeify version %s', v));
};
