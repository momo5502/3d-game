(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.start = function()
  {
    GAME.network.init();

    GAME.initScene();
    GAME.controls.initMouse();

    GAME.particles.add();
    GAME.butterfly.add();
    GAME.grass.add();
    GAME.trees.add();
    GAME.rays.add();

    ENGINE.animate(GAME.frame);

    ENGINE.stats.display();

    // Experimental username
    if (!ENGINE.storage.hasLocal("username"))
    {
      GAME.DATA.username = prompt("Enter a username");
      ENGINE.storage.storeLocal("username", GAME.DATA.username);
    }
    else
    {
      GAME.DATA.username = ENGINE.storage.loadLocal("username");
    }

    GAME.network.authenticate(GAME.DATA.username);

    // Display the container
    ENGINE.console.log("Game initialized.");
    ENGINE.console.log("Fading in...");

    $('#loader').fadeOut();
    $('#container').fadeTo(1000, 1, function()
    {
      ENGINE.sound.playLoop("ambient").setVolume(0.5);
      ENGINE.sound.playLoop("leaves").setVolume(0.3);
      ENGINE.sound.playLoop("forest").setVolume(0.03);
      ENGINE.console.log("Ambient started.");
    });
  };
})();
