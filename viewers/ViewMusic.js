var exec        = require('child_process').exec;
var deferred    = require('deferred');
var mongoose    = require('mongoose');
var config      = require('../config');
var artistModel = require('../schemas/artistModel');

module.exports = function renderMusic(error, stdout, stderr) {
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
        artistModel.find(function(err, artists) {
            if (err) {
                console.log(err);
                html += err;
            }
            
            html += '<div class="columns">';
            artists.forEach(function (artist) {
                html += '<div class="column">'; 
                html += '<img class="artist" src="' + artist.profile + '">';
                html += '<div class="artist-name-container">';
                html += '<span class="artist-name">' + artist.name +'</span>';
                html += '</div>';
                html += '</div>';
            });
            
            for (var i = 0; i < 4 - (artists.length % 4); i++) {
                html += '<div class="column"></div>';
            }
            
            html += '</div>';
            

            connection.disconnect();
            response.resolve(html);
        });
    });

    return response.promise;
}
