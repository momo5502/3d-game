(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.network = {};

  var listeners = [];

  ENGINE.network.on = function(event, callback)
  {
    var distinctCallback = function(data)
    {
      callback(data, ENGINE.network.socket);
    };

    listeners[event] = distinctCallback;

    if (ENGINE.network.socket != undefined)
    {
      ENGINE.network.socket.on(event, distinctCallback);
    }
  };

  ENGINE.network.send = function(event, data)
  {
    if (ENGINE.network.socket != undefined)
    {
      ENGINE.network.socket.emit(event, data);
    }

    return undefined;
  }

  ENGINE.network.connect = function(server)
  {
    ENGINE.console.log("Connecting to server: " + server);
    var ticket = new ENGINE.ticket("network");

    if (ENGINE.network.socket != undefined)
    {
      ENGINE.network.socket.ticket.close();
      ENGINE.network.socket.destroy();
    }

    ENGINE.network.server = server;
    ENGINE.network.socket = io.connect(ENGINE.network.server);
    ENGINE.network.socket.ticket = ticket;
    ticket.socket = ENGINE.network.socket;

    registerListeners(ENGINE.network.socket);

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

    ENGINE.network.socket.on('error', function(data)
    {
      ENGINE.console.log("Error");
      console.log(data);
    });

    ENGINE.network.socket.on('connect_error', function(err)
    {
      ENGINE.console.log("Server connection timed out.");
      ticket.close();
    });

    return ticket;
  };

  /****************************/
  /*      Misc functions      */
  /****************************/

  function registerListeners(socket)
  {
    for (var key in listeners)
    {
      socket.on(key, listeners[key]);
    }
  }
})();
