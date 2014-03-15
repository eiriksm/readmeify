var prompt = require('prompt');
var readmeify = require('../..');

module.exports = function(schema, settings) {
  prompt.message = "READMEIFY!".cyan;
  prompt.start();
  prompt.get(schema, function (err, result) {

    readmeify(result, settings);

  });
};
