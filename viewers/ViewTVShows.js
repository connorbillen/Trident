var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');
var tvshowModel = require('../schemas/tvshowModel');

module.exports = function processTVShows(error, stdout, stderr) {
    if (error) {
        console.log(stderr);
        return;
    }

    var response = deferred();
    var html = '';

    tvshowModel.find(function(err, tvshows) {
        if (err) {
            console.log(err);
            html += err;
        }

        tvshows.forEach(function (tvshow) {
            html += '<div class="columns">';
            html += '<img class="tvshow" src="' + tvshow.banner + '">';
            html += '</div>';
        });
        
        response.resolve(html);
    });

    return response.promise;
};
