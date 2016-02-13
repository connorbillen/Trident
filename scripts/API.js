var http        = require('http');
var deferred    = require('deferred');
var config      = require('../config');
var tvshows     = require('./' + config.tvshows);
var music       = require('./' + config.music);
var movies      = require('./' + config.movies);

function query(cmd, options) {
    var response = deferred();

    console.log('cmd: ' + cmd);
    console.log('options: ' + JSON.stringify(options));

    if (options.type == 'TV Shows') {
        tvshows[cmd](options.data)(
            function(data) {
                response.resolve(data);
            }
        );
    } else if (options.type == 'Music') {
        music[cmd](options.data)(
            function(data) {
                response.resolve(data);
            }
        );
    } else if (options.type == 'Movies') {
        movies[cmd](options.data)(
            function(data) {
                response.resolve(data);
            }
        );
    }
    
    return response.promise;
}

exports.query = query;
