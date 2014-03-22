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
    require('../bin/lib/beforeBool')('y').should.eql('y');
    require('../bin/lib/beforeBool')('yes').should.eql('y');
    require('../bin/lib/beforeBool')('no').should.eql('n');
    require('../bin/lib/beforeBool')('bogus').should.eql(false);
  });
});
