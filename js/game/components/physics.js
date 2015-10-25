(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.physics = {};

  GAME.physics.computationWorker = function()
  {
    GAME.physics.compute();
    GAME.DATA.scene.simulate(undefined, 1);
  };

  GAME.physics.compute = function() {

  };

  GAME.physics.init = function()
  {
    GAME.DATA.scene.setGravity(GAME.const.gravityVector);
    GAME.DATA.scene.addEventListener(
      'update',
      GAME.physics.computationWorker
    );
  }
})();
