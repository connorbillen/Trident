var http        = require('http');
var deferred    = require('deferred');
var config      = require('./config');
var tvshows     = require('./modules/' + config.tvshows);
var music       = require('./modules/' + config.music);
var movies      = require('./modules/' + config.movies);
var List        = require('./processors/List');
var View        = require('./viewers/View');

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

function view(type) {
    var response = deferred();

    View(type)(
        function (data) {
            console.log(data);
            response.resolve(data);
        }
    );

    return response.promise;    
}

function listmedia(type) {
    var response = deferred();

    List(type)(
        function (data) {
            console.log(data);
            response.resolve(data);           
        }
    );
     
    return response.promise;
}

exports.query       = query;
exports.listmedia   = listmedia;
exports.view        = view;
