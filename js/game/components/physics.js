(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.physics = {};

  var collisionMeshes = [];
  GAME.physics.addCollisionMesh = function(mesh)
  {
    if(collisionMeshes.indexOf(mesh) == -1)
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
    GAME.DATA.world.step(1 / 60);
    GAME.camera.syncCollider();
  };

  // TODO: Check for each vertex in the camera collider
  GAME.physics.collides = function(objectOrigin, target)
  {
    var direction = new THREE.Vector3(target.x, target.y, target.z);
    direction.sub(objectOrigin);

    var ray = new THREE.Raycaster(objectOrigin, direction.clone().normalize());
    var collisionResults = ray.intersectObjects(collisionMeshes);

    for(var i = 0;i<collisionResults.length;i++)
    {
      if(collisionResults[i].distance <= (direction.length() + 10))
      {
        return true;
      }
    }

    return false;
  };
})();
