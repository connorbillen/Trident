var exec        = require('child_process').exec;
var deferred    = require('deferred');
var mongoose    = require('mongoose');
var config      = require('../config');
var movieModel  = require('../schemas/movieModel');

module.exports = function renderMovies(error, stdout, stderr) {
    if (error) {
        console.log(stderr);
        return;
    }
    
    var response = deferred();
    var html = '';
    
    movieModel.find(function(err, movies) {
        if (err) {
            console.log(err);
            html += err;
        }
      
        html += '<div class="columns">';
        movies.forEach(function (movie) {
            html += '<div class="column" onclick="play(\'Movie\', \'' + movie.name +
                    ' (' + (new Date(movie.year)).getFullYear() + ')\'); ">'; 
            html += '<img class="movie" src="' + movie.poster + '">';
            html += '<div class"movie-name-container">';
            html += '<span class="movie-name">' + movie.name + '</span>';
            html += '</div>';
            html += '</div>';
        });
        
        for (var i = 0; i < 4 - (movies.length % 4); i++) {
            html += '<div class="column"></div>';
        }
        
        html += '</div>';
        
        response.resolve(html);
    });

    return response.promise;
}
