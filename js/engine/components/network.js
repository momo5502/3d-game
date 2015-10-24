(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.network = {};


  ENGINE.network.connect = function(server)
  {
    ENGINE.console.log("Connecting to server: " + server);
    var ticket = new ENGINE.ticket("network");

    ENGINE.network.server = server;
    ENGINE.network.socket = io.connect(ENGINE.network.server);

    ticket.socket = ENGINE.network.socket;
    console.log(ENGINE.network.socket);

    var time = Date().now;

    ENGINE.network.socket.on('ping', function(data)
    {
      var newTime = Date.now();
      ENGINE.console.log("Received ping: " + (newTime - time));
      time = newTime;
      ENGINE.network.socket.emit("ping", data);
    });

    ENGINE.network.socket.on('connect', function()
    {
      ENGINE.console.log("Connected to server.");
      ENGINE.network.socket.emit("ping", "test");
      ticket.close();
    });

    ENGINE.network.socket.on('reconnect', function()
    {
      ENGINE.console.log("Reconnected to server.");
      ticket.close();
    });

    ENGINE.network.socket.on('disconnect', function()
    {
      ENGINE.console.log("Disconnected from server. Reconnecting...");
    });

    ENGINE.network.socket.on('connect_error', function(err)
    {
      ENGINE.console.log("Server connection timed out.");
      ticket.close();
    });

    return ticket;
  }
})();
