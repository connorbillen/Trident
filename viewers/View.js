var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');

// Retrieves the separate media files for media info parsing
var ViewMovies  = require('./ViewMovies');
var ViewMusic   = require('./ViewMusic');
var ViewTVShows = require('./ViewTVShows');

module.exports = function (type) {
    var response = deferred();
    
    if (type == 'Music') {
        exec('ls "' + config.musicpath + '"', ViewMusic);
        response.resolve('Rendering music directory...');
    } else if (type == 'Movies') {
        exec('ls "' + config.moviespath + '"', ViewMovies);
        response.resolve('Rendering movies directory...');
    } else if (type == 'TV Shows') {
        exec('ls "' + config.tvpath + '"', ViewTVShows);
        response.resolve('Rendering tv show directory...');
    }

    return response.promise;
};
