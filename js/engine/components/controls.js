(function()
{
	'use strict';
	window.ENGINE = window.ENGINE || {};

  ENGINE.controls = {};
  ENGINE.controls.pointer = {};

  ENGINE.controls.key =
  {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,

    F5: 116
  };

  var actions = [];
  var keyDown = [];

  ENGINE.controls.runKey = function(key)
  {
    if(actions[key] != undefined)
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

    point.x = event.movementX       ||
              event.mozMovementX    ||
              event.webkitMovementX ||
              0;

    point.y = event.movementY       ||
              event.mozMovementY    ||
              event.webkitMovementY ||
              0;

    ENGINE.controls.pointer.callbacks.run(event, point);
  };

  ENGINE.controls.pointer.locked = function(element)
  {
    return document.pointerLockElement === element    ||
           document.mozPointerLockElement === element ||
           document.webkitPointerLockElement === element;
  };

  ENGINE.controls.pointer.lock = function(element)
  {
    element.requestPointerLock = element.requestPointerLock    ||
                                 element.mozRequestPointerLock ||
                                 element.webkitRequestPointerLock;

    $(element).click(function()
    {
      if(!ENGINE.controls.pointer.locked(element))
      {
        element.requestPointerLock();
      }
    });

    $(element).mousemove(function( event )
    {
      if(ENGINE.controls.pointer.locked(element))
      {
        ENGINE.controls.pointer.dispatchMovement(event.originalEvent);
      }
    });

    ENGINE.controls.pointer.unlock = function()
    {
      document.exitPointerLock   = document.exitPointerLock      ||
                                   document.mozExitPointerLock   ||
                                   document.webkitExitPointerLock;

      document.exitPointerLock();
    }
  };

  ENGINE.controls.assign = function(key, callback)
  {
    if(actions[key] == undefined)
    {
      actions[key] = new ENGINE.callbackHandler();
    }

    actions[key].add(callback);
  };

  $(window).keydown(function(event)
  {
    event.preventDefault();
    keyDown[event.keyCode] = true;

    if(event.char == undefined)
    {
      ENGINE.controls.runKey(event.keyCode);
    }
    else
    {
      ENGINE.controls.runKey(event.charCode);
    }
  });

  $(window).keyup(function(event)
  {
    event.preventDefault();
    keyDown[event.keyCode] = false;
  });
})();
