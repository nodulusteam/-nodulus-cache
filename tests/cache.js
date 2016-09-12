// tests/config.js
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
 

describe('cache-init', function() {
  it('init the cache singleton', function() {   
       var cache = require('../index');
        expect(cache).to.not.equal(undefined);
  });
});