(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.players = new Array();

  ENGINE.player = function(name, id)
  {
    var player = ENGINE.players.find(id);
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
      return ENGINE.players.remove(this.id);
    };

    ENGINE.players.push(this);
  };

  ENGINE.players.add = function(name, id)
  {
    return new ENGINE.player(name, id);
  }

  ENGINE.players.find = function(id)
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

  ENGINE.players.parseStates = function(states)
  {
    for (var i = 0; i < states.length; i++)
    {
      var player = this.find(states[i].id);
      if (player === undefined)
      {
        player = this.add(states[i].name, states[i].id)
      }

      player.origin = states[i].origin;
      player.angles = states[i].angles;
    }
  };

  ENGINE.players.remove = function(id)
  {
    var player = this.find(id);
    if (player !== undefined)
    {
      GAME.DATA.scene.remove(player.overheadText);
      GAME.DATA.scene.remove(player.object);
      this.splice(this.indexOf(player), 1);
    }
  };

  ENGINE.players.update = function()
  {
    for (var i = 0; i < this.length; i++)
    {
      var player = this[i];
      player.object.position.x = player.origin.x;
      player.object.position.y = player.origin.y;
      player.object.position.z = player.origin.z;

      player.object.rotation.x = player.angles.x;
      player.object.rotation.y = player.angles.y;
      player.object.rotation.z = player.angles.z;

      player.overheadText.position.x = player.origin.x;
      player.overheadText.position.y = player.origin.y + (GAME.const.cameraHeightOffset / 2) + 5;
      player.overheadText.position.z = player.origin.z;

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
      size: 3,
      height: 0,
      font: "helvetiker",
      weight: "normal",
      style: "normal",
      curveSegments : 12,
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
