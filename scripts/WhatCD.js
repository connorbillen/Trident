'use strict';

var https       = require('https');
var http        = require('http');
var request     = require('request');
    request     = request.defaults({jar: true});
var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');

// Login to the WhatCD API using the username and password supplied in the config file
var host = config[config.music];
request.post({ url: host.host + host.path + 'login.php', form: { username: host.username, password: host.password }}, 
    function(err, httpResponse, body) { 
        if (err)
            console.log(err);
    }
);
/* This is where the download-related 
   functions are. Search functions
   are below this sectioin          */ 

// Exported function that is called as the download endpoint for the BroadcasTheNet module
function downloadAlbum(options) {
    var response = deferred();

    var download = exec('wget --no-check-certificate -O "' + config[config.music].watch_dir + options.title + '.torrent" "' + options.url + '"', 
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

// Exported function that is called as the search endpoint for the BroadcasTheNet module
function searchForArtist(artist) {
    var response    = deferred();
    var host        = config[config.music];
    
    request(host.host + host.path + 'ajax.php?action=artist&artistname=' + encodeURI(artist), function (error, res, body) {
        response.resolve(process(artist, body));
    });

    return response.promise;
}

// Convert the returned JSON into a usable, organized structure
function process(artistname, json) {
    var releases = JSON.parse(json).response.torrentgroup;
    var albums = [];
        
    for (var release in releases) {
        for (var artist in releases[release].artists) {
            if (releases[release].artists[artist].name.toUpperCase().search(artistname.toUpperCase()) != -1 &&
                releases[release].releaseType == 1)
                albums.push(releases[release]);
        }
    }

    return JSON.stringify(albums);
}

// Render the passed JSON object into an HTML string
function render(json) {
}

exports.search      = searchForArtist;
exports.download    = downloadAlbum;
