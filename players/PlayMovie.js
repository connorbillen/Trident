var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');

module.exports = function (error, stdout, stderr, path) {
    if (error) {
        console.log(stderr);
        return;
    }
  
    var response    = deferred();
    var moviefile   = stdout.split('\n')[0];
    
    if (moviefile == '') {
        console.log('Error: No movie file found in content directory');
        return;
    }

    response.resolve(path + '/' + moviefile);

    return response.promise;
}
