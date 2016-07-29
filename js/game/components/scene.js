(function()
{
    'use strict';
    window.GAME = window.GAME ||
    {};

    GAME.scene = {};

    GAME.scene.init = function()
    {
        GAME.DATA.renderer = new THREE.WebGLRenderer(
        {
            antialias: true
        });

        GAME.DATA.scene = new THREE.Scene();
        GAME.DATA.scene.fog = new THREE.Fog(0xabaf99, 0, 3000);

        GAME.camera.init();

        GAME.DATA.renderer.setClearColor(GAME.DATA.scene.fog.color);
        GAME.DATA.renderer.sortObjects = false;

        var shader = THREE.ShaderLib["cube"];
        var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
        uniforms['tCube'].value = ENGINE.material.loadCube("plains").texture;

        var _material = new THREE.ShaderMaterial(
        {
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: uniforms
        });

        var geometry = new THREE.CubeGeometry(15000, 15000, 15000, 7, 7, 7);
        var mesh = new THREE.Mesh(geometry, _material, 0);
        mesh.scale.x = -1;
        GAME.DATA.scene.add(mesh);

        var aLight = new THREE.AmbientLight(0x151c0f);
        GAME.DATA.scene.add(aLight);

        var pLight = new THREE.PointLight(0xe3fbdc, 0.9);
        pLight.position.set(1000, 600, 0);
        GAME.DATA.scene.add(pLight);

        var plane = new THREE.PlaneGeometry(5000, 5000);
        plane.computeTangents();

        var material = new THREE.MeshBasicMaterial(
        {
            color: 0x0f110d,
            map: ENGINE.material.load("ground").texture,
            side: THREE.DoubleSide
        });

        material.map.wrapS = THREE.RepeatWrapping;
        material.map.wrapT = THREE.RepeatWrapping;
        material.map.repeat.x = 20;
        material.map.repeat.y = 20;

        var ground = new THREE.Mesh(plane, material, 0);
        ground.rotation.x = -Math.PI * 0.5;
        ground.receiveShadow = true;
        GAME.DATA.scene.add(ground);

        var groundShape = new CANNON.Box(new CANNON.Vec3(2500, 0.1, 2500));
        GAME.DATA.groundBody = new CANNON.Body(
        {
            mass: 0
        });
        GAME.DATA.groundBody.position.set(0, 0, 0);

        GAME.DATA.groundBody.addShape(groundShape);
        GAME.DATA.world.add(GAME.DATA.groundBody);

        ENGINE.binding.bindRenderer(GAME.DATA.renderer, GAME.DATA.camera);
    };
})();
