(function()
{
  'use strict';
  window.GAME = window.GAME ||
  {};

  GAME.players = new Array();

  GAME.player = function(name, id)
  {
    var player = GAME.players.find(id);
    if (player !== undefined)
    {
      GAME.DATA.scene.remove(player.overheadText);
      player.name = name;
      player.overheadText = generateOverheadBox(player.name);
      return player;
    }

    this.id = id;
    this.name = name;
    this.origin = new THREE.Vector3(0, 0, 0);
    this.angles = new THREE.Vector3(0, 0, 0);
    this.object = generatePlayerBox();
    this.overheadText = generateOverheadBox(this.name);

    this.remove = function()
    {
      return GAME.players.remove(this.id);
    };

    GAME.players.push(this);
  };

  GAME.players.add = function(name, id)
  {
    return new GAME.player(name, id);
  }

  GAME.players.find = function(id)
  {
    for (var i = 0; i < this.length; i++)
    {
      if (this[i].id == id)
      {
        return this[i];
      }
    }

    return undefined;
  };

  GAME.players.parseStates = function(states)
  {
    for (var i = 0; i < states.length; i++)
    {
      var player = this.find(states[i].id);
      if (player === undefined)
      {
        player = this.add(states[i].name, states[i].id)
      }

      player.matrix = states[i].matrix;
    }
  };

  GAME.players.remove = function(id)
  {
    var player = this.find(id);
    if (player !== undefined)
    {
      GAME.DATA.scene.remove(player.overheadText);
      GAME.DATA.scene.remove(player.object);
      this.splice(this.indexOf(player), 1);
    }
  };

  GAME.players.update = function()
  {
    for (var i = 0; i < this.length; i++)
    {
      var player = this[i];
      player.object.matrix.fromArray(player.matrix);
      player.object.matrix.decompose(player.object.position, player.object.quaternion, player.object.scale); 

      player.overheadText.position.x = player.object.position.x;
      player.overheadText.position.y = player.object.position.y + (GAME.const.cameraHeightOffset / 2) + 5;
      player.overheadText.position.z = player.object.position.z;

      player.overheadText.rotation.x = GAME.DATA.camera.rotation.x;
      player.overheadText.rotation.y = GAME.DATA.camera.rotation.y;
      player.overheadText.rotation.z = GAME.DATA.camera.rotation.z;
    }
  };

  function generatePlayerBox()
  {
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(15, GAME.const.cameraHeightOffset, 15), new THREE.MeshNormalMaterial());
    GAME.DATA.scene.add(mesh);
    return mesh;
  }

  function generateOverheadBox(name)
  {
    var geometry = new THREE.TextGeometry(name,
    {
      size: 1.5,
      height: 0,
      font: "helvetiker",
      weight: "normal",
      style: "normal",
      curveSegments: 12,
    });

    THREE.GeometryUtils.center(geometry);

    var text = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(
    {
      color: "white",
      overdraw: true
    }));

    GAME.DATA.scene.add(text);
    return text;
  }
})();
