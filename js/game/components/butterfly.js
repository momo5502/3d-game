(function()
{
    'use strict';
    window.GAME = window.GAME ||
    {};

    GAME.butterfly = {};

    GAME.butterfly.add = function()
    {
        GAME.DATA.butterflys = [];

        var geometry = ENGINE.model.load("butterfly").geometry;
        geometry.computeMorphNormals();

        var material = new THREE.MeshPhongMaterial(
        {
            color: 0xf7f660,
            specular: 0x999999,
            shininess: 60,
            morphTargets: true,
            morphNormals: true,
            side: THREE.DoubleSide,
            shading: THREE.SmoothShading
        });

        for (var i = 0; i < GAME.const.butterflyCount; i++)
        {
            var mesh = new THREE.MorphAnimMesh(geometry, material);
            mesh.duration = 800;
            mesh.time = Math.random() * mesh.duration;

            mesh.position.set(Math.random() * -2000 + 1000, i * 50, Math.random() * -2000 + 1000);

            var s = 0.5 + Math.random() * 0.5;
            mesh.scale.set(s, s, s);

            GAME.DATA.scene.add(mesh);

            var target = new THREE.Vector3(Math.random() * -2000 + 1000, 250 + Math.random() * 100, Math.random() * -2000 + 1000);
            var look = new THREE.Vector3();

            var distance = mesh.position.distanceTo(target);
            var speed = 0.00000005;

            var butterfly = {
                mesh: mesh,
                target: target,
                time: 0,
                distance: distance,
                speed: speed,
                look: look
            };

            GAME.DATA.butterflys.push(butterfly);
            butterfly.num = GAME.DATA.butterflys.length;

            (new ENGINE.map.dynent(butterfly)).update = GAME.butterfly.update;
        }
    };

    GAME.butterfly.update = function(delta)
    {
        var speed = delta * 0.030;

        var o = this.object;
        o.mesh.updateAnimation(GAME.var.frameDelta);

        o.time += GAME.var.frameDelta * o.speed;
        o.look.copy(o.mesh.position);
        o.mesh.position.lerp(o.target, o.time);
        o.mesh.position.x += Math.sin((GAME.var.frameNewTime / 2000) + o.num) * 1;
        o.mesh.position.z -= (Math.cos((GAME.var.frameNewTime / 1500) + o.num) * 0.5) - speed;
        o.mesh.lookAt(o.look);

        if (o.mesh.position.y >= 250)
        {
            o.time = 0;
            o.mesh.position.set(Math.random() * -2000 + 1000, 0, Math.random() * -2000 + 1000);
            o.target = new THREE.Vector3(Math.random() * -2000 + 1000, 250 + Math.random() * 100, Math.random() * -2000 + 1000);
            o.distance = o.mesh.position.distanceTo(o.target);
            //o.speed = o.distance * 0.000000001;
        }
    };
})();
