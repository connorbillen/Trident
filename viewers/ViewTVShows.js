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

        html += '<div class="columns">';
        tvshows.forEach(function (tvshow) {
            console.log(tvshow);

            html += '<div class="column">';
            html += '<img class="tvshow" src="">';
            html += '<div class="tvshow-name-container>';
            html += '</div>';
            html += '</div>';
        });
        html += '</div>';

        for (var i = 0; i < 4 - (tvshows.length % 4); i++) {
            html += '<div class="column"</div>';
        }

        html += '</div>';

        response.resolve(html);
    });

    return response.promise;
};
