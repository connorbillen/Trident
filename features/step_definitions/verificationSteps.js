// 'Then' declarations
'use strict';
var expect = require('chai').expect;

module.exports = function() {

  this.Then(/^everything should pass without issue$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    expect(1).to.equal(1);
    
    callback();
  });

};
