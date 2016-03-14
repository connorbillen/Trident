var exec        = require('child_process').exec;
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
    else if (type == 'Movie') {
        console.log('Playing movie: ' + config.moviespath + path);
        exec('ls "' + config.moviespath + path + '"',
            function(error, stdout, stderr) {
                response.resolve(PlayMovie(error, stdout, stderr, config.moviespath + path));
            });
    } else if (type == 'TVShow')
        response.resolve('Play TV Show...');
    
    return response.promise;
}
