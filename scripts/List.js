var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');

// Retrieves the separate media files for media info parsing
var ListMovies  = require('./ListMovies');
var ListMusic   = require('./ListMusic');
var ListTVShows = require('./ListTVShows');

module.exports = function (type) {
    var response = deferred();
    
    if (type == 'Music')
        response.resolve(exec('ls "' + config.musicpath + '"', ListMusic));
    else if (type == 'Movies')
        response.resolve(exec('ls "' + config.moviespath + '"', ListMovies));
    else if (type == 'TV Shows')
        response.resolve(exec('ls "' + config.tvpath + '"', ListTVShows));

    return response.promise;
};
