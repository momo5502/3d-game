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
    var menu = name;
    if(typeof menu == 'string')
    {
      menu = ENGINE.menu.load(name);
      if(!menu.closed()) return; // Ensure it's loaded
    }

    menu.attachStyles();
    menu.onOpen();
    menu.show();
  };

  ENGINE.menu.close = function(name)
  {
    var menu = name;
    if(typeof menu == 'string')
    {
      menu = ENGINE.menu.load(name);
      if(!menu.closed()) return; // Ensure it's loaded
    }

    menu.onClose();
    menu.hide();
    menu.detachStyles();
  };

  /****************************/
  /*      Misc functions      */
  /****************************/

  function embedMenu(menu)
  {
    // menu.id is reserved for the ticket
    menu.domID = dbType + "_" + menu.name;

    menu.element = $("<div/>",
    {
      id: menu.domID,
      html: menu.data
    });

    // Custom selector for child elements
    menu.select = function(value)
    {
      return $("#" + this.domID + " " + value);
    };

    menu.hide = function()
    {
      this.element.hide();
    };

    menu.show = function()
    {
      this.element.show();
    };

    menu.onOpen = function(){};
    menu.onClose = function(){};

    // Provide self to underlying scripts
    ENGINE.menu.self = menu;
    menu.hide();
    menu.element.addClass("menu");
    menu.element.appendTo(ENGINE.binding.element);

    menu.detachStyles = function()
    {
      menu.styles = menu.select("style[scoped]");
      menu.styles.detach();
    };

    menu.attachStyles = function()
    {
      menu.styles.appendTo(menu.element);
    };

    // Detach styles until the menu is displayed
    menu.detachStyles();

    // Reset self object
    ENGINE.menu.self = {};
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
