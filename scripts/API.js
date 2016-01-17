var http        = require('http');
var deferred    = require('deferred');

var cpKey       = '5b33f28344174ff683b9e04d89e58f2a';
var sbKey       = '';
var hpKey       = 'cf2b3fd4df738e1f0789b9061b25dacf';

var host        = '10.0.0.8';

var cpPort      = '5050';
var sbPort      = '5051';
var hpPort      = '5052';

var cpPath       = '/api/' + cpKey + '/';
var sbPath       = sbKey;
var hpPath       = '/api?apikey=' + hpKey + '&cmd=';

// Music functions
function getAlbumArt(guid) {
    var response = deferred();

    http.request({ 'host': host, 'port': hpPort, 'path': hpPath + 'getAlbumArt&id=' + guid },
        function processAddAlbum(data) {
            var json = '';

            data.on('data', function(chunk) {
                json += chunk;
            });

            data.on('end', function() {
                response.resolve(json);
            }); 

            data.on('error', function (error) {
                console.log(error);
            }); 
        }).on('error', function (error) {
            console.log(error); 
        }).end();

    return response.promise;
}


function addAlbum(guid) {
    var response = deferred();

    http.request({ 'host': host, 'port': hpPort, 'path': hpPath + 'queueAlbum&id=' + guid },
        function processAddAlbum(data) {
            var json = '';

            data.on('data', function(chunk) {
                json += chunk;
            });

            data.on('end', function() {
                response.resolve(json);
            }); 

            data.on('error', function (error) {
                console.log(error);
            }); 
        }).on('error', function (error) {
            console.log(error); 
        }).end();

    return response.promise;
}


function getArtist(guid) {
    var response = deferred();

    http.request({ 'host': host, 'port': hpPort, 'path': hpPath + 'getArtist&id=' + guid },
        function processAddArtist(data) {
            var json = '';

            data.on('data', function(chunk) {
                json += chunk;
            });

            data.on('end', function() {
                json = JSON.parse(json);
                var promises = [];

                json.albums.forEach(function getAlbums(album) {
                    promises.push(getAlbumArt(album.AlbumID).then(function (response) { console.log(response); }));
                });
            
                deferred.apply(null, promises).then(function () { response.resolve(JSON.stringify(json)); });
            }); 

            data.on('error', function (error) {
                console.log(error);
            }); 
        }).on('error', function (error) {
            console.log(error); 
        }).end();

    return response.promise;
}

function addArtist(guid) {
    var response = deferred();

    http.request({ 'host': host, 'port': hpPort, 'path': hpPath + 'addArtist&id=' + guid },
        function processAddArtist(data) {
            var json = '';

            data.on('data', function(chunk) {
                json += chunk;
            });

            data.on('end', function() {
                getArtist(guid)(function (data) {
                    response.resolve(data);
                });    
            }); 

            data.on('error', function (error) {
                console.log(error);
            }); 
        }).on('error', function (error) {
            console.log(error); 
        }).end();

    return response.promise; 
}

function searchForMusic(artist) {
    var response = deferred();

    http.request({ 'host': host, 'port': hpPort, 'path': hpPath + 'findArtist&name=' + artist  + '&limit=5'},
            function processTVRequest(data) {
                var json = '';

                data.on('data', function(chunk) {
                    json += chunk;
                });

                data.on('end', function() {
                    response.resolve(processArtists(json));
                }); 

                data.on('error', function (error) {
                    console.log(error);
                }); 
            }).on('error', function (error) {
                console.log(error); 
            }).end();

    function processArtists(json) {
        var artists = [];
            json = JSON.parse(json);

        for (var artist in json) {
            artists.push(json[artist]);
        };
    
        return JSON.stringify(artists);
    }

    return response.promise;
}

// Movie functions
function searchForMovie(title) {
    var response = deferred();
    
    http.request({ 'host': host, 'port': cpPort,'path': cpPath + 'search/?q=' + title }, 
        function processMovieRequest(data) {
            var json = '';

            data.on('data', function(chunk) {
                json += chunk;
            });

            data.on('end', function() {
                response.resolve(json); 
            });

            data.on('error', function (error) {
                console.log(error);
            });
        }).on('error', function (error) {
            console.log(error);
        }).end();

    return response.promise;
}

function addMovie(title, identifier) {
    var response = deferred();

    http.request({ 'host': host, 'port': cpPort, 'path': cpPath + 'movie.add/?identifier=' + identifier + '&title=' + encodeURI(title) },
            function processMovieAdd(data) {
                var json = '';

                data.on('data', function(chunk) {
                    json += chunk;
                });

                data.on('end', function () {
                    response.resolve(json);
                });

                data.on('error', function (error) {
                    console.log(error);
                });
            }).on('error', function (error) {
                console.log(error);
            }).end();

    return response.promise;
}

exports.searchForMovie  = searchForMovie;
exports.addMovie        = addMovie;

exports.searchForMusic  = searchForMusic;
exports.addArtist       = addArtist;
exports.addAlbum        = addAlbum;
