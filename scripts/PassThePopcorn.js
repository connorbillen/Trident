'use strict';

var https       = require('https');
var http        = require('http');
var request     = require('request');
    request     = request.defaults({jar: true});
var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');

// Login to the PassThePopcorn API using the username and password supplied in the config file
var host = config[config.movies];
request.post({ url: host.host + host.path + 'ajax.php?action=login', form: { username: host.username, password: host.password, passkey: host.auth, 
                                                                             keeplogged: 1 }}, 
    function(err, httpResponse, body) { 
        console.log(body);
            
        if (err)
            console.log(err);
    }
);
/* This is where the download-related 
   functions are. Search functions
   are below this sectioin          */ 

// Exported function that is called as the download endpoint for the PassThePopcorn module
function downloadMovie(options) {
    var response = deferred();

    var download = exec('wget --no-check-certificate -O "' + config[config.movies].watch_dir + options.title + '.torrent" "' + options.url + '"', 
        function processDownload(error, stdout, stderr) {
            if (error) {
                console.log(stderr);
                return;
            }

            console.log(stdout);
            response.resolve();
        }
    );

    return response.promise;
}


/* This is where the search related 
   functions are. Exports are at the
   bottom of the file.             */ 

// Exported function that is called as the search endpoint for the PassThePopcorn module
function searchForMovie(title) {
    var response    = deferred();
    var host        = config[config.movies];
    
    request(host.host + host.path + 'torrents.php?searchstr=' + encodeURI(title) + '&json=noredirect', function (error, res, body) {
        response.resolve(process(JSON.parse(body)));
    });

    return response.promise;
}

// Convert the returned JSON into a usable, organized structure
function process(json) {
    var movies = [];
    
    json.Movies.forEach(function (movie) {
        var newmovie = {
            'title'     : movie.Title,
            'poster'    : movie.Cover,
            'torrents'  : []
        };
    
        movie.Torrents.forEach(function (torrent) {
            if (config[config.movies].resolutions.indexOf(torrent.Resolution) != -1 &&
                config[config.movies].sources.indexOf(torrent.Source) != -1)
                newmovie.torrents.push(torrent);
        });

        if (newmovie.torrents.length)
            movies.push(newmovie);
    });

    return render(movies);
}

// Render the passed JSON object into an HTML string
function render(json) {
    var html = '';

    json.forEach(function (movie) {
        html += '<div class="tile">';
        html += '<img class="movie-art" alt="movie-art" src="' + movie.poster + '">';
        html += '<div class="movie-name">' + movie.title + '</div>';
        for (var torrent in movie.torrents) {
            html += '<div class="movie-download">';
            html += '<span class="movie-source">' + movie.torrents[torrent].Source + '</span>';
            html += '<span class="movie-size">' + Math.floor(movie.torrents[torrent].Size / 1024 / 1024 / 2014) + ' GB</span>';
            html += '<input class="movie-download-button" onclick="download(\'Movie\', \'' +  
                     movie.title + '\', \'https://tls.passthepopcorn.me/torrents.php?action=download&id=' + 
                     movie.torrents[torrent].Id + '&authkey=' + config[config.movies].key + 
                     '&torrent_pass=' + config[config.movies].auth + '\'); "' + 
                    'type="button" value="Download">';
            html += '</div>';
        }
        html += '</div>';
    });

    return html;
}

exports.search      = searchForMovie;
exports.download    = downloadMovie;
