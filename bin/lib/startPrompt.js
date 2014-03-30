var prompt = require('prompt');
var readmeify = require('../..');

module.exports = function(schema, settings) {
  prompt.message = "READMEIFY!".cyan;
  prompt.start();
  prompt.get(schema, function (err, result) {
    if (err) {
      if (err.message === 'canceled') {
        console.log('Readmeify cancelled!\n'.yellow);
        process.exit(0);
      }
      process.exit(1);
    }
    readmeify(result, settings);
  });
};
