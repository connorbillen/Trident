var http        = require('http');
var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');

/* This is where the download-related 
   functions are. Search functions
   are below this sectioin          */ 

// Exported function that is called as the download endpoint for the BroadcasTheNet module
function downloadTVShow(options) {
    var response = deferred();

    var download = exec('wget --no-check-certificate -O "' + config[config.tvshows].watch_dir + options.title + '.torrent" "' + options.url + '"', 
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
function searchForTVShow(title, count) {
    var response = deferred();
    count = (count ? count : 1)

    var postData = JSON.stringify({
        'method': 'getTorrents',
        'params': [ config[config.tvshows].key,
                  [ { 'series': '%' + title + '%', 'category': 'Season', 'resolution': config[config.tvshows].resolutions, 'source': config[config.tvshows].resolution }], 
                  count, 0],
        'id': 'query'
    });

    var postOptions = {
        host: config[config.tvshows].host,
        port: config[config.tvshows].port,
        path: config[config.tvshows].path,
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
                searchForTVShow(title, parseInt(obj.result.results)).then(function(json) {
                    var html = process(json);
                    response.resolve(html);       
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
        html += '<div class="tvshow-download-container">';
        for (var season in json[series]) {
            if (season == 'Poster')
                continue;
            
            html += '<div class="season-name" onclick="expand(this.parentNode); ">' + season + '</div>';
            html += '<div class="container">';
            for (var resolution in json[series][season]) {
                html += '<div class="season-resolution">' + resolution + '</div>';
                html += '<div class="container">';
                json[series][season][resolution].forEach(function (download) {
                    html += '<div class="tvshow-download">';
                    html += '<span class="format">' + download.container + '</span>';
                    html += '<span class="source">' + download.source + '</span>';
                    html += '<br>';
                    html += '<span class="size">' + download.size + '</span>';
                    html += '<input class="tv-download-button" onclick="download(\'TVShow\', \'' 
                            + download.url  + '\', \'' + series + ' - ' + season + '\'); " type="button" value="Download">'
                    html += '</div>';
                });
                html += '</div>';
            }
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';
        html += '</div>';
    }
   
    return html;
}

exports.search      = searchForTVShow;
exports.download    = downloadTVShow;
