var http        = require('http');
var deferred    = require('deferred');

var cpKey       = '5b33f28344174ff683b9e04d89e58f2a';
var sbKey       = '';
var hpKey       = '';

var host        = '10.0.0.12';

var cpPort      = '5050';
var sbPort      = '5051';
var hpPort      = '5052';

var cpPath       = '/api/' + cpKey + '/';
var sbPath       = sbKey;
var hpPath       = hpKey;


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
