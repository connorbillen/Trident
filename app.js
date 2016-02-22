// Require necessary modules and build out require global vars
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var api     = require('./API');
app.use(express.static('style'));
app.use(express.static('scripts'));
app.use(express.static('node_modules/bulma'));

// Scan the media content directories for new items
api.listmedia('Music');
// api.listmedia('Movies');
// api.listmedia('TV Shows');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', function(socket) {
        console.log('A frontend client connected...');

        socket.on('query', function(info) {
            api.query(info.cmd, info.options)(function (html) {
                socket.emit('response', html);
            });
        });

        socket.on('view', function(type) {
            api.view(type)(function (html) {
                socket.emit('response', html)
            });
        });

        socket.on('list', function(type) {
            api.listmedia(type)(function (html) {
                socket.emit('response', html);
            });
        });

        socket.on('disconnect', function () {
            console.log('A frontend client disconnected...');
        });
    });

http.listen(8080, function () {
    console.log('HTTP Server started and listening on port 8080...');
});
