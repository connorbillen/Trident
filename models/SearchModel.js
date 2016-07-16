'use strict';

var ejs = require('ejs');

var SearchModel = function (params) {
  this.params = params;
};

SearchModel.prototype.get = function (param) {
  return this.params[param];
};

SearchModel.prototype.set = function (param, value) {
  this.params[param] = value;
};

SearchModel.prototype.render = function (params) {
  ejs.renderFile(__dirname + '/../templates/' + this.params.template + '.ejs', this.params, (err, str) => {
    if (err) {
      console.log('rendering error:', err);
      return;
    }

    this.params.el.innerHTML += str;
  });
};

module.exports = SearchModel;
