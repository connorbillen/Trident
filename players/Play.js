var deferred    = require('deferred');
var config      = require('../config');

// Separate playermodules for songs, albums, tv shows, series, movies, etc
var PlayMovie   = require('./PlayMovie');
var PlaySong    = require('./PlaySong');
var PlayTVShow  = require('./PlayTVShow');

module.exports = function (type, path) {
    var response = deferred();

    if (type == 'Song')
        response.resolve('Play song...');  
    else if (type == 'Movie')
        PlayMovie(config.moviespath + path)(response.resolve);
    else if (type == 'TVShow')
        response.resolve('Play TV Show...');
    
    return response.promise;
}
