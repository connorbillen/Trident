var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');
var tvdb        = require('../fetchers/TVDB').tvdb;
var mongoose    = require('mongoose');
var tvshowModel = require('../schemas/tvshowModel');

module.exports = function processTVShows(error, stdout, stderr) {
    if (error) {
        console.log(error);
        return;
    }
    
    var tvshows     = stdout.split('\n');
    var tvshowsData = [];
    var responses   = [];

    tvshows.forEach(function (tvshow) {
        if (tvshow == '')
            return;

        var response = deferred();
        responses.push(response.promise);

        tvdb.show(encodeURI(tvshow))(
            function(data) {
                tvshowsData.push(data);
                response.resolve();
            }
        );
    });

    deferred.apply(null, responses)(function (data) { storeTVShows(tvshowsData); });
};

function storeTVShows(tvshowsData) {
    var response = true;
    
    var data = parseTVShowData(tvshowsData);
    tvshowModel.remove({}, function (err) {});
     
    data.forEach(function(tvshow) {
        tvshow.save(function (err, tvshow) {
            if (err) { 
                return console.error(err);
                response = false;
            }
        });
    });

    return response;
}

function parseTVShowData(tvshowsData) {
    var parsedData = [];

    tvshowsData.forEach(function (tvshow) {
        var tvshowData = new tvshowModel({
            name: tvshow.seriesName,
            banner: 'https://thetvdb.com/banners/' + tvshow.banner,
            plot: tvshow.overview
        });

        parsedData.push(tvshowData);
    });
    
    return parsedData;
}
