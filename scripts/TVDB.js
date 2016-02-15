var request     = require('request');
var deferred    = require('deferred');
var config      = require('../config');
var token       = ''

request.post({ url: config.tvdb.host + config.tvdb.path + 'login', json: { apikey: config.tvdb.key }},
    function (err, response, body) {
        if (err) {
            console.log(err);
            return;
        }

        console.log(body);
        token = JSON.parse(body).token;
    }
);

function searchSeries(title) {
    var response = deferred();

    request({ url: ocnfig.tvdb.host + config.tvdb.path + '/search/' + title, headers: { 'Authorizaton': 'Bearer ' + token }},
        function (err, res, body) {
            console.log(body);
        }
    );

    return response.promise;
}

exports.search = searchSeries;
