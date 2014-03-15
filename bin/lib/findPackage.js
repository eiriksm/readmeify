module.exports = function(dir) {
  // Try to find package.json of current directory.
  var pack;
  try {
    pack = require(dir + '/package.json');
  }
  catch (err) {
    console.error('No package.json found in ' + dir);
    process.exit(1);
  }
  return pack;
};
