var mongoose = require('mongoose');

// moviemodel schema
var movieSchema = mongoose.Schema({
        name: String,
        poster: String,
        genre: String,
        plot: String,
        actors: String,
        rating: String,
        year: Date,
    });

module.exports = mongoose.model('Movie', movieSchema);
