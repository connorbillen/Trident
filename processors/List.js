var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');

// Retrieves the separate media files for media info parsing
var ListMovies  = require('./ListMovies');
var ListMusic   = require('./ListMusic');
var ListTVShows = require('./ListTVShows');

module.exports = function (type) {
    var response = deferred();
    
    if (type == 'Music') {
        exec('ls "' + config.musicpath + '"', ListMusic);
        response.resolve('Processing music directory...');
    } else if (type == 'Movies') {
        exec('ls "' + config.moviespath + '"', ListMovies);
        response.resolve('Processing movies directory...');
    } else if (type == 'TV Shows') {
        exec('ls "' + config.tvpath + '"', ListTVShows);
        response.resolve('Processing tv show directory...');
    }

    return response.promise;
};
