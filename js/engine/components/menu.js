(function()
{
  'use strict';
  window.ENGINE = window.ENGINE ||
  {};

  ENGINE.menu = {};

  ENGINE.menu.path = "assets/menus/";
  ENGINE.menu.extension = ".html";

  var dbType = "menu";
  var stack = [];

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
    ticket.popup = false;

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

  ENGINE.menu.open = function(name, time, callback)
  {
    var menu = name;
    if (typeof menu == 'string')
    {
      menu = ENGINE.menu.load(name);
      if (!menu.closed()) return; // Ensure it's loaded
    }

    stackPush(menu);
    menu.attachStyles();
    menu.onOpen();
    menu.show(time, callback);
  };

  ENGINE.menu.close = function(name, time, callback)
  {
    var menu = name;
    if (typeof menu == 'string')
    {
      menu = ENGINE.menu.load(name);
      if (!menu.closed()) return; // Ensure it's loaded
    }

    menu.onClose();
    menu.hide(time, function()
    {
      if (callback !== undefined) callback();
      menu.detachStyles();
      stackPop(menu);
    });
  };

  ENGINE.menu.toggle = function(name, time, callback)
  {
    if (ENGINE.menu.isOpen(name))
    {
      ENGINE.menu.close(name, time, callback);
    }
    else
    {
      ENGINE.menu.open(name, time, callback);
    }
  }

  ENGINE.menu.isOpen = function(name)
  {
    for (var i = 0; i < stack.length; i++)
    {
      if (stack[i].name == name)
      {
        return true;
      }
    }

    return false;
  };

  /****************************/
  /*      Misc functions      */
  /****************************/

  // TODO: Hide all menus below, if this is not a popmenu
  function stackPush(menu)
  {
    ENGINE.controls.deactivate();
    var menuindex = stack.indexOf(menu);
    if (menuindex != -1)
    {
      stack.splice(menuindex, 1);
    }

    if (stack.length && !menu.popup)
    {
      stack[stack.length - 1].hide();
    }

    stack.push(menu);
  }

  // TODO: Show all necessary menus when removing a popmenu/normal menus
  function stackPop(menu)
  {
    var menuindex = stack.indexOf(menu);
    if (menuindex != -1)
    {
      stack.splice(menuindex, 1);
    }

    if (stack.length)
    {
      stack[stack.length - 1].show();
    }
    else
    {
      ENGINE.controls.activate();
    }
  }

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

    menu.hide = function(time, callback)
    {
      if (time === undefined)
      {
        this.element.hide();
        if (callback !== undefined) callback();
      }
      else
      {
        this.element.fadeOut(time, callback);
      }
    };

    menu.show = function(time, callback)
    {
      if (time === undefined)
      {
        this.element.show();
        if (callback !== undefined) callback();
      }
      else
      {
        this.element.fadeIn(time, callback);
      }
    };

    menu.onOpen = function() {};
    menu.onClose = function() {};

    // Provide self to underlying scripts
    ENGINE.menu.self = menu;
    menu.hide();
    menu.element.addClass("menu");
    menu.element.appendTo(ENGINE.binding.element);

    menu.detachStyles = function()
    {
      if (menu.styles === undefined)
      {
        menu.styles = menu.select("style[scoped]");
        menu.styles.detach();
      }
    };

    menu.attachStyles = function()
    {
      // Attaching fucks up transitions
      if (menu.styles !== undefined)
      {
        menu.styles.appendTo(menu.element);
        menu.styles = undefined;
      }
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
