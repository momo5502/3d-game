(function()
{
	'use strict';
	window.GAME = window.GAME || {};

  GAME.start = function()
  {
    GAME.initScene();
    GAME.controls.initMouse();

		ENGINE.sound.playLoop("loop");

    ENGINE.animate(GAME.frame);

    // Display the container
    $('#container').fadeTo(1000, 1);
  };
})();
