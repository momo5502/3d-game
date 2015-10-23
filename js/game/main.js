ENGINE.init(function()
{
  ENGINE.material.loadCube("downpour");
  ENGINE.material.load("ground");

  ENGINE.material.load("fins2");
  ENGINE.material.load("shadow");

  ENGINE.shader.loadPair("flower");
  ENGINE.shader.loadPair("grass");
  ENGINE.shader.loadPair("particle");
  ENGINE.shader.loadPair("ray");
  ENGINE.shader.loadPair("tree");

  ENGINE.model.load("tree");
  ENGINE.model.load("butterfly");

  ENGINE.sound.load("loop");

  ENGINE.controls.assign(ENGINE.controls.key.F5, function()
  {
    window.location.reload();
  });

  var gameComponents = [
    "constant",
    "variable",
    "controls",
    "frame",
    "start",
    "scene",
    "grass",
    "tree"
  ];

  ENGINE.components.load("js/game/components/", gameComponents);
});

ENGINE.ready(function()
{
  GAME.start();
});
