var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');

module.exports = function (path) {
    var response = deferred();

    response.resolve(path);

    return response.promise;
}
