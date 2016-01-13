'use strict';
module.exports = function(dir) {
  // Try to find package.json of current directory.
  var pack;
  try {
    pack = require(dir + '/package.json');
  }
  catch (err) {
    return false;
  }
  return pack;
};
