var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');
var tvdb        = require('./TVDB').tvdb;

module.exports = function processTVShows(error, stdout, stderr) {
    if (error) {
        console.log(error);
        return;
    }
    
    var tvshows     = stdout.split('\n');
    var tvshowData  = [];
    var responses   = [];
    tvshows.forEach(function (tvshow) {
        if (tvshow == '')
            return;

        var response = deferred();
        responses.push(response.promise);

        tvdb.show(encodeURI(tvshow))(
            function(data) {
                tvshowData.push(data);
                response.resolve();
            }
        );
    });

    deferred.apply(null, responses)(function (data) { renderTVShows(tvshowData); });
};

function renderTVShows(tvshowData) {
    console.log(tvshowData);
    
    var html = '';

    return html;
}
