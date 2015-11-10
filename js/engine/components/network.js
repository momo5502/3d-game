(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.network = {};

  var listeners = [];

  ENGINE.network.on = function(event, callback)
  {
    var handler = listeners[event];

    if (handler == undefined)
    {
      handler = new ENGINE.callbackHandler();

      handler.distinctCallback = function(data)
      {
        handler.run(data, ENGINE.network.socket);
      };

      listeners[event] = handler;
    }

    handler.add(callback);

    if (ENGINE.network.socket != undefined && !isExceptionedEvent(event))
    {
      ENGINE.network.socket.on(event, handler.distinctCallback);
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

    ENGINE.network.socket.on('connect', function(data)
    {
      ENGINE.console.log("Connected to server.");
      ticket.close();

      runCallbacks('connect', data);
    });

    ENGINE.network.socket.on('reconnect', function(data)
    {
      ENGINE.console.log("Reconnected to server.");
      ENGINE.notify.info("Reconnected to server.");
      ticket.close();

      runCallbacks('reconnect', data);
    });

    ENGINE.network.socket.on('disconnect', function(data)
    {
      ENGINE.console.log("Disconnected from server. Reconnecting...");
      ENGINE.notify.error("Lost connection to server");
      runCallbacks('disconnect', data);
    });

    ENGINE.network.socket.on('connect_error', function(err)
    {
      ENGINE.console.log("Server connection timed out.");
      ticket.close();

      runCallbacks('connect_error', err);
    });

    return ticket;
  };

  /****************************/
  /*      Misc functions      */
  /****************************/

  function isExceptionedEvent(event)
  {
    return (event == 'connect' || event == 'reconnect' || event == 'disconnect' || event == 'connect_error');
  }

  function runCallbacks(event, object)
  {
    if (listeners[event] != undefined)
    {
      listeners[event].distinctCallback(object);
    }
  }

  function registerListeners(socket)
  {
    for (var key in listeners)
    {
      socket.on(key, listeners[key].distinctCallback);
    }
  }
})();
