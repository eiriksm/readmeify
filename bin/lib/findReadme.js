'use strict';
var fs = require('fs');
module.exports = function(dir) {
  var readmefile;
  // See if we can do something with the README.md
  try {
    readmefile = fs.readFileSync(dir + '/README.md');
  }
  catch (err) {
    return false;
  }

  return readmefile.toString('utf-8');
};
