// Require necessary modules and build out require global vars
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var api     = require('./scripts/API');
app.use(express.static('style'));
app.use(express.static('scripts'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', function(socket) {
        console.log('A frontend client connected...');

        socket.on('searchForMusic', function(artist) {
            api.searchForMusic(artist)(function (data) {
                socket.emit('searchForMusic', data);
            });
        });

        socket.on('searchForMovie', function(title) {
            api.searchForMovie(title)(function (data) { 
                socket.emit('searchForMovie', data); 
            });
        });
      
        socket.on('getTVShow', function(tvdbid) {
            api.getTVShow(tvdbid)(function (data) {
                console.log(data);
                socket.emit('addTVShow', data);
            });
        });

        socket.on('searchForTVShow', function(title) {
            api.searchForTVShow(title)(function (data) {
                socket.emit('searchForTVShow', data);
            });
        });

        socket.on('addMovie', function(info) {
            api.addMovie(info.title, info.identifier)(function (data) {
                socket.emit('addMovie', data);
            });
        });
        
        socket.on('addArtist', function(guid) {
            api.addArtist(guid)(function (data) {
                socket.emit('addArtist', data);
            });
        });
        
        socket.on('addAlbum', function(guid) {
            api.addAlbum(guid)(function (data) {
                socket.emit('addAlbum', data);
            });
        });

        socket.on('disconnect', function () {
            console.log('A frontend client disconnected...');
        });
    });

http.listen(8080, function () {
    console.log('HTTP Server started and listening on port 8080...');
});
