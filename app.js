var express = require('express');
var app = express();
var path = require('path')
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

// Index
app.get('/', function(req, res){
    res.sendFile(__dirname + '/register.html');
});

// Chat page block
app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/register.html');
});

// Chat to room
app.get('/chat/((?:[a-z0-9]*))', function(req, res){
    res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket){

    // When a client sends a message
    socket.on('chat message', function(data){

        // Broadcast it to everyone in the same room as the client
        io.in(data.room).emit('chat message', data);
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
