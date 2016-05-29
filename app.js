// Require necessary modules and build out require global vars
var express     = require('express');
var app         = express();
var http        = require('http').Server(app);
var io          = require('socket.io')(http);
var mongoose    = require('mongoose');
var api         = require('./API');

app.use(express.static('static'));
app.use(express.static('node_modules/bulma'));
app.use(express.static('cache'));

// Connect to the database
var connection  = mongoose.connect('mongodb://localhost/Trident');
var db          = mongoose.connection;

db.on('error', function() { console.error.bing(console, 'connection error:'); });

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/html/index.html');
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
            socket.emit('response', html);
        });
    });
        
    socket.on('list', function(type) {
        console.log(type);
        
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
