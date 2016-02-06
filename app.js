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

        socket.on('query', function(info) {
            api.query(info.cmd, info.options)(function (html) {
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
