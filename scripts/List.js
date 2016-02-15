var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');
var omdb        = require('./OMDB');
var discogs     = require('./Discogs');
var tvdb        = require('./TVDB').tvdb;

module.exports = function (type) {
    var response = deferred();
    
    if (type == 'Music')
        response.resolve(exec('ls "' + config.musicpath + '"', processMusic));
    else if (type == 'Movies')
        response.resolve(exec('ls "' + config.moviespath + '"', processMovies));
    else if (type == 'TV Shows')
        response.resolve(exec('ls "' + config.tvpath + '"', processTVShows));

    return response.promise;
};

function processMovies(error, stdout, stderr) {
    if (error) {
        console.log(stderr);
        return;
    }

    var movies  = stdout.split('\n');

    movies.forEach(function (movie) {
        if (movie == '')
            return;
        
        var title   = movie.split(' ');
        var year    = title.pop().slice(1, 5);
        title       = title.join(' ');

        omdb(title, year)(
            function (data) {
                console.log(data);
            }
        );
    });

    return render({});
}

function processMusic(error, stdout, stderr) {
    if (error) {
        console.log(stderr);
        return;
    }
        
    var artists = stdout.split('\n');

    artists.forEach(function (artist) {
        if (artist == '')
            return;
    
        discogs.artist(artist)(
            function (data) {
                console.log(data);
            }
        );
        
        exec('ls ' + config.musicpath + artist, function (error, stdout, stderr) { processAlbums(artist, error, stdout, stderr); });
    });

    return render({});
}

function processAlbums(artist, error, stdout, stderr) {
    if (error) {
        console.log(stderr);
        return;
    }
    
    var albums = stdout.split('\n');

    albums.forEach(function (album) {
        if (album == '')
            return;
        
        var title   = album.split(' ');
        var year    = title.pop().slice(1, 5);
        title       = title.join(' ');

        discogs.album(title, year, artist)(
            function (data) {
                console.log(data);
            }
        );
    });
}

function processTVShows(error, stdout, stderr) {
    if (error) {
        console.log(error);
        return;
    }
    
    var tvshows = stdout.split('\n');

    tvshows.forEach(function (tvshow) {
        if (tvshow == '')
            return;

        tvdb.search(encodeURI(tvshow))(
            function(data) {
                console.log(data);
            }
        );
    });

    return render({});
}

function render(json) {
    var html = '';

    return html;
}
