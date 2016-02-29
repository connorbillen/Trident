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
            console.log(tvshow);

            html += '<div class="columns">';
            html += '<img class="tvshow" src="' + tvshow.banner + '">';
            html += '</div>';
        });
        
        /*
        for (var i = 0; i < 4 - (tvshows.length % 4); i++) {
            html += '<div class="column"</div>';
        }

        html += '</div>';
        */

        response.resolve(html);
    });

    return response.promise;
};
