(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};
  window.GAME.DATA = window.GAME.DATA ||
  {};

  GAME.camera = {};

  GAME.camera.init = function()
  {
    GAME.DATA.camera = new THREE.PerspectiveCamera(GAME.const.cameraFov, ENGINE.NULL, 1, 20000);
    GAME.DATA.camera.position.z = 0;
    GAME.DATA.camera.position.y = GAME.const.cameraHeightOffset;
    GAME.DATA.scene.add(GAME.DATA.camera);
    GAME.camera.camera = GAME.DATA.camera;

    GAME.camera.collider = new THREE.Mesh /*Physijs.BoxMesh*/ (new THREE.BoxGeometry(15, GAME.const.cameraHeightOffset, 15));
    GAME.camera.collider.visible = false;
    //GAME.camera.collider.setCcdMotionThreshold(1);
    GAME.camera.moveColliderToCamera();

    GAME.camera.collider.addEventListener('collision', GAME.camera.collides);

    GAME.DATA.scene.add(GAME.camera.collider);
  };

  GAME.camera.moveColliderToCamera = function()
  {
    GAME.camera.collider.position.x = GAME.DATA.camera.position.x;
    GAME.camera.collider.position.y = GAME.DATA.camera.position.y - (GAME.const.cameraHeightOffset / 2 - 10); // Camera is the head
    GAME.camera.collider.position.z = GAME.DATA.camera.position.z;

    GAME.camera.collider.__dirtyPosition = true;
  };

  GAME.camera.moveCameraToCollider = function()
  {
    GAME.camera.camera.position.x = GAME.camera.collider.position.x;
    GAME.camera.camera.position.y = GAME.camera.collider.position.y + (GAME.const.cameraHeightOffset / 2 - 10); // Camera is the head
    GAME.camera.camera.position.z = GAME.camera.collider.position.z;
  };

  GAME.camera.lookAt = function(target)
  {
    // As the target is relative to the camera,
    // not relative to the collider (it will be, but still handle it separately),
    // adjust the camera to the normalized target
    GAME.DATA.camera.lookAt(normalizeTarget(target, GAME.DATA.camera));

    // Then copy the rotation to the collider
    GAME.camera.collider.rotation = GAME.DATA.camera.rotation;
    GAME.camera.collider.__dirtyRotation = true;

    // Then rotate the camera
    GAME.DATA.camera.lookAt(target);
  };

  // Movement
  GAME.camera.moveForward = function()
  {
    GAME.camera.collider.translateZ(translateMovementToFrame(-GAME.const.cameraSpeed));
    GAME.camera.collider.__dirtyPosition = true;
  };

  GAME.camera.moveBackward = function()
  {
    GAME.camera.collider.translateZ(translateMovementToFrame(GAME.const.cameraSpeed));
    GAME.camera.collider.__dirtyPosition = true;
  };

  GAME.camera.moveLeft = function()
  {
    GAME.camera.collider.translateX(translateMovementToFrame(-GAME.const.cameraSpeed));
    GAME.camera.collider.__dirtyPosition = true;
  };

  GAME.camera.moveRight = function()
  {
    GAME.camera.collider.translateX(translateMovementToFrame(GAME.const.cameraSpeed));
    GAME.camera.collider.__dirtyPosition = true;
  };

  GAME.camera.update = function()
  {
    GAME.var.cameraTargetLat = Math.max(-GAME.const.cameraMaxAngle, Math.min(GAME.const.cameraMaxAngle, GAME.var.cameraTargetLat));
    GAME.var.cameraTargetPhi = THREE.Math.degToRad(90 - GAME.var.cameraTargetLat);
    GAME.var.cameraTargetTheta = THREE.Math.degToRad(GAME.var.cameraTargetLon);

    GAME.var.cameraTarget.x = GAME.DATA.camera.position.x + 500 * Math.sin(GAME.var.cameraTargetPhi) * Math.cos(GAME.var.cameraTargetTheta);
    GAME.var.cameraTarget.y = GAME.DATA.camera.position.y + 500 * Math.cos(GAME.var.cameraTargetPhi);
    GAME.var.cameraTarget.z = GAME.DATA.camera.position.z + 500 * Math.sin(GAME.var.cameraTargetPhi) * Math.sin(GAME.var.cameraTargetTheta);

    GAME.camera.lookAt(GAME.var.cameraTarget);

    // TODO: Use constraints
    GAME.camera.moveCameraToCollider();
  };

  GAME.camera.collides = function(other_object, relative_velocity, relative_rotation, contact_normal)
  {
    ENGINE.console.log("Colliding!");
  }

  function translateMovementToFrame(value)
  {
    var speed = value; // this should be the speed at 60fps
    speed /= 1000 / 60;
    speed *= GAME.var.frameDelta;

    return speed;
  }

  function normalizeTarget(target, targetObject)
  {
    return (new THREE.Vector3()).copy(target).setY(targetObject.position.y);
  }
})();
