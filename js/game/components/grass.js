(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.grass = {};

  GAME.grass.add = function()
  {
    var planeGeometry = new THREE.PlaneGeometry(800, 8, 20, 2);

    for (var i = 0; i < planeGeometry.vertices.length; i++)
    {
      planeGeometry.vertices[i].z += Math.sin(planeGeometry.vertices[i].x * 0.2) * 10;
    }

    planeGeometry.applyMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3(0, 4, 0)));

    var map = ENGINE.material.load("fins2").texture;
    map.wrapS = THREE.RepeatWrapping;

    var shadow = ENGINE.material.load("shadow").texture;
    shadow.wrapS = shadow.wrapT = THREE.RepeatWrapping;

    var attributes = {
      customColor:
      {
        type: 'c',
        value: []
      },
      time:
      {
        type: 'f',
        value: []
      },
      uvScale:
      {
        type: 'v2',
        value: []
      },
    };

    GAME.DATA.uniformsGrass = {
      color:
      {
        type: "c",
        value: new THREE.Color(0x53544d)
      },
      sunColor:
      {
        type: "c",
        value: new THREE.Color(0xe2e784)
      },
      texture:
      {
        type: "t",
        value: map
      },
      shadow:
      {
        type: "t",
        value: shadow
      },
      globalTime:
      {
        type: "f",
        value: 0.0
      },
      fogColor:
      {
        type: "c",
        value: GAME.DATA.scene.fog.color
      },
      fogNear:
      {
        type: "f",
        value: GAME.DATA.scene.fog.near
      },
      fogFar:
      {
        type: "f",
        value: GAME.DATA.scene.fog.far * 0.75
      },
      size:
      {
        type: "v2",
        value: new THREE.Vector2(1200.0, 2400.0)
      },
    };

    var material = new THREE.ShaderMaterial(
    {
      uniforms: GAME.DATA.uniformsGrass,
      attributes: attributes,
      vertexShader: ENGINE.shader.loadVertex("grass").data,
      fragmentShader: ENGINE.shader.loadFragment("grass").data,
      transparent: true,
    });

    var geometry = new THREE.Geometry();

    for (var i = 0; i < GAME.const.grassWideCount; i++)
    {
      var mesh = new THREE.Mesh(planeGeometry);
      mesh.rotation.y = Math.random() * 360;
      mesh.position.set(Math.random() * 4000 - 2300, 0, Math.random() * 4000 - 3000);
      mesh.scale.y = 1 + Math.random() * 1.75;

      THREE.GeometryUtils.merge(geometry, mesh);
    };

    var planeGeometry2 = new THREE.PlaneGeometry(30, 30, 1, 2);
    planeGeometry2.applyMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3(0, 15, 0)));

    for (var i = 0; i < GAME.const.grassTallCount; i++)
    {
      var mesh = new THREE.Mesh(planeGeometry2);
      mesh.rotation.y = Math.random() - 0.5;
      mesh.position.set(Math.random() * 4000 - 2300, 0, Math.random() * 4000 - 3000);
      mesh.scale.y = 1 + Math.random() * 0.5;

      THREE.GeometryUtils.merge(geometry, mesh);
    };

    var vertices = geometry.vertices;
    var values_time = attributes.time.value;
    var values_uv = attributes.uvScale.value;
    var values_color = attributes.customColor.value;

    var l1 = planeGeometry.vertices.length * GAME.const.grassWideCount;

    for (var v = 0; v < l1; v += planeGeometry.vertices.length)
    {
      var t = Math.random();

      for (var j = v; j < v + planeGeometry.vertices.length; j++)
      {
        values_time[j] = t;
        values_uv[j] = new THREE.Vector2(56, 1);
        values_color[j] = new THREE.Color(0xffffff);
        values_color[j].setHSL(0.25, 0.25 - Math.random() * 0.25, 0.7);
      }
    }

    var l2 = planeGeometry2.vertices.length * GAME.const.grassTallCount;

    for (var v = l1; v < l1 + l2; v += planeGeometry2.vertices.length)
    {
      var t = Math.random();

      for (var j = v; j < v + planeGeometry2.vertices.length; j++)
      {
        values_time[j] = t;
        values_uv[j] = new THREE.Vector2(1.5, 1);
        values_color[j] = new THREE.Color(0x4ea648);
        values_color[j].setHSL(0.25, 0.5 + Math.random() * 0.25, 0.5);
      };
    }

    var planes = new THREE.Mesh(geometry, material);
    planes.material.side = THREE.DoubleSide;
    GAME.DATA.scene.add(planes);
  };

  GAME.grass.update = function()
  {
    if (GAME.DATA.uniformsGrass)
    {
      GAME.DATA.uniformsGrass.globalTime.value += GAME.var.frameDelta * 0.0012;
    }
  };
})();
