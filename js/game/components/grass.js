(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.grass = {};

  GAME.grass.add = function()
  {
    GAME.grass.addGrass();
    GAME.grass.addFlowers();
    GAME.grass.addRocks();
  };

  GAME.grass.addFlowers = function()
  {
    var planeGeometry = new THREE.PlaneGeometry(6, 11, 1, 1);
    planeGeometry.applyMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3(0, 9, 0)));

    var map = ENGINE.material.load("vitsippa").texture;

    var attributes = {
      time:
      {
        type: 'f',
        value: []
      },
    };

    GAME.DATA.uniformsFlower = {
      color:
      {
        type: "c",
        value: new THREE.Color(0xffffff)
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
      darken:
      {
        type: "f",
        value: 0.25
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
        value: GAME.DATA.scene.fog.far
      },
    };

    var ent = new ENGINE.map.dynent(GAME.DATA.uniformsFlower);
    ent.update = function(delta)
    {
      this.object.globalTime.value += delta * 0.0012;
    };

    var material = new THREE.ShaderMaterial(
    {
      uniforms: GAME.DATA.uniformsFlower,
      attributes: attributes,
      vertexShader: ENGINE.shader.loadVertex("flower").data,
      fragmentShader: ENGINE.shader.loadFragment("flower").data,
      side: THREE.DoubleSide,
      transparent: true,
    });

    var geometry = new THREE.Geometry();

    for (var i = 0; i < 500; i++)
    {
      var mesh = new THREE.Mesh(planeGeometry, undefined, 0);
      mesh.rotation.y = Math.random() * 360;
      mesh.rotation.z = Math.random() * 0.5 - 0.25;
      mesh.position.set(Math.random() * 3000 - 1500, 0, Math.random() * 3000 - 1500);

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

    var planes = new THREE.Mesh(geometry, material, 0);
    GAME.DATA.scene.add(planes);
  };

  GAME.grass.addGrass = function()
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

    var ent = new ENGINE.map.dynent(GAME.DATA.uniformsGrass);
    ent.update = function(delta)
    {
      this.object.globalTime.value += delta * 0.0012;
    };

    var material = new THREE.ShaderMaterial(
    {
      uniforms: GAME.DATA.uniformsGrass,
      attributes: attributes,
      vertexShader: ENGINE.shader.loadVertex("grass").data,
      fragmentShader: ENGINE.shader.loadFragment("grass").data,
      transparent: true,
      side: THREE.DoubleSide
    });

    var geometry = new THREE.Geometry();

    for (var i = 0; i < GAME.const.grassWideCount; i++)
    {
      var mesh = new THREE.Mesh(planeGeometry, undefined, 0);
      mesh.rotation.y = Math.random() * 360;
      mesh.position.set(Math.random() * 4000 - 2300, 0, Math.random() * 4000 - 2300);
      mesh.scale.y = 1 + Math.random() * 1.75;

      THREE.GeometryUtils.merge(geometry, mesh);
    };

    var planeGeometry2 = new THREE.PlaneGeometry(30, 30, 1, 2);
    planeGeometry2.applyMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3(0, 15, 0)));

    for (var i = 0; i < GAME.const.grassTallCount; i++)
    {
      var mesh = new THREE.Mesh(planeGeometry2, undefined, 0);
      mesh.rotation.y = Math.random() - 0.5;
      mesh.position.set(Math.random() * 4000 - 2000, 0, Math.random() * 4000 - 2000);
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

    var planes = new THREE.Mesh(geometry, material, 0);
    GAME.DATA.scene.add(planes);
  };

  GAME.grass.addRocks = function()
  {
    var map = ENGINE.material.load("rock").texture;

    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;

    var normalMap = ENGINE.material.load("rock-normal").texture;
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;

    var material = new THREE.MeshPhongMaterial(
    {
      color: 0xffffff,
      shininess: 1000,
      map: map,
      normalMap: normalMap,
      specular: 0x111111,
      ambient: 0xffffff
    });

    material.normalScale.x = material.normalScale.y = 1.0;

    var c = new THREE.Color().setHSL(0.2, 0.02, 0.7);
    material.color = c;

    var ico = new THREE.IcosahedronGeometry(1, 2);

    for (var i = 0; i < ico.vertices.length; i++)
    {
      ico.vertices[i].multiplyScalar(1 + Math.random() * 0.15);
    }

    ico.computeVertexNormals();
    ico.computeFaceNormals();

    for (var i = 0; i < GAME.const.rockCount; i++)
    {
      var mesh = new THREE.Mesh(ico, material, 0);

      var s = 10 + Math.random() * 30;
      mesh.scale.set(s, s, s);

      mesh.position.set(Math.random() * 3000 - 1500, 0, Math.random() * 3000 - 1500)

      mesh.rotation.y = Math.random() * (Math.PI * 2);

      mesh.rotation.x = Math.random() * (Math.PI * 2);
      mesh.rotation.z = Math.random() * (Math.PI * 2);

      GAME.DATA.scene.add(mesh);

      GAME.physics.addCollisionMesh(mesh);
    }
  };
})();
