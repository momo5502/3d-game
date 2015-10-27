(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.controls = {};
  ENGINE.controls.pointer = {};

  ENGINE.controls.key = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,

    W: 87,
    A: 65,
    S: 83,
    D: 68,

    T: 84,

    F5: 116
  };

  var actions = [];
  var keyDown = [];

  ENGINE.controls.runKey = function(key)
  {
    if (actions[key] != undefined)
    {
      actions[key].run();
    }
  }

  ENGINE.controls.isKeyDown = function(key)
  {
    return (keyDown[key] != undefined && keyDown[key]);
  }

  ENGINE.controls.pointer.callbacks = new ENGINE.callbackHandler();

  ENGINE.controls.pointer.onMove = function(callback)
  {
    ENGINE.controls.pointer.callbacks.add(callback);
  };

  ENGINE.controls.pointer.dispatchMovement = function(event)
  {
    var point = {};

    point.x = event.movementX ||
      event.mozMovementX ||
      event.webkitMovementX ||
      0;

    point.y = event.movementY ||
      event.mozMovementY ||
      event.webkitMovementY ||
      0;

    ENGINE.controls.pointer.callbacks.run(event, point);
  };

  ENGINE.controls.pointer.isLockedTo = function(element)
  {
    return document.pointerLockElement === element ||
      document.mozPointerLockElement === element ||
      document.webkitPointerLockElement === element;
  };

  ENGINE.controls.pointer.lock = function(element)
  {
    ENGINE.controls.pointer.element = element;

    element.requestPointerLock = element.requestPointerLock ||
      element.mozRequestPointerLock ||
      element.webkitRequestPointerLock;

    $(element).click(function()
    {
      if (!ENGINE.controls.pointer.isLockedTo(element))
      {
        ENGINE.console.log("Requesting pointer lock...");
        element.requestPointerLock();
      }
    });

    $(element).mousemove(function(event)
    {
      if (ENGINE.controls.pointer.isLockedTo(element))
      {
        ENGINE.controls.pointer.dispatchMovement(event.originalEvent);
      }
    });

    ENGINE.controls.pointer.unlock = function()
    {
      document.exitPointerLock = document.exitPointerLock ||
        document.mozExitPointerLock ||
        document.webkitExitPointerLock;

      document.exitPointerLock();
    }
  };

  ENGINE.controls.pointer.lockChanged = function()
  {
    if (ENGINE.controls.pointer.element != undefined)
    {
      if (ENGINE.controls.pointer.isLockedTo(ENGINE.controls.pointer.element))
      {
        ENGINE.console.log("Pointer locked.");
      }
      else
      {
        ENGINE.console.log("Pointer unlocked.");
      }
    }
  };

  ENGINE.controls.assign = function(key, callback)
  {
    if (actions[key] == undefined)
    {
      actions[key] = new ENGINE.callbackHandler();
    }

    actions[key].add(callback);
  };

  $(window).keydown(function(event)
  {
    event.preventDefault();
    keyDown[event.keyCode] = true;

    console.log(event);
    ENGINE.controls.runKey(event.keyCode);
  });

  $(window).keyup(function(event)
  {
    event.preventDefault();
    keyDown[event.keyCode] = false;
  });

  // Install pointer lock listener
  if ("onpointerlockchange" in document)
  {
    document.addEventListener('pointerlockchange', ENGINE.controls.pointer.lockChanged, false);
  }
  else if ("onmozpointerlockchange" in document)
  {
    document.addEventListener('mozpointerlockchange', ENGINE.controls.pointer.lockChanged, false);
  }
  else if ("onwebkitpointerlockchange" in document)
  {
    document.addEventListener('webkitpointerlockchange', ENGINE.controls.pointer.lockChanged, false);
  }
})();
