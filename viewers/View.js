var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');

// Retrieves the separate media files for media info parsing
var ViewMovies  = require('./ViewMovies');
var ViewMusic   = require('./ViewMusic');
var ViewTVShows = require('./ViewTVShows');

module.exports = function (type) {
    var response = deferred();
    
    if (type == 'Music')
        exec('ls "' + config.musicpath + '"', 
            function(error, stdout, stderr) { 
                ViewMusic(error, stdout, stderr).then(function(data) {
					response.resolve(data);
				});
            });
 
    else if (type == 'Movies')
        exec('ls "' + config.moviespath + '"', 
            function(error, stdout, stderr) { 
                ViewMovies(error, stdout, stderr)(response.resolve);
            });
 
    else if (type == 'TV Shows') {
        exec('ls "' + config.tvpath + '"', 
            function(error, stdout, stderr) { 
                ViewTVShows(error, stdout, stderr)(response.resolve);
            });
    }

    return response.promise;
};
