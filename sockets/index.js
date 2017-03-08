module.exports = function(app) {

  var io = require('socket.io')(app, {path: '/fake-news/'});

  var CommonHandler = require('./handlers/Common');
  var GameManager = require('../lib/GameManager');

  io.on('connection', function (socket) {

    console.log("Player connection", socket.id)

    // Create event handlers for this socket
    var eventHandlers = {
        common: new CommonHandler(io, socket)
    };

    // Bind events to handlers
    for (var category in eventHandlers) {
        var handler = eventHandlers[category].handler;
        for (var event in handler) {
            socket.on(event, handler[event]);
        }
    }

    socket.send(socket.id);

  });

  console.log('emerging-citizens: socket.io inititalized');

};