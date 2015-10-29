(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.material = {};

  ENGINE.material.path = "assets/textures/";
  ENGINE.material.extension = ".png";

  var dbType = "material";

  ENGINE.material.loadCube = function(name, extension)
  {
    extension = extension || ENGINE.material.extension;

    var type = "cube";
    var loaded = loadFromDB(type, name + extension);
    if (loaded != undefined)
    {
      return loaded;
    }

    var ticket = new ENGINE.ticket(name);
    ticket.type = type;

    var urls = [];
    for (var i = 0; i < 6; i++)
    {
      urls[i] = ENGINE.material.path + type + "/" + name + "/" + (i + 1) + extension;
    }

    ticket.texture = THREE.ImageUtils.loadTextureCube(urls, undefined, function()
    {
      ticket.close();
    });

    storeDB(type, name + extension, ticket);
    return ticket;
  };

  ENGINE.material.load = function(name, extension)
  {
    extension = extension || ENGINE.material.extension;

    var type = "2d";
    var loaded = loadFromDB(type, name + extension);
    if (loaded != undefined)
    {
      return loaded;
    }

    var ticket = new ENGINE.ticket(name);
    ticket.type = type;

    ticket.texture = THREE.ImageUtils.loadTexture(ENGINE.material.path + type + "/" + name + extension, undefined, function()
    {
      ticket.close();
    });

    storeDB(type, name + extension, ticket);
    return ticket;
  };

  /****************************/
  /*      Misc functions      */
  /****************************/

  function loadFromDB(type, name)
  {
    return ENGINE.database.load(dbType, type + name);
  }

  function storeDB(type, name, object)
  {
    return ENGINE.database.add(dbType, type + name, object);
  }
})();
