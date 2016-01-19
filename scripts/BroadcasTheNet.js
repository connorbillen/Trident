var http        = require('http');
var deferred    = require('deferred');
var config      = require('../config');

function searchForTVShow(title) {
    var postData = JSON.stringify({
        'method': 'getTorrents',
        'params': ['35348e9ad7f0f66b32cc1c799271d110', 
                  [ { 'series': title, 'category': 'Season' }], 
                  10, 0],
        'id': 'example1'
    });

    var postOptions = {
        host: 'api.btnapps.net',
        port: '80',
        path: '/',
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
            console.log(json);
        });

        res.on('error', function(error) {
            console.log(error);
        });
    }).on('error', function(error) {
        console.log(error);
    });

    postRequest.write(postData);
    postRequest.end();
}

searchForTVShow('Adventure Time');

exports.search = searchForTVShow;
