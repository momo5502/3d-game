(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.menu = {};

  ENGINE.menu.path = "assets/menus/";
  ENGINE.menu.extension = ".html";

  var dbType = "menu";

  ENGINE.menu.load = function(name)
  {
    var loaded = loadFromDB(name);
    if (loaded != undefined)
    {
      return loaded;
    }

    var ticket = new ENGINE.ticket(name);
    ticket.type = dbType;
    ticket.failed = false;

    $.ajax(
    {
      url: resolveMenu(name),
      dataType: "html"
    }).done(function(data)
    {
      ticket.data = data;
      embedMenu(ticket);
    }).fail(function(xhr, status, error)
    {
      ticket.failed = true;
      console.error("Failed to load menu: " + this.url + "\nReason: " + error);
    }).always(function()
    {
      ticket.close();
    });

    storeDB(name, ticket);
    return ticket;
  };

  ENGINE.menu.open = function(name)
  {
    ENGINE.menu.load(name).show();
  };

  ENGINE.menu.close = function(name)
  {
    ENGINE.menu.load(name).hide();
  };

  /****************************/
  /*      Misc functions      */
  /****************************/

  function embedMenu(menu)
  {
    menu.element = $("<div/>",
    {
      id: dbType + "_" + menu.name,
      html: menu.data
    });

    menu.hide = function()
    {
      this.element.hide();
    };

    menu.show = function()
    {
      this.element.show();
    };

    menu.hide();
    menu.element.addClass("menu");
    menu.element.appendTo(ENGINE.binding.element);
  }

  function resolveMenu(name)
  {
    return ENGINE.menu.path + "/" + name + ENGINE.menu.extension;
  }

  function loadFromDB(name)
  {
    return ENGINE.database.load(dbType, name);
  }

  function storeDB(name, object)
  {
    return ENGINE.database.add(dbType, name, object);
  }
})();
