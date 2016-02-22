var exec        = require('child_process').exec;
var deferred    = require('deferred');
var mongoose    = require('mongoose');
var config      = require('../config');
var discogs     = require('../fetchers/Discogs');
var artistModel = require('../schemas/artistModel');

module.exports = function renderMusic(error, stdout, stderr) {
    if (error) {
        console.log(stderr);
        return;
    }
    var db;    
    var html = '<p>Rendering Music...';

    mongoose.connect('mongodb://localhost/local');
    db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'connection error: '));
    db.once('open', function() {
        artistModel.find(function(err, artist) {
            if (err)
                console.log(err);
            
            console.log(artist);
        });
    });


    return html;
}
