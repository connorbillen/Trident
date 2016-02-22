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

    exec('wget --no-check-certificate -O "' + config[config.music].watch_dir + options.title + '.torrent" "' + options.url + '"', 
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
        if (JSON.parse(body).status == 'failure')
            response.resolve('<p>Search failed: ' + JSON.parse(body).error + '</p>');
        else
            response.resolve(process(artist, body));
    });

    return response.promise;
}

// Convert the returned JSON into a usable, organized structure
function process(artistname, json) {
    var releases = JSON.parse(json).response.torrentgroup;
    var albums = [];
    
    for (var release in releases) {
        releases[release].torrent.forEach(function (torrent) { 
            for (var artist in releases[release].artists) {
                if (releases[release].artists[artist].name.toUpperCase().search(artistname.toUpperCase()) != -1 &&
                    releases[release].releaseType == 1) {              
                     var newalbum = {
                        'name'      : releases[release].groupName,
                        'image'     : releases[release].wikiImage,
                        'torrents'  : []
                    };
                    
                    releases[release].torrent.forEach(function (torrent) {
                        if (config[config.music].formats.indexOf(torrent.format) != -1 &&
                            config[config.music].sources.indexOf(torrent.media) != -1)
                            newalbum.torrents.push(torrent);
                    });   
                                           
                    albums.forEach(function (album) {
                        if (album.name == newalbum.name) 
                            newalbum = null; 
                    });
                    
                    if (newalbum)
                        albums.push(newalbum);
                }
            }
        });
    };

    return render(albums);
}

// Render the passed JSON object into an HTML string
function render(json) {
    var html = '';

    for (var album in json) {
        html += '<div class="tile">';
        html += '<img class="album-art" alt="album-art" src="' + json[album].image  + '">';
        html += '<div class="album-name">' + json[album].name + '</div>';
        html += '<div class="album-download-container">';
        
        for (var torrent in json[album].torrents) {
            html += '<div class="album-download">';
            html += '<span class="album-source">' + json[album].torrents[torrent].media + '</span>';
            html += '<span class="album-encoding">' + json[album].torrents[torrent].format + '</span><br>';
            html += '<span class="album-size">' + Math.floor(json[album].torrents[torrent].size / 1024 / 1024) + ' MB</span>';
            html += '<input class="album-download-button" onclick="download(\'Music\', \'' + 
                    'https://what.cd/torrents.php?action=download&id=' + json[album].torrents[torrent].id + 
                    '&authkey=' + config[config.music].auth + '&torrent_pass=' + config[config.music].key + 
                    '\', \'' + json[album].name + ' - ' + json[album].torrents[torrent].format + 
                    '\'); " type="button" value="Download">';
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';
    }

    return html;
}

exports.search      = searchForArtist;
exports.download    = downloadAlbum;
