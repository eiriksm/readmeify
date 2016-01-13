/*eslint quotes: 0 */
'use strict';
require('should');
var stream = require('mock-utf8-stream');
var stdin = new stream.MockReadableStream();

describe('Unit tests', function() {
  it('Should expose a beforeBool in lib', function() {
    require('../bin/lib/beforeBool').should.be.instanceOf(Function);
  });

  it('Should return some expected values from beforeBool', function() {
    require('../bin/lib/beforeBool')('y').should.eql('y');
    require('../bin/lib/beforeBool')('yes').should.eql('y');
    require('../bin/lib/beforeBool')('no').should.eql('n');
    require('../bin/lib/beforeBool')('bogus').should.eql(false);
  });

  it('Should expose a findPackage in lib', function() {
    require('../bin/lib/findPackage').should.be.instanceOf(Function);
  });

  it('Should return some expected values from findPackage', function() {
    var f = require('../bin/lib/findPackage');
    f(require('path').join(__dirname, '/..')).should.be.instanceOf(Object);
    f('bogus/dir/name').should.eql(false);
  });

  it('Should expose version in lib', function() {
    require('../bin/lib/version').should.be.instanceOf(Object);
    require('../bin/lib/version').arg.should.be.instanceOf(Function);
    require('../bin/lib/version').display.should.be.instanceOf(Function);
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

describe('Bootstrap everything', function() {
  var s = {
    package: {
      repository: {
        url: 'https://github.com/eiriksm/readmeify'
      }
    }
  };
  var input = {};
  var r = require('..');
  it('Should go all good', function() {
    r(null, null, function(){});
    r(null, s);
  });
  it('Should not recognize non-github repo', function() {
    s.package.repository.url = 'http://bugus.domain';
    r(null, s, function(e, c) {
      c.should.equal(1);
    });
  });
  it('Should add all badges if we flag them to be there', function(done) {
    s.dir = '..';
    input.readme = 'y';
    input.travisyml = 'y';
    input.david = 'y';
    input.coveralls = 'y';
    input.codeclimate = 'y';
    input.travis = 'y';
    var r2 = require('..');
    s.stdin = stdin;
    setTimeout(function() {
      s.stdin.write('y');
      s.stdin.write("\n");
    });
    r2(input, s, function() {
      done();
    });
  });
  it('Should pass on a strange gh url format', function(done) {
    s.package.repository.url = 'git+https://github.com/eiriksm/readmeify.git';
    setTimeout(function() {
      s.stdin.write('y');
      s.stdin.write("\n");
    });
    require('..')(input, s, function(err, code, readme) {
      code.should.equal(0);
      readme[2].should.equal('[![Build Status](https://travis-ci.org/eiriksm/readmeify.svg?branch=master)](https://travis-ci.org/eiriksm/readmeify)');
      done(err);
    });
  });
  it('Should pass on a couple of coverage based cases', function(done) {
    var r3 = require('..');
    setTimeout(function() {
      s.stdin.write('n');
      s.stdin.write("\n");
    });
    r3(input, s, function() {
      setTimeout(function() {
        s.stdin.write("\x03");
      });
      r3(input, s, function() {
        done();
      });
    });
  });
});
