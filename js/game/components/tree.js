(function()
{
	'use strict';
	window.GAME = window.GAME || {};

	GAME.trees = {};

  GAME.trees.getMaterial = function(texture, shadow)
  {
    var attributes = {};

		var uniforms =
    {
      color : { type: "c", value: new THREE.Color() },
			map: { type: "t", value: texture },
			shadow: { type: "t", value: shadow },
			globalTime : { type: "f", value: 0.0 },
			lightPos : { type: "v2", value: new THREE.Vector2() },
			fogColor : { type: "c", value: GAME.DATA.scene.fog.color },
			fogNear : { type: "f", value: GAME.DATA.scene.fog.near },
			fogFar : { type: "f", value: GAME.DATA.scene.fog.far },
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
		GAME.DATA.trees = [];

    var geometry = ENGINE.model.load("tree").geometry;
    geometry.computeTangents();

    var texture = ENGINE.material.load("leaves").texture;
    var shadow = ENGINE.material.load("occlusion").texture;

    shadow.wrapS = THREE.MirroredRepeatWrapping;
    shadow.wrapT = THREE.MirroredRepeatWrapping;

    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    // normal map shader
    var ambient = 0xffffff, diffuse = 0x331100, specular = 0x444444, shininess = 1000, scale = 23;

    var shader = THREE.ShaderLib[ "normalmap" ];
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    uniforms[ "enableAO" ].value = true;
		uniforms[ "enableDiffuse" ].value = true;
		uniforms[ "enableSpecular" ].value = false;
		uniforms[ "enableReflection" ].value = false;
		uniforms[ "enableDisplacement" ].value = false;

	  uniforms[ "tDiffuse" ].value = ENGINE.material.load("grey").texture;
		uniforms[ "tNormal" ].value = ENGINE.material.load("normal").texture;
		uniforms[ "tAO" ].value = shadow;

		uniforms[ "uDisplacementBias" ].value = - 0.428408;
		uniforms[ "uDisplacementScale" ].value = 2.436143;

    uniforms[ "uNormalScale" ].value.x = 1;
		uniforms[ "uNormalScale" ].value.y = 1;

		uniforms[ "uDiffuseColor" ].value.setHex( diffuse );
		uniforms[ "uSpecularColor" ].value.setHex( specular );
		uniforms[ "uAmbientColor" ].value.setHex( ambient );
		uniforms[ "uSunColor" ].value.setHex( 0xffffff );

		uniforms[ "uShininess" ].value = shininess;

		var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true, fog: true, side: THREE.DoubleSide };
		var bark = new THREE.ShaderMaterial( parameters );

		bark.uniforms.tDiffuse.value.wrapS = THREE.RepeatWrapping;
		bark.uniforms.tDiffuse.value.wrapT = THREE.RepeatWrapping;
		bark.uniforms.tNormal.value.wrapS = THREE.RepeatWrapping;
		bark.uniforms.tNormal.value.wrapT = THREE.RepeatWrapping;

    /*

    bark
    cap
		leaf1
		leaf2
		branches

		*/

		var cap = new THREE.MeshPhongMaterial( {map: ENGINE.material.load("cap").texture, color: 0x333333, ambient: 0x333333, side: THREE.DoubleSide} );
		var branches = new THREE.MeshPhongMaterial( {map: ENGINE.material.load("branch").texture, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide} );

		var c = new THREE.Color().setHSL(0.25,0.01,0.5);
		bark.uniforms.uDiffuseColor.value = c;

		var c = new THREE.Color().setHSL(0.25,0.3,0.5);
		branches.color = c;

		var grid = new THREE.PlaneGeometry( 2000, 2000, 4, 5 );
		grid.applyMatrix( new THREE.Matrix4().makeRotationFromEuler( new THREE.Vector3( -Math.PI/2, 0, 0 ) ) );
		grid.applyMatrix( new THREE.Matrix4().setPosition( new THREE.Vector3( 0, 0, -1000 ) ) );

		var num = grid.faces.length;

		// trees
		for (var i = 0; i < num; i++)
    {
		    var material0 = GAME.trees.getMaterial(texture, shadow);

		    var c = new THREE.Color().setHSL(0.2+Math.random()*0.05,0.3,0.5);
		    material0.uniforms.color.value = c;

		    var mf = new THREE.MeshFaceMaterial( [bark, cap, material0, material0, branches] );

		    var tree = new THREE.Mesh( geometry, mf );
		    var s = 13+Math.random()*12;
		    tree.scale.set(s,s,s);

		    var f = grid.faces[i];

		    if (Math.abs(f.centroid.x) < 300)
        {
    		  tree.isCenter = true;
        }

				tree.position.set( f.centroid.x + Math.random()*100-50, Math.random()-5, f.centroid.z + Math.random()*100+1000 )

				tree.rotation.y = Math.random()*(Math.PI*2);
				tree.rotation.x = Math.random()*0.4-0.2;
				tree.rotation.z = Math.random()*0.4-0.2;

			  GAME.DATA.scene.add(tree);
				GAME.DATA.trees.push(tree);
    }

		GAME.trees.update = function()
		{
			for (var i = 0; i < GAME.DATA.trees.length; i++)
			{
				GAME.DATA.trees[i].material.materials[2].uniforms.globalTime.value += GAME.var.frameDelta * 0.001;
			}
		};
  };
})();
