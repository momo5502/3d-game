(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.start = function()
  {
    GAME.initScene();
    GAME.controls.initMouse();

    GAME.particles.add();
    GAME.grass.add();
    GAME.trees.add();
    GAME.rays.add();

    ENGINE.sound.playLoop("loop");

    ENGINE.animate(GAME.frame);

    // Display the container
    $('#loader').fadeOut();
    $('#container').fadeTo(1000, 1);
  };
})();
