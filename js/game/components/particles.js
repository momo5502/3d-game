(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.particles = {};

  GAME.particles.add = function()
  {
    var map = ENGINE.material.load("bob2").texture;

    var attributes = {
      size:
      {
        type: 'f',
        value: []
      },
      time:
      {
        type: 'f',
        value: []
      },
    };

    GAME.DATA.uniformsParticles = {
      color:
      {
        type: "c",
        value: new THREE.Color(0xf6e5b0)
      },
      texture:
      {
        type: "t",
        value: map
      },
      globalTime:
      {
        type: "f",
        value: 0.0
      },
      bass:
      {
        type: "f",
        value: 1.0
      },
      scale:
      {
        type: "f",
        value: window.innerHeight * 0.5
      },
    };

    var shaderMaterial = new THREE.ShaderMaterial(
    {
      uniforms: GAME.DATA.uniformsParticles,
      attributes: attributes,
      vertexShader: ENGINE.shader.loadVertex("particle").data,
      fragmentShader: ENGINE.shader.loadFragment("particle").data,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      side: THREE.DoubleSide
    });

    var geometry = new THREE.Geometry();

    for (var i = 0; i < GAME.const.particleCount; i++)
    {
      var vertex = new THREE.Vector3(Math.random() * 4000 - 2000, Math.random() * 100, Math.random() * 4000 - 2000);
      geometry.vertices.push(vertex);
    }

    var particles = new THREE.ParticleSystem(geometry, shaderMaterial);

    var vertices = geometry.vertices;
    var values_size = attributes.size.value;
    var values_time = attributes.time.value;

    for (var v = 0; v < vertices.length; v++)
    {
      values_time[v] = Math.random();
      values_size[v] = 1.0 + Math.random() * 2;
    }

    GAME.DATA.scene.add(particles);
  };

  GAME.particles.update = function()
  {
    if (GAME.DATA.uniformsParticles)
    {
      GAME.DATA.uniformsParticles.globalTime.value += GAME.var.frameDelta * 0.0012;
    }
  };
})();
