var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');
var omdb        = require('./OMDB');

module.exports = function processMovies(error, stdout, stderr) {
    if (error) {
        console.log(stderr);
        return;
    }

    var movies      = stdout.split('\n');
    var movieData   = [];
    var responses   = [];

    movies.forEach(function (movie) {
        if (movie == '')
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


    return deferred.apply(null, responses)(function (data) { renderMovies(movieData) });
};

function renderMovies(movieData) {
    console.log(movieData);
    
    var html = '';

    return html;
}
