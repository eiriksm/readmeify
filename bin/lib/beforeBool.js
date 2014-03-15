module.exports = function(value) {
  var val = value.toLowerCase();
  var truthvals = {
    y: true,
    yes: true,
    'true': true
  };
  var falsevals = {
    n: true,
    no: true,
    'false': true
  };
  if (truthvals[val]) {
    return 'y';
  }
  if (falsevals[val]) {
    return 'n';
  }
  return false;
};
