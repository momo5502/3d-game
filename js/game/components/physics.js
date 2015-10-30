(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.physics = {};

  GAME.physics.init = function()
  {
    GAME.DATA.world = new CANNON.World();
    GAME.DATA.world.gravity.set(0, GAME.const.gravity, 0);
    GAME.DATA.world.broadphase = new CANNON.NaiveBroadphase();
    GAME.DATA.world.solver.iterations = 10;
  }

  GAME.physics.update = function()
  {
    GAME.DATA.world.step(1 / 60);
    GAME.camera.syncCollider();
  };
})();
