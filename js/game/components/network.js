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
      ENGINE.console.log("User connected: " + data.name);
      ENGINE.notify.info("User connected: " + data.name);
      GAME.players.add(data.name, data.id);
    });

    ENGINE.network.on('user_disconnect', function(data)
    {
      ENGINE.console.log("User disconnected: " + data.name);
      ENGINE.notify.info("User disconnected: " + data.name);
      GAME.players.remove(data.id);
    });

    ENGINE.network.on('reconnect', function(data)
    {
      GAME.players.clear(); // Maybe do that on disconnect?
      GAME.authentication.request(GAME.DATA.username);
    });

    ENGINE.network.on("playerstates", function(data)
    {
      GAME.players.parseStates(data);
    });

    GAME.DATA.networkLoop = setInterval(GAME.network.loop, 1000 / GAME.const.snaps);
  };

  GAME.network.loop = function()
  {
    GAME.network.transmitPlayerState(GAME.camera.collider.matrix);
  };

  GAME.network.transmitPlayerState = function(matrix)
  {
    ENGINE.network.send("playerstate", matrix.toArray());
  };
})();
