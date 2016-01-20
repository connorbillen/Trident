var http        = require('http');
var deferred    = require('deferred');
var config      = require('../config');

function searchForTVShow(title, count) {
    var response = deferred();
    count = (count ? count : 1)

    var postData = JSON.stringify({
        'method': 'getTorrents',
        'params': [ config[config.tvshows].key, // '35348e9ad7f0f66b32cc1c799271d110', 
                  [ { 'series': title, 'category': 'Season', 'resolution': config[config.tvshows].resolutions, 'source': config[config.tvshows].resolution }], 
                  count, 0],
        'id': 'query'
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
            var obj = JSON.parse(json);
            if (Object.keys(obj.result.torrents).length < obj.result.results) {
                console.log('getting the rest of the results');
                searchForTVShow(title, parseInt(obj.result.results)).then(function(json) {
                    response.resolve(process(json));       
                });
            } else {
                response.resolve(json);
            }
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

// Convert the returned JSON into a usable, organized structure
function process(json) {
    var series  = {};
        json    = JSON.parse(json);

    console.log('processing...');

    for (var torrentId in json.result.torrents) {
        var torrent = json.result.torrents[torrentId];
        if (!series[torrent.Series])
            series[torrent.Series] = {
                'Poster'    : torrent.SeriesPoster,
            };
        if (!series[torrent.Series][torrent.GroupName])
            series[torrent.Series][torrent.GroupName] = {};

        if (!series[torrent.Series][torrent.GroupName][torrent.Resolution])
            series[torrent.Series][torrent.GroupName][torrent.Resolution] = [];

        series[torrent.Series][torrent.GroupName][torrent.Resolution].push({
            container   : torrent.Container,
            source      : torrent.Source,
            size        : Math.floor((torrent.Size / 1000000000) + .5) + ' GB',
            url         : torrent.DownloadURL
        });
    }

    return render(series);
}

// Render the passed JSON object into an HTML string
function render(json) {
    var html = '';
    
    for (var series in json) {
        html += '<div class="tile">';
        html += '<img class="tvshow-poster" alt="Poster" src="' + json[series].Poster + '">';
        html += '<div class="tvshow-name">' + series + '</div>';
        html += '<div class="seasons-container">';
        for (var season in json[series]) {
            html += '<div class="season">';
            if (season == 'Poster')
                continue;
            
            html += '<div class="season-name" onclick="expand(this.parentNode); ">' + season + '</div>';
            html += '<div class="season-resolution-container">';
            for (var resolution in json[series][season]) {
                html += '<div class="season-resolution">' + resolution + '</div>';
                html += '<div class="season-resolution-download-container">';
                json[series][season][resolution].forEach(function (download) {
                    html += '<div class="season-resolution-download">';
                    html += '<span class="season-resolution-download-information">' + download.container + ' - ' 
                                                                                   + download.source + '-'
                                                                                   + download.size + '</span>';
                    html += '<input class="season-resolution-download-button" type="button" value="Download">'
                    html += '</div>';
                });
                html += '</div>';
            }
            html += '</div>';
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';
    }
    
    return html;
}

exports.search = searchForTVShow;
