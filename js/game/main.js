ENGINE.init(function()
{


  ENGINE.material.loadCube("downpour_light");
  //ENGINE.material.loadCube("downpour");

  ENGINE.material.load("ground");

  ENGINE.material.load("fins2");
  ENGINE.material.load("shadow");

  ENGINE.material.load("vitsippa");

  ENGINE.material.load("bob2");

  ENGINE.material.load("rock");
  ENGINE.material.load("rock-normal");

  ENGINE.material.load("leaves");
  ENGINE.material.load("branch");
  ENGINE.material.load("cap");

  ENGINE.material.load("diffuse-birch");
  ENGINE.material.load("normal-birch");

  ENGINE.material.load("grey");
  ENGINE.material.load("normal");
  ENGINE.material.load("occlusion");

  ENGINE.material.load("ray");

  ENGINE.shader.loadPair("flower");
  ENGINE.shader.loadPair("grass");
  ENGINE.shader.loadPair("particle");
  ENGINE.shader.loadPair("ray");
  ENGINE.shader.loadPair("tree");

  ENGINE.model.load("tree");
  ENGINE.model.load("butterfly");

  ENGINE.sound.load("ambient");
  ENGINE.sound.load("leaves", "https://s3.amazonaws.com/noisliaudio/leaves.ogg");
  ENGINE.sound.load("forest", "https://s3.amazonaws.com/noisliaudio/forest.ogg");

  //ENGINE.network.connect("http://127.0.0.1:88");
  ENGINE.network.connect("http://fw.kthx.at:88");

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
    "particles",
    "butterfly",
    "grass",
    "trees",
    "rays"
  ];

  ENGINE.components.load("js/game/components/", gameComponents);
});

ENGINE.ready(function()
{
  GAME.start();
});
