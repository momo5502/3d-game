(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.controls = {};

  GAME.controls.initMouse = function()
  {
    ENGINE.controls.pointer.onMove(function(event, point)
    {
      GAME.var.cameraTargetLon += point.x * 0.1;
      GAME.var.cameraTargetLat -= point.y * 0.1;
    });
  };

  GAME.controls.update = function()
  {
    if (ENGINE.controls.isKeyDown(ENGINE.controls.key.UP) || ENGINE.controls.isKeyDown(ENGINE.controls.key.W))
    {
      GAME.camera.moveForward();
    }

    if (ENGINE.controls.isKeyDown(ENGINE.controls.key.DOWN) || ENGINE.controls.isKeyDown(ENGINE.controls.key.S))
    {
      GAME.camera.moveBackward();
    }

    if (ENGINE.controls.isKeyDown(ENGINE.controls.key.LEFT) || ENGINE.controls.isKeyDown(ENGINE.controls.key.A))
    {
      GAME.camera.moveLeft();
    }

    if (ENGINE.controls.isKeyDown(ENGINE.controls.key.RIGHT) || ENGINE.controls.isKeyDown(ENGINE.controls.key.D))
    {
      GAME.camera.moveRight();
    }
  };

  GAME.controls.init = function()
  {
    GAME.controls.initMouse();

    ENGINE.controls.assign(ENGINE.controls.key.T, function()
    {
      ENGINE.chat.sendMessage(prompt("Enter a message"));
    });

    // Player jump
    ENGINE.controls.assignSingle(ENGINE.controls.key.Space, GAME.camera.jump);
    ENGINE.controls.assignSingle(ENGINE.controls.key.Num5, GAME.camera.jump);

    var toggleConsole = function()
    {
      ENGINE.menu.toggle("console");
    };

    ENGINE.controls.assignSinglePersistent(ENGINE.controls.key.Tilde, toggleConsole);
    ENGINE.controls.assignSinglePersistent(ENGINE.controls.key.Circonflex, toggleConsole);
    ENGINE.controls.assignSinglePersistent(ENGINE.controls.key.Circonflex2, toggleConsole);
  };
})();
