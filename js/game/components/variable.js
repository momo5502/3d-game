(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  window.GAME.DATA = window.GAME.DATA ||
  {};

  GAME.var = {};

  // TODO: Initialize variables here

  // Camera target
  GAME.var.cameraTargetLon = -90;
  GAME.var.cameraTargetLat = 0;
  GAME.var.cameraTargetPhi = 0;
  GAME.var.cameraTargetTheta = 0;
  GAME.var.cameraTarget = new THREE.Vector3();

  GAME.var.frameOldTime = Date.now();
  GAME.var.frameNewTime = Date.now();
  GAME.var.frameDelta = 0;
})();
