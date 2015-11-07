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

    ENGINE.map.dynents.update(GAME.var.frameDelta);

    GAME.camera.update();
    GAME.players.update();
    GAME.physics.update();

    GAME.DATA.renderer.render(GAME.DATA.scene, GAME.DATA.camera);
  };
})();
