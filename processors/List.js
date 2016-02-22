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
        exec('ls "' + config.musicpath + '"', 
            function(error, stdout, stderr) { 
                response.resolve(ListMusic(error, stdout, stderr)); 
            });
    } else if (type == 'Movies') {
        exec('ls "' + config.moviespath + '"', 
            function(error, stdout, stderr) { 
                response.resolve(ListMovies(error, stdout, stderr)); 
            });
    } else if (type == 'TV Shows') {
        exec('ls "' + config.tvpath + '"', 
            function(error, stdout, stderr) { 
                response.resolve(ListTVShows(error, stdout, stderr)); 
            });
    }

    return response.promise;
};
