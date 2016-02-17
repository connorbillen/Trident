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
       
        console.log('ARTIST: ' + artist);
        var response = deferred();
        responses.push(response.promise);

        discogs.artist(artist)(
            function (data) {
                musicData.push(data);
                response.resolve();
            }
        );
        
        // exec('ls ' + config.musicpath + artist, function (error, stdout, stderr) { processAlbums(artist, error, stdout, stderr); });
    });

    return deferred.apply(null, responses)(function (data) { renderMusic(musicData); });
};

function processAlbums(artist, error, stdout, stderr) {
    if (error) {
        console.log(stderr);
        return;
    }
    
    var albums = stdout.split('\n');

    albums.forEach(function (album) {
        if (album == '')
            return;
        
        var title   = album.split(' ');
        var year    = title.pop().slice(1, 5);
        title       = title.join(' ');

        discogs.album(title, year, artist)(
            function (data) {
                console.log(data);
            }
        );
    });
}


function renderMusic(musicData) {
    console.log(musicData);
    
    var html = '';

    return html;
}
