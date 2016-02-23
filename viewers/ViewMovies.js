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

    var db;
    var connection;
    var response = deferred();
    var html = '';

    connection = mongoose.connect('mongodb://localhost/Trident');
    db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'connection error: '));
    db.once('open', function() {
        movieModel.find(function(err, movies) {
            if (err) {
                console.log(err);
                html += err;
            }
           
            console.log('MOVIES:' + movies);

            html += '<div class="columns">';
            movies.forEach(function (movie) {
                console.log(movie);

                html += '<div class="column">'; 
                html += '</div>';
            });
            
            for (var i = 0; i < 4 - (movies.length % 4); i++) {
                html += '<div class="column"></div>';
            }
            
            html += '</div>';
            

            connection.disconnect();
            response.resolve(html);
        });
    });

    return response.promise;
}
