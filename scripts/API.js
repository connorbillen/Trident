var http        = require('http');
var deferred    = require('deferred');

var cpKey       = '5b33f28344174ff683b9e04d89e58f2a';
var sbKey       = '6580a1ce694ec2b079ef8eaa9cdee621';
var hpKey       = 'cf2b3fd4df738e1f0789b9061b25dacf';

var host        = '10.0.0.8';

var cpPort      = '5050';
var sbPort      = '5051';
var hpPort      = '5052';

var cpPath       = '/api/' + cpKey + '/';
var sbPath       = '/api/' + sbKey + '/?cmd=';
var hpPath       = '/api?apikey=' + hpKey + '&cmd=';

// TV functions
function addTVSeason(tvdbid, season) {
    var response = deferred();
    http.request({ 'host': host, 'port': sbPort, 'path': sbPath + 'episode.search&tvdbid=' + tvdbid + '&season=' + season },
        function processAddTVSeason(data) {
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

function getTVShow(tvdbid) {
    var response = deferred();

    http.request({ 'host': host, 'port': sbPort, 'path': sbPath + 'show.addnew&tvdbid=' + tvdbid },
        function processGetTVShow(data) {
            var json = '';

            data.on('data', function(chunk) {
                json += chunk;
            });

            data.on('end', function() {
                addTVShow(tvdbid)(function (json) {
                    response.resolve(json);
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

function addTVShow(tvdbid) {
    var response = deferred();

    http.request({ 'host': host, 'port': sbPort, 'path': sbPath + 'show&tvdbid=' + tvdbid },
        function processTVShowAdd(data) {
            var json = '';
            
            data.on('data', function(chunk) {
                json += chunk;
            });

            data.on('end', function() {
                response.resolve(json);
            });

            data.on('error', function(error) {
                console.log(error);
            });
        }).on('error', function(error) {
            console.log(error);
        }).end();;
    
    return response.promise;
}

function searchForTVShow(title) {
    var response = deferred();

    console.log('Searching for: ' + title);

    http.request({ 'host': host, 'port': sbPort, 'path': sbPath + 'sb.searchtvdb&name=' + title + '&lang=en'},
        function processTVSearch(data) {
            var json = '';
            
            data.on('data', function(chunk) {
                json += chunk;
            });

            data.on('end', function() {
                response.resolve(json);
            });

            data.on('error', function(error) {
                console.log(error);
            });
        }).on('error', function(error) {
        }).end();;
    

    return response.promise;
}

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

    console.log('Searching for: ' + artist);

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

    console.log('Searching for: ' + title);

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

exports.searchForTVShow = searchForTVShow;
exports.getTVShow       = getTVShow;
exports.addTVSeason     = addTVSeason;
