(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.frame = function()
  {
    GAME.var.frameNewTime = Date.now();
    GAME.var.frameDelta = GAME.var.frameNewTime - GAME.var.frameOldTime;
    GAME.var.frameOldTime = GAME.var.frameNewTime;

    GAME.controls.update();
    GAME.particles.update();
    GAME.butterfly.update();
    GAME.trees.update();
    GAME.grass.update();
    GAME.rays.update();

    GAME.camera.update();

    GAME.players.update();

    GAME.DATA.renderer.render(GAME.DATA.scene, GAME.DATA.camera);
  };
})();
