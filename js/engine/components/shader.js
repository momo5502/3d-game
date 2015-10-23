(function()
{
	'use strict';
	window.ENGINE = window.ENGINE || {};

  ENGINE.shader = {};

  ENGINE.shader.path = "assets/shaders/";
  ENGINE.shader.extension = ".js";

  ENGINE.shader.type =
  {
    VERTEX: "vertex",
    FRAGMENT: "fragment",
  };

	var dbType = "shader";

  ENGINE.shader.loadPair = function(name)
  {
    ENGINE.shader.loadVertex(name);
    ENGINE.shader.loadFragment(name);
  };

  ENGINE.shader.loadVertex = function(name)
  {
    return ENGINE.shader.load(ENGINE.shader.type.VERTEX, name);
  };

  ENGINE.shader.loadFragment = function(name)
  {
    return ENGINE.shader.load(ENGINE.shader.type.FRAGMENT, name);
  };

	ENGINE.shader.load = function(type, name)
	{
    var loaded = loadFromDB(type, name);
    if(loaded != undefined)
    {
      return loaded;
    }

    var ticket = new ENGINE.ticket(ENGINE.shader.getId(type, name));

    ticket.type = type;
    ticket.data = "";

    $.ajax(
    {
      url: resolveShader(type, name),
      dataType: "text"
    }).done(function( data )
    {
      ticket.data = data;
    }).fail(function(xhr, status, error)
    {
        console.error("Failed to load shader: " + this.url + "\nReason: " + error);
    }).always(function()
    {
      ticket.close();
    });

    storeDB(type, name, ticket);
    return ticket;
	};

  ENGINE.shader.getId = function(type, name)
  {
    return type[0] + "s_" + name;
  };

	/****************************/
  /*      Misc functions      */
	/****************************/

  function resolveShader(type, name)
  {
    return ENGINE.shader.path + type + "/" + name + ENGINE.shader.extension;
  }

	function loadFromDB(type, name)
	{
		return ENGINE.database.load(dbType, type + name);
	}

	function storeDB(type, name, object)
	{
		return ENGINE.database.add(dbType, type + name, object);
	}
})();
