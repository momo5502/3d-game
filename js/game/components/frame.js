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
    GAME.trees.update();
    GAME.grass.update();
    GAME.rays.update();

    GAME.var.cameraTargetLat = Math.max(-GAME.const.cameraMaxAngle, Math.min(GAME.const.cameraMaxAngle, GAME.var.cameraTargetLat));
    GAME.var.cameraTargetPhi = THREE.Math.degToRad(90 - GAME.var.cameraTargetLat);
    GAME.var.cameraTargetTheta = THREE.Math.degToRad(GAME.var.cameraTargetLon);

    GAME.var.cameraTarget.x = GAME.DATA.camera.position.x + 500 * Math.sin(GAME.var.cameraTargetPhi) * Math.cos(GAME.var.cameraTargetTheta);
    GAME.var.cameraTarget.y = GAME.DATA.camera.position.y + 500 * Math.cos(GAME.var.cameraTargetPhi);
    GAME.var.cameraTarget.z = GAME.DATA.camera.position.z + 500 * Math.sin(GAME.var.cameraTargetPhi) * Math.sin(GAME.var.cameraTargetTheta);

    GAME.DATA.camera.lookAt(GAME.var.cameraTarget);

    GAME.DATA.renderer.render(GAME.DATA.scene, GAME.DATA.camera);
  };
})();
