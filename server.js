
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
  var roomId;

  console.log('a user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected');
  })

  socket.on('help', function() {
    // roomId = Math.random();
    roomId = 'test';

    socket.join(roomId);
    io.emit('add to support queue', roomId);
  });

  socket.on('join', function(roomIdToJoin) {
    socket.join(roomIdToJoin);
    io.to(roomIdToJoin).emit('help has arrived');
    io.to(roomIdToJoin).emit('chat message', 'Hi there, how can I help you?');
  });

  socket.on('chat message', function(msg) {
    io.to('test').emit('chat message', msg);
  })

});



http.listen(3333, function(){
  console.log('listening on :3333');
});
