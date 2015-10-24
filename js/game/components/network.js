(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.network = {};

  GAME.network.init = function()
  {
    ENGINE.network.on('user_connect', function(data)
    {
      ENGINE.console.log("User connected: " + data);
    });

    ENGINE.network.on('user_disconnect', function(data)
    {
      ENGINE.console.log("User disconnected: " + data);
    });
  };

  GAME.network.authenticate = function(username)
  {
    ENGINE.network.send("authenticate", username);
  };
})();
