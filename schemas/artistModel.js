var mongoose = require('mongoose');

// artistModel schema
var artistSchema = mongoose.Schema({
        name: String,
        profile: String,
        albums: [{ title: String, genre: String, poster: String, year: Date }]
    });

module.exports = mongoose.model('Artist', artistSchema); 
