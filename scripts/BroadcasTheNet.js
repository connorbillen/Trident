var http        = require('http');
var deferred    = require('deferred');
var config      = require('../config');

function searchForTVShow(title) {
    var response = deferred();
    
    var postData = JSON.stringify({
        'method': 'getTorrents',
        'params': [ config[config.tvshows].key, // '35348e9ad7f0f66b32cc1c799271d110', 
                  [ { 'series': title, 'category': 'Season' }], 
                  10, 0],
        'id': 'example1'
    });

    var postOptions = {
        host: config[config.tvshows].host, // 'api.btnapps.net',
        port: config[config.tvshows].port, // 80
        path: config[config.tvshows].path, // '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var postRequest = http.request(postOptions, function(res) {
        var json = ''

        res.on('data', function(chunk) {
            json += chunk;
        });

        res.on('end', function() {
            response.resolve(json);
        });

        res.on('error', function(error) {
            console.log(error);
        });
    }).on('error', function(error) {
        console.log(error);
    });

    postRequest.write(postData);
    postRequest.end();

    return response.promise;
}

exports.search = searchForTVShow;
