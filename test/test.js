var should = require('should');

describe('Unit tests', function() {
  it('Should expose a beforeBool in lib', function() {
    require('../bin/lib/beforeBool').should.be.a.Function;
  });

  it('Should return some expected values from beforeBool', function() {
    require('../bin/lib/beforeBool')('y').should.eql('y');
    require('../bin/lib/beforeBool')('yes').should.eql('y');
    require('../bin/lib/beforeBool')('no').should.eql('n');
    require('../bin/lib/beforeBool')('bogus').should.eql(false);
  });

  it('Should expose a findPackage in lib', function() {
    require('../bin/lib/findPackage').should.be.a.Function;
  });

  it('Should return some expected values from findPackage', function() {
    var f = require('../bin/lib/findPackage');
    f(__dirname + '/..').should.be.a.Object;
    f('bogus/dir/name').should.eql(false);
  });

  it('Should expose version in lib', function() {
    require('../bin/lib/version').should.be.a.Object;
    require('../bin/lib/version').arg.should.be.a.Function;
    require('../bin/lib/version').display.should.be.a.Function;
  });

  it('Should return some expected values from version', function() {
    var v = require('../bin/lib/version');
    v.arg('version').should.eql(true);
    v.arg('--version').should.eql(true);
    v.arg('dummy').should.eql(false);
    v.arg().should.eql(false);
    // Just run the display function to see it does not error out.
    v.display();
  });
});
