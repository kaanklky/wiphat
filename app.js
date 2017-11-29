var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Index
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// Registration
app.get('/register', function(req, res){
    res.sendFile(__dirname + '/register.html');
});

// Stylesheet
app.get('/style', function(req, res){
    res.sendFile(__dirname + '/style.css');
});

// IMGs
app.get('/img/nebuladark.jpg', function(req, res){
    res.sendFile(__dirname + '/img/nebuladark.jpg');
});
app.get('/img/waterdark.jpg', function(req, res){
    res.sendFile(__dirname + '/img/waterdark.jpg');
});

// A nice little cookie handling script
app.get('js/cookie.js', function(req, res){
    res.sendFile(__dirname + '/js/cookies.js');
});

// The font we're using, Arca Majora
app.get('/am.otf', function(req, res){
    res.sendFile(__dirname + '/am.otf');
});

// The fancy little "ping sound"
app.get('/tagged.mp3', function(req, res){
    res.sendFile(__dirname + '/served.mp3');
});
app.get('/jquery', function(req, res){
    res.sendFile(__dirname + '/js/jquery.js');
});

io.on('connection', function(socket){

    // When a client sends a message
    socket.on('chat message', function(data){

        // Broadcast it to everyone in the same room as the client
        io.in(data.room).emit('chat message', data);

        // If the message starts with "@", the user wants to tag someone
        if(data.message.indexOf("@") > -1) {
            var tagged = data.message.match(/@\w+/g);
            tagged[0] = tagged[0].substr(1);
            data2 = {
                tagged : tagged[0],
                tagger : data.name
            }
            io.in(data.room).emit('tagged', data2);
        }
    });

    // When a new user joins, we add them to their desired room
    socket.on('new user', function(data){
        var name = data.name;
        var room = data.room;
        socket.join(room);
        data2 = {
            name : "server",
            room : data.room,
            message : '"' + name + '"' + ' joined the room.'
        };

        // Tell everyone in the room that the new client joined
        io.in(data.room).emit('chat message', data2);
    });

    // When a client wants to connect to a room
    socket.on('connect to room', function(room) {
        socket.join(room);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});