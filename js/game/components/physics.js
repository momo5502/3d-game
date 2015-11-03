(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.physics = {};

  var collisionMeshes = [];
  GAME.physics.addCollisionMesh = function(mesh)
  {
    if (collisionMeshes.indexOf(mesh) == -1)
    {
      collisionMeshes.push(mesh);
    }
  };

  GAME.physics.init = function()
  {
    GAME.DATA.world = new CANNON.World();
    GAME.DATA.world.gravity.set(0, GAME.const.gravity, 0);
    GAME.DATA.world.broadphase = new CANNON.NaiveBroadphase();
    GAME.DATA.world.solver.iterations = 10;
  }

  GAME.physics.update = function()
  {
    GAME.DATA.world.step(/*GAME.var.frameDelta / 1000*/ 1 / 60);
    GAME.camera.syncCollider();
  };

  // TODO: Check for each vertex in the camera collider
  GAME.physics.collides = function(objectOrigin, target)
  {
    // First filter the objects that are not worth being checked cause of being to far away
    var meshes = [];

    var direction = new THREE.Vector3(target.x, target.y, target.z);
    direction.sub(objectOrigin);
    var length = (direction.length() + 10);

    for (var i = 0; i < collisionMeshes.length; i++)
    {
      var checkVector = collisionMeshes[i].position.clone();
      checkVector.sub(objectOrigin);

      // Direction is ommitted for now
      if ( /*angleTo2d(direction, checkVector) < 90 &&*/ checkVector.length() <= (length * 10)) // Maybe 10 is too low or high?
      {
        meshes.push(collisionMeshes[i]);
      }
    }

    // Then actually compare the faces to the vector
    var ray = new THREE.Raycaster(objectOrigin, direction.clone().normalize());
    var collisionResults = ray.intersectObjects(meshes);

    for (var i = 0; i < collisionResults.length; i++)
    {
      if (collisionResults[i].distance <= length)
      {
        return true;
      }
    }

    return false;
  };

  function angleTo2d(vector1, vector2)
  {
    return vector1.clone().setY(0).angleTo(vector2.clone().setY(0)) * (180 / Math.PI);
  }
})();
