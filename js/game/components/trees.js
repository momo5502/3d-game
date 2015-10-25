(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.trees = {};

  GAME.trees.getMaterial = function(texture, shadow)
  {
    var attributes = {};

    var uniforms = {
      color:
      {
        type: "c",
        value: new THREE.Color()
      },
      map:
      {
        type: "t",
        value: texture
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
      lightPos:
      {
        type: "v2",
        value: new THREE.Vector2()
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

    var material = new THREE.ShaderMaterial(
    {
      uniforms: uniforms,
      attributes: attributes,
      vertexShader: ENGINE.shader.loadVertex("tree").data,
      fragmentShader: ENGINE.shader.loadFragment("tree").data,
      transparent: true,
      side: THREE.DoubleSide,
    });

    return material;
  }

  GAME.trees.add = function()
  {
    GAME.trees.addBig();
    GAME.trees.addThin();
    GAME.trees.addBirch();
    GAME.trees.addSticks();
  };

  GAME.trees.addThin = function()
  {
    var cylinderGeometry = new THREE.CylinderGeometry(0.5, 5, 300, 10, 20, true);
    cylinderGeometry.applyMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3(0, 150, 0)));
    cylinderGeometry.mergeVertices();

    for (var i = 0; i < cylinderGeometry.vertices.length; i++)
    {
      cylinderGeometry.vertices[i].x += Math.sin(cylinderGeometry.vertices[i].y * 0.02) * 5;
      cylinderGeometry.vertices[i].z += Math.cos(cylinderGeometry.vertices[i].y * 0.015) * 10;

      var y = cylinderGeometry.vertices[i].y;

      cylinderGeometry.vertices[i].multiplyScalar(1 + Math.random() * 0.5);

      cylinderGeometry.vertices[i].y = y;

    }

    cylinderGeometry.computeVertexNormals();
    cylinderGeometry.computeFaceNormals();

    cylinderGeometry.computeTangents();

    // normal map shader
    var ambient = 0xffffff,
      diffuse = 0x331100,
      specular = 0x444444,
      shininess = 30,
      scale = 23;

    var shader = THREE.ShaderLib["normalmap"];
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms["enableAO"].value = true;
    uniforms["enableDiffuse"].value = true;
    uniforms["enableSpecular"].value = false;
    uniforms["enableReflection"].value = false;
    uniforms["enableDisplacement"].value = false;

    uniforms["tDiffuse"].value = ENGINE.material.load("grey").texture;
    uniforms["tNormal"].value = ENGINE.material.load("normal").texture;
    uniforms["tAO"].value = GAME.DATA.treeShadow;

    uniforms["uDisplacementBias"].value = -0.428408;
    uniforms["uDisplacementScale"].value = 2.436143;

    uniforms["uNormalScale"].value.x = 1;
    uniforms["uNormalScale"].value.y = 1;

    uniforms["uRepeat"].value.x = 1;
    uniforms["uRepeat"].value.y = 3;

    uniforms["uDiffuseColor"].value.setHex(diffuse);
    uniforms["uSpecularColor"].value.setHex(specular);
    uniforms["uAmbientColor"].value.setHex(ambient);
    uniforms["uSunColor"].value.setHex(0xffffff);

    uniforms["uShininess"].value = shininess;

    var parameters = {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: uniforms,
      lights: true,
      fog: true,
      side: THREE.DoubleSide
    };
    GAME.DATA.treeBark2 = new THREE.ShaderMaterial(parameters);

    GAME.DATA.treeBark2.uniforms.tDiffuse.value.wrapS = THREE.RepeatWrapping;
    GAME.DATA.treeBark2.uniforms.tDiffuse.value.wrapT = THREE.RepeatWrapping;
    GAME.DATA.treeBark2.uniforms.tNormal.value.wrapS = THREE.RepeatWrapping;
    GAME.DATA.treeBark2.uniforms.tNormal.value.wrapT = THREE.RepeatWrapping;

    var c = new THREE.Color().setHSL(0.0, 0.9, 1.0);
    GAME.DATA.treeBark2.uniforms.uDiffuseColor.value = c;


    for (var i = 0; i < GAME.const.treeThinCount; i++)
    {
      var mesh = new Physijs.BoxMesh(cylinderGeometry, GAME.DATA.treeBark2, 0);

      var s = 1 + Math.random() * 1;
      mesh.scale.set(s, s, s);
      mesh.position.set(Math.random() * 2000 - 1000, Math.random() - 20, Math.random() * -2000 + 1000)

      mesh.rotation.y = Math.random() * (Math.PI * 2);

      mesh.rotation.x = Math.random() * 0.2 - 0.1;
      mesh.rotation.z = Math.random() * 0.2 - 0.1;

      GAME.DATA.scene.add(mesh);
    }
  };

  GAME.trees.addBirch = function()
  {
    var cylinderGeometry = new THREE.CylinderGeometry(2, 6, 300, 12, 1, true);
    cylinderGeometry.applyMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3(0, 150, 0)));
    cylinderGeometry.mergeVertices();

    cylinderGeometry.computeTangents();

    // normal map shader
    var ambient = 0xaaaaaa,
      diffuse = 0xffffff,
      specular = 0x111111,
      shininess = 1,
      scale = 23;

    var shader = THREE.ShaderLib["normalmap"];
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms["enableAO"].value = true;
    uniforms["enableDiffuse"].value = true;
    uniforms["enableSpecular"].value = false;
    uniforms["enableReflection"].value = false;
    uniforms["enableDisplacement"].value = false;

    uniforms["tDiffuse"].value = ENGINE.material.load("diffuse-birch").texture;
    uniforms["tNormal"].value = ENGINE.material.load("normal-birch").texture;
    uniforms["tAO"].value = GAME.DATA.treeShadow;

    uniforms["uDisplacementBias"].value = -0.428408;
    uniforms["uDisplacementScale"].value = 2.436143;

    uniforms["uNormalScale"].value.x = 20;
    uniforms["uNormalScale"].value.y = 10;

    uniforms["uRepeat"].value.x = 1;
    uniforms["uRepeat"].value.y = 3;

    uniforms["uDiffuseColor"].value.setHex(diffuse);
    uniforms["uSpecularColor"].value.setHex(specular);
    uniforms["uAmbientColor"].value.setHex(ambient);
    uniforms["uSunColor"].value.setHex(0x222222);

    uniforms["uShininess"].value = shininess;

    var parameters = {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: uniforms,
      lights: true,
      fog: true
    };
    GAME.DATA.treeBark3 = new THREE.ShaderMaterial(parameters);

    GAME.DATA.treeBark3.uniforms.tDiffuse.value.wrapS = THREE.RepeatWrapping;
    GAME.DATA.treeBark3.uniforms.tDiffuse.value.wrapT = THREE.RepeatWrapping;
    GAME.DATA.treeBark3.uniforms.tNormal.value.wrapS = THREE.RepeatWrapping;
    GAME.DATA.treeBark3.uniforms.tNormal.value.wrapT = THREE.RepeatWrapping;

    for (var i = 0; i < GAME.const.treeBirchCount; i++)
    {
      var mesh = new Physijs.BoxMesh(cylinderGeometry, GAME.DATA.treeBark3, 0);

      var s = 1 + Math.random() * 1;
      mesh.scale.set(s, s, s);
      mesh.position.set(Math.random() * 2000 - 1000, 0, Math.random() * -2000 + 1000)

      mesh.rotation.y = Math.random() * (Math.PI * 2);
      mesh.rotation.x = Math.random() * 0.1 - 0.05;
      mesh.rotation.z = Math.random() * 0.1 - 0.05;

      GAME.DATA.scene.add(mesh);
    }
  };

  GAME.trees.addSticks = function()
  {
    var plane = new THREE.PlaneGeometry(0.5, 300, 1, 20);

    for (var i = 0; i < plane.vertices.length; i++)
    {
      plane.vertices[i].x += Math.sin(plane.vertices[i].y * 0.05) * 4;
    }

    var material = new THREE.MeshBasicMaterial(
    {
      color: 0x000000,
      side: THREE.DoubleSide
    });

    for (var i = 0; i < GAME.const.treeStickCount; i++)
    {

      var mesh = new Physijs.BoxMesh(plane, material, 0);

      mesh.scale.x = 1 + Math.random() * 0.5;
      mesh.scale.z = 1 + Math.random() * 0.5;

      mesh.position.y = 150 + Math.random() * 100;
      mesh.position.x = Math.random() * -2000 + 1000;
      mesh.position.z = Math.random() * -2000 + 1000;

      mesh.rotation.y = Math.random() * Math.PI;

      GAME.DATA.scene.add(mesh);

    }
  };

  GAME.trees.addBig = function()
  {
    GAME.DATA.trees = [];

    var geometry = ENGINE.model.load("tree").geometry;
    geometry.computeTangents();

    var texture = ENGINE.material.load("leaves").texture;
    GAME.DATA.treeShadow = ENGINE.material.load("occlusion").texture;

    GAME.DATA.treeShadow.wrapS = THREE.MirroredRepeatWrapping;
    GAME.DATA.treeShadow.wrapT = THREE.MirroredRepeatWrapping;

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    // normal map shader
    var ambient = 0xffffff,
      diffuse = 0x331100,
      specular = 0x444444,
      shininess = 1000,
      scale = 23;

    var shader = THREE.ShaderLib["normalmap"];
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms["enableAO"].value = true;
    uniforms["enableDiffuse"].value = true;
    uniforms["enableSpecular"].value = false;
    uniforms["enableReflection"].value = false;
    uniforms["enableDisplacement"].value = false;

    uniforms["tDiffuse"].value = ENGINE.material.load("grey").texture;
    uniforms["tNormal"].value = ENGINE.material.load("normal").texture;
    uniforms["tAO"].value = GAME.DATA.treeShadow;

    uniforms["uDisplacementBias"].value = -0.428408;
    uniforms["uDisplacementScale"].value = 2.436143;

    uniforms["uNormalScale"].value.x = 1;
    uniforms["uNormalScale"].value.y = 1;

    uniforms["uDiffuseColor"].value.setHex(diffuse);
    uniforms["uSpecularColor"].value.setHex(specular);
    uniforms["uAmbientColor"].value.setHex(ambient);
    uniforms["uSunColor"].value.setHex(0xffffff);

    uniforms["uShininess"].value = shininess;

    var parameters = {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: uniforms,
      lights: true,
      fog: true,
      side: THREE.DoubleSide
    };

    GAME.DATA.treeBark = new THREE.ShaderMaterial(parameters);
    GAME.DATA.treeBark.uniforms.tDiffuse.value.wrapS = THREE.RepeatWrapping;
    GAME.DATA.treeBark.uniforms.tDiffuse.value.wrapT = THREE.RepeatWrapping;
    GAME.DATA.treeBark.uniforms.tNormal.value.wrapS = THREE.RepeatWrapping;
    GAME.DATA.treeBark.uniforms.tNormal.value.wrapT = THREE.RepeatWrapping;

    /*

    bark
    cap
		leaf1
		leaf2
		branches

		*/

    var cap = new THREE.MeshPhongMaterial(
    {
      map: ENGINE.material.load("cap").texture,
      color: 0x333333,
      ambient: 0x333333,
      side: THREE.DoubleSide
    });
    var branches = new THREE.MeshPhongMaterial(
    {
      map: ENGINE.material.load("branch").texture,
      transparent: true,
      alphaTest: 0.5,
      side: THREE.DoubleSide
    });

    var c = new THREE.Color().setHSL(0.25, 0.01, 0.5);
    GAME.DATA.treeBark.uniforms.uDiffuseColor.value = c;

    var c = new THREE.Color().setHSL(0.25, 0.3, 0.5);
    branches.color = c;

    var grid = new THREE.PlaneGeometry(2000, 2000, 4, 5);
    grid.applyMatrix(new THREE.Matrix4().makeRotationFromEuler(new THREE.Vector3(-Math.PI / 2, 0, 0)));
    grid.applyMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3(0, 0, -1000)));

    var num = grid.faces.length;

    // trees
    for (var i = 0; i < num; i++)
    {
      var material0 = GAME.trees.getMaterial(texture, GAME.DATA.treeShadow);

      var c = new THREE.Color().setHSL(0.2 + Math.random() * 0.05, 0.3, 0.5);
      material0.uniforms.color.value = c;

      var mf = new THREE.MeshFaceMaterial([GAME.DATA.treeBark, cap, material0, material0, branches]);

      var tree = new Physijs.BoxMesh(geometry, mf, 0);
      var s = 13 + Math.random() * 12;
      tree.scale.set(s, s, s);

      var f = grid.faces[i];

      if (Math.abs(f.centroid.x) < 300)
      {
        tree.isCenter = true;
      }

      tree.position.set(f.centroid.x + Math.random() * 100 - 50, Math.random() - 5, f.centroid.z + Math.random() * 100 + 1000)

      tree.rotation.y = Math.random() * (Math.PI * 2);
      tree.rotation.x = Math.random() * 0.4 - 0.2;
      tree.rotation.z = Math.random() * 0.4 - 0.2;

      GAME.DATA.scene.add(tree);
      GAME.DATA.trees.push(tree);
    }

    GAME.trees.update = function()
    {
      for (var i = 0; i < GAME.DATA.trees.length; i++)
      {
        GAME.DATA.trees[i].material.materials[2].uniforms.globalTime.value += GAME.var.frameDelta * 0.001;
      }

      GAME.DATA.treeBark.uniforms.uGlobalTime.value += GAME.var.frameDelta * 0.0012;
      GAME.DATA.treeBark2.uniforms.uGlobalTime.value += GAME.var.frameDelta * 0.0012;
      GAME.DATA.treeBark3.uniforms.uGlobalTime.value += GAME.var.frameDelta * 0.0012;
    };
  };
})();
