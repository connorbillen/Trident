var mongoose = require('mongoose');

// tvshowmodel schema
var tvshowSchema = mongoose.Schema({
        name: String,
        poster: String,
        plot: String
    });

module.exports = mongoose.model('TVShow', tvshowSchema);
