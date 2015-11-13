(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  // Register commands here

  ENGINE.command.add("reset", function(params)
  {
    if (params.length < 2) return;

    ENGINE.dvars.reset(params[1]);
  });
})();
