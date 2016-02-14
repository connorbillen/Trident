var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');
var omdb        = require('./OMDB');

module.exports = function (type) {
    var response = deferred();
    
    if (type == 'Music') {
        response.resolve(exec('ls "' + config.musicpath + '"', processMusic));
    } else if (type == 'Movies') {
        response.resolve(exec('ls "' + config.moviespath + '"', processMovies));
    } else if (type == 'TV Shows') {
        response.resolve(exec('ls "' + config.tvpath + '"', processTVShows));
    }

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

        console.log('title: ' + title);
        console.log('year: ' + year);

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

    return render({});
}

function processTVShows(error, stdout, stderr) {
    if (error) {
        console.log(error);
        return;
    }

    return render({});
}

function render(json) {
    var html = '';

    return html;
}
