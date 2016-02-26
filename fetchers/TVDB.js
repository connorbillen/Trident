'use strict';
var request     = require('request');
var deferred    = require('deferred');
var config      = require('../config');

class TVDB {
    constructor() {
        this.token = '';
    }

    setToken(token) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }

    show(title) {
        var response = deferred();
        var token = this.token;

        request({ url: config.tvdb.host + config.tvdb.path + 'search/series?name=' + encodeURI(title), 
                  headers: { 'Authorization': 'Bearer ' + token }},
            function (err, res, body) {
                if (err) {
                    console.log(err);
                    return;
                }
                
                response.resolve(JSON.parse(body).data[0]);
            }
        );

        return response.promise;
    }

    episode(id, season, episode) {
        var response = deferred();
        var token = this.token;

        request({ url: config.tvdb.host + config.tvdb.path + '/series/' + id + '/episodes/query?' +
                       'airedSeason=' + uriEncode(season) + '&airedEpisode=' + uriEncode(episode) },
            function(err, res, body) {
                if (err) {
                    console.log(err);
                    return;
                }

                console.log(body);
            }
        );

        return response.promise;
    }
}

var tvdb = new TVDB();

request.post({ url: config.tvdb.host + config.tvdb.path + 'login', json: { apikey: config.tvdb.key }},
    function (err, response, body) {
        if (err) {
            console.log(err);
            return;
        }
        
        console.log(body);

        tvdb.setToken(body.token);
    }
);

exports.tvdb = tvdb;
