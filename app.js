var express = require("express");
var app = express();
var path = require("path");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var tools = require('./tools');

app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// globals
var userName, room;

// Index
app.get("/", function(req, res) {
  userName = tools.makeId(4, true);
  room = tools.makeId(10, false );

  res.render('register', { userName: userName, room: room });
});

// Chat room
app.get("^/chat/:id([a-z0-9]{10})", function(req, res) {
  if (typeof userName === 'undefined' || typeof room === 'undefined') {
    res.redirect('/');
  } else {
    res.render('chat', { userName: userName, room: room });
		userName = room = undefined;
  }
});

// Join with url
app.get("^/join/:id([a-z0-9]{10})", function(req, res) {
  userName = tools.makeId(4, true);
  room = req.params.id;

  res.redirect('/chat/' + room);
})

// 404 to all another urls
app.use(function(req, res){
  res.sendStatus(404);
});

io.on("connection", function(socket) {
  // When a client sends a message
  socket.on("chat message", function(data) {
    // To add timestamp to message
    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();

    if (h < 10) {
      h = "0" + h;
    }

    if (m < 10) {
      m = "0" + m;
    }

    // Broadcast it to everyone in the same room as the client
    io.in(data.room).emit("chat message", data);
    // console.log( "[" + data.room + "] " + data.name + " (" + h + "." + m + "): " + data.message);
  });

  // When a new user joins, we add them to their desired room
  socket.on("new user", function(data) {
    var name = data.name;
    var room = data.room;
    socket.join(room);
    data2 = {
      name: "server",
      room: room,
      message: '"' + name + '"' + " joined the room."
    };

    // Tell everyone in the room that the new client joined
    io.in(room).emit("chat message", data2);
    // console.log("[" + room + "] " + data.name + " joined");
  });

  // When a client wants to connect to a room
  socket.on("connect to room", function(room) {
    socket.join(room);
  });
});

http.listen(3000, function() {
  console.log("wiphat started on 3000");
});
