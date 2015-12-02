var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userQ = [];

io.on('connection', function(socket){
  var roomId;

  console.log('a user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected');
  })

  socket.on('help', function(userName) {
    roomId = userName;
    socket.join(roomId);

    userQ.push({userName: userName, roomId: roomId});
    io.emit('support queue updated', userQ);
  });

  socket.on('join', function(roomIdToJoin) {
    socket.join(roomIdToJoin);

    // remove user from q
    var userToRemove = userQ.filter(function(user) {
      return user.roomId === roomIdToJoin;
    })[0];
    var userIndex = userQ.indexOf(userToRemove);
    userQ.splice(userIndex, 0);

    // tell all admins to upddate their local Q
    io.emit('support queue updated', userQ);

    // let the user know the handshake has succeeded
    io.to(roomIdToJoin).emit('help has arrived');
  });

  socket.on('chat message', function(roomId, msg) {
    io.to(roomId).emit('chat message', msg);
  })


  // separate socket handler for admin view
  socket.on('admin joined', function() {
    io.emit('support queue updated', userQ);
  });

});

http.listen(3333, function(){
  console.log('listening on :3333');
});


/*

- client requests help
- client creates random room, server passes that room info to admin
- admin joins that room

questions:


*/
