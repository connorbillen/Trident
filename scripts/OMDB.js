var deferred    = require('deferred');
var request     = require('request');

module.exports = function(title, year) {
    var response = deferred();

    request('http://omdbapi.com/?t=' + encodeURI(title) + '&y=' + encodeURI(year) + '&type=movie', 
        function(error, res, body) {
            if (error) {
                console.log(error);
                return;
            }
        
            response.resolve(body);
        }
    );

    return response.promise;
};
