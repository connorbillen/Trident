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
/*
    ajax.php?action=browse&searchstr=<Search Term>
    searchstr - string to search for

    page - page to display (default: 1)

    taglist, tags_type, order_by, order_way, filter_cat, freetorrent, vanityhouse, scene, haslog, releasetype, media, format, encoding, artistname, filelist, groupname, recordlabel, cataloguenumber, year, remastertitle, remasteryear, remasterrecordlabel, remastercataloguenumber
*/
    request(host.host + host.path + 'ajax.php?action=browse&searchstr=' + artist, function (error, response, body) {
        console.log(body);
    });

    return response.promise;
}

// Convert the returned JSON into a usable, organized structure
function process(json) {
}

// Render the passed JSON object into an HTML string
function render(json) {
}

exports.search      = searchForArtist;
exports.download    = downloadAlbum;
