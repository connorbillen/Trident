var deferred    = require('deferred');
var request     = require('request');
var config      = require('../config');

function artist(name) {
    var response = deferred();

    var query = config.discogs.host + 'q=' + encodeURI(name) + '&type=artist&token=' + config.discogs.token;

    request({ url: query, headers: { 'User-Agent': 'Trident' } }, 
        function (error, res, body) {
            if (error) {
                console.log('error: ' + error);
                return;
            }
            
            response.resolve(JSON.parse(body).results[0]);
        }
    );

    return response.promise;
}

function album(name, year, artist) {
    var response = deferred();

    var query = config.discogs.host + 'artist=' + encodeURI(artist) + '&release_title=' + encodeURI(name) + 
                '&year=' + year + '&type=release&token=' + config.discogs.token;

    request({ url: query, headers: { 'User-Agent': 'Trident' } }, 
        function (error, res, body) {
            if (error) {
                console.log('error: ' + error);
                return;
            }
            
            response.resolve(JSON.parse(body).results[0]);
        }
    );

    return response.promise;
}

exports.artist  = artist;
exports.album   = album;
