'use strict';

var TorrentModel = function (params) {
  this.params = params;
};

TorrentModel.prototype.get = function (param) {
  return this.params[param];
};

TorrentModel.prototype.set = function (param, value) {
  this.params[param] = value;
};

module.exports = TorrentModel;
