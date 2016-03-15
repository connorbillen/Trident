var exec        = require('child_process').exec;
var deferred    = require('deferred');
var config      = require('../config');

module.exports = function (error, stdout, stderr, path) {
    if (error) {
        console.log(stderr);
        return;
    }
  
    var response    = deferred();
    var moviefile   = stdout.split('\n')[0];
    
    if (moviefile == '') {
        console.log('Error: No movie file found in content directory');
        return;
    }

    exec('ffmpeg -i "' + path + '/' + moviefile + 
         '" -c:v libvpx http://localhost:8090/feed1.ffm',
        function(error, stdout, stderr) {
            if (error) {
                console.log(stderr);
                return;
            }
        });

    response.resolve('<video id="video" width="640" height="480" controls>' +
                        '<source src="http://localhost:8090/stream.webm" type="video/webm">' +
                        'Your browser does not support the video tag.' +
                     '</video>');

    return response.promise;
}
