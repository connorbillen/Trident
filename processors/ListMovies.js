var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');
var omdb        = require('../fetchers/OMDB');
var mongoose    = require('mongoose');
var movieModel  = require('../schemas/movieModel'); 

module.exports = function processMovies(error, stdout, stderr) {
    if (error) {
        console.log(stderr);
        return;
    }

    var movies      = stdout.split('\n');
    var movieData   = [];
    var responses   = [];

    movies.forEach(function (movie) {
        if (movie === '')
            return;
        
        var response = deferred(); 
        responses.push(response.promise);
        var title   = movie.split(' ');
        var year    = title.pop().slice(1, 5);
        title       = title.join(' ');

        omdb(title, year)(
            function (data) {
                movieData.push(data);
                response.resolve();
            }
        );
    });

    return deferred(responses)(function (data) { storeMovies(movieData); });
};

function storeMovies(movieData) {
    var response = true;

    var data = parseMovieData(movieData);
    movieModel.remove({}, function (err) {});

    data.forEach(function(movie) {
        movie.save(function (err, movie) {
            if (err) {
                response = false;
                return console.error(err);
            }
        });
    });
        
    return response;
}

function parseMovieData(movieData) {
    var parsedData = [];

    for (var data in movieData) {
        var movie = JSON.parse(movieData[data]);

        var movieDatum = new movieModel({
            name: movie.Title,
            poster: movie.Poster,
            genre: movie.Genre,
            plot: movie.Plot,
            actors: movie.Actors,
            rating: movie.Rated,
            year: new Date(movie.Released)
        });

        parsedData.push(movieDatum);
    }

    return parsedData;
}
