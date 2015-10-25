(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.rays = {};

  GAME.rays.add = function()
  {
    var planeGeometry = new THREE.PlaneGeometry(40, 1000);
    planeGeometry.applyMatrix(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, 0, -Math.PI, 'XYZ')));

    var rayTexture = ENGINE.material.load("ray").texture;
    rayTexture.wrapS = THREE.RepeatWrapping;
    rayTexture.wrapT = THREE.RepeatWrapping;
    rayTexture.repeat.x = 2;
    rayTexture.repeat.y = 1;

    var attributes = {

      time:
      {
        type: 'f',
        value: []
      },

    };

    GAME.DATA.uniformsRays = {

      color:
      {
        type: "c",
        value: new THREE.Color(0xdadc9f)
      },
      texture:
      {
        type: "t",
        value: rayTexture
      },
      globalTime:
      {
        type: "f",
        value: 0.0
      },

    };

    var material = new THREE.ShaderMaterial(
    {

      uniforms: GAME.DATA.uniformsRays,
      attributes: attributes,
      vertexShader: ENGINE.shader.loadVertex("ray").data,
      fragmentShader: ENGINE.shader.loadFragment("ray").data,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,

    });


    var geometry = new THREE.Geometry();

    for (var i = 0; i < GAME.const.rayCount; i++)
    {

      var mesh = new Physijs.BoxMesh(planeGeometry, undefined, 0);

      mesh.scale.x = 1 + Math.random() * 2;

      mesh.position.x = Math.random() * 1500 - 750;
      mesh.position.z = Math.random() * 2000 - 1000;
      mesh.position.y = 300;

      mesh.rotation.z = -0.5 + mesh.position.x * 0.0006;

      var rotationVar = 0.8;
      mesh.rotation.y += Math.random() * (rotationVar * 2) - rotationVar;

      THREE.GeometryUtils.merge(geometry, mesh);
    };

    var vertices = geometry.vertices;
    var values_time = attributes.time.value;

    for (var v = 0; v < vertices.length; v += planeGeometry.vertices.length)
    {

      var t = Math.random();

      for (var j = v; j < v + planeGeometry.vertices.length; j++)
      {
        values_time[j] = t;
      };

    }


    var planes = new Physijs.BoxMesh(geometry, material, 0);
    GAME.DATA.scene.add(planes);
  };

  GAME.rays.update = function()
  {
    if (GAME.DATA.uniformsRays)
    {
      GAME.DATA.uniformsRays.globalTime.value += GAME.var.frameDelta * 0.0012;
    }
  };
})();
