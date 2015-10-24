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
    GAME.butterfly.add();
    GAME.grass.add();
    GAME.trees.add();
    GAME.rays.add();

    ENGINE.animate(GAME.frame);

    ENGINE.stats.display();

    // Display the container
    $('#loader').fadeOut();
    $('#container').fadeTo(1000, 1, function()
    {
      ENGINE.sound.playLoop("ambient").setVolume(0.5);
      ENGINE.sound.playLoop("leaves").setVolume(0.3);
      ENGINE.sound.playLoop("forest").setVolume(0.1);
    });
  };
})();
