var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');
var discogs     = require('./Discogs');

module.exports = function processMusic(error, stdout, stderr) {
    if (error) {
        console.log(stderr);
        return;
    }
        
    var artists     = stdout.split('\n');
    var musicData   = [];
    var responses   = [];
    
    artists.forEach(function (artist) {
        if (artist == '')
            return;
        var artistData  = {}; 
        var response    = deferred();
        var _response   = deferred();
        responses.push(response.promise);
        responses.push(_response.promise);

        discogs.artist(artist)(
            function (data) {
                artistData.artist = data;
                _response.resolve();
            }
        );
        
        processAlbums(artist)(
            function (data) {
                artistData.albums = data;
                musicData.push(artistData);
                response.resolve();
            }
        );
    });

    return deferred.apply(null, responses)(function (data) { renderMusic(musicData); });
};

function processAlbums(artist) {
    var response = deferred();
    
    exec('ls "' + config.musicpath + artist + '"', (error, stdout, stderr) => { 
        if (error) {
            console.log(error);
            return;
        }
        
        var responses   = [];
        var albumData   = [];  
        var albums      = stdout.split('\n');
        
        albums.forEach(function (album) {
            if (album == '')
                return;
            
            var response    = deferred();
            var title       = album.split(' ');
            var year        = title.pop().slice(1, 5);
            title           = title.join(' ');

            responses.push(response.promise);
            discogs.album(title, year, artist)(
                function (data) {
                    albumData.push(data);
                    response.resolve();
                }
            );
        });

        return deferred.apply(null, responses)(function (data) { return response.resolve(albumData); }); 
    });

    return response.promise;
}


function renderMusic(musicData) {
    console.log(musicData);
    
    var html = '';

    return html;
}
