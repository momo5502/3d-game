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

    if(ENGINE.network.socket != undefined)
    {
      ENGINE.network.socket.ticket.close();
      ENGINE.network.socket.destroy();
    }

    ENGINE.network.server = server;
    ENGINE.network.socket = io.connect(ENGINE.network.server);
    ENGINE.network.socket.ticket = ticket;
    ticket.socket = ENGINE.network.socket;
    console.log(ENGINE.network.socket);

    ENGINE.network.socket.on('connect', function()
    {
      ENGINE.console.log("Connected to server.");
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

    ENGINE.network.socket.on('user_connect', function(data)
    {
      ENGINE.console.log("User connected: " + data);
    });

    ENGINE.network.socket.on('user_disconnect', function(data)
    {
      ENGINE.console.log("User diconnected: " + data);
    });

    /*
    ENGINE.network.socket.on('error', function(data)
    {
      ENGINE.console.log("Error");
    });
    */

    ENGINE.network.socket.on('connect_error', function(err)
    {
      ENGINE.console.log("Server connection timed out.");
      ticket.close();
    });

    return ticket;
  }
})();
